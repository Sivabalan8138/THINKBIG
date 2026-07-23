import { v2 as cloudinary } from 'cloudinary';

/**
 * Uploads a buffer to Cloudinary using a base64 encoded data URI.
 * @param buffer The file buffer from multer.memoryStorage or pdfkit/qrcode.
 * @param mimetype The mimetype of the file (e.g., 'image/png', 'application/pdf').
 * @param folder The target folder on Cloudinary.
 * @param resourceType The resource type (auto, image, raw). Default is 'auto'.
 * @returns The secure URL of the uploaded file on Cloudinary.
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  mimetype: string,
  folder: string,
  resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const b64 = buffer.toString('base64');
      const dataURI = `data:${mimetype};base64,${b64}`;

      cloudinary.uploader.upload(
        dataURI,
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Unknown Cloudinary upload error'));
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
