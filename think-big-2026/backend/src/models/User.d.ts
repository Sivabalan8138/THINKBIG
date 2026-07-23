import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    username: string;
    passwordHash: string;
    role: 'admin' | 'judge';
    isFirstLogin: boolean;
    assignedTeams?: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map