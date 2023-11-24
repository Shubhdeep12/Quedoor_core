"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postSchema_1 = __importDefault(require("../schema/postSchema"));
const mongoose = require('mongoose');
const _postSchema = new mongoose.Schema(postSchema_1.default);
const Post = mongoose.model('Post', _postSchema);
exports.default = Post;
//# sourceMappingURL=posts.js.map