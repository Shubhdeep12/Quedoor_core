import express from "express";
import {
  follow,
  getAllFollowers,
  getAllFollowing,
  getUser,
  unfollow,
  updateUser
} from "../controllers/user";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.get("/find/:userId", verifyToken, getUser);
router.put("/:userId", verifyToken, updateUser);
router.get('/:userId/followers', verifyToken, getAllFollowers);
router.get('/:userId/following', verifyToken, getAllFollowing);
router.post('/:userId/follow', verifyToken, follow);
router.post('/:userId/unfollow', verifyToken, unfollow);

export default router;
