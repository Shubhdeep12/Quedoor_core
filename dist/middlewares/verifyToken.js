"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const config_1 = require("../config/config");
const response_1 = __importDefault(require("../utils/response"));
const httpError_1 = __importDefault(require("../utils/httpError"));
dotenv.config();
const verifyToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            (0, httpError_1.default)(401, "You are not authenticated!");
            return (0, response_1.default)({ res, status: 401, message: "You are not authenticated" });
        }
        jsonwebtoken_1.default.verify(token, config_1.jwt_key, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                (0, httpError_1.default)(401, "Token is not valid!");
                return (0, response_1.default)({ res, status: 401, message: "Token is not valid!" });
            }
            req.user = user;
            next();
        }));
    }
    catch (err) {
        (0, httpError_1.default)(403, "Authentication failed!");
        return (0, response_1.default)({ res, status: 401, message: "Authentication failed!" });
    }
};
exports.default = verifyToken;
// export const verifyToken = (req: AuthRequest, res: Response) => {
//   try {
//     verifyToken(req, res, () => {
//       if (req.user?.id === req.params.userId) {
//         next();
//       } else {
//         return next(createError(403, "You are not authorized!"));
//       }
//     });
//   } catch (err) {
//     return next(createError(403, "Authentication failed!"));
//   }
// };
//# sourceMappingURL=verifyToken.js.map