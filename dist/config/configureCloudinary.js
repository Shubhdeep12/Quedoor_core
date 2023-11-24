"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = require("./config");
const configureCloudinary = () => {
    cloudinary_1.v2.config({
        cloud_name: config_1.cloud_name,
        api_key: config_1.cloud_key,
        api_secret: config_1.cloud_secret,
    });
};
exports.default = configureCloudinary;
//# sourceMappingURL=configureCloudinary.js.map