"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const attachment_1 = require("../controllers/attachment");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = express_1.default.Router();
router.post("/", verifyToken_1.default, upload_1.default.single('image'), attachment_1.uploadAttachment);
router.delete("/", verifyToken_1.default, attachment_1.deleteAttachment);
exports.default = router;
//# sourceMappingURL=attachment.js.map