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
exports.getFilteredPosts = void 0;
const response_1 = __importDefault(require("../utils/response"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const posts_1 = __importDefault(require("../models/posts"));
const users_1 = __importDefault(require("../models/users"));
const getFollowing_1 = __importDefault(require("../utils/getFollowing"));
const getImageText_1 = __importDefault(require("../utils/getImageText"));
const stringSimilarity = require('string-similarity');
const getFilteredPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
    const description = req.body.description;
    let image_text = '';
    if (image) {
        image_text = yield (0, getImageText_1.default)(image);
    }
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { limit = 10, page = 1 } = req.query;
    try {
        const skip = (page - 1) * limit;
        const followers = yield (0, getFollowing_1.default)(Number(userId));
        const filter = { userId: { $in: [userId, ...(followers || [])] } };
        let count = 1;
        if ((description === null || description === void 0 ? void 0 : description.length) > 2 && image_text && (image_text === null || image_text === void 0 ? void 0 : image_text.length) > 2) {
            count = 2;
        }
        // Fetch the posts first
        const posts = yield posts_1.default.find(filter).lean().exec();
        console.log({ posts });
        // Apply your custom sort logic to the posts
        posts.sort((a, b) => {
            const valA = ((image_text && (image_text === null || image_text === void 0 ? void 0 : image_text.length) > 1 &&
                stringSimilarity.compareTwoStrings(image_text, a.image_text)) +
                (description.length > 1 &&
                    stringSimilarity.compareTwoStrings(description, a.description))) /
                count;
            const valB = ((image_text && (image_text === null || image_text === void 0 ? void 0 : image_text.length) > 1 &&
                stringSimilarity.compareTwoStrings(image_text, b.image_text)) +
                (description.length > 1 &&
                    stringSimilarity.compareTwoStrings(description, b.description))) /
                count;
            if (valA > valB) {
                return -1; // Sort in descending order
            }
            else if (valA < valB) {
                return 1; // Sort in descending order
            }
            return 0;
        });
        // Apply limit and skip to the sorted data
        const sortedPosts = posts.slice(skip, skip + Number(limit));
        // Get total records count
        const totalRecords = posts.length;
        const postsWithUserInfo = [];
        for (const post of sortedPosts) {
            const user = yield users_1.default.findOne({
                where: { id: post.userId },
                attributes: { exclude: ['password'] },
            });
            if (user) {
                postsWithUserInfo.push(Object.assign(Object.assign({}, post), { creator: user }));
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
exports.getFilteredPosts = getFilteredPosts;
//# sourceMappingURL=filter.js.map