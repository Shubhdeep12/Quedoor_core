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
exports.handleLike = void 0;
const response_1 = __importDefault(require("../utils/response"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const posts_1 = __importDefault(require("../models/posts"));
const handleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const postId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.postId;
    const { like, dislike } = req.body;
    if (!postId && !(like || dislike)) {
        (0, httpError_1.default)(500, "PostId or body missing.");
        return (0, response_1.default)({ res, status: 500, message: "PostId or body missing." });
    }
    try {
        if (like) {
            // Add a like to the post
            yield posts_1.default.findByIdAndUpdate(postId, { $push: { reactions: userId } });
        }
        else if (dislike) {
            // Remove a like from the post
            yield posts_1.default.findByIdAndUpdate(postId, { $pull: { reactions: userId } });
        }
        else {
            (0, httpError_1.default)(400, "Invalid reaction. Provide like or dislike as true.");
            return (0, response_1.default)({ res, status: 400, message: 'Invalid reaction. Provide like or dislike as true.' });
        }
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
    return (0, response_1.default)({ res, status: 200, message: 'Reaction added successfully' });
});
exports.handleLike = handleLike;
//# sourceMappingURL=likes.js.map