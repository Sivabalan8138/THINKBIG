import { Request, Response } from 'express';
import User from '../models/User';
import Team from '../models/Team';
import bcrypt from 'bcrypt';

export const createJudge = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const judgeCount = await User.countDocuments({ role: 'judge' });
    if (judgeCount >= 1) {
      return res.status(400).json({ message: 'Only one judge account is allowed in the system.' });
    }

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const judge = await User.create({
      username,
      passwordHash,
      role: 'judge'
    });

    res.status(201).json({ message: 'Judge created successfully', judge: { _id: judge._id, username: judge.username } });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create judge', error: error.message });
  }
};

export const getAllJudges = async (req: Request, res: Response) => {
  try {
    const judges = await User.find({ role: 'judge' }).select('-passwordHash').populate('assignedTeams', 'teamId teamName projectTitle domain status evaluationStatus');
    res.json(judges);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch judges', error: error.message });
  }
};

export const assignTeamsToJudge = async (req: Request, res: Response) => {
  try {
    const { judgeId } = req.params;
    const { teamIds } = req.body;

    const judge = await User.findById(judgeId);
    if (!judge || judge.role !== 'judge') {
      return res.status(404).json({ message: 'Judge not found' });
    }

    judge.assignedTeams = teamIds;
    await judge.save();
    res.json({ message: 'Teams assigned successfully', judge: { _id: judge._id, username: judge.username, assignedTeams: judge.assignedTeams } });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to assign teams', error: error.message });
  }
};

export const getAssignedTeams = async (req: Request, res: Response) => {
  try {
    const judgeId = (req as any).user._id;
    const judge = await User.findById(judgeId).populate('assignedTeams', '-__v');
    if (!judge) return res.status(404).json({ message: 'Judge not found' });

    res.json(judge.assignedTeams);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch assigned teams', error: error.message });
  }
};
