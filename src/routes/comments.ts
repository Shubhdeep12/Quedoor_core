import express from "express";
import { deleteComment, updateComment } from "../controllers/comment";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.put('/:id', verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);

export default router;