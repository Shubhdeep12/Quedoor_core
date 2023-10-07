import { Request, Response } from "express";

import { AuthRequest } from "../entities/auth.entity";

import User from "../models/users";

import getFollowers from "../utils/getFollowers";
import getFollowing from "../utils/getFollowing";
import createError from "../utils/httpError";
import response from "../utils/response";
import followUser from "../utils/follow";
import unfollowUser from "../utils/unfollow";

export const getUser = async(req: Request, res: Response) => {
  const userId = req.params?.userId;
  let user;
  try {
    user = await User.findOne({
      where:{
        id: userId
      },
      attributes: { exclude: ['password'] }, // Exclude the 'password' field
    });
    if (!user) {
      createError(404, 'Invalid User Id, Please try again!');
      return response({res, status: 404, message: 'Invalid User Id, Please try again!'});
    }
   
  } catch (error) {
    createError(500, String(error));
    return response({res, status: 500, message: String(error)});
  }
  
  // eslint-disable-next-line no-unused-vars
 
    
  return response({ res, data: user, message: "User fetched successfully" });
};

export const updateUser = async(req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (userId !== req.params.userId) {
    createError(401, "You are not authorized to update this user");
    return response({res, status: 401, message: "You are not authorized to update this user"});
  }
  let result:any;
  try {
    result = await User.update({
      name: req.body.name,
      city: req.body.city,
      website: req.body.website,
      profileImg: req.body.profile_img,
      coverImg: req.body.cover_img,
    }, { where: { id: userId } });
    
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message:"Unable to update user, Please try again!"});
  }

  if (result?.affectedRows > 0)
    return response({ res, status: 200, message: "User updated" });
  
  createError(403, "You can only update your own profile!");
  return response({res, status: 403, message: "You can only update your own profile!"});
};

export const getAllFollowers = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const followers = await getFollowers(Number(userId));
    const users = await User.findAll({
      where: {
        id: followers,
      },
      attributes: { exclude: ['password'] }, // Exclude the 'password' field
    });
    return response({ res, data: { success: true, result: users } , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  }
};

export const getAllFollowing = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  try {
    const following = await getFollowing(Number(userId));
    const users = await User.findAll({
      where: {
        id: following,
      },
      attributes: { exclude: ['password'] }, // Exclude the 'password' field
    });
    return response({ res, data: {success: true, result: users}, status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  }
};

export const follow = async (req: AuthRequest, res: Response) => {
  const { follower_id, following_id } = req.body;
  if (!follower_id || !following_id) {
    createError(500, "FollowerId or followingId is missing.");
    return response({res, status: 500, message: "FollowerId or followingId is missing."});
  }
  try {
    // Create a relationship in Neo4j
    const result = await followUser(Number(follower_id), Number(following_id));
    console.log({ result });
    
    return response({ res, data: { success: true, result } , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  }
};

export const unfollow = async (req: AuthRequest, res: Response) => {
  const { follower_id, following_id } = req.body;
  if (!follower_id || !following_id) {
    createError(500, "FollowerId or followingId is missing.");
    return response({res, status: 500, message: "FollowerId or followingId is missing."});
  }
  try {
    // Delete the relationship in Neo4j
    const result = await unfollowUser(Number(follower_id), Number(following_id));
    return response({ res, data: { success: true, result } , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  } 
};
