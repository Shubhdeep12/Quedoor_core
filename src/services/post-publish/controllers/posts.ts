import { Response } from "express";
import { AuthRequest } from "../../../shared/entities/auth.entity";
import createError from "../../../shared/utils/httpError";
import Post from "../models/posts";
import response from "../../../shared/utils/response";

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