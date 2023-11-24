"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const posts_1 = __importDefault(require("./posts"));
const comments_1 = __importDefault(require("./comments"));
const users_1 = __importDefault(require("./users"));
const attachment_1 = __importDefault(require("./attachment"));
const misc_1 = __importDefault(require("./misc"));
const filter_1 = __importDefault(require("./filter"));
const router = express_1.default.Router();
router.use("/auth", auth_1.default);
router.use("/posts", posts_1.default);
router.use("/filter", filter_1.default);
router.use("/comments", comments_1.default);
router.use("/users", users_1.default);
router.use("/attachment", attachment_1.default);
router.use("/", misc_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map