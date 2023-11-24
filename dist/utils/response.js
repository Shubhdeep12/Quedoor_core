"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response = ({ res, message, status = 200, data = undefined }) => {
    res.status(status).json({
        status,
        message,
        result: data,
    });
};
exports.default = response;
//# sourceMappingURL=response.js.map