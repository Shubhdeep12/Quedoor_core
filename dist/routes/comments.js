"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_1 = require("../controllers/comment");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const router = express_1.default.Router();
router.put('/:id', verifyToken_1.default, comment_1.updateComment);
router.delete("/:id", verifyToken_1.default, comment_1.deleteComment);
exports.default = router;
//# sourceMappingURL=comments.js.map