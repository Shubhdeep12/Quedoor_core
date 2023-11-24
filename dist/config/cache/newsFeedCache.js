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
exports.getNewsFeedCache = void 0;
const redis = require('redis');
const config_1 = require("../config");
const newsFeedCache = redis.createClient({
    url: `${config_1.redis_uri}/0`
});
newsFeedCache.on('connect', () => {
    console.log('NewsFeed Cache Connected to Redis server');
});
newsFeedCache.on('error', (err) => {
    console.error('Redis connection error:', err);
});
const connectNewsFeedCache = () => __awaiter(void 0, void 0, void 0, function* () {
    newsFeedCache.connect();
});
const getNewsFeedCache = () => {
    if (!newsFeedCache) {
        throw new Error('newsFeed cache driver not initialized.');
    }
    return newsFeedCache;
};
exports.getNewsFeedCache = getNewsFeedCache;
exports.default = connectNewsFeedCache;
//# sourceMappingURL=newsFeedCache.js.map