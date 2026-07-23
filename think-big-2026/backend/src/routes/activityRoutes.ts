import express from 'express';
import { getActivities } from '../controllers/activityController';
import { protect, adminCheck } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, adminCheck, getActivities);

export default router;
