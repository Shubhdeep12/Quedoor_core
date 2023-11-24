"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const router = express_1.default.Router();
router.get("/", verifyToken_1.default, user_1.getAllUsers);
router.get("/find/:userId", verifyToken_1.default, user_1.getUser);
router.put("/:userId", verifyToken_1.default, user_1.updateUser);
router.get('/:userId/followers', verifyToken_1.default, user_1.getAllFollowers);
router.get('/:userId/following', verifyToken_1.default, user_1.getAllFollowing);
router.post('/follow', verifyToken_1.default, user_1.follow);
router.post('/unfollow', verifyToken_1.default, user_1.unfollow);
exports.default = router;
//# sourceMappingURL=users.js.map