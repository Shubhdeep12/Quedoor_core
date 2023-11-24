"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// import fs from 'fs';
const config_1 = require("../config");
const postgresConnection = new sequelize_1.Sequelize(Object.assign({ dialect: "postgres", host: config_1.postgres_host, port: config_1.postgres_port, database: config_1.postgres_db, username: config_1.postgres_user, password: config_1.postgres_password }, (config_1.node_env === 'production' ? { dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: config_1.selfSignedCertificate
        },
    } } : {})));
exports.default = postgresConnection;
//# sourceMappingURL=sequelize.js.map