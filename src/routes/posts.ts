import express from "express";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post";
import verifyToken from "../middlewares/verifyToken";
import { createComment, getComments } from "../controllers/comment";

const router = express.Router();

router.get("/", verifyToken, getPosts);
router.post("/", verifyToken, createPost);
router.put('/:id', verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

router.get("/:postId/comments", verifyToken, getComments);
router.post("/:postId/comment", verifyToken, createComment);

export default router;
