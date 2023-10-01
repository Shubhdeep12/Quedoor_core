import express from "express";
import { verifyUser } from "../middlewares/verifyToken";
const proxy = require('express-http-proxy');

const router = express.Router();

router.get("/", verifyUser, proxy('http://localhost:4002/api/posts'));
router.post("/", verifyUser, proxy('http://localhost:4003/api/posts'));
router.put('/:id', verifyUser, proxy('http://localhost:4003/api/posts'))
router.delete("/:id", verifyUser, proxy('http://localhost:4003/api/posts'));

export default router;
