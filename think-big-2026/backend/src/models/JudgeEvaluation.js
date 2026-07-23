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
const JudgeEvaluationSchema = new mongoose_1.Schema({
    teamId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    judgeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    scores: {
        presentationSkills: { type: Number, required: true },
        technicalExplanation: { type: Number, required: true },
        qnaSession: { type: Number, required: true },
    },
    totalJudgeScore: { type: Number, required: true },
    comments: { type: String },
    isLocked: { type: Boolean, default: true }, // Locked immediately upon submission
    evaluatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
// Prevent a judge from evaluating the same team multiple times
JudgeEvaluationSchema.index({ teamId: 1, judgeId: 1 }, { unique: true });
exports.default = mongoose_1.default.model('JudgeEvaluation', JudgeEvaluationSchema);
//# sourceMappingURL=JudgeEvaluation.js.map