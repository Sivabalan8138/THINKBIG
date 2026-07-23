"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.calculateRankings = exports.publishResults = exports.adminUnlockEvaluation = exports.submitJudgeEvaluation = exports.submitAdminJudgeScore = exports.triggerAiEvaluation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const JudgeEvaluation_1 = __importDefault(require("../models/JudgeEvaluation"));
const Team_1 = __importDefault(require("../models/Team"));
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const Settings_1 = __importDefault(require("../models/Settings"));
const emailService_1 = require("../services/emailService");
const triggerAiEvaluation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(400).json({ message: 'AI Evaluation has been deprecated and disabled.' });
});
exports.triggerAiEvaluation = triggerAiEvaluation;
const submitAdminJudgeScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        const { score } = req.body;
        const judgeScore = Number(score);
        if (isNaN(judgeScore) || judgeScore < 0 || judgeScore > 100) {
            return res.status(400).json({ message: 'Score must be between 0 and 100' });
        }
        const team = yield Team_1.default.findById(teamId);
        if (!team)
            return res.status(404).json({ message: 'Team not found' });
        team.scores.judgeScore = judgeScore;
        // Final score is entirely dependent on judgeScore now
        team.scores.finalScore = judgeScore;
        team.evaluationStatus = 'completed';
        yield team.save();
        yield ActivityLog_1.default.create({
            action: 'JUDGE_EVALUATION',
            description: `Admin assigned a manual Judge Score of ${judgeScore}/100 to team ${team.teamName}`,
            teamId: team.teamId
        });
        res.json({ message: 'Judge score updated successfully', teamScore: team.scores });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update score', error: error.message });
    }
});
exports.submitAdminJudgeScore = submitAdminJudgeScore;
const submitJudgeEvaluation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        const { scores, comments } = req.body;
        const judgeId = req.user._id;
        const isAdmin = req.user.role === 'admin';
        const team = yield Team_1.default.findById(teamId);
        if (!team)
            return res.status(404).json({ message: 'Team not found' });
        const totalJudgeScore = scores.presentationSkills + scores.technicalExplanation + scores.qnaSession;
        if (totalJudgeScore > 100) {
            return res.status(400).json({ message: 'Judge score cannot exceed 100 marks.' });
        }
        // Check if locked
        const existingEval = yield JudgeEvaluation_1.default.findOne({
            teamId: new mongoose_1.default.Types.ObjectId(teamId),
            judgeId: new mongoose_1.default.Types.ObjectId(judgeId)
        });
        if (existingEval && existingEval.isLocked && !isAdmin) {
            return res.status(403).json({ message: 'Evaluation is locked. Contact Admin to unlock.' });
        }
        const evaluation = yield JudgeEvaluation_1.default.findOneAndUpdate({ teamId: new mongoose_1.default.Types.ObjectId(teamId), judgeId: new mongoose_1.default.Types.ObjectId(judgeId) }, {
            teamId: new mongoose_1.default.Types.ObjectId(teamId),
            judgeId: new mongoose_1.default.Types.ObjectId(judgeId),
            scores,
            totalJudgeScore,
            comments,
            isLocked: true // Lock immediately upon submission
        }, { upsert: true, new: true });
        // Aggregate judge scores if multiple judges
        const allJudgeEvals = yield JudgeEvaluation_1.default.find({ teamId: new mongoose_1.default.Types.ObjectId(teamId) });
        const avgJudgeScore = allJudgeEvals.reduce((acc, curr) => acc + curr.totalJudgeScore, 0) / allJudgeEvals.length;
        team.scores.judgeScore = avgJudgeScore;
        team.scores.finalScore = avgJudgeScore;
        team.evaluationStatus = 'completed'; // Direct to completed since no AI
        yield team.save();
        yield ActivityLog_1.default.create({
            action: isAdmin ? 'ADMIN_OVERRIDE_EVALUATION' : 'JUDGE_EVALUATION',
            description: `Judge evaluation submitted for ${team.teamName}. Score: ${totalJudgeScore}/100`,
            teamId: team.teamId
        });
        res.json({ message: 'Judge Evaluation submitted successfully', evaluation, teamScore: team.scores });
    }
    catch (error) {
        res.status(500).json({ message: 'Judge Evaluation failed', error: error.message });
    }
});
exports.submitJudgeEvaluation = submitJudgeEvaluation;
const adminUnlockEvaluation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { evalId } = req.params;
        const evaluation = yield JudgeEvaluation_1.default.findById(evalId);
        if (!evaluation)
            return res.status(404).json({ message: 'Evaluation not found' });
        evaluation.isLocked = false;
        yield evaluation.save();
        yield ActivityLog_1.default.create({
            action: 'EVALUATION_UNLOCKED',
            description: `Admin unlocked evaluation ID: ${evalId}`
        });
        res.json({ message: 'Evaluation unlocked successfully', evaluation });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to unlock evaluation', error: error.message });
    }
});
exports.adminUnlockEvaluation = adminUnlockEvaluation;
const publishResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const settings = yield Settings_1.default.findOne();
        if (!settings)
            return res.status(404).json({ message: 'Settings not found' });
        settings.resultsPublished = !settings.resultsPublished;
        yield settings.save();
        if (settings.resultsPublished) {
            const teams = yield Team_1.default.find({ evaluationStatus: 'completed' });
            for (const team of teams) {
                if ((_a = team.teamLeader) === null || _a === void 0 ? void 0 : _a.email) {
                    yield (0, emailService_1.sendResultEmail)(team.teamLeader.email, team.teamName, ((_b = team.rankings) === null || _b === void 0 ? void 0 : _b.overallRank) || 0, ((_c = team.rankings) === null || _c === void 0 ? void 0 : _c.domainRank) || 0, ((_d = team.scores) === null || _d === void 0 ? void 0 : _d.finalScore) || 0);
                }
            }
        }
        yield ActivityLog_1.default.create({
            action: settings.resultsPublished ? 'RESULTS_PUBLISHED' : 'RESULTS_HIDDEN',
            description: `Admin ${settings.resultsPublished ? 'published' : 'hid'} the final results.`
        });
        res.json({ message: `Results ${settings.resultsPublished ? 'published' : 'hidden'} successfully`, resultsPublished: settings.resultsPublished });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to publish results', error: error.message });
    }
});
exports.publishResults = publishResults;
const calculateRankings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all completed teams
        const teams = yield Team_1.default.find({ evaluationStatus: 'completed' }).sort({ 'scores.finalScore': -1 });
        // Calculate Overall Ranks
        for (let i = 0; i < teams.length; i++) {
            const team = teams[i];
            if (!team)
                continue;
            if (!team.rankings) {
                team.rankings = {};
            }
            team.rankings.overallRank = i + 1;
            yield team.save();
        }
        // Calculate Domain Ranks
        const domainGroups = {};
        teams.forEach(t => {
            if (!t)
                return;
            if (!domainGroups[t.domain])
                domainGroups[t.domain] = [];
            domainGroups[t.domain].push(t);
        });
        for (const domain in domainGroups) {
            const group = domainGroups[domain];
            if (!group)
                continue;
            const dTeams = group.sort((a, b) => { var _a, _b; return (((_a = b.scores) === null || _a === void 0 ? void 0 : _a.finalScore) || 0) - (((_b = a.scores) === null || _b === void 0 ? void 0 : _b.finalScore) || 0); });
            for (let i = 0; i < dTeams.length; i++) {
                const team = dTeams[i];
                if (!team)
                    continue;
                if (!team.rankings) {
                    team.rankings = {};
                }
                team.rankings.domainRank = i + 1;
                yield team.save();
            }
        }
        yield ActivityLog_1.default.create({
            action: 'RANKINGS_CALCULATED',
            description: `Admin calculated overall and domain rankings for ${teams.length} teams.`
        });
        res.json({ message: 'Rankings calculated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to calculate rankings', error: error.message });
    }
});
exports.calculateRankings = calculateRankings;
const getLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield Team_1.default.find()
            .select('teamId teamName projectTitle domain scores status rankings')
            .sort({ 'scores.finalScore': -1 });
        res.json(teams);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
    }
});
exports.getLeaderboard = getLeaderboard;
//# sourceMappingURL=evaluationController.js.map