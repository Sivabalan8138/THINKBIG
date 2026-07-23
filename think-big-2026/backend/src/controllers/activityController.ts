import { Request, Response } from 'express';
import ActivityLog from '../models/ActivityLog';

export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch activities', error: error.message });
  }
};
