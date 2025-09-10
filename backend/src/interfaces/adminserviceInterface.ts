

// // backend/src/interfaces/adminserviceInterface.ts
// import { Types } from 'mongoose';
// import { IUser } from './userInterface';

// export interface IAdminService {
//     getUsers(role?: string): Promise<IUser[]>;
//     // Changed 'userId: string' to 'userId: Types.ObjectId' for consistency and best practice
//     approveTeacher(userId: Types.ObjectId): Promise<IUser | null>;
//     // Changed 'userId: string' to 'userId: Types.ObjectId'
//     rejectTeacher(userId: Types.ObjectId, reason: string): Promise<IUser | null>;
//     // Changed 'userId: string' to 'userId: Types.ObjectId'
//     blockUser(userId: Types.ObjectId): Promise<IUser | null>;
//     // Changed 'userId: string' to 'userId: Types.ObjectId'
//     unblockUser(userId: Types.ObjectId): Promise<IUser | null>;
//     // Changed 'userId: string' to 'userId: Types.ObjectId'
//     deleteUser(userId: Types.ObjectId): Promise<void>;
// }



import { Types } from 'mongoose';
import { IUser } from './userInterface';
import { PlatformStats } from './userRepositoryinterface';

export interface IAdminService {
    getUsers(query?: any): Promise<IUser[]>;
    approveTeacher(userId: Types.ObjectId): Promise<IUser | null>;
    rejectTeacher(userId: Types.ObjectId, reason: string): Promise<IUser | null>;
    blockUser(userId: Types.ObjectId): Promise<IUser | null>;
    unblockUser(userId: Types.ObjectId): Promise<IUser | null>;
    deleteUser(userId: Types.ObjectId): Promise<void>;
    getPlatformStats(): Promise<PlatformStats>;
}
