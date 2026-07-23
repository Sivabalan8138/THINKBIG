import multer from 'multer';

// Use memory storage for all uploads so we can process buffers
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max size
});
