"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const sequelize_1 = __importDefault(require("../config/db/sequelize"));
const User = sequelize_1.default.define('users', userSchema_1.default, {
    tableName: 'users',
    timestamps: false
});
exports.default = User;
//# sourceMappingURL=users.js.map