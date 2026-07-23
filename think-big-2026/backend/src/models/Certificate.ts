import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string;
  teamId: mongoose.Types.ObjectId;
  memberRegisterNumber: string; // The specific member this certificate belongs to
  certificateType:
    | 'Participation Certificate'
    | 'Merit Certificate'
    | 'Winner Certificate'
    | 'Runner-Up Certificate'
    | 'Best Innovation Award'
    | 'Best Technical Solution Award'
    | 'Best Social Impact Award';
  qrCodeUrl: string; // The generated QR code image URL or base64
  pdfUrl?: string; // S3 or Cloudinary URL of the generated PDF
  issuedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    memberRegisterNumber: { type: String, required: true },
    certificateType: {
      type: String,
      enum: [
        'Participation Certificate',
        'Merit Certificate',
        'Winner Certificate',
        'Runner-Up Certificate',
        'Best Innovation Award',
        'Best Technical Solution Award',
        'Best Social Impact Award',
      ],
      required: true,
    },
    qrCodeUrl: { type: String },
    pdfUrl: { type: String },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
