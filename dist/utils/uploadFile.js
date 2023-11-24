"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const uploadFile = (buffer) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        }).end(buffer);
    });
};
exports.default = uploadFile;
//# sourceMappingURL=uploadFile.js.map