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
exports.getMe = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = __importDefault(require("../utils/response"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const config_1 = require("../config/config");
const users_1 = __importDefault(require("../models/users"));
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _token = req.params.token;
    users_1.default.sync();
    let _user;
    jsonwebtoken_1.default.verify(_token, config_1.jwt_key, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            (0, httpError_1.default)(401, "Token is not valid!");
            return (0, response_1.default)({ res, status: 401, message: "Token is not valid!" });
        }
        _user = user;
    }));
    let userDetails;
    if (_user && _user.id) {
        try {
            userDetails = yield users_1.default.findOne({
                where: {
                    id: _user.id
                },
                attributes: { exclude: ['password'] }, // Exclude the 'password' field
            });
            if (!userDetails) {
                (0, httpError_1.default)(404, 'Invalid User Id, Please try again!');
                return (0, response_1.default)({ res, status: 404, message: 'Invalid User Id, Please try again!' });
            }
        }
        catch (error) {
            (0, httpError_1.default)(500, String(error));
            return (0, response_1.default)({ res, status: 500, message: String(error) });
        }
        // eslint-disable-next-line no-unused-vars
        return (0, response_1.default)({ res, data: userDetails, message: "User fetched successfully" });
    }
});
exports.getMe = getMe;
//# sourceMappingURL=misc.js.map