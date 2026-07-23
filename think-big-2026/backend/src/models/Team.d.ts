import mongoose, { Document } from 'mongoose';
export interface IMember {
    studentName: string;
    registerNumber: string;
    department: string;
    year: string;
}
export interface ITeam extends Document {
    teamId: string;
    teamName: string;
    projectTitle: string;
    domain: string;
    teamLeader: IMember & {
        mobileNumber: string;
        email: string;
    };
    members: IMember[];
    abstract: {
        problemStatement: string;
        existingChallenges: string;
        proposedSolution: string;
        innovationDescription: string;
        technicalApproach: string;
        expectedBenefits: string;
        futureScope: string;
        estimatedCost: string;
        targetUsers: string;
    };
    files: {
        pptUrl?: string;
        pdfUrl?: string;
    };
    qrPassUrl?: string;
    hallTicketUrl?: string;
    scores: {
        aiScore?: number;
        judgeScore?: number;
        finalScore?: number;
    };
    rankings?: {
        overallRank?: number;
        domainRank?: number;
    };
    evaluationStatus: 'pending' | 'ai_evaluated' | 'judge_evaluated' | 'completed';
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}
declare const _default: mongoose.Model<ITeam, {}, {}, {}, Document<unknown, {}, ITeam, {}, mongoose.DefaultSchemaOptions> & ITeam & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITeam>;
export default _default;
//# sourceMappingURL=Team.d.ts.map