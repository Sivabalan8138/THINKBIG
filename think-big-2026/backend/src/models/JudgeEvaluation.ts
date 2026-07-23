import mongoose, { Document, Schema } from 'mongoose';

export interface IJudgeEvaluation extends Document {
  teamId: mongoose.Types.ObjectId;
  judgeId: mongoose.Types.ObjectId;
  scores: {
    presentationSkills: number; // Max 10
    technicalExplanation: number; // Max 10
    qnaSession: number; // Max 10
  };
  totalJudgeScore: number; // Max 100
  comments: string;
  isLocked: boolean;
  evaluatedAt: Date;
}

const JudgeEvaluationSchema: Schema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    judgeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scores: {
      presentationSkills: { type: Number, required: true },
      technicalExplanation: { type: Number, required: true },
      qnaSession: { type: Number, required: true },
    },
    totalJudgeScore: { type: Number, required: true },
    comments: { type: String },
    isLocked: { type: Boolean, default: true }, // Locked immediately upon submission
    evaluatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent a judge from evaluating the same team multiple times
JudgeEvaluationSchema.index({ teamId: 1, judgeId: 1 }, { unique: true });

export default mongoose.model<IJudgeEvaluation>('JudgeEvaluation', JudgeEvaluationSchema);
