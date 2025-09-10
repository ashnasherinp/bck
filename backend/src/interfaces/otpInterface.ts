

// import { Types, Document, Model } from 'mongoose';

// export interface IOTP {
//   _id: Types.ObjectId; 
//   userId: Types.ObjectId;
//   otp: string;
//   expiresAt: Date;
// }

// export interface IOTPMethods {
//   compareOTP(candidateOTP: string): Promise<boolean>;
// }

// export type OTPModelType = Model<IOTP, {}, IOTPMethods>;

import { Types, Document, Model } from 'mongoose';

export interface IOTP {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
}

export interface IOTPMethods {
  compareOTP(candidateOTP: string): Promise<boolean>;
}

export type OTPModelType = Model<IOTP, {}, IOTPMethods>;