import { Request, Response } from 'express';
export declare const createJudge: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllJudges: (req: Request, res: Response) => Promise<void>;
export declare const assignTeamsToJudge: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAssignedTeams: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=judgeController.d.ts.map