import express from "express";
import postRoutes from "./posts";

const router = express.Router();

router.use("/", postRoutes);
// router.use("/comment", commentRoutes)


export default router;
