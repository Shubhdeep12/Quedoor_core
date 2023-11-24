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
// import connectPostCache from "../cache/postCache";
// import connectUserCache from "../cache/userCache";
const mongoose_1 = __importDefault(require("./mongoose"));
const neo4j_1 = require("./neo4j");
const sequelize_1 = __importDefault(require("./sequelize"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize_1.default.authenticate();
    yield (0, mongoose_1.default)();
    yield (0, neo4j_1.createNeo4jConnection)();
    // await connectUserCache();
    // await connectPostCache();
    // await connectNewsFeedCache();
});
exports.default = connectDB;
//# sourceMappingURL=connectDB.js.map