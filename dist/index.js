"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const config_1 = __importDefault(require("./config/config"));
const config_2 = require("./config/config");
const connectDB_1 = __importDefault(require("./config/db/connectDB"));
const configureCloudinary_1 = __importDefault(require("./config/configureCloudinary"));
const app = (0, express_1.default)();
(0, config_1.default)(app, express_1.default);
(0, connectDB_1.default)();
(0, configureCloudinary_1.default)();
app.use("/api/v1", routes_1.default);
app.listen(config_2.port, () => console.log(`Server running on port ${config_2.port}`));
//# sourceMappingURL=index.js.map