import express from 'express';
import { registerTeam, uploadFiles, getAllTeams, deleteTeam } from '../controllers/teamController';
import { protect, adminCheck } from '../middleware/auth';
import { upload } from '../utils/upload';

const router = express.Router();

router.post('/register', registerTeam);
router.post(
  '/:teamId/upload',
  upload.fields([
    { name: 'ppt', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  uploadFiles
);

router.get('/', protect, adminCheck, getAllTeams);
router.delete('/:id', protect, adminCheck, deleteTeam);

export default router;
