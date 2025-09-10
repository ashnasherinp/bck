

// // backend/src/interfaces/userRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { IUser } from './userInterface';

// export interface IUserRepository {
//     findByEmail(email: string): Promise<IUser | null>;
//     findById(id: Types.ObjectId): Promise<IUser | null>;
//     findByIds(ids: Types.ObjectId[]): Promise<IUser[]>;
//     findByRole(role: string): Promise<IUser[]>;
//     find(query: any): Promise<IUser[]>;

//     create(user: Partial<IUser>): Promise<IUser & Document>
//     update(id: Types.ObjectId, data: Partial<IUser>): Promise<IUser | null>;
//     delete(id: Types.ObjectId): Promise<void>;
//     findByIdPopulated(id: Types.ObjectId): Promise<IUser | null>; 
//     findUsersByRoleWithEnrollments(role?: string): Promise<IUser[]>; 
// }

import { Types, Document } from 'mongoose';
import { IUser } from './userInterface';

export interface PlatformStats {
    totalUsers: number;
    totalEnrollments: number;
    totalRevenue: number;
    usersByRole: { [key: string]: number };
}

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: Types.ObjectId): Promise<IUser | null>;
    findByIds(ids: Types.ObjectId[]): Promise<IUser[]>;
    findByRole(role: string): Promise<IUser[]>;
    find(query: any): Promise<IUser[]>;
    create(user: Partial<IUser>): Promise<IUser & Document>;
    update(id: Types.ObjectId, data: Partial<IUser>): Promise<IUser | null>;
    delete(id: Types.ObjectId): Promise<void>;
    findByIdPopulated(id: Types.ObjectId): Promise<IUser | null>;
    findUsersByRoleWithEnrollments(role?: string): Promise<IUser[]>;
    findApprovedTeachers(): Promise<IUser[]>;
    getPlatformStats(): Promise<PlatformStats>;
}