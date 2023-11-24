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
exports.unfollow = exports.follow = exports.getAllFollowing = exports.getAllFollowers = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const users_1 = __importDefault(require("../models/users"));
const getFollowers_1 = __importDefault(require("../utils/getFollowers"));
const getFollowing_1 = __importDefault(require("../utils/getFollowing"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const response_1 = __importDefault(require("../utils/response"));
const follow_1 = __importDefault(require("../utils/follow"));
const unfollow_1 = __importDefault(require("../utils/unfollow"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.default.sync();
    const { limit = 10, page = 1 } = req.query;
    try {
        const skip = (page - 1) * limit;
        const [users, totalRecords] = yield Promise.all([
            users_1.default.findAll({
                attributes: { exclude: ['password'] },
                limit: limit,
                offset: skip,
            }),
            users_1.default.findAndCountAll()
        ]);
        const usersWithCounts = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const following = yield (0, getFollowing_1.default)(Number(user.dataValues.id)); // Use user.id or the appropriate field from your User model
            const followers = yield (0, getFollowers_1.default)(Number(user.dataValues.id)); // Implement a getFollowers function similarly
            return Object.assign(Object.assign({}, user.get({ plain: true })), { following,
                followers });
        })));
        const responseData = { data: usersWithCounts, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords.count) };
        return (0, response_1.default)({ res, data: responseData, message: "User fetched successfully" });
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    users_1.default.sync();
    const userId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.userId;
    let user;
    try {
        user = yield users_1.default.findOne({
            where: {
                id: userId
            },
            attributes: { exclude: ['password'] },
        });
        if (!user) {
            (0, httpError_1.default)(404, 'Invalid User Id, Please try again!');
            return (0, response_1.default)({ res, status: 404, message: 'Invalid User Id, Please try again!' });
        }
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
    // eslint-disable-next-line no-unused-vars
    return (0, response_1.default)({ res, data: user, message: "User fetched successfully" });
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    users_1.default.sync();
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    if (Number(userId) !== Number(req.params.userId)) {
        (0, httpError_1.default)(401, "You are not authorized to update this user");
        return (0, response_1.default)({ res, status: 401, message: "You are not authorized to update this user" });
    }
    try {
        const [rowCount, updatedUser] = yield users_1.default.update({
            name: req.body.name,
            city: req.body.city,
            website: req.body.website,
            profile_img: req.body.profile_img,
        }, {
            where: { id: userId },
            returning: true,
        });
        if (updatedUser && updatedUser[0] && updatedUser[0].dataValues) {
            delete updatedUser[0].dataValues.password;
        }
        if (rowCount !== 0)
            return (0, response_1.default)({ res, data: updatedUser[0], status: 200, message: "User updated" });
        (0, httpError_1.default)(403, "You can only update your own profile!");
        return (0, response_1.default)({ res, status: 403, message: "You can only update your own profile!" });
    }
    catch (error) {
        (0, httpError_1.default)(500, error);
        return (0, response_1.default)({ res, status: 500, message: "Unable to update user, Please try again!" });
    }
});
exports.updateUser = updateUser;
const getAllFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    users_1.default.sync();
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    const { limit = 10, page = 1 } = req.query;
    try {
        const followers = yield (0, getFollowers_1.default)(Number(userId));
        const skip = (page - 1) * limit;
        const [users, totalRecords] = yield Promise.all([
            users_1.default.findAll({
                where: {
                    id: followers,
                },
                attributes: { exclude: ['password'] },
                limit: limit,
                offset: skip,
            }),
            users_1.default.findAndCountAll({
                where: {
                    id: followers,
                },
            })
        ]);
        const responseData = { data: users, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords.count) };
        return (0, response_1.default)({ res, data: responseData, status: 200 });
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, message: 'Internal Server error.', status: 500 });
    }
});
exports.getAllFollowers = getAllFollowers;
const getAllFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.default.sync();
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    try {
        const following = yield (0, getFollowing_1.default)(Number(userId));
        const skip = (page - 1) * limit;
        const [users, totalRecords] = yield Promise.all([
            users_1.default.findAll({
                where: {
                    id: following,
                },
                attributes: { exclude: ['password'] },
                limit: limit,
                offset: skip,
            }),
            users_1.default.findAndCountAll({
                where: {
                    id: following,
                },
            })
        ]);
        const responseData = { data: users, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords.count) };
        return (0, response_1.default)({ res, data: responseData, status: 200 });
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, message: 'Internal Server error.', status: 500 });
    }
});
exports.getAllFollowing = getAllFollowing;
const follow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { follower_id, following_id } = req.body;
    if (!follower_id || !following_id) {
        (0, httpError_1.default)(500, "FollowerId or followingId is missing.");
        return (0, response_1.default)({ res, status: 500, message: "FollowerId or followingId is missing." });
    }
    try {
        // Create a relationship in Neo4j
        const result = yield (0, follow_1.default)(Number(follower_id), Number(following_id));
        return (0, response_1.default)({ res, data: result, status: 200 });
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, message: 'Internal Server error.', status: 500 });
    }
});
exports.follow = follow;
const unfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { follower_id, following_id } = req.body;
    if (!follower_id || !following_id) {
        (0, httpError_1.default)(500, "FollowerId or followingId is missing.");
        return (0, response_1.default)({ res, status: 500, message: "FollowerId or followingId is missing." });
    }
    try {
        // Delete the relationship in Neo4j
        const result = yield (0, unfollow_1.default)(Number(follower_id), Number(following_id));
        return (0, response_1.default)({ res, data: result, status: 200 });
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, message: 'Internal Server error.', status: 500 });
    }
});
exports.unfollow = unfollow;
//# sourceMappingURL=user.js.map