import { Request, Response } from 'express';
export declare const triggerAiEvaluation: (req: Request, res: Response) => Promise<void>;
export declare const submitAdminJudgeScore: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitJudgeEvaluation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const adminUnlockEvaluation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const publishResults: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const calculateRankings: (req: Request, res: Response) => Promise<void>;
export declare const getLeaderboard: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=evaluationController.d.ts.map