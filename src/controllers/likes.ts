import { Response } from "express";
import response from "../utils/response";
import createError from "../utils/httpError";
import {Post} from "../models/post";
import { AuthRequest } from "../entities/auth.entity";

export const handleLike = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const postId = Number(req.params?.postId);
  
    const { like, dislike } = req.body;
  
    if (!postId && !(like || dislike)) {
      createError(500, "PostId or body missing.");
      return response({ res, status: 500, message: "PostId or body missing." });
    }
    const post = await Post.findByPk(postId);
    if (!post) {
      createError(500, "Post not found");
      return response({ res, status: 500, message: "Post not found" });
    }
    if (like) {
      const updatedReactions = [...post.reactions, userId];
      await post.update({ reactions: updatedReactions });

    } else if (dislike) {
      const updatedReactions = post.reactions.filter(userid => userid !== userId);
      await post.update({ reactions: updatedReactions });
    } else {
      createError(400, "Invalid reaction. Provide like or dislike as true.");
      return response({ res, status: 400, message: 'Invalid reaction. Provide like or dislike as true.' });
    }
  } catch (error) {
    createError(500, String(error));
    return response({ res, status: 500, message: String(error) });
  }
  return response({ res, status: 200, message: 'Reaction added successfully' });
};