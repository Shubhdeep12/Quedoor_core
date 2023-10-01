import { Response } from "express";
import { AuthRequest } from "../../../shared/entities/auth.entity";
import { getNeo4jDriver } from "../config/db/neo4j";
import response from "../../../shared/utils/response";
import createError from "../../../shared/utils/httpError";
import Post from "../models/posts";
import User from "../models/users";

export const getFollowers =  async (req: AuthRequest, res: Response, next: Function) => {
  const userId = req.query.userId;

  const session = getNeo4jDriver().session();

  try {
    const result = await session.run(
      'MATCH (follower:User)-[:FOLLOWS]->(following:User {user_id: $userId}) RETURN follower',
      { userId }
    );

    const followers = result.records.map((record: any) => record.get('follower').properties);
    response({ res, data: { success: true, result: followers } , status: 200 });
  } catch (error) {
    console.error(error);
    next(createError(500, 'Internal Server Error'));
  } finally {
    session.close();
  }
};

export const getFollowing =  async (req: AuthRequest, res: Response, next: Function) => {
  const { userId } = req.params;

  const session = getNeo4jDriver().session();

  try {
    const result = await session.run(
      'MATCH (follower:User {user_id: $userId})-[:FOLLOWS]->(following:User) RETURN following',
      { userId }
    );

    const following = result.records.map((record: any) => record.get('following').properties);
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


export const unfollow =  async (req: AuthRequest, res: Response, next: Function) => {
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


export const getPosts = async (req: AuthRequest, res: Response, next: Function) => {
  const userId = req.user?.id;
  const { limit = 10, page = 1 }: any = req.query;
  const session = getNeo4jDriver().session();
  try {
    const skip = (page - 1) * limit;
    const followingUserIds = await session.run(
      'MATCH (follower:User {user_id: $userId})-[:FOLLOWS]->(following:User) RETURN following',
      { userId }
    );

    const posts = await Post.find({ user_id: { $in: followingUserIds } })
      .sort({ date: -1 }) 
      .limit(Number(limit)) 
      .skip(skip);
    
      const postsWithUserInfo = [];
      for (const post of posts) {
        const user = await User.findOne({ where: { userId: post.userId } });
        if (user) {
          
          const { password, ...userInfo } = user.toJSON(); // Exclude password from the response
    
          postsWithUserInfo.push({
            post: {
              ...post._doc, // Include the original post data
              user: userInfo, // Include user information
            },
          });
        }
      }

    response({ res, status: 200, data: postsWithUserInfo });


  } catch (error) {
    next(createError(500, "Internal Server Error"));
  }
}