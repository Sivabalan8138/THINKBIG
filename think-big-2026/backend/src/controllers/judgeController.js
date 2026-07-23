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
exports.getAssignedTeams = exports.assignTeamsToJudge = exports.getAllJudges = exports.createJudge = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createJudge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const judgeCount = yield User_1.default.countDocuments({ role: 'judge' });
        if (judgeCount >= 1) {
            return res.status(400).json({ message: 'Only one judge account is allowed in the system.' });
        }
        const existing = yield User_1.default.findOne({ username });
        if (existing)
            return res.status(400).json({ message: 'Username already exists' });
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        const judge = yield User_1.default.create({
            username,
            passwordHash,
            role: 'judge'
        });
        res.status(201).json({ message: 'Judge created successfully', judge: { _id: judge._id, username: judge.username } });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create judge', error: error.message });
    }
});
exports.createJudge = createJudge;
const getAllJudges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const judges = yield User_1.default.find({ role: 'judge' }).select('-passwordHash').populate('assignedTeams', 'teamId teamName projectTitle domain status evaluationStatus');
        res.json(judges);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch judges', error: error.message });
    }
});
exports.getAllJudges = getAllJudges;
const assignTeamsToJudge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { judgeId } = req.params;
        const { teamIds } = req.body;
        const judge = yield User_1.default.findById(judgeId);
        if (!judge || judge.role !== 'judge') {
            return res.status(404).json({ message: 'Judge not found' });
        }
        judge.assignedTeams = teamIds;
        yield judge.save();
        res.json({ message: 'Teams assigned successfully', judge: { _id: judge._id, username: judge.username, assignedTeams: judge.assignedTeams } });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to assign teams', error: error.message });
    }
});
exports.assignTeamsToJudge = assignTeamsToJudge;
const getAssignedTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const judgeId = req.user._id;
        const judge = yield User_1.default.findById(judgeId).populate('assignedTeams', '-__v');
        if (!judge)
            return res.status(404).json({ message: 'Judge not found' });
        res.json(judge.assignedTeams);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch assigned teams', error: error.message });
    }
});
exports.getAssignedTeams = getAssignedTeams;
//# sourceMappingURL=judgeController.js.map