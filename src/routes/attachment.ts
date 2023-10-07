import express from "express";
import verifyToken from "../middlewares/verifyToken";
import { deleteAttachment, uploadAttachment } from "../controllers/attachment";
import upload from "../middlewares/upload";

const router = express.Router();

router.post("/", verifyToken, upload.single('image'), uploadAttachment);
router.delete("/", verifyToken, deleteAttachment);

export default router;