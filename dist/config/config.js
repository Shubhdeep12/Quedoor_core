"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selfSignedCertificate = exports.cloud_secret = exports.cloud_key = exports.cloud_name = exports.redis_uri = exports.mongodb_uri = exports.neo4j_uri = exports.neo4j_user = exports.neo4j_password = exports.postgres_password = exports.postgres_user = exports.postgres_db = exports.postgres_port = exports.postgres_host = exports.jwt_key = exports.client_url = exports.port = exports.node_env = void 0;
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const rateLimit_1 = __importDefault(require("../middlewares/rateLimit"));
const logger_1 = __importDefault(require("../middlewares/logger"));
dotenv.config();
exports.node_env = String(process.env.NODE_ENV);
exports.port = Number(process.env.PORT || 4000);
exports.client_url = String(process.env.CLIENT_URL);
exports.jwt_key = String(process.env.JWT_KEY);
exports.postgres_host = String(process.env.POSTGRES_HOST);
exports.postgres_port = Number(process.env.POSTGRES_PORT);
exports.postgres_db = String(process.env.POSTGRES_DB);
exports.postgres_user = String(process.env.POSTGRES_USER);
exports.postgres_password = String(process.env.POSTGRES_PASSWORD);
exports.neo4j_password = String(process.env.NEO4J_PASSWORD);
exports.neo4j_user = String(process.env.NEO4J_USERNAME);
exports.neo4j_uri = String(process.env.NEO4J_URI);
exports.mongodb_uri = String(process.env.MONGO_DB_URI);
exports.redis_uri = String(process.env.REDIS_URI);
exports.cloud_name = String(process.env.CLOUDINARY_CLOUD_NAME);
exports.cloud_key = String(process.env.CLOUDINARY_CLOUD_API_KEY);
exports.cloud_secret = String(process.env.CLOUDINARY_CLOUD_API_SECRET);
exports.selfSignedCertificate = String(JSON.parse(String(process.env.POSTGRES_SELF_SIGNED_CERTIFICATE_KEY)).KEY);
exports.default = (app, express) => {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    });
    app.use((0, cors_1.default)({
        origin: String(process.env.CLIENT_URL),
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(rateLimit_1.default);
    app.use((req, res, next) => {
        // Log an info message for each incoming request
        logger_1.default.info(`Received a ${req.method} request for ${req.url}`);
        logger_1.default.info(JSON.stringify({ method: req.method, url: req.url, headers: req.headers, body: req.body }));
        next();
    });
};
//# sourceMappingURL=config.js.map