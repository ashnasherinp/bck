

// // backend/src/interfaces/enrollmentInterface.ts
// import { Types } from 'mongoose';
// import { ICoursePopulated } from './courseInterface'; // Assuming ICoursePopulated comes from here
// import { IUser } from './userInterface'; // Assuming IUser comes from here


// export enum EnrollmentStatus {
//     Pending = 'Pending',
//     InProgress = 'InProgress',
//     Completed = 'Completed',
// }

// export enum PaymentStatus {
//     Pending = 'Pending',
//     Completed = 'Completed',
//     Failed = 'Failed',
// }

// export enum AdminApprovalStatus {
//     Pending = 'Pending',
//     Approved = 'Approved',
//     Rejected = 'Rejected',
// }

// export interface ILessonProgress {
//     lessonId: Types.ObjectId;
//     completed: boolean;
//     completedAt?: Date;
//     isLocked: boolean;
// }

// export interface IPaymentDetails {
//     orderId: string;
//     paymentId?: string;
//     signature?: string;
//     amount: number;
//     currency: string;
//     paymentDate: Date;
//     status: string;
// }

// export interface IEnrollment {
//     _id: Types.ObjectId;
//     userId: Types.ObjectId;
//     courseId: Types.ObjectId;
//     teacherId?: Types.ObjectId;
//     enrollmentDate: Date;
//     status: EnrollmentStatus;
//     paymentStatus?: PaymentStatus;
//     adminApprovalStatus: AdminApprovalStatus;
//     progress: ILessonProgress[];
//     sessionCountAttended?: number;
//     paymentDetails?: IPaymentDetails;
//     completionDate?: Date;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// export interface IEnrollmentPopulated {
//     _id: Types.ObjectId;
//     userId:  IUser;
//     courseId: ICoursePopulated;
//     teacherId?:  IUser;
//     enrollmentDate: Date;
//     status: EnrollmentStatus;
//     paymentStatus?: PaymentStatus;
//     adminApprovalStatus: AdminApprovalStatus;
//     progress: ILessonProgress[];
//     sessionCountAttended?: number;
//     paymentDetails?: IPaymentDetails;
//     completionDate?: Date;
//     createdAt?: Date;
//     updatedAt?: Date;
// }


import { Types, Document } from 'mongoose';
import { ICourse } from './courseInterface';
import { IUser } from './userInterface';
import { ICoursePopulated } from './courseInterface';
export enum EnrollmentStatus {
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
      Pending= 'Pending',
}

export enum PaymentStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Failed = 'Failed',
}

export enum AdminApprovalStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

export interface ILessonProgress {
    lessonId: Types.ObjectId;
    completed: boolean;
    completedAt?: Date;
    isLocked: boolean;
}

export interface IPaymentDetails {
    orderId: string;
    paymentId?: string;
    signature?: string;
    amount: number;
    totalAmount: number; // Added to resolve error
    currency: string;
    paymentDate: Date;
    status: string;
}

export interface IEnrollment {
    _id: Types.ObjectId;
    userId: Types.ObjectId | IUser;
    courseId: Types.ObjectId | ICourse;
    teacherId?: Types.ObjectId | IUser;
    enrollmentDate: Date;
    status: EnrollmentStatus;
    paymentStatus?: PaymentStatus;
    adminApprovalStatus: AdminApprovalStatus;
    progress: ILessonProgress[];
    sessionCountAttended: number;
    paymentDetails?: IPaymentDetails;
    completionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEnrollmentPopulated extends Omit<IEnrollment, 'userId' | 'courseId' | 'teacherId'> {
    userId: IUser;
    courseId:  ICoursePopulated;
    teacherId?: IUser;
}
