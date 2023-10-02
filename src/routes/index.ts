import express from "express";
import authRoutes from "./auth";
import postRoutes from "./posts";
import commentRoutes from "./comments";
import userRoutes from "./users";
import likeRoutes from './likes';

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/like", likeRoutes);
router.use("/users", userRoutes);

export default router;
