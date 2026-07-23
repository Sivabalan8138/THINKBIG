import express from 'express';
import { exportExcel, exportPdf, exportWord } from '../controllers/attendanceController';

const router = express.Router();

router.get('/export/excel', exportExcel);
router.get('/export/pdf', exportPdf);
router.get('/export/word', exportWord);

export default router;
