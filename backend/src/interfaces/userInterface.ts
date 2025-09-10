
// // backend/src/interfaces/userInterface.ts
// import { Types } from 'mongoose';

// export enum UserRole {
//     Admin = 'Admin',
//     Teacher = 'Teacher',
//     Learner = 'Learner',
// }

// export enum TeacherRequestStatus {
//     NotRequested = 'not requested',
//     Pending = 'pending',
//     Approved = 'approved',
//     Rejected = 'rejected',
// }

// export interface IUserBase {
//     email: string;
//     password?: string;
//     name: string;
//     role: UserRole;
//     phone?: string;
//     className?: string; // Add this if your schema has it
//     qualifications?: string[]; // Add this if your schema has it
//     experience?: string; // Add this if your schema has it
//     syllabus?: string; // Add this if your schema has it
//     certificates?: string[]; // Add this if your schema has it
//     classesToTeach?: string[]; // Add this if your schema has it
//     profilePicture?: string; // Add this if your schema has it
//     // isVerified: boolean;
//     isEmailVerified: boolean; 
//     isBlocked: boolean;
//     isApproved: boolean; // For teacher approval - Add this if your schema has it
//     isGoogleAuth?: boolean; // Add this if your schema has it
//     googleId?: string; // Add this if your schema has it
//     teacherRequestStatus?: TeacherRequestStatus; // Add this if your schema has it
//     teacherRequestRejectionReason?: string; // Add this if your schema has it
//     resetPasswordToken?: string; // Add this if your schema has it
//     resetPasswordExpires?: Date; // Add this if your schema has it
//     enrolledCourses?: Types.ObjectId[]; // Add this if your schema has it
// }
// export interface IUser extends IUserBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // This interface reflects the *minimal* user data typically stored in a JWT payload or session,
// // which is then attached to `req.user` by authentication middleware.
// // export interface IAuthenticatedUserPayload {
// //     _id: Types.ObjectId;
// //     email: string;
// //     role: UserRole; // Use the enum here for type safety
// //     isBlocked: boolean;
// //     isEmailVerified: boolean;
// //     teacherRequestStatus?: TeacherRequestStatus; // Use the enum here
// // }
// export type IAuthenticatedUserPayload = Pick<
//     IUser,
//     '_id' | 'email' | 'role' | 'isBlocked' | 'isEmailVerified' | 'teacherRequestStatus' | 'isApproved'
//     // Include any other properties from IUser that you explicitly want to be available
//     // and type-safe on `req.user`. For example: 'name', 'profilePicture', 'phone'.
//     // If you need all properties, you could just make it `type IAuthenticatedUserPayload = IUser;`
//     // but typically you only need a subset for authentication context.
// >;


// export interface IUserPopulated { // This should be exported
//     _id: Types.ObjectId;
//     email: string;
//     name: string;
//     phone?: string; // Make optional if it can be missing
//     profilePicture?: string; // Make optional if it can be missing
// }


// backend/src/interfaces/userInterface.ts
import { Types, Document } from 'mongoose';

export enum UserRole {
    Admin = 'Admin',
    Teacher = 'Teacher',
    Learner = 'Learner',
}

export enum TeacherRequestStatus {
    NotRequested = 'not requested',
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}

export interface Profile {
    firstName?: string;
    lastName?: string;
    phone?: string;
    alternatePhone?: string;
}

export interface IUserBase {
    email: string;
    password?: string;
    name: string;
    role: UserRole;
    profile?: Profile;
    className?: string;
    qualifications?: string[];
    experience?: string;
    syllabus?: string;
    certificates?: string[];
    classesToTeach?: string[];
    profilePicture?: string;
    isEmailVerified: boolean;
    isBlocked: boolean;
    isApproved?: boolean;
    isGoogleAuth?: boolean;
    googleId?: string;
    teacherRequestStatus?: TeacherRequestStatus;
    teacherRequestRejectionReason?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    enrolledCourses?: Types.ObjectId[];
}

export interface IUser extends IUserBase, Document {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export type IAuthenticatedUserPayload = Pick<
    IUser,
    '_id' | 'email' | 'role' | 'isBlocked' | 'isEmailVerified' | 'teacherRequestStatus' | 'isApproved'
>;

export interface IUserPopulated {
    _id: Types.ObjectId;
    email: string;
    name: string;
    profile?: Profile;
    profilePicture?: string;
}