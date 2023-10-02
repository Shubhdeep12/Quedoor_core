import express from "express";
import { register, logIn, logOut } from "../controllers/auth";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/register", register);
router.post("/login", logIn);
router.post("/logout", verifyToken, logOut);

export default router;
