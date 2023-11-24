"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const filter_1 = require("../controllers/filter");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = express_1.default.Router();
router.post("/posts", verifyToken_1.default, upload_1.default.single('image'), filter_1.getFilteredPosts);
exports.default = router;
//# sourceMappingURL=filter.js.map