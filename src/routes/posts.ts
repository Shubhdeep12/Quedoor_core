import express from "express";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getPosts);
router.post("/", verifyToken, createPost);
router.put('/:id', verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
