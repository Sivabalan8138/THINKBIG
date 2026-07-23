import mongoose, { Document } from 'mongoose';
export interface ICertificate extends Document {
    certificateId: string;
    teamId: mongoose.Types.ObjectId;
    memberRegisterNumber: string;
    certificateType: 'Participation Certificate' | 'Merit Certificate' | 'Winner Certificate' | 'Runner-Up Certificate' | 'Best Innovation Award' | 'Best Technical Solution Award' | 'Best Social Impact Award';
    qrCodeUrl: string;
    pdfUrl?: string;
    issuedAt: Date;
}
declare const _default: mongoose.Model<ICertificate, {}, {}, {}, Document<unknown, {}, ICertificate, {}, mongoose.DefaultSchemaOptions> & ICertificate & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICertificate>;
export default _default;
//# sourceMappingURL=Certificate.d.ts.map