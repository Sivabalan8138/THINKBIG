import { Request, Response } from 'express';
export declare const registerTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadFiles: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllTeams: (req: Request, res: Response) => Promise<void>;
export declare const deleteTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=teamController.d.ts.map