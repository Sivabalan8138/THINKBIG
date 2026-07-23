import { Request, Response } from 'express';
import mongoose from 'mongoose';
import AiEvaluation from '../models/AiEvaluation';
import JudgeEvaluation from '../models/JudgeEvaluation';
import Team from '../models/Team';
import ActivityLog from '../models/ActivityLog';
import Settings from '../models/Settings';
import { sendResultEmail } from '../services/emailService';
import { evaluateAbstractWithAI } from '../services/aiService';

export const triggerAiEvaluation = async (req: Request, res: Response) => {
  res.status(400).json({ message: 'AI Evaluation has been deprecated and disabled.' });
};

export const submitAdminJudgeScore = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { score } = req.body;

    const judgeScore = Number(score);
    if (isNaN(judgeScore) || judgeScore < 0 || judgeScore > 100) {
      return res.status(400).json({ message: 'Score must be between 0 and 100' });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.scores.judgeScore = judgeScore;
    // Final score is entirely dependent on judgeScore now
    team.scores.finalScore = judgeScore;
    team.evaluationStatus = 'completed';
    await team.save();

    await ActivityLog.create({
      action: 'JUDGE_EVALUATION',
      description: `Admin assigned a manual Judge Score of ${judgeScore}/100 to team ${team.teamName}`,
      teamId: team.teamId
    });

    res.json({ message: 'Judge score updated successfully', teamScore: team.scores });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update score', error: error.message });
  }
};

export const submitJudgeEvaluation = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { scores, comments } = req.body;
    const judgeId = (req as any).user._id;
    const isAdmin = (req as any).user.role === 'admin';

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const totalJudgeScore = scores.presentationSkills + scores.technicalExplanation + scores.qnaSession;

    if (totalJudgeScore > 100) {
      return res.status(400).json({ message: 'Judge score cannot exceed 100 marks.' });
    }

    // Check if locked
    const existingEval = await JudgeEvaluation.findOne({
      teamId: new mongoose.Types.ObjectId(teamId as string),
      judgeId: new mongoose.Types.ObjectId(judgeId as string)
    });

    if (existingEval && existingEval.isLocked && !isAdmin) {
      return res.status(403).json({ message: 'Evaluation is locked. Contact Admin to unlock.' });
    }

    const evaluation = await JudgeEvaluation.findOneAndUpdate(
      { teamId: new mongoose.Types.ObjectId(teamId as string), judgeId: new mongoose.Types.ObjectId(judgeId as string) },
      {
        teamId: new mongoose.Types.ObjectId(teamId as string),
        judgeId: new mongoose.Types.ObjectId(judgeId as string),
        scores,
        totalJudgeScore,
        comments,
        isLocked: true // Lock immediately upon submission
      },
      { upsert: true, new: true }
    );

    // Aggregate judge scores if multiple judges
    const allJudgeEvals = await JudgeEvaluation.find({ teamId: new mongoose.Types.ObjectId(teamId as string) });
    const avgJudgeScore = allJudgeEvals.reduce((acc, curr) => acc + curr.totalJudgeScore, 0) / allJudgeEvals.length;

    team.scores.judgeScore = avgJudgeScore;
    team.scores.finalScore = avgJudgeScore;
    team.evaluationStatus = 'completed'; // Direct to completed since no AI
    await team.save();

    await ActivityLog.create({
      action: isAdmin ? 'ADMIN_OVERRIDE_EVALUATION' : 'JUDGE_EVALUATION',
      description: `Judge evaluation submitted for ${team.teamName}. Score: ${totalJudgeScore}/100`,
      teamId: team.teamId
    });

    res.json({ message: 'Judge Evaluation submitted successfully', evaluation, teamScore: team.scores });
  } catch (error: any) {
    res.status(500).json({ message: 'Judge Evaluation failed', error: error.message });
  }
};

export const adminUnlockEvaluation = async (req: Request, res: Response) => {
  try {
    const { evalId } = req.params;
    const evaluation = await JudgeEvaluation.findById(evalId);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });

    evaluation.isLocked = false;
    await evaluation.save();

    await ActivityLog.create({
      action: 'EVALUATION_UNLOCKED',
      description: `Admin unlocked evaluation ID: ${evalId}`
    });

    res.json({ message: 'Evaluation unlocked successfully', evaluation });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to unlock evaluation', error: error.message });
  }
};

export const publishResults = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) return res.status(404).json({ message: 'Settings not found' });

    settings.resultsPublished = !settings.resultsPublished;
    await settings.save();

    if (settings.resultsPublished) {
      const teams = await Team.find({ evaluationStatus: 'completed' });
      for (const team of teams) {
        if (team.teamLeader?.email) {
          await sendResultEmail(
            team.teamLeader.email,
            team.teamName,
            team.rankings?.overallRank || 0,
            team.rankings?.domainRank || 0,
            team.scores?.finalScore || 0
          );
        }
      }
    }

    await ActivityLog.create({
      action: settings.resultsPublished ? 'RESULTS_PUBLISHED' : 'RESULTS_HIDDEN',
      description: `Admin ${settings.resultsPublished ? 'published' : 'hid'} the final results.`
    });

    res.json({ message: `Results ${settings.resultsPublished ? 'published' : 'hidden'} successfully`, resultsPublished: settings.resultsPublished });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to publish results', error: error.message });
  }
};

export const calculateRankings = async (req: Request, res: Response) => {
  try {
    // Fetch all completed teams
    const teams = await Team.find({ evaluationStatus: 'completed' }).sort({ 'scores.finalScore': -1 });
    
    // Calculate Overall Ranks
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      if (!team) continue;
      if (!team.rankings) {
        team.rankings = {} as any;
      }
      team.rankings!.overallRank = i + 1;
      await team.save();
    }

    // Calculate Domain Ranks
    const domainGroups: { [domain: string]: any[] } = {};
    teams.forEach(t => {
      if (!t) return;
      if (!domainGroups[t.domain]) domainGroups[t.domain] = [];
      domainGroups[t.domain]!.push(t);
    });

    for (const domain in domainGroups) {
      const group = domainGroups[domain];
      if (!group) continue;
      const dTeams = group.sort((a, b) => (b.scores?.finalScore || 0) - (a.scores?.finalScore || 0));
      for (let i = 0; i < dTeams.length; i++) {
        const team = dTeams[i];
        if (!team) continue;
        if (!team.rankings) {
          team.rankings = {} as any;
        }
        team.rankings!.domainRank = i + 1;
        await team.save();
      }
    }

    await ActivityLog.create({
      action: 'RANKINGS_CALCULATED',
      description: `Admin calculated overall and domain rankings for ${teams.length} teams.`
    });

    res.json({ message: 'Rankings calculated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to calculate rankings', error: error.message });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find()
      .select('teamId teamName projectTitle domain scores status rankings')
      .sort({ 'scores.finalScore': -1 });
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
};
