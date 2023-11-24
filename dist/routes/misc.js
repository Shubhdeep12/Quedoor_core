"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const misc_1 = require("../controllers/misc");
const router = express_1.default.Router();
router.get("/me/:token", misc_1.getMe);
exports.default = router;
//# sourceMappingURL=misc.js.map