import express from 'express';
import { issueCertificates, verifyCertificate } from '../controllers/certificateController';
import { protect, adminCheck } from '../middleware/auth';

const router = express.Router();

router.post('/issue/:teamId', protect, adminCheck, issueCertificates);
router.get('/verify/:certificateId', verifyCertificate);

export default router;
