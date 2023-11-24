"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getPosts = void 0;
const response_1 = __importDefault(require("../utils/response"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const posts_1 = __importDefault(require("../models/posts"));
const users_1 = __importDefault(require("../models/users"));
const comment_1 = __importDefault(require("../models/comment"));
const getFollowing_1 = __importDefault(require("../utils/getFollowing"));
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { limit = 10, page = 1 } = req.query;
    try {
        // TODO: to have newsfeed cache here instead of this.
        const skip = (page - 1) * limit;
        const followers = yield (0, getFollowing_1.default)(Number(userId));
        const filter = { userId: { $in: [userId, ...(followers || [])] } };
        const [posts, totalRecords] = yield Promise.all([
            posts_1.default.find(filter)
                .sort({ created_at: -1 })
                .limit(Number(limit))
                .skip(skip),
            posts_1.default.countDocuments(filter)
        ]);
        const postsWithUserInfo = [];
        for (const post of posts) {
            const user = yield users_1.default.findOne({
                where: { id: post.userId },
                attributes: { exclude: ['password'] },
            });
            if (user) {
                postsWithUserInfo.push(Object.assign(Object.assign({}, post._doc), { creator: user }));
            }
        }
        const responseData = { data: postsWithUserInfo, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords) };
        (0, response_1.default)({ res, status: 200, data: responseData });
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    users_1.default.sync();
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    if (!req.body.description && !req.body.image_url) {
        (0, httpError_1.default)(500, "Please enter content or add image.");
        return (0, response_1.default)({ res, status: 500, message: "Please enter content or add image." });
    }
    try {
        const postData = {
            userId,
            image_url: req.body.image_url,
            image_text: req.body.image_text,
            rich_description: req.body.rich_description,
            description: req.body.description,
            comments: []
        };
        const createdPost = yield posts_1.default.create(postData);
        if (!createdPost) {
            (0, httpError_1.default)(500, 'Unable to create Post!');
            return (0, response_1.default)({ res, status: 500, message: "Unable to create Post!" });
        }
        const user = yield users_1.default.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] },
        });
        const postWithUserInfo = Object.assign(Object.assign({}, createdPost._doc), { creator: user });
        // TODO: to start a background job here - fanout
        return (0, response_1.default)({ res, data: postWithUserInfo, status: 201, message: "Post created successfully" });
    }
    catch (error) {
        (0, httpError_1.default)(500, error);
        return (0, response_1.default)({ res, status: 500, message: "Unable to create Post!" });
    }
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    users_1.default.sync();
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    if (!req.body.description && !req.body.image_url && !req.body.comments) {
        (0, httpError_1.default)(500, "Please enter some updated content in body.");
        return (0, response_1.default)({ res, status: 500, message: "Please enter some updated content in body." });
    }
    try {
        const postId = req.params.id;
        const updatedData = {
            image_url: req.body.image_url,
            image_text: req.body.image_text,
            rich_description: req.body.rich_description,
            description: req.body.description,
            comments: req.body.comments
        };
        const updatedPost = yield posts_1.default.findByIdAndUpdate({ _id: postId, userId }, updatedData, { new: true });
        if (!updatedPost) {
            (0, httpError_1.default)(500, 'Post not found.');
            return (0, response_1.default)({ res, status: 500, message: "Post not found." });
        }
        const user = yield users_1.default.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] },
        });
        const postWithUserInfo = Object.assign(Object.assign({}, updatedPost._doc), { creator: user });
        return (0, response_1.default)({ res, data: postWithUserInfo, status: 200, message: "Post updated successfully" });
    }
    catch (error) {
        (0, httpError_1.default)(500, error);
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    try {
        const postId = req.params.id;
        // Use the Post model to find and delete the post by ID
        const deletedPost = yield posts_1.default.findByIdAndDelete({ _id: postId, userId });
        if (!deletedPost) {
            (0, httpError_1.default)(500, 'Post not found.');
            return (0, response_1.default)({ res, status: 500, message: "Post not found." });
        }
        yield comment_1.default.deleteMany({ postId });
        return (0, response_1.default)({ res, status: 204, message: "Post deleted successfully" });
    }
    catch (error) {
        (0, httpError_1.default)(500, error);
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
});
exports.deletePost = deletePost;
//# sourceMappingURL=post.js.map