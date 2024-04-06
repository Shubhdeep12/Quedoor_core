import { Response } from "express";

import response from "../utils/response";
import createError from "../utils/httpError";
import { Post } from "../models/post";
import { AuthRequest } from "../entities/auth.entity";
import { User } from "../models/user";
import { Comment } from "../models/comment";
import getFollowing from "../utils/getFollowing";
import { Op } from "sequelize";

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const { limit = 10, page = 1 }: any = req.query;
    const skip = (page - 1) * limit;

    const followers = await getFollowing(userId);
    const filter = {
      userId: {
        [Op.in]: [...followers, userId]
      }
    };

    const [posts, totalRecords] = await Promise.all([
      Post.findAll({
        where: filter,
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: skip,
      }),
      Post.count({
        where: filter,
      }),
    ]);

    const postsWithUserInfo = [];
    for (const post of posts) {
      const user = await User.findOne({
        where: { id: Number((post as any).userId) },
        attributes: { exclude: ['password'] }
      });
      if (user) {
        postsWithUserInfo.push({
          ...post.dataValues,
          creator: user.dataValues
        });
      }
    }
    const responseData = { data: postsWithUserInfo, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords) };
    response({ res, status: 200, data: responseData });
  } catch (error) {
    createError(500, String(error));
    return response({ res, status: 500, message: String(error) });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {

  if (!req.body.description && !req.body.imageUrl) {
    createError(500, "Please enter content or add image.");
    return response({ res, status: 500, message: "Please enter content or add image." });
  }
  try {
    const userId = Number(req.user?.id);
    const postData = {
      userId: userId,
      imageUrl: req.body.imageUrl,
      imageText: req.body.imageText,
      richDescription: req.body.richDescription,
      description: req.body.description,
      comments: []
    } as unknown as Post;

    const createdPost = await Post.create(postData);
    if (!createdPost) {
      createError(500, 'Unable to create Post!');
      return response({ res, status: 500, message: "Unable to create Post!" });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    });

    const postWithUserInfo = {
      ...createdPost.dataValues,
      creator: user,
    };
    // TODO: to start a background job here - fanout
    return response({ res, data: postWithUserInfo, status: 201, message: "Post created successfully" });
  } catch (error) {
    createError(500, error);
    return response({ res, status: 500, message: "Unable to create Post!" });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {  
  if (!req.body.description && !req.body.imageUrl && !req.body.comments) {
    createError(500, "Please enter some updated content in body.");
    return response({ res, status: 500, message: "Please enter some updated content in body." });
  }
  try {
    const userId = Number(req.user?.id);
    const postId = req.params.id;

    const updatedData = {
      imageUrl: req.body.imageUrl,
      imageText: req.body.imageText,
      richDescription: req.body.richDescription,
      description: req.body.description,
      comments: req.body.comments
    };

    const [postRowsUpdated, [updatedPost]] = await Post.update(updatedData, {
      where: { id: postId, userId: userId },
      returning: true
    });

    if (postRowsUpdated === 0 || !updatedPost) {
      createError(500, 'Post not found or user is not authorized to update');
      return response({ res, status: 500, message: "Post not found or user is not authorized to update" });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    });

    const postWithUserInfo = {
      ...updatedPost,
      creator: user,
    };
    return response({ res, data: postWithUserInfo, status: 200, message: "Post updated successfully" });
  } catch (error) {
    createError(500, error);
    return response({ res, status: 500, message: String(error) });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const postId = req.params.id;

    const postsDeleted = await Post.destroy({
      where: { id: postId, userId: userId }
    });
    if (postsDeleted === 0) {
      createError(500, 'Post not found or user is not authorized to delete');
      return response({ res, status: 500, message: "Post not found or user is not authorized to delete" });
    }

    const commentsDeleted = await Comment.destroy({
      where: { postId: postId }
    });
    if (commentsDeleted === 0) {
      createError(500, 'No comments found for the specified postId');
      return response({ res, status: 500, message: "No comments found for the specified postId" });
    }

    return response({ res, status: 204, message: "Post deleted successfully" });
  } catch (error) {
    createError(500, error);
    return response({ res, status: 500, message: String(error) });
  }

};