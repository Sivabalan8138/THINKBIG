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
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
/**
 * Uploads a buffer to Cloudinary using a base64 encoded data URI.
 * @param buffer The file buffer from multer.memoryStorage or pdfkit/qrcode.
 * @param mimetype The mimetype of the file (e.g., 'image/png', 'application/pdf').
 * @param folder The target folder on Cloudinary.
 * @param resourceType The resource type (auto, image, raw). Default is 'auto'.
 * @returns The secure URL of the uploaded file on Cloudinary.
 */
const uploadToCloudinary = (buffer_1, mimetype_1, folder_1, ...args_1) => __awaiter(void 0, [buffer_1, mimetype_1, folder_1, ...args_1], void 0, function* (buffer, mimetype, folder, resourceType = 'auto') {
    return new Promise((resolve, reject) => {
        try {
            const b64 = buffer.toString('base64');
            const dataURI = `data:${mimetype};base64,${b64}`;
            cloudinary_1.v2.uploader.upload(dataURI, {
                folder,
                resource_type: resourceType,
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else if (result) {
                    resolve(result.secure_url);
                }
                else {
                    reject(new Error('Unknown Cloudinary upload error'));
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
});
exports.uploadToCloudinary = uploadToCloudinary;
//# sourceMappingURL=cloudinaryHelper.js.map