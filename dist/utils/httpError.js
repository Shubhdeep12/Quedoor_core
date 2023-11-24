"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../middlewares/logger"));
const createError = (status, message) => {
    logger_1.default.error(message);
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};
exports.default = createError;
//# sourceMappingURL=httpError.js.map