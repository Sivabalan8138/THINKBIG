import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'admin' | 'judge';
  isFirstLogin: boolean; // For force password change
  assignedTeams?: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'judge'], required: true },
    isFirstLogin: { type: Boolean, default: true },
    assignedTeams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
