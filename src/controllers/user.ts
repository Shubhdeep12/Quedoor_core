import { Request, Response } from "express";
import createError from "../utils/httpError";
import response from "../utils/response";
import { AuthRequest } from "../entities/auth.entity";
import User from "../models/users";
import { getNeo4jDriver } from "../config/db/neo4j";
import getFollowers from "../utils/getFollowers";
import getFollowing from "../utils/getFollowing";

export const getUser = async(req: Request, res: Response) => {
  const userId = req.params?.userId;
  let user;
  try {
    const users = await User.findAll({
      where:{
        id: userId
      }
    });
    if (users.length ===0) {
      createError(404, 'Invalid User Id, Please try again!');
      return response({res, status: 404, message: 'Invalid User Id, Please try again!'});
    }
    user = users[0].dataValues;
  } catch (error) {
    createError(500, String(error));
    return response({res, status: 500, message: String(error)});
  }
  
  // eslint-disable-next-line no-unused-vars
  const { password, ...info } = user;
  return response({ res, data: info, message: "User fetched successfully" });
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
      profileImg: req.body.profileImg,
      coverImg: req.body.coverImg,
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
  const userId = req.query.userId;

  const session = getNeo4jDriver().session();

  try {
    const followers = await getFollowers(String(userId), session);
    return response({ res, data: { success: true, result: followers } , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  } finally {
    session.close();
  }
};

export const getAllFollowing = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  const session = getNeo4jDriver().session();

  try {
    const following = await getFollowing(String(userId), session);
    return response({ res, data: {success: true, result: following}, status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  } finally {
    session.close();
  }
};

export const follow = async (req: AuthRequest, res: Response) => {
  const { followerId, followingId } = req.body;

  const session = getNeo4jDriver().session();

  try {
    // Create a relationship in Neo4j
    const result = await session.run(
      'MATCH (follower:User {user_id: $followerId}), (following:User {user_id: $followingId}) ' +
      'CREATE (follower)-[:FOLLOWS]->(following) ' +
      'RETURN follower, following',
      { followerId, followingId }
    );
    session.close();
    return response({ res, data: { success: true, result: result.records } , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  }
};

export const unfollow = async (req: AuthRequest, res: Response) => {
  const { followerId, followingId } = req.body;

  const session = getNeo4jDriver().session();

  try {
    // Delete the relationship in Neo4j
    const result = await session.run(
      'MATCH (follower:User {user_id: $followerId})-[rel:FOLLOWS]->(following:User {user_id: $followingId}) ' +
      'DELETE rel ' +
      'RETURN follower, following',
      { followerId, followingId }
    );
    session.close();
    return response({ res, data: { success: true, result: result.records } , status: 200 });
  } catch (error) {
    createError(500, String(error));
    return response({ res, message: 'Internal Server error.' , status: 500 });
  } 
};
