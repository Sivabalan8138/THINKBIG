import mongoose, { Document } from 'mongoose';
export interface ISettings extends Document {
    isRegistrationOpen: boolean;
    isCandidateIdOpen: boolean;
    sampleCertificateUrl: string;
    resultsPublished: boolean;
    certNameX: number;
    certNameY: number;
    certDeptX: number;
    certDeptY: number;
    certQrX: number;
    certQrY: number;
    certNameFontSize: number;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any, any> | mongoose.Model<ISettings, {}, {}, {}, Document<unknown, {}, ISettings, {}, mongoose.DefaultSchemaOptions> & ISettings & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISettings>;
export default _default;
//# sourceMappingURL=Settings.d.ts.map