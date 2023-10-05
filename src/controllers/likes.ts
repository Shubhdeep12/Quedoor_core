import { Response } from "express";
import response from "../utils/response";
import createError from "../utils/httpError";
import Post from "../models/posts";
import { AuthRequest } from "../entities/auth.entity";

export const handleLike = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const postId = req.params?.postId;
  const { like, dislike } = req.body;
  if (!postId && (like || dislike)) {
    createError(500, "PostId or body missing.");
    return response({res, status: 500, message: "PostId or body missing."});
  }

  try {
    if (like) {
      // Add a like to the post
      await Post.findByIdAndUpdate(postId, { $push: { reactions: userId } });
    } else if (dislike) {
      // Remove a like from the post
      await Post.findByIdAndUpdate(postId, { $pull: { reactions: userId } });
    } else {
      createError(400, "Invalid reaction. Provide like or dislike as true.");
      return response({res, status: 400, message: 'Invalid reaction. Provide like or dislike as true.' });
    }
  } catch (error) {
    createError(500, String(error));
    return response({res, status: 500, message: String(error)});
  }
};