

// import { Types } from 'mongoose';

// export interface IResetToken {
//   _id?: Types.ObjectId;
//   userId: Types.ObjectId;
//   token: string;
//   expiresAt: Date;
// }
// export interface IResetTokenRepository { 
//   create(tokenData: Partial<IResetToken>): Promise<IResetToken>;
//   findByToken(token: string): Promise<IResetToken | null>;
//   deleteById(tokenId: Types.ObjectId): Promise<void>;
// }

import { Types } from 'mongoose';

export interface IResetToken {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}
export interface IResetTokenRepository {
    create(tokenData: Partial<IResetToken>): Promise<IResetToken>;
    findByToken(token: string): Promise<IResetToken | null>;
    deleteById(tokenId: Types.ObjectId): Promise<void>;

    deleteByUserId(userId: Types.ObjectId): Promise<void>;

    deleteByToken(token: string): Promise<void>;
}