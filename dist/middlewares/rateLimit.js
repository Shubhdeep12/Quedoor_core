"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setRateLimit = require("express-rate-limit");
const rateLimit = setRateLimit({
    windowMs: 60 * 1000,
    max: 50,
    message: "You have exceeded your 50 requests per minute limit.",
    headers: true,
});
exports.default = rateLimit;
//# sourceMappingURL=rateLimit.js.map