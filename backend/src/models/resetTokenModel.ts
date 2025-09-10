import mongoose, { Schema } from 'mongoose';
import { IResetToken } from '../interfaces/resetToken.interface';

const resetTokenSchema = new Schema<IResetToken>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: '1h' } },
});

export const ResetToken = mongoose.model<IResetToken>('ResetToken', resetTokenSchema);