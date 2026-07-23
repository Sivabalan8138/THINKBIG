import express from 'express';
import { 
  triggerAiEvaluation, 
  submitJudgeEvaluation, 
  getLeaderboard,
  adminUnlockEvaluation,
  publishResults,
  calculateRankings,
  submitAdminJudgeScore
} from '../controllers/evaluationController';
import { protect, adminCheck, judgeCheck } from '../middleware/auth';

const router = express.Router();

router.post('/:teamId/ai', protect, adminCheck, triggerAiEvaluation);
router.post('/:teamId/admin-score', protect, adminCheck, submitAdminJudgeScore);
router.post('/:teamId/judge', protect, judgeCheck, submitJudgeEvaluation);
router.post('/unlock/:evalId', protect, adminCheck, adminUnlockEvaluation);
router.post('/publish', protect, adminCheck, publishResults);
router.post('/calculate-rankings', protect, adminCheck, calculateRankings);
router.get('/leaderboard', getLeaderboard);

export default router;
