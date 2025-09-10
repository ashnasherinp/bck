

// import { Types } from 'mongoose';
// import { IUser, UserRole } from './userInterface';

// export interface SignupData {
//   email: string;
//   password: string;
//   role: UserRole;
//   name: string;
//   phone?: string;
//   className?: string;
//   qualifications?: string[];
//   experience?: string;
//   certificates?: string[]; 
// }

// export interface LoginData {
//   email: string;
//   password: string;
//   role?: string;
// }

// export interface IAuthService {
//   signup(data: SignupData): Promise<{ userId: string; message: string }>;
//   verifyOTP(email: string, otp: string): Promise<{ token: string; message: string }>;
//   login(data: LoginData): Promise<{ token: string; user: IUser }>;
//   generateToken(user: IUser): Promise<string>;
//   forgotPassword(email: string): Promise<void>;
//   resetPassword(token: string, newPassword: string): Promise<void>;
//   resendOTP(email: string): Promise<void>;
//   getProfile(userId: Types.ObjectId): Promise<IUser | null>; 
//   updateProfile(userId: Types.ObjectId, data: Partial<IUser>): Promise<IUser | null>; 
// }


// // backend/src/interfaces/authServiceInterface.ts
// import { Types } from 'mongoose';
// import { IUser, UserRole } from './userInterface';
// import { Profile as GoogleProfile } from 'passport-google-oauth20'; // Import GoogleProfile type

// export interface SignupData {
//   email: string;
//   password: string;
//   role: UserRole;
//   name: string;
//   phone?: string;
//   className?: string;
//   qualifications?: string[];
//   experience?: string;
//   certificates?: string[];
// }

// export interface LoginData {
//   email: string;
//   password: string;
//   role?: string;
// }

// // --- MODIFIED INTERFACE FOR PROFILE UPDATE DATA ---
// export interface IProfileUpdateData {
//   experience?: string;
//   classesToTeach?: string[];
//   syllabus?: string;
//   phone?: string;
//   // profilePicture will be handled via file upload, not directly in updateData
// }
// // --- END MODIFIED INTERFACE ---

// export interface IAuthService {
//   signup(data: SignupData): Promise<{ userId: string; message: string }>;
//   verifyOTP(email: string, otp: string): Promise<{ token: string; message: string }>;
//   login(data: LoginData): Promise<{ token: string; user: IUser }>;
//   generateToken(user: IUser): Promise<string>;
//   forgotPassword(email: string): Promise<void>;
//   resetPassword(token: string, newPassword: string): Promise<void>;
//   resendOTP(email: string): Promise<void>;
//   getProfile(userId: Types.ObjectId): Promise<IUser | null>;

//   // --- UPDATED updateProfile SIGNATURE TO HANDLE MULTIPLE FILES ---
//   updateProfile(
//     userId: Types.ObjectId,
//     updateData: IProfileUpdateData,
//     profilePictureFile?: Express.Multer.File, // New optional argument for profile picture
//     certificateFile?: Express.Multer.File // Existing optional argument for certificate
//   ): Promise<IUser | null>;
//   // --- END UPDATED updateProfile SIGNATURE ---

//   // --- ADDED findOrCreateGoogleUser SIGNATURE ---
//   findOrCreateGoogleUser(profile: GoogleProfile): Promise<IUser>;
//   // --- END ADDED findOrCreateGoogleUser SIGNATURE ---
// }

// // backend/src/interfaces/authServiceInterface.ts
// import { Types } from 'mongoose';
// import { IUser, UserRole } from './userInterface';
// import { Profile as GoogleProfile } from 'passport-google-oauth20';

// export interface SignupData {
//   email: string;
//   password: string;
//   role: UserRole;
//   name: string;
//   phone?: string;
//   className?: string;
//   qualifications?: string[];
//   experience?: string;
//   certificates?: string[];
// }

// export interface LoginData {
//   email: string;
//   password: string;
//   role?: string;
// }

// export interface IProfileUpdateData {
//   experience?: string;
//   classesToTeach?: string[];
//   syllabus?: string;
//   phone?: string;
// }

// export interface IAuthService {
//   signup(data: SignupData): Promise<{ userId: string; message: string }>;
//   verifyOTP(email: string, otp: string): Promise<{ token: string; message: string }>;
//   login(data: LoginData): Promise<{ token: string; user: IUser }>;
//   generateToken(user: IUser): Promise<string>;
//   forgotPassword(email: string): Promise<void>;
//   resetPassword(token: string, newPassword: string): Promise<void>;
//   resendOTP(email: string): Promise<void>;
//   getProfile(userId: Types.ObjectId): Promise<IUser | null>;
//   updateProfile(
//     userId: Types.ObjectId,
//     updateData: IProfileUpdateData,
//     profilePictureFile?: Express.Multer.File,
//     certificateFile?: Express.Multer.File
//   ): Promise<IUser | null>;
//   findOrCreateGoogleUser(profile: GoogleProfile): Promise<IUser>;
// }



// // backend/src/interfaces/authServiceInterface.ts
// import { Types } from 'mongoose';
// import { IUser, UserRole } from './userInterface';
// import { Profile as GoogleProfile } from 'passport-google-oauth20';

// export interface SignupData {
//     email: string;
//     password: string;
//     role: UserRole;
//     name: string;
//     phone?: string;
//     className?: string;
//     qualifications?: string[];
//     experience?: string;
//     certificates?: string[];
// }

// export interface LoginData {
//     email: string;
//     password: string;
//     role?: string;
// }

// export interface IProfileUpdateData {
//     experience?: string;
//     classesToTeach?: string[];
//     syllabus?: string;
//     phone?: string;
// }

// export interface IAuthService {
//     signup(data: SignupData): Promise<{ userId: string; message: string }>;
//     verifyOTP(email: string, otp: string): Promise<{ token: string; message: string }>;
//     login(data: LoginData): Promise<{ token: string; user: IUser }>;
//     generateToken(user: IUser): Promise<string>;
//     forgotPassword(email: string): Promise<void>;
//     resetPassword(token: string, newPassword: string): Promise<void>;
//     resendOTP(email: string): Promise<void>;
//     getProfile(userId: Types.ObjectId): Promise<IUser | null>;
//     updateProfile(
//         userId: Types.ObjectId,
//         updateData: IProfileUpdateData,
//         profilePictureFile?: Express.Multer.File,
//         certificateFile?: Express.Multer.File
//     ): Promise<IUser | null>;
//     findOrCreateGoogleUser(profile: GoogleProfile): Promise<IUser>;
// }


// backend/src/interfaces/authServiceInterface.ts
import { Types } from 'mongoose';
import { IUser, UserRole } from './userInterface';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

export interface SignupData {
    email: string;
    password: string;
    role: UserRole;
    name: string;
    phone?: string;
    className?: string;
    qualifications?: string[];
    experience?: string;
    certificates?: string[];
}

export interface LoginData {
    email: string;
    password: string;
    role?: UserRole; 
}

// export interface IProfileUpdateData {
//     experience?: string;
//     classesToTeach?: string[];
//     syllabus?: string;
//     phone?: string;
// }

export interface IProfileUpdateData {
  name?: string;
  phone?: string;
  className?: string;
  experience?: string;
  classesToTeach?: string[];
  syllabus?: string;
}

export interface IAuthService {
    signup(data: SignupData): Promise<{ userId: string; message: string }>;
    verifyOTP(email: string, otp: string): Promise<{ token: string; message: string }>;
    login(data: LoginData): Promise<{ token: string; user: IUser }>;
    generateToken(user: IUser): Promise<string>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    resendOTP(email: string): Promise<void>;
    getProfile(userId: Types.ObjectId): Promise<IUser | null>;
    updateProfile(
        userId: Types.ObjectId,
        updateData: IProfileUpdateData,
        profilePictureFile?: Express.Multer.File,
        certificateFile?: Express.Multer.File
    ): Promise<IUser | null>;
    findOrCreateGoogleUser(profile: GoogleProfile): Promise<IUser>;
}