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
const logger_1 = __importDefault(require("../middlewares/logger"));
const neo4j_1 = require("../config/db/neo4j");
const followUser = (followerId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = (0, neo4j_1.getNeo4jDriver)().session();
    let createdRelationship;
    try {
        const result = yield session.run('MATCH (follower:User {user_id: $followerId}), (following:User {user_id: $followingId}) ' +
            'WHERE NOT (follower)-[:FOLLOWS]->(following) ' +
            'CREATE (follower)-[:FOLLOWS]->(following) ' +
            'RETURN follower, following', { followerId, followingId });
        if (result.records.length === 0) {
            throw new Error('Relationship already exists');
        }
        createdRelationship = result.records[0];
        const followerNode = createdRelationship.get('follower');
        const followingNode = createdRelationship.get('following');
        logger_1.default.info('Relationship created successfully:', followerNode.properties, followingNode.properties);
        return createdRelationship;
    }
    catch (error) {
        if (error === null || error === void 0 ? void 0 : error.message.includes('Relationship already exists')) {
            throw new Error('Relationship already exists between the users');
        }
        else if (error === null || error === void 0 ? void 0 : error.message.includes('Node not found')) {
            throw new Error('One or both users do not exist');
        }
        else {
            throw new Error('Error:', error.message);
        }
    }
    finally {
        session.close();
    }
});
exports.default = followUser;
//# sourceMappingURL=follow.js.map