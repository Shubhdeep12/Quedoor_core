import { Request, Response } from "express";
import createError from "../utils/httpError";
import response from "../utils/response";
import { AuthRequest } from "../entities/auth.entity";
import User from "../models/users";
import { getNeo4jDriver } from "../config/db/neo4j";
import getFollowers from "../utils/getFollowers";
import getFollowing from "../utils/getFollowing";

export const getUser = async(req: Request, res: Response, next: Function) => {
  const userId = req.params?.userId;
  let user;
  try {
    const users = await User.findAll({
      where:{
        id: userId
      }
    });
    if (users.length ===0) {
      return next(createError(404, 'Invalid User Id! Please try again.'));
    }
    user = users[0].dataValues;
  } catch (error) {
    return next(createError(404, 'Please try again.'));
  }
  
  // eslint-disable-next-line no-unused-vars
  const { password, ...info } = user;
  return response({ res, data: info, message: "User fetched successfully" });
};

export const updateUser = async(req: AuthRequest, res: Response, next: any) => {
  const userId = req.user?.id;
  if (userId !== req.params.userId) {
    return next(createError(401, "You are not authorized to update this user"));
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
    
  }

  if (result?.affectedRows > 0)
    return response({ res, message: "User updated" });
  return createError(403, "You can only update your own profile!");
};

export const getAllFollowers = async (req: AuthRequest, res: Response, next: Function) => {
  const userId = req.query.userId;

  const session = getNeo4jDriver().session();

  try {
    const followers = await getFollowers(String(userId), session);
    response({ res, data: { success: true, result: followers } , status: 200 });
  } catch (error) {
    console.error(error);
    next(createError(500, 'Internal Server Error'));
  } finally {
    session.close();
  }
};

export const getAllFollowing = async (req: AuthRequest, res: Response, next: Function) => {
  const { userId } = req.params;

  const session = getNeo4jDriver().session();

  try {
    const following = await getFollowing(String(userId), session);
    response({ res, data: {success: true, result: following}, status: 200 });
  } catch (error) {
    console.error(error);
    next(createError(500, 'Internal Server Error'));
  } finally {
    session.close();
  }
};

export const follow = async (req: AuthRequest, res: Response, next: Function) => {
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
    response({ res, data: { success: true, result: result.records } , status: 200 });
  } catch (error) {
    console.error(error);
    next(createError(500, 'Internal Server Error'));
  } finally {
    session.close();
  }
};

export const unfollow = async (req: AuthRequest, res: Response, next: Function) => {
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

    response({ res, data: { success: true, result: result.records } , status: 200 });
  } catch (error) {
    console.error(error);
    next(createError(500, 'Internal Server Error'));
  } finally {
    session.close();
  }
};
