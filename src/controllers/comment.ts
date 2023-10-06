import { Response } from "express";

import response from "../utils/response";
import createError from "../utils/httpError";
import Post from "../models/posts";
import { AuthRequest } from "../entities/auth.entity";
import User from "../models/users";
import Comment from "../models/comment";

export const getComments = async (req: AuthRequest, res: Response) => {
  const postId = req.params?.postId;
  const { limit = 10, page = 1 }: any = req.query;
  try {
    const skip = (page - 1) * limit;

    const { comments } = await Post.findById(postId);
    let commentsWithUserInfo = [];
    if (comments) {
      
      const result = await Comment.find({ _id: { $in: comments } }).sort({ date: -1 }) 
        .limit(Number(limit)) 
        .skip(skip);
    
      for (const comment of result) {
        const user = await User.findOne({
          where: { id: comment.userId },
          attributes: { exclude: ['password'] }, // Exclude the 'password' field
        });
        if (user) {
    
          commentsWithUserInfo.push(
            {
              ...comment._doc, // Include the original comment data
              user, // Include user information
            },
          );
        }
      }
    }

    const responseData = {data : commentsWithUserInfo, page,limit,totalRecords: comments.length};

    return response({ res, status: 200, data: responseData });


  } catch (error) {
    createError(500, "Internal Server Error");
    return response({res, status: 500, message: "Internal Server Error"});
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const postId = req.params?.postId;
  let createdComment;
  try {
    const commentData = {
      userId, postId,
      attachments: req.body.attachments,
      rich_description: req.body.rich_description,
      description: req.body.description,
    };

    createdComment = await Comment.create(commentData);
    if (!createdComment) {
      createError(500, 'Unable to create Comment!');
      return response({ res, status: 500, message: 'Unable to create Comment!' });
    } 

    await Post.findByIdAndUpdate(postId, { $push: { comments: createdComment._id } },
      { safe: true, upsert: true });

    // TODO: to start a background job here - fanout
    return response({ res, data:createdComment, status: 201, message: "Comment created successfully" });
  } catch (error) {
    createError(500, error);
    if (createdComment) {
      // You may need to handle errors in the rollback process as well
      await Comment.findByIdAndDelete(createdComment._id);
    }
    return response({ res, status: 500, message: 'Unable to create Comment!' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const commentId = req.params.id;

    const updatedData = {
      attachments: req.body.attachments,
      rich_description: req.body.rich_description,
      description: req.body.description,
    };

    const updatedComment = await Comment.findByIdAndUpdate({_id: commentId, userId}, updatedData, { new: true });
    if (!updatedComment) {
      createError(500, 'Error while updating comment.');
      return response({res, status: 500, message: 'Error while updating comment. Please try again!'});
    }

    return response({ res, data:updatedComment, status: 200, message: "Comment updated successfully" });
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message: String(error)});
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const commentId = req.params.id;
    

    // Use the Comment model to find and delete the post by ID
    const deletedComment = await Comment.findByIdAndDelete({_id: commentId, userId});
    if (!deletedComment) {
      createError(500, 'Comment not found.');
      return response({res, status: 500, message: 'Comment not found. Please try again!'});
    }

    await Comment.findByIdAndUpdate(deletedComment.postId, { $pull: { comments: deletedComment._id } },
      { safe: true, upsert: true });
    return response({ res, status: 204, message: "Comment deleted successfully" });
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message: String(error)});
  }
};