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

router.get("/find/:userId", getUser);
router.put("/:userId", verifyToken, updateUser);
router.get('/:userId/followers', verifyToken, getAllFollowers);
router.get('/:userId/following', verifyToken, getAllFollowing);
router.post('/follow', verifyToken, follow);
router.post('/unfollow', verifyToken, unfollow);

export default router;
