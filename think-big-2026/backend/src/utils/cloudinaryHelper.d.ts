/**
 * Uploads a buffer to Cloudinary using a base64 encoded data URI.
 * @param buffer The file buffer from multer.memoryStorage or pdfkit/qrcode.
 * @param mimetype The mimetype of the file (e.g., 'image/png', 'application/pdf').
 * @param folder The target folder on Cloudinary.
 * @param resourceType The resource type (auto, image, raw). Default is 'auto'.
 * @returns The secure URL of the uploaded file on Cloudinary.
 */
export declare const uploadToCloudinary: (buffer: Buffer, mimetype: string, folder: string, resourceType?: 'auto' | 'image' | 'video' | 'raw') => Promise<string>;
//# sourceMappingURL=cloudinaryHelper.d.ts.map