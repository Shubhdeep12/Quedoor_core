import express from "express";
import {
  getUser,
  updateUser
} from "../controllers/user";
import { verifyUser } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/:userId", updateUser);

export default router;
