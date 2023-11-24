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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.logIn = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = __importDefault(require("../utils/response"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const users_1 = __importDefault(require("../models/users"));
const config_1 = require("../config/config");
const neo4j_1 = require("../config/db/neo4j");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.default.sync();
    let user;
    if (!req.body.name || !req.body.email || !req.body.password) {
        (0, httpError_1.default)(500, "Please enter name, email and password.");
        return (0, response_1.default)({ res, status: 500, message: "Please enter name, email and password." });
    }
    try {
        user = yield users_1.default.findAll({ where: {
                email: req.body.email
            } });
    }
    catch (error) {
        (0, httpError_1.default)(404, error);
        return (0, response_1.default)({ res, status: 404, message: 'Not able to register, Please try again!' });
    }
    if (user === null || user === void 0 ? void 0 : user.length) {
        (0, httpError_1.default)(409, "User already exists.");
        return (0, response_1.default)({ res, status: 409, message: "User already exists." });
    }
    const salt = bcrypt_1.default.genSaltSync(10);
    const hashedPassword = bcrypt_1.default.hashSync(req.body.password, salt);
    let newUser;
    try {
        newUser = yield users_1.default.create({ email: req.body.email, password: hashedPassword, name: req.body.name });
        if (newUser) {
            const userId = newUser.dataValues.id;
            const session = (0, neo4j_1.getNeo4jDriver)().session();
            yield session.run(`CREATE (user:User { user_id: ${userId}})`);
        }
    }
    catch (error) {
        (0, httpError_1.default)(500, error);
        return (0, response_1.default)({ res, status: 500, message: 'Not able to create user, Please try again!' });
    }
    return (0, response_1.default)({ res, status: 201, message: "User created successfully." });
});
exports.register = register;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.default.sync();
    let user;
    if (!req.body.email || !req.body.password) {
        (0, httpError_1.default)(500, "Please enter email and password.");
        return (0, response_1.default)({ res, status: 500, message: "Please enter email and password." });
    }
    try {
        const users = yield users_1.default.findAll({
            where: {
                email: req.body.email
            }
        });
        if ((users === null || users === void 0 ? void 0 : users.length) === 0) {
            (0, httpError_1.default)(404, "User not found, Please try again!");
            return (0, response_1.default)({ res, status: 404, message: "User not found, Please try again!" });
        }
        user = users[0].dataValues;
    }
    catch (error) {
        (0, httpError_1.default)(404, error);
        return (0, response_1.default)({ res, status: 404, message: 'Not able to login, please try again!' });
    }
    const checkPassword = bcrypt_1.default.compareSync(req.body.password, user.password);
    if (!checkPassword) {
        (0, httpError_1.default)(400, "Wrong password or username, Please try again!");
        return (0, response_1.default)({
            res,
            status: 400,
            message: "Wrong password or username, Please try again!",
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.jwt_key, { expiresIn: '365d' });
    // eslint-disable-next-line no-unused-vars
    const { password } = user, others = __rest(user, ["password"]);
    return (0, response_1.default)({
        res,
        message: "User logged in successfully.",
        data: Object.assign(Object.assign({}, others), { access_token: token }),
    });
});
exports.logIn = logIn;
//TODO: Blacklist tokens
const logOut = (req, res) => {
    (0, response_1.default)({
        res,
        message: "User has been logged out",
    });
};
exports.logOut = logOut;
//# sourceMappingURL=auth.js.map