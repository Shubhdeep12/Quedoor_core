import { Response } from "express";

import { getNeo4jDriver } from "../config/db/neo4j";
import response from "../utils/response";
import createError from "../utils/httpError";
import Post from "../models/posts";
import User from "../models/users";
import getFollowers from "../utils/getFollowers";
import getFollowing from "../utils/getFollowing";
import { AuthRequest } from "../entities/auth.entity";

export const getAllFollowers =  async (req: AuthRequest, res: Response, next: Function) => {
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

export const getAllFollowing =  async (req: AuthRequest, res: Response, next: Function) => {
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

    
    // const followingUserIds = await session.run(
    //   'MATCH (follower:User {user_id: $userId})-[:FOLLOWS]->(following:User) RETURN following',
    //   { userId }
    // );

    // const posts = await Post.find({ user_id: { $in: followingUserIds } })
    //   .sort({ date: -1 }) 
    //   .limit(Number(limit)) 
    //   .skip(skip);
    
    //   const postsWithUserInfo = [];
    //   for (const post of posts) {
    //     const user = await User.findOne({ where: { userId: post.userId } });
    //     if (user) {
          
    //       const { password, ...userInfo } = user.toJSON(); // Exclude password from the response
    
    //       postsWithUserInfo.push({
    //         post: {
    //           ...post._doc, // Include the original post data
    //           user: userInfo, // Include user information
    //         },
    //       });
    //     }
    //   }

    // response({ res, status: 200, data: postsWithUserInfo });


  } catch (error) {
    next(createError(500, "Internal Server Error"));
  }
}

export const createPost = async (req: AuthRequest, res: Response, next: Function) => {
  const userId = req.user?.id;
  try {
    const postData = {
      userId, attachments: req.body.attachments,
      rich_description: req.body.rich_description,
      description: req.body.description,
      comments: req.body.comments
    }

    const createdPost = await Post.create(postData);
    if (!createdPost) {
      next(createError(500, 'Unable to create Post!'));
    } 

    // TODO: to start a background job here - fanout
    return response({ res, data:createdPost, status: 200, message: "Post created successfully" });
  } catch (error) {
    next(createError(500, error))
  }
}

export const updatePost = async (req: AuthRequest, res: Response, next: Function) => {
  const userId = req.user?.id;
  try {
    const postId = req.params.id;

    const updatedData = {
      userId, attachments: req.body.attachments,
      rich_description: req.body.rich_description,
      description: req.body.description,
      comments: req.body.comments
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });
    if (!updatedPost) {
      next(createError(500, 'Post not found.'));
    } else if (updatedPost.userId === userId) {
      next(createError(404, 'You can update only your post.'));
    }

    return response({ res, data:updatedPost, status: 200, message: "Post updated successfully" });
  } catch (error) {
    next(createError(500, error))
  }
}

export const deletePost = async (req: AuthRequest, res: Response, next: Function) => {
  const userId = req.user?.id;
  try {
    const postId = req.params.id;

    // Use the Post model to find and delete the post by ID
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      next(createError(500, 'Post not found.'));
    } else if (deletedPost.userId === userId) {
      next(createError(404, 'You can delete only your post.'));
    }

    // await Comment.deleteALl
    return response({ res, status: 200, message: "Post deleted successfully" });
  } catch (error) {
    next(createError(500, error))
  }
};