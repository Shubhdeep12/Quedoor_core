import express from "express";
import {
  getUser,
  updateUser
} from "../controllers/user";
import { verifyUser } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/find/:userId", verifyUser, getUser);
router.put("/:userId", verifyUser, updateUser);

export default router;
