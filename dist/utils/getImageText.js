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
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const logger_1 = __importDefault(require("../middlewares/logger"));
const getImageText = (image_url) => __awaiter(void 0, void 0, void 0, function* () {
    const worker = yield tesseract_js_1.default.createWorker('eng');
    let result;
    try {
        result = yield worker.recognize(image_url);
        return result.data.text;
    }
    catch (error) {
        logger_1.default.error('not able to get image text');
        return "";
    }
    finally {
        // console.log(result.data.text);
        yield worker.terminate();
    }
});
exports.default = getImageText;
//# sourceMappingURL=getImageText.js.map