"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MemberSchema = new mongoose_1.Schema({
    studentName: { type: String, required: true },
    registerNumber: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
});
const TeamSchema = new mongoose_1.Schema({
    teamId: { type: String, unique: true },
    teamName: { type: String, required: true, unique: true },
    projectTitle: { type: String, required: true },
    domain: { type: String, required: true },
    teamLeader: Object.assign(Object.assign({}, MemberSchema.obj), { mobileNumber: { type: String, required: true }, email: { type: String, required: true } }),
    members: [MemberSchema], // validate 1-3 extra members
    abstract: {
        problemStatement: { type: String },
        existingChallenges: { type: String },
        proposedSolution: { type: String },
        innovationDescription: { type: String },
        technicalApproach: { type: String },
        expectedBenefits: { type: String },
        futureScope: { type: String },
        estimatedCost: { type: String },
        targetUsers: { type: String },
    },
    files: {
        pptUrl: { type: String },
        pdfUrl: { type: String },
    },
    qrPassUrl: { type: String },
    hallTicketUrl: { type: String },
    scores: {
        aiScore: { type: Number, default: 0 },
        judgeScore: { type: Number, default: 0 },
        finalScore: { type: Number, default: 0 },
    },
    rankings: {
        overallRank: { type: Number },
        domainRank: { type: Number },
    },
    evaluationStatus: {
        type: String,
        enum: ['pending', 'ai_evaluated', 'judge_evaluated', 'completed'],
        default: 'pending',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });
TeamSchema.pre('save', function () {
    if (!this.teamId) {
        this.teamId = `TB26-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
});
exports.default = mongoose_1.default.model('Team', TeamSchema);
//# sourceMappingURL=Team.js.map