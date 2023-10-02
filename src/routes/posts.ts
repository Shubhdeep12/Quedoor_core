import express from "express";
import { verifyUser } from "../middlewares/verifyToken";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post";

const router = express.Router();

router.get("/", verifyUser, getPosts);
router.post("/", verifyUser, createPost);
router.put('/:id', verifyUser, updatePost)
router.delete("/:id", verifyUser, deletePost);

export default router;
