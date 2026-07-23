import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IAiEvaluation, {}, {}, {}, Document<unknown, {}, IAiEvaluation, {}, mongoose.DefaultSchemaOptions> & IAiEvaluation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAiEvaluation>;
export default _default;
//# sourceMappingURL=AiEvaluation.d.ts.map