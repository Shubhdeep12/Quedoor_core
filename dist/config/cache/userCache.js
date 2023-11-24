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
exports.getUserCache = void 0;
const redis = require('redis');
const config_1 = require("../config");
const userCache = redis.createClient({
    url: `${config_1.redis_uri}/0`
});
userCache.on('connect', () => {
    console.log('User Cache Connected to Redis server');
});
userCache.on('error', (err) => {
    console.error('Redis connection error:', err);
});
const connectUserCache = () => __awaiter(void 0, void 0, void 0, function* () {
    userCache.connect();
});
const getUserCache = () => {
    if (!userCache) {
        throw new Error('user cache driver not initialized.');
    }
    return userCache;
};
exports.getUserCache = getUserCache;
exports.default = connectUserCache;
//# sourceMappingURL=userCache.js.map