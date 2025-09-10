
// import mongoose, { Schema } from 'mongoose';
// import bcrypt from 'bcryptjs';
// import { IOTP, IOTPMethods, OTPModelType } from '../interfaces/otpInterface';

// const otpSchema = new Schema<IOTP, OTPModelType, IOTPMethods>({
//     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     otp: { type: String, required: true },
//     expiresAt: { type: Date, required: true, index: { expires: '10m' } },
// });


// otpSchema.methods.compareOTP = async function (candidateOTP: string): Promise<boolean> {
//     try {
//         return await bcrypt.compare(candidateOTP, this.otp);
//     } catch (error) {
//         return false;
//     }
// };

// export const OTP = mongoose.model<IOTP, OTPModelType>('OTP', otpSchema);

import mongoose, { Schema } from 'mongoose';
import { IOTP, OTPModelType } from '../interfaces/otpInterface';

const otpSchema = new Schema<IOTP, OTPModelType>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true }, // Add email field for querying
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: '10m' } },
});

export const OTP = mongoose.model<IOTP, OTPModelType>('OTP', otpSchema);