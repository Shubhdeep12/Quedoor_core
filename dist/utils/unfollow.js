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
const unfollowUser = (followerId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = (0, neo4j_1.getNeo4jDriver)().session();
    try {
        const result = yield session.run('MATCH (follower:User {user_id: $followerId})-[rel:FOLLOWS]->(following:User {user_id: $followingId}) ' +
            'DELETE rel ' +
            'RETURN follower, following', { followerId, followingId });
        // Check if the relationship was deleted
        if (result.records.length === 0) {
            throw new Error('Relationship does not exist');
        }
        const deletedRelationship = result.records[0];
        // Access the follower and following nodes
        const followerNode = deletedRelationship.get('follower');
        const followingNode = deletedRelationship.get('following');
        // Handle the nodes as needed
        logger_1.default.info('Relationship deleted successfully:', followerNode.properties, followingNode.properties);
    }
    catch (error) {
        if (error.message.includes('Relationship does not exist')) {
            throw new Error('Relationship does not exist between the users');
        }
        else if (error.message.includes('Node not found')) {
            throw new Error('One or both users do not exist');
        }
        else {
            throw new Error('Error:', error.message);
        }
    }
    finally {
        // Always close the session
        session.close();
    }
});
exports.default = unfollowUser;
//# sourceMappingURL=unfollow.js.map