import mongoose, { Document } from 'mongoose';
export interface IJudgeEvaluation extends Document {
    teamId: mongoose.Types.ObjectId;
    judgeId: mongoose.Types.ObjectId;
    scores: {
        presentationSkills: number;
        technicalExplanation: number;
        qnaSession: number;
    };
    totalJudgeScore: number;
    comments: string;
    isLocked: boolean;
    evaluatedAt: Date;
}
declare const _default: mongoose.Model<IJudgeEvaluation, {}, {}, {}, Document<unknown, {}, IJudgeEvaluation, {}, mongoose.DefaultSchemaOptions> & IJudgeEvaluation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IJudgeEvaluation>;
export default _default;
//# sourceMappingURL=JudgeEvaluation.d.ts.map