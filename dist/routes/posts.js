"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("../controllers/post");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const comment_1 = require("../controllers/comment");
const likes_1 = require("../controllers/likes");
const router = express_1.default.Router();
router.get("/", verifyToken_1.default, post_1.getPosts);
router.post("/", verifyToken_1.default, post_1.createPost);
router.put('/:id', verifyToken_1.default, post_1.updatePost);
router.delete("/:id", verifyToken_1.default, post_1.deletePost);
router.get("/:postId/comments", verifyToken_1.default, comment_1.getComments);
router.post("/:postId/comment", verifyToken_1.default, comment_1.createComment);
router.post('/:postId/like', verifyToken_1.default, likes_1.handleLike);
exports.default = router;
//# sourceMappingURL=posts.js.map