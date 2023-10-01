import express from "express";
import { createPost, deletePost, updatePost } from "../controllers/posts";
// const proxy = require('express-http-proxy');

const router = express.Router();

router.post("/", createPost);
router.put("/:id", updatePost)
router.delete("/:id", deletePost);

export default router;
