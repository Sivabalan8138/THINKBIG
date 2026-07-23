import express from 'express';
import { 
  createJudge, 
  getAllJudges, 
  assignTeamsToJudge, 
  getAssignedTeams 
} from '../controllers/judgeController';
import { protect, adminCheck, judgeCheck } from '../middleware/auth';

const router = express.Router();

// Admin Routes
router.post('/create', protect, adminCheck, createJudge);
router.get('/all', protect, adminCheck, getAllJudges);
router.put('/:judgeId/assign', protect, adminCheck, assignTeamsToJudge);

// Judge Routes
router.get('/assigned-teams', protect, judgeCheck, getAssignedTeams);

export default router;
