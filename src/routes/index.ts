import express from "express";

import authRoutes from "./auth";
import postRoutes from "./posts";
import commentRoutes from "./comments";
import userRoutes from "./users";
import attachmentRoutes from './attachment';

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/users", userRoutes);
router.use("/attachment", attachmentRoutes);

export default router;
