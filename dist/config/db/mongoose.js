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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const mongoose = require('mongoose');
let mongodb;
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongodb = yield mongoose.connect(config_1.mongodb_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongodb Database connected!");
        return mongodb;
    }
    catch (error) {
        throw new Error(`MongoDB connection error: ${error}`);
    }
});
exports.default = connectToMongoDB;
//# sourceMappingURL=mongoose.js.map