import express from "express";
import {
  getMe
} from "../controllers/misc";

const router = express.Router();

router.get("/me/:token", getMe);


export default router;
