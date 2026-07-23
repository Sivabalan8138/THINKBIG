import express from 'express';
import { generateReport } from '../controllers/reportController';
import { protect, adminCheck } from '../middleware/auth';

const router = express.Router();

router.get('/:reportType/export/:format', protect, adminCheck, generateReport);

export default router;
