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
exports.deleteTeam = exports.getAllTeams = exports.uploadFiles = exports.registerTeam = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const emailService_1 = require("../services/emailService");
const generatePass_1 = require("../utils/generatePass");
const cloudinaryHelper_1 = require("../utils/cloudinaryHelper");
const registerTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamName, projectTitle, domain, teamLeader, members, abstract } = req.body;
        // Validate member count (min 2, max 4 total)
        const totalMembers = 1 + ((members === null || members === void 0 ? void 0 : members.length) || 0);
        if (totalMembers < 2 || totalMembers > 4) {
            return res.status(400).json({ message: 'Team must have between 2 and 4 members.' });
        }
        const newTeam = new Team_1.default({
            teamName,
            projectTitle,
            domain,
            teamLeader,
            members,
            abstract,
        });
        const savedTeam = yield newTeam.save();
        // Generate QR Pass & Hall Ticket
        const qrPassUrl = yield (0, generatePass_1.generateQR)(savedTeam.teamId);
        const hallTicketUrl = yield (0, generatePass_1.generateHallTicket)(savedTeam, qrPassUrl);
        savedTeam.qrPassUrl = qrPassUrl;
        savedTeam.hallTicketUrl = hallTicketUrl;
        yield savedTeam.save();
        // Store Activity Log
        yield ActivityLog_1.default.create({
            action: 'TEAM_REGISTERED',
            description: `New team registered: ${savedTeam.teamName} (${savedTeam.domain})`,
            teamId: savedTeam.teamId
        });
        // Send Confirmation Email
        const fullQrUrl = qrPassUrl;
        const fullHallTicketUrl = hallTicketUrl;
        yield (0, emailService_1.sendRegistrationEmail)(teamLeader.email, teamName, savedTeam.teamId, fullQrUrl, fullHallTicketUrl);
        res.status(201).json({ message: 'Team registered successfully', team: savedTeam });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register team', error: error.message });
    }
});
exports.registerTeam = registerTeam;
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        const files = req.files;
        const { abstract } = req.body;
        const team = yield Team_1.default.findOne({ teamId: teamId });
        if (!team) {
            return res.status(404).json({ message: 'Team not found. Please check your Team ID.' });
        }
        if (files['ppt'] && files['ppt'][0]) {
            const p = files['ppt'][0];
            team.files.pptUrl = yield (0, cloudinaryHelper_1.uploadToCloudinary)(p.buffer, p.mimetype, 'think-big-2026/teams', 'raw');
        }
        if (files['pdf'] && files['pdf'][0]) {
            const p = files['pdf'][0];
            team.files.pdfUrl = yield (0, cloudinaryHelper_1.uploadToCloudinary)(p.buffer, p.mimetype, 'think-big-2026/teams', 'raw');
        }
        if (abstract) {
            // Save the single text abstract to the problemStatement field
            team.abstract = Object.assign(Object.assign({}, team.abstract), { problemStatement: abstract });
        }
        team.status = 'approved'; // optionally mark as uploaded/approved
        yield team.save();
        yield (0, emailService_1.sendSubmissionEmail)(team.teamLeader.email, team.teamName);
        res.json({ message: 'Files uploaded successfully', team });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to upload files', error: error.message });
    }
});
exports.uploadFiles = uploadFiles;
const getAllTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield Team_1.default.find().sort({ createdAt: -1 });
        res.json(teams);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch teams', error: error.message });
    }
});
exports.getAllTeams = getAllTeams;
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTeam = yield Team_1.default.findByIdAndDelete(id);
        if (!deletedTeam) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json({ message: 'Team deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete team', error: error.message });
    }
});
exports.deleteTeam = deleteTeam;
//# sourceMappingURL=teamController.js.map