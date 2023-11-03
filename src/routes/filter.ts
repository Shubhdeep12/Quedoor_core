import express from "express";
import verifyToken from "../middlewares/verifyToken";
import { getFilteredPosts } from "../controllers/filter";
import upload from "../middlewares/upload";

const router = express.Router();

router.post("/posts", verifyToken, upload.single('image'), getFilteredPosts);

export default router;
