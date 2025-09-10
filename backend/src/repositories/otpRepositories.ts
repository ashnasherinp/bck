

// backend/src/repositories/otpRepositories.ts
import { Types, Document } from 'mongoose';
import { OTP } from '../models/otpModel';
import { IOTP } from '../interfaces/otpInterface';
import { IOTPRepository } from '../interfaces/otpRepositoryinterface';

type IOTPDocument = IOTP & Document;

export class OTPRepository implements IOTPRepository {
    async create(otpData: Partial<IOTP>): Promise<IOTP> {
        otpData.email = otpData.email?.toLowerCase().trim();
        const otp = await OTP.create(otpData);
        console.log(`[OTPRepository] Created OTP for ${otpData.email}: ${otpData.otp}`);
        return otp.toObject();
    }

    async findByEmailAndOTP(email: string, otp: string): Promise<IOTP | null> {
        const standardizedEmail = email.toLowerCase().trim();
        const trimmedOtp = otp.trim();

        console.log(`[OTPRepository] Searching OTP for email: ${standardizedEmail}, OTP: ${trimmedOtp}`);

        const otpDoc = await OTP.findOne({
            email: standardizedEmail,
            otp: trimmedOtp,
            expiresAt: { $gt: new Date() },
        }).exec();

        console.log(`[OTPRepository] Query result: ${otpDoc ? 'found' : 'not found'}`);
        return otpDoc ? otpDoc.toObject() : null;
    }

    async findByUserId(userId: Types.ObjectId): Promise<IOTP | null> {
        const otpDoc = await OTP.findOne({ userId, expiresAt: { $gt: new Date() } }).exec();
        console.log(`[OTPRepository] Query result for userId ${userId}: ${otpDoc ? 'found' : 'not found'}`);
        return otpDoc ? otpDoc.toObject() : null;
    }

    async deleteByEmail(email: string): Promise<void> {
        const standardizedEmail = email.toLowerCase().trim();
        await OTP.deleteMany({ email: standardizedEmail });
        console.log(`[OTPRepository] Deleted OTPs for email: ${standardizedEmail}`);
    }

    async deleteByUserId(userId: Types.ObjectId): Promise<void> {
        await OTP.deleteMany({ userId });
        console.log(`[OTPRepository] Deleted OTPs for user ID: ${userId}`);
    }

    async deleteById(otpId: Types.ObjectId): Promise<void> {
        const result = await OTP.deleteOne({ _id: otpId });
        if (result.deletedCount === 0) {
            console.log(`[OTPRepository] No OTP found for ID: ${otpId}`);
            throw new Error('OTP not found');
        }
        console.log(`[OTPRepository] Deleted OTP with ID: ${otpId}`);
    }
}