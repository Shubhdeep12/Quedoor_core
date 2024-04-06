import { Response } from "express";

import response from "../utils/response";
import createError from "../utils/httpError";

import { AuthRequest } from "../entities/auth.entity";

import { User } from "../models/user";
import { Post } from "../models/post";
import { Comment } from "../models/comment";

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const postId = Number(req.params?.postId);
    const { limit = 10, page = 1 }: any = req.query;
    const skip = (page - 1) * limit;

    const post = await Post.findByPk(postId);
    if (!post) {
      createError(404, String('Post not found'));
      return response({ res, status: 404, message: 'Post not found' });
    }
    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: skip,
    });

    const commentsWithUserInfo = await Promise.all(comments.map(async (comment) => {
      const commentUserId = Number(comment.userId);
      const user = await User.findByPk(commentUserId, {attributes: { exclude: ['password'] } });
      return { ...comment.toJSON(), creator: user };
    }));

    const responseData = { data: commentsWithUserInfo, page, limit, totalRecords: comments.length };
    return response({res, status: 200, data: responseData});
  } catch (error) {
    createError(500, String(error));
    return response({ res, status: 500, message: String(error) });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.user?.id);
  const postId = Number(req.params?.postId);
  if (!req.body.description && !req.body.imageUrl) {
    createError(500, "Please enter content or add image.");
    return response({ res, status: 500, message: "Please enter content or add image." });
  }
  let createdComment;
  try {
    const createdComment = await Comment.create({
      userId: Number(userId),
      postId: Number(postId),
      imageUrl: req.body.imageUrl,
      imageText: req.body.imageText,
      richDescription: req.body.richDescription,
      description: req.body.description,
    } as unknown as Comment);

    if (!createdComment) {
      return response({ res, status: 500, message: 'Unable to create Comment!' });
    }

    await Comment.update(
      { postId: Number(postId) },
      { where: { id: createdComment.id } }
    );
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    const commentInfo = {
      ...createdComment.toJSON(),
      creator: user,
    };
    // TODO: to start a background job here - fanout
    return response({ res, data: commentInfo, status: 201, message: "Comment created successfully" });
  } catch (error) {
    createError(500, error);
    if (createdComment) {
      await Comment.destroy({ where: { id: (createdComment as Comment).id } });
    }
    return response({ res, status: 500, message: 'Unable to create Comment!' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.user?.id);
  if (!req.body.description && !req.body.imageUrl) {
    createError(500, "Please enter some updated content in body.");
    return response({ res, status: 500, message: "Please enter some updated content in body." });
  }
  try {
    const commentId = Number(req.params.id);

    const updatedData = {
      imageUrl: req.body.imageUrl,
      imageText: req.body.imageText,
      richDescription: req.body.richDescription,
      description: req.body.description,
    };

    const commentToUpdate = await Comment.findByPk(commentId);

    if (!commentToUpdate || commentToUpdate.userId !== userId) {
      createError(500, 'Comment not found or user does not have permission to update');
      return response({ res, status: 404, message: 'Comment not found or user does not have permission to update' });
    }

    await commentToUpdate.update(updatedData);

    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    });
    const commentInfo = {
      ...commentToUpdate.toJSON(),
      creator: user,
    };
    return response({ res, data: commentInfo, status: 200, message: "Comment updated successfully" });
  } catch (error) {
    createError(500, error);
    return response({ res, status: 500, message: String(error) });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.user?.id);
  try {
    const commentId = Number(req.params.id);
    const commentToDelete = await Comment.findOne({ where: { id: commentId, userId } });

    if (!commentToDelete) {
      createError(500, 'Comment not found.');
      return response({ res, status: 500, message: 'Comment not found. Please try again!' });
    }
    commentToDelete.destroy();

    await Post.update(
      { comments: [] },
      { where: { id: commentToDelete.postId } }
    );
    return response({ res, status: 204, message: "Comment deleted successfully" });
  } catch (error) {
    createError(500, error);
    return response({ res, status: 500, message: String(error) });
  }
};