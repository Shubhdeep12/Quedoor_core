"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentSchema_1 = __importDefault(require("../schema/commentSchema"));
const mongoose = require('mongoose');
const _commentSchema = new mongoose.Schema(commentSchema_1.default);
const Comment = mongoose.model('Comment', _commentSchema);
exports.default = Comment;
//# sourceMappingURL=comment.js.map