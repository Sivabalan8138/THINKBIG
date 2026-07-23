import mongoose, { Document, Schema } from 'mongoose';

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

const settingsSchema = new Schema<ISettings>(
  {
    isRegistrationOpen: { type: Boolean, default: true },
    isCandidateIdOpen: { type: Boolean, default: false },
    sampleCertificateUrl: { type: String, default: '' },
    resultsPublished: { type: Boolean, default: false },
    certNameX: { type: Number, default: 0 },
    certNameY: { type: Number, default: 325 },
    certDeptX: { type: Number, default: 310 },
    certDeptY: { type: Number, default: 386 },
    certQrX: { type: Number, default: 46 },
    certQrY: { type: Number, default: 461 },
    certNameFontSize: { type: Number, default: 48 },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
