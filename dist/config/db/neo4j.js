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
exports.getNeo4jDriver = exports.createNeo4jConnection = void 0;
const neo4j = require("neo4j-driver");
const config_1 = require("../config");
let driver;
const createNeo4jConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connecting to neo4j');
    driver = neo4j.driver(config_1.neo4j_uri, neo4j.auth.basic(config_1.neo4j_user, config_1.neo4j_password));
    driver.onCompleted = () => {
        console.log('Connected to Neo4j');
    };
    driver.onError = (error) => {
        console.error('Neo4j connection error:', error);
    };
    const session = driver.session();
    try {
        yield session.run('RETURN 1');
        console.log('Connected to Neo4j');
    }
    catch (error) {
        console.error('Neo4j connection error:', error);
    }
    finally {
        session.close();
    }
});
exports.createNeo4jConnection = createNeo4jConnection;
const getNeo4jDriver = () => {
    if (!driver) {
        throw new Error('Neo4j driver not initialized. Call createNeo4jConnection first.');
    }
    return driver;
};
exports.getNeo4jDriver = getNeo4jDriver;
//# sourceMappingURL=neo4j.js.map