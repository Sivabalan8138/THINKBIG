import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
export interface AuthRequest extends Request {
    user?: IUser;
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const adminCheck: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const judgeCheck: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map