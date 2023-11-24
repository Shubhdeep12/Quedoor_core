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
exports.deleteComment = exports.updateComment = exports.createComment = exports.getComments = void 0;
const response_1 = __importDefault(require("../utils/response"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const posts_1 = __importDefault(require("../models/posts"));
const users_1 = __importDefault(require("../models/users"));
const comment_1 = __importDefault(require("../models/comment"));
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    users_1.default.sync();
    const postId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.postId;
    const { limit = 10, page = 1 } = req.query;
    try {
        const skip = (page - 1) * limit;
        const { comments } = yield posts_1.default.findById(postId);
        let commentsWithUserInfo = [];
        if (comments) {
            const result = yield comment_1.default.find({ _id: { $in: comments } }).sort({ created_at: -1 })
                .limit(Number(limit))
                .skip(skip);
            for (const comment of result) {
                const user = yield users_1.default.findOne({
                    where: { id: comment.userId },
                    attributes: { exclude: ['password'] },
                });
                if (user) {
                    commentsWithUserInfo.push(Object.assign(Object.assign({}, comment._doc), { creator: user }));
                }
            }
        }
        const responseData = { data: commentsWithUserInfo, page, limit, totalRecords: comments.length };
        return (0, response_1.default)({ res, status: 200, data: responseData });
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
});
exports.getComments = getComments;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    users_1.default.sync();
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const postId = (_c = req.params) === null || _c === void 0 ? void 0 : _c.postId;
    if (!req.body.description && !req.body.image_url) {
        (0, httpError_1.default)(500, "Please enter content or add image.");
        return (0, response_1.default)({ res, status: 500, message: "Please enter content or add image." });
    }
    let createdComment;
    try {
        const commentData = {
            userId, postId,
            image_url: req.body.image_url,
            image_text: req.body.image_text,
            rich_description: req.body.rich_description,
            description: req.body.description,
        };
        createdComment = yield comment_1.default.create(commentData);
        if (!createdComment) {
            (0, httpError_1.default)(500, 'Unable to create Comment!');
            return (0, response_1.default)({ res, status: 500, message: 'Unable to create Comment!' });
        }
        yield posts_1.default.findByIdAndUpdate(postId, { $push: { comments: createdComment._id } }, { safe: true, upsert: true });
        const user = yield users_1.default.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] },
        });
        const commentInfo = Object.assign(Object.assign({}, createdComment._doc), { creator: user });
        // TODO: to start a background job here - fanout
        return (0, response_1.default)({ res, data: commentInfo, status: 201, message: "Comment created successfully" });
    }
    catch (error) {
        (0, httpError_1.default)(500, error);
        if (createdComment) {
            // You may need to handle errors in the rollback process as well
            yield comment_1.default.findByIdAndDelete(createdComment._id);
        }
        return (0, response_1.default)({ res, status: 500, message: 'Unable to create Comment!' });
    }
});
exports.createComment = createComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    users_1.default.sync();
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    if (!req.body.description && !req.body.image_url) {
        (0, httpError_1.default)(500, "Please enter some updated content in body.");
        return (0, response_1.default)({ res, status: 500, message: "Please enter some updated content in body." });
    }
    try {
        const commentId = req.params.id;
        const updatedData = {
            image_url: req.body.image_url,
            image_text: req.body.image_text,
            rich_description: req.body.rich_description,
            description: req.body.description,
        };
        const updatedComment = yield comment_1.default.findByIdAndUpdate({ _id: commentId, userId }, updatedData, { new: true });
        if (!updatedComment) {
            (0, httpError_1.default)(500, 'Error while updating comment.');
            return (0, response_1.default)({ res, status: 500, message: 'Error while updating comment. Please try again!' });
        }
        const user = yield users_1.default.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] },
        });
        const commentInfo = Object.assign(Object.assign({}, updatedComment._doc), { creator: user });
        return (0, response_1.default)({ res, data: commentInfo, status: 200, message: "Comment updated successfully" });
    }
    catch (error) {
        (0, httpError_1.default)(500, error);
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
    try {
        const commentId = req.params.id;
        // Use the Comment model to find and delete the post by ID
        const deletedComment = yield comment_1.default.findByIdAndDelete({ _id: commentId, userId });
        if (!deletedComment) {
            (0, httpError_1.default)(500, 'Comment not found.');
            return (0, response_1.default)({ res, status: 500, message: 'Comment not found. Please try again!' });
        }
        yield posts_1.default.findByIdAndUpdate(deletedComment.postId, { $pull: { comments: deletedComment._id } }, { safe: true, upsert: true });
        return (0, response_1.default)({ res, status: 204, message: "Comment deleted successfully" });
    }
    catch (error) {
        (0, httpError_1.default)(500, error);
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment.js.map