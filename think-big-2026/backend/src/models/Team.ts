import mongoose, { Document, Schema } from 'mongoose';

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
  teamLeader: IMember & { mobileNumber: string; email: string };
  members: IMember[]; // Total max 3 (including leader, team size is 2-4)
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

const MemberSchema = new Schema({
  studentName: { type: String, required: true },
  registerNumber: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
});

const TeamSchema: Schema = new Schema(
  {
    teamId: { type: String, unique: true },
    teamName: { type: String, required: true, unique: true },
    projectTitle: { type: String, required: true },
    domain: { type: String, required: true },
    teamLeader: {
      ...MemberSchema.obj,
      mobileNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
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
  },
  { timestamps: true }
);

TeamSchema.pre('save', function () {
  if (!this.teamId) {
    this.teamId = `TB26-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
});

export default mongoose.model<ITeam>('Team', TeamSchema);
