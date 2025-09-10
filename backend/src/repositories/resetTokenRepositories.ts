
import { Types } from 'mongoose';
import { ResetToken } from '../models/resetTokenModel'; 
import { IResetTokenRepository, IResetToken } from '../interfaces/resetToken.interface'; 

export class ResetTokenRepository implements IResetTokenRepository {
    async create(tokenData: Partial<IResetToken>): Promise<IResetToken> {
        const newToken = new ResetToken(tokenData);

        return newToken.toObject(); 
    }

    async findByToken(token: string): Promise<IResetToken | null> {
        return ResetToken.findOne({ token }).lean(); 
    }

    async deleteById(tokenId: Types.ObjectId): Promise<void> {
        await ResetToken.findByIdAndDelete(tokenId).exec();
    }


    async deleteByUserId(userId: Types.ObjectId): Promise<void> {
        await ResetToken.deleteMany({ userId }).exec();
    }


    async deleteByToken(token: string): Promise<void> {
        await ResetToken.deleteOne({ token }).exec();
    }
}