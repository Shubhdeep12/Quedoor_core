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
const neo4j_1 = require("../config/db/neo4j");
const getFollowing = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = (0, neo4j_1.getNeo4jDriver)().session();
    try {
        const result = yield session.run('MATCH (follower:User {user_id: $userId})-[:FOLLOWS]->(following:User) RETURN following', { userId });
        return result.records.map((record) => record.get('following').properties.user_id.low);
    }
    catch (error) {
        throw new Error(error);
    }
    finally {
        session.close();
    }
});
exports.default = getFollowing;
//# sourceMappingURL=getFollowing.js.map