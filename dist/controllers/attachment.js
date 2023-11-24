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
exports.deleteAttachment = exports.uploadAttachment = void 0;
const httpError_1 = __importDefault(require("../utils/httpError"));
const response_1 = __importDefault(require("../utils/response"));
const getImageText_1 = __importDefault(require("../utils/getImageText"));
const uploadFile_1 = __importDefault(require("../utils/uploadFile"));
const deleteFile_1 = __importDefault(require("../utils/deleteFile"));
const uploadAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { with_image_text = "true" } = req.body;
    try {
        // Check file size
        const fileSizeLimit = 10 * 1024 * 1024; // 10MB
        if (!req.file || req.file.size > fileSizeLimit) {
            (0, httpError_1.default)(400, 'File size exceeds the limit (10MB)');
            return (0, response_1.default)({ res, status: 400, message: 'File size exceeds the limit (10MB)' });
        }
        // Check file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            (0, httpError_1.default)(400, 'Invalid file type. Only JPEG, JPG, GIF and PNG are allowed.');
            return (0, response_1.default)({ res, status: 400, message: 'Invalid file type. Only JPEG, JPG, GIF and PNG are allowed.' });
        }
        // Upload image to Cloudinary
        const result = yield (0, uploadFile_1.default)(req.file.buffer);
        let image_text = "";
        if (with_image_text === 'true')
            image_text = yield (0, getImageText_1.default)(result.secure_url);
        // console.log(image_text);
        return (0, response_1.default)({ res, data: { image_url: result.secure_url, image_text } });
    }
    catch (error) {
        (0, httpError_1.default)(500, String(error));
        return (0, response_1.default)({ res, status: 500, message: 'Server error' });
    }
});
exports.uploadAttachment = uploadAttachment;
const deleteAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image_url: image_url } = req.query;
    try {
        yield (0, deleteFile_1.default)(String(image_url));
        return (0, response_1.default)({ res, message: 'File deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return (0, response_1.default)({ res, status: 500, message: String(error) });
    }
});
exports.deleteAttachment = deleteAttachment;
//# sourceMappingURL=attachment.js.map