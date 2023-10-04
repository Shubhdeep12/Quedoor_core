import { Response } from "express";

import { getNeo4jDriver } from "../config/db/neo4j";
import response from "../utils/response";
import createError from "../utils/httpError";
import Post from "../models/posts";
import { AuthRequest } from "../entities/auth.entity";
import User from "../models/users";
import Comment from "../models/comment";

export const getPosts = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { limit = 10, page = 1 }: any = req.query;
  const session = getNeo4jDriver().session();
  try {
    const skip = (page - 1) * limit;

    
    const followingUserIds = await session.run(
      'MATCH (follower:User {user_id: $userId})-[:FOLLOWS]->(following:User) RETURN following',
      { userId }
    );

    
    const filter = { userId: { $in: [userId, ...(followingUserIds?.records || [])] } };

    const [posts, totalRecords] = await Promise.all([
      Post.find(filter)
        .sort({ date: -1 })
        .limit(Number(limit))
        .skip(skip),
      Post.countDocuments(filter)
    ]);
    
    const postsWithUserInfo = [];
    for (const post of posts) {
      const user = await User.findOne({ where: { id: post.userId } });
      if (user && user.dataValues) {
          
        // eslint-disable-next-line no-unused-vars
        const { dataValues: { password, ...userInfo } } = user;
    
        postsWithUserInfo.push(
          {
            ...post._doc, // Include the original post data
            user: userInfo, // Include user information
          },
        );
      }
    }

    const responseData = {data: postsWithUserInfo, page, limit, totalRecords };

    response({ res, status: 200, data: responseData });


  } catch (error) {
    console.log({error});
    createError(500, "Internal Server Error.");
    return response({res, status: 500, message: 'Internal Server Error.'});
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!req.body.description && req.body.attachments.length === 0) {
    return response({res, status: 500, message: "Please enter content or add image."});
  }
  try {
    const postData = {
      userId, attachments: req.body.attachments,
      rich_description: req.body.rich_description,
      description: req.body.description,
      comments: req.body.comments
    };

    const createdPost = await Post.create(postData);
    if (!createdPost) {
      createError(500, 'Unable to create Post!');
      return response({res, status: 500, message: "Unable to create Post!"});
    } 

    // TODO: to start a background job here - fanout
    return response({ res, data:createdPost, status: 200, message: "Post created successfully" });
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message: "Unable to create Post!"});
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const postId = req.params.id;

    const updatedData = {
      userId, attachments: req.body.attachments,
      rich_description: req.body.rich_description,
      description: req.body.description,
      comments: req.body.comments
    };

    const updatedPost = await Post.findByIdAndUpdate({_id: postId, userId}, updatedData, { new: true });
    if (!updatedPost) {
      createError(500, 'Post not found.');
      return response({res, status: 500, message: "Post not found."});
    }

    return response({ res, data:updatedPost, status: 200, message: "Post updated successfully" });
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message: String(error)});
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const postId = req.params.id;

    // Use the Post model to find and delete the post by ID
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      createError(500, 'Post not found.');
      return response({res, status: 500, message: "Post not found."});
    } else if (deletedPost.userId === userId) {
      createError(404, 'You can delete only your post.');
      return response({res, status: 404, message: "You can delete only your post."});
    }

    await Comment.deleteMany({ postId });
    return response({ res, status: 200, message: "Post deleted successfully" });
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message: String(error)});
  }

};