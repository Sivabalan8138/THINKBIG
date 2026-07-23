import mongoose, { Document } from 'mongoose';
export interface IActivityLog extends Document {
    action: string;
    description: string;
    teamId?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IActivityLog, {}, {}, {}, Document<unknown, {}, IActivityLog, {}, mongoose.DefaultSchemaOptions> & IActivityLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IActivityLog>;
export default _default;
//# sourceMappingURL=ActivityLog.d.ts.map