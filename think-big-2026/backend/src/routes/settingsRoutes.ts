import express from 'express';
import multer from 'multer';
import path from 'path';
import { getSettings, updateSettings, uploadSampleCertificate } from '../controllers/settingsController';
import { protect, adminCheck } from '../middleware/auth';

const router = express.Router();

// Setup local storage for multer
const storage = multer.memoryStorage();

const upload = multer({ storage });

router.get('/', getSettings);
router.put('/', protect, adminCheck, updateSettings);
router.post('/upload-certificate', protect, adminCheck, upload.single('certificate'), uploadSampleCertificate);

export default router;
