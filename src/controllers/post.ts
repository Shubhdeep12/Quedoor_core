import { Response } from "express";

import response from "../utils/response";
import createError from "../utils/httpError";
import Post from "../models/posts";
import { AuthRequest } from "../entities/auth.entity";
import User from "../models/users";
import Comment from "../models/comment";
import getFollowing from "../utils/getFollowing";

export const getPosts = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { limit = 10, page = 1 }: any = req.query;
  try {
    // TODO: to have newsfeed cache here instead of this.
    const skip = (page - 1) * limit;

    const followers = await getFollowing(Number(userId));
    const filter = { userId: { $in: [userId, ...(followers || [])] } };

    const [posts, totalRecords] = await Promise.all([
      Post.find(filter)
        .sort({ date: -1 })
        .limit(Number(limit))
        .skip(skip),
      Post.countDocuments(filter)
    ]);
    
    const postsWithUserInfo = [];
    for (const post of posts) {
      const user = await User.findOne({
        where: { id: post.userId },
        attributes: { exclude: ['password'] },
      });
      if (user) {
    
        postsWithUserInfo.push(
          {
            ...post._doc,
            creator: user,
          },
        );
      }
    }
    const responseData = {data: postsWithUserInfo, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords) };
    response({ res, status: 200, data: responseData });
  } catch (error) {
    createError(500, String(error));
    return response({res, status: 500, message: String(error)});
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  User.sync();
  const userId = req.user?.id;
  if (!req.body.description && !req.body.image_url) {
    createError(500, "Please enter content or add image.");
    return response({res, status: 500, message: "Please enter content or add image."});
  }
  try {
    const postData = {
      userId,
      image_url: req.body.image_url,
      image_text: req.body.image_text,
      rich_description: req.body.rich_description,
      description: req.body.description,
      comments: []
    };

    const createdPost = await Post.create(postData);
    if (!createdPost) {
      createError(500, 'Unable to create Post!');
      return response({res, status: 500, message: "Unable to create Post!"});
    } 

    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    });

    const postWithUserInfo = {
      ...createdPost._doc,
      creator: user,
    };
    // TODO: to start a background job here - fanout
    return response({ res, data: postWithUserInfo, status: 201, message: "Post created successfully" });
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message: "Unable to create Post!"});
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  User.sync();
  const userId = req.user?.id;
  if (!req.body.description && !req.body.image_url && !req.body.comments) {
    createError(500, "Please enter some updated content in body.");
    return response({res, status: 500, message: "Please enter some updated content in body."});
  }
  try {
    const postId = req.params.id;

    const updatedData = {
      image_url: req.body.image_url,
      image_text: req.body.image_text,
      rich_description: req.body.rich_description,
      description: req.body.description,
      comments: req.body.comments
    };

    const updatedPost = await Post.findByIdAndUpdate({_id: postId, userId}, updatedData, { new: true });
    if (!updatedPost) {
      createError(500, 'Post not found.');
      return response({res, status: 500, message: "Post not found."});
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    });

    const postWithUserInfo = {
      ...updatedPost._doc,
      creator: user,
    };
    return response({ res, data: postWithUserInfo, status: 200, message: "Post updated successfully" });
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
    const deletedPost = await Post.findByIdAndDelete({_id: postId, userId});
    if (!deletedPost) {
      createError(500, 'Post not found.');
      return response({res, status: 500, message: "Post not found."});
    }

    await Comment.deleteMany({ postId });
    return response({ res, status: 204, message: "Post deleted successfully" });
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message: String(error)});
  }

};