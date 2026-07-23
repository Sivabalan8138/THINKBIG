import mongoose, { Document, Schema } from 'mongoose';

export interface IAiEvaluation extends Document {
  teamId: mongoose.Types.ObjectId;
  scores: {
    innovationAndCreativity: number;
    technicalFeasibility: number;
    problemSolvingCapability: number;
    socialIndustrialImpact: number;
    scalabilityFutureScope: number;
    pptQualityDocumentation: number;
  };
  totalAiScore: number;
  report: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    improvementAreas: string[];
    innovationRating: string;
    technicalRating: string;
  };
  evaluatedAt: Date;
}

const AiEvaluationSchema: Schema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, unique: true },
    scores: {
      innovationAndCreativity: { type: Number, required: true },
      technicalFeasibility: { type: Number, required: true },
      problemSolvingCapability: { type: Number, required: true },
      socialIndustrialImpact: { type: Number, required: true },
      scalabilityFutureScope: { type: Number, required: true },
      pptQualityDocumentation: { type: Number, required: true },
    },
    totalAiScore: { type: Number, required: true },
    report: {
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }],
      improvementAreas: [{ type: String }],
      innovationRating: { type: String },
      technicalRating: { type: String },
    },
    evaluatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IAiEvaluation>('AiEvaluation', AiEvaluationSchema);
