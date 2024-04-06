import { Request, Response } from "express";

import { AuthRequest } from "../entities/auth.entity";

import {User} from "../models/user";

import getFollowers from "../utils/getFollowers";
import getFollowing from "../utils/getFollowing";
import createError from "../utils/httpError";
import response from "../utils/response";
import followUser from "../utils/follow";
import unfollowUser from "../utils/unfollow";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const { limit = 10, page = 1 }: any = req.query;
  try {
    const skip = (page - 1) * limit;

    const [users, totalRecords] = await Promise.all([
      User.findAll({
        attributes: { exclude: ['password'] },
        limit: limit, 
        offset: skip, 
      }),
      User.findAndCountAll()
    ]);

    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const following = await getFollowing(Number(user.dataValues.id)); // Use user.id or the appropriate field from your User model
        const followers = await getFollowers(Number(user.dataValues.id)); // Implement a getFollowers function similarly
        return {
          ...user.get({ plain: true }),
          following,
          followers,
        };
      })
    );
  
    const responseData = { data: usersWithCounts, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords.count) };

    return response({ res, data: responseData, message: "User fetched successfully" });
  } catch (error) {
    createError(500, String(error));
    return response({res, status: 500, message: String(error)});
  }

};

export const getUser = async (req: Request, res: Response) => {
  let user;
  try {
    const userId = Number(req.params?.userId);
    user = await User.findOne({
      where:{
        id: userId
      },
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      createError(404, 'Invalid User Id, Please try again!');
      return response({res, status: 404, message: 'Invalid User Id, Please try again!'});
    }
   
  } catch (error) {
    createError(500, String(error));
    return response({res, status: 500, message: String(error)});
  }
  
  return response({ res, data: user, message: "User fetched successfully" });
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.user?.id);
  if (Number(userId) !== Number(req.params.userId)) {
    createError(401, "You are not authorized to update this user");
    return response({res, status: 401, message: "You are not authorized to update this user"});
  }
  try {
    const [rowCount, updatedUser] = await User.update(
      {
        name: req.body.name,
        city: req.body.city,
        website: req.body.website,
        profileImg: req.body.profileImg,
      },
      {
        where: { id: userId },
        returning: true,
      }
    );

    if (updatedUser && updatedUser[0]) {
      delete (updatedUser[0] as any).password;
    }

    if (rowCount !== 0)
      return response({ res, data: updatedUser[0], status: 200, message: "User updated" });
  
    createError(403, "You can only update your own profile!");
    return response({res, status: 403, message: "You can only update your own profile!"});
    
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message:"Unable to update user, Please try again!"});
  }
  
};

export const getAllFollowers = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.user?.id);
  const { limit = 10, page = 1 }: any = req.query;
  try {
    
    const followers = await getFollowers(Number(userId));

    const skip = (page - 1) * limit;

    const [users, totalRecords] = await Promise.all([
      User.findAll({
        where: {
          id: followers,
        },
        attributes: { exclude: ['password'] },
        limit: limit, 
        offset: skip, 
      }),
      User.findAndCountAll({
        where: {
          id: followers,
        },
      })
    ]);
    const responseData = {data: users, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords.count) };

    return response({ res, data: responseData , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  }
};

export const getAllFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const { limit = 10, page = 1 }: any = req.query;
    const following = await getFollowing(Number(userId));

    const skip = (page - 1) * limit;

    const [users, totalRecords] = await Promise.all([
      User.findAll({
        where: {
          id: following,
        },
        attributes: { exclude: ['password'] },
        limit: limit, 
        offset: skip, 
      }),
      User.findAndCountAll({
        where: {
          id: following,
        }, })
    ]);

    const responseData = {data: users, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords.count) };

    return response({ res, data: responseData, status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  }
};

export const follow = async (req: AuthRequest, res: Response) => {
  const { followerId, followingId } = req.body;
  if (!followerId || !followingId) {
    createError(500, "FollowerId or followingId is missing.");
    return response({res, status: 500, message: "FollowerId or followingId is missing."});
  }
  try {
    // Create a relationship in Neo4j
    const result = await followUser(Number(followerId), Number(followingId));
    
    return response({ res, data: result , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  }
};

export const unfollow = async (req: AuthRequest, res: Response) => {
  const { followerId, followingId } = req.body;
  if (!followerId || !followingId) {
    createError(500, "FollowerId or followingId is missing.");
    return response({res, status: 500, message: "FollowerId or followingId is missing."});
  }
  try {
    // Delete the relationship in Neo4j
    const result = await unfollowUser(Number(followerId), Number(followingId));
    return response({ res, data: result , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  } 
};
