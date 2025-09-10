
// import { Types } from 'mongoose';
// import { IOTP } from './otpInterface';

// export interface IOTPRepository {
//     create(otpData: Partial<IOTP>): Promise<IOTP>;
//     findByUserId(userId: Types.ObjectId): Promise<IOTP | null>;
//     deleteById(otpId: Types.ObjectId): Promise<void>;
//     deleteByUserId(userId: Types.ObjectId): Promise<void>;
// }

import { Types } from 'mongoose';
import { IOTP } from './otpInterface';

export interface IOTPRepository {
    create(otpData: Partial<IOTP>): Promise<IOTP>;
    findByUserId(userId: Types.ObjectId): Promise<IOTP | null>;
    deleteById(otpId: Types.ObjectId): Promise<void>;
    deleteByUserId(userId: Types.ObjectId): Promise<void>;

    findByEmailAndOTP(email: string, otp: string): Promise<IOTP | null>;
    deleteByEmail(email: string): Promise<void>;
}