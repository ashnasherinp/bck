// // // frontend/src/interfaces/enrollmentInterface.ts




import { Course } from './courseInterface';
import { User } from './userInterface';

export enum EnrollmentStatus {
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
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
    lessonId: string;
    isLocked: boolean;
    completed: boolean;
    completedAt?: string;
}

export interface IPaymentDetails {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    amount?: number;
    currency?: string;
}

export interface IEnrollment {
    _id: string;
    userId: string | User;
    courseId: string | Course;
    teacherId?: string | User;
    enrollmentDate: string;
    status: EnrollmentStatus;
    paymentStatus?: PaymentStatus;
    adminApprovalStatus: AdminApprovalStatus;
    progress: ILessonProgress[];
    sessionCountAttended: number;
    paymentDetails?: IPaymentDetails;
    completionDate?: string;
}

export interface IEnrollmentPopulated {
    _id: string;
    userId: User;
    courseId: Course & { lessons?: string[] };
    teacherId?: User;
    enrollmentDate: string;
    completionDate?: string;
    status: EnrollmentStatus;
    paymentStatus: PaymentStatus;
    adminApprovalStatus: AdminApprovalStatus;
    progress: ILessonProgress[];
    sessionCountAttended: number;
    paymentDetails?: IPaymentDetails;
}

export interface EnrollmentResponse {
    enrollmentId: string;
    orderId?: string;
    amount?: number;
    currency?: string;
    isFreeCourse?: boolean;
}

export interface PaymentSuccessResponse {
    enrollment: IEnrollmentPopulated;
    invoice?: {
        invoiceId: string;
        orderId: string;
        paymentId: string;
        amount: number;
        currency: string;
        details: {
            tax: number;
            totalAmount: number;
            description: string;
        };
        generatedAt: string;
    };
}