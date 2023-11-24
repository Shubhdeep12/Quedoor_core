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
exports.getPostCache = void 0;
const redis = require('redis');
const config_1 = require("../config");
const postCache = redis.createClient({
    url: `${config_1.redis_uri}/1`
});
postCache.on('connect', () => {
    console.log('Post Cache Connected to Redis server');
});
postCache.on('error', (err) => {
    console.error('Redis connection error:', err);
});
const connectPostCache = () => __awaiter(void 0, void 0, void 0, function* () {
    postCache.connect();
});
const getPostCache = () => {
    if (!postCache) {
        throw new Error('post cache driver not initialized.');
    }
    return postCache;
};
exports.getPostCache = getPostCache;
exports.default = connectPostCache;
//# sourceMappingURL=postCache.js.map