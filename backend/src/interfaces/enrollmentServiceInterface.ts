

// // backend/src/interfaces/enrollmentServiceInterface.ts
// import { Types } from 'mongoose';
// import { IEnrollment, IEnrollmentPopulated, ILessonProgress } from './enrollmentInterface';

// export interface IEnrollmentService {
//     createEnrollment(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment>;
//     enrollUserInCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment>;
//     initiateEnrollment(userId: Types.ObjectId, courseId: Types.ObjectId, amount: number, currency: string): Promise<{ enrollment: IEnrollment; order: any }>;
//     handlePaymentSuccess(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string, userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment>;
//     handlePaymentFailure(razorpayOrderId: string): Promise<IEnrollment | null>;
//     approveEnrollmentByAdmin(enrollmentId: Types.ObjectId): Promise<IEnrollment | null>;
//     completeEnrollment(enrollmentId: Types.ObjectId, paymentDetails: { orderId: string; paymentId: string; signature: string; amount: number; currency: string }): Promise<IEnrollment>;
//     updatePaymentStatus(enrollmentId: Types.ObjectId, status: string, paymentDetails?: Partial<IEnrollment['paymentDetails']>): Promise<IEnrollment | null>;
//     updateEnrollmentStatus(enrollmentId: Types.ObjectId, status: string): Promise<IEnrollment | null>;
//     updateAdminApprovalStatus(enrollmentId: Types.ObjectId, status: string): Promise<IEnrollment | null>;
//     getEnrollmentById(enrollmentId: Types.ObjectId): Promise<IEnrollmentPopulated | null>;
//     getAllEnrollments(): Promise<IEnrollment[]>;
//     getEnrollmentsByCourse(courseId: Types.ObjectId): Promise<IEnrollment[]>;
//     getUserEnrollments(userId: Types.ObjectId): Promise<IEnrollmentPopulated[]>;
//     getEnrollmentProgress(enrollmentId: Types.ObjectId): Promise<ILessonProgress[] | null>;
//     unlockLesson(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, adminOrTeacherId: Types.ObjectId, role: string): Promise<IEnrollment | null>;
//     lockLesson(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, adminOrTeacherId: Types.ObjectId, role: string): Promise<IEnrollment | null>;
//     markLessonComplete(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, userId: Types.ObjectId): Promise<IEnrollment | null>;
//     findByUserAndCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment | null>;
//     getEnrollmentsForAdminApproval(): Promise<IEnrollment[]>;
//     updateEnrollmentSessionCount(enrollmentId: Types.ObjectId, sessionCount: number): Promise<IEnrollment | null>;
//     assignTeacher(enrollmentId: Types.ObjectId, teacherId: Types.ObjectId): Promise<IEnrollment | null>;
//     delete(enrollmentId: Types.ObjectId): Promise<boolean>;
// }



import { Types } from 'mongoose';
import { IEnrollment, IEnrollmentPopulated, ILessonProgress } from './enrollmentInterface';

export interface IEnrollmentService {
    createEnrollment(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment>;
    enrollUserInCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment>;
    initiateEnrollment(userId: Types.ObjectId, courseId: Types.ObjectId, amount: number, currency: string): Promise<{ enrollment: IEnrollment; order: any }>;
    handlePaymentSuccess(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string, userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment>;
    handlePaymentFailure(razorpayOrderId: string): Promise<IEnrollment | null>;
    approveEnrollmentByAdmin(enrollmentId: Types.ObjectId): Promise<IEnrollment | null>;
    completeEnrollment(enrollmentId: Types.ObjectId, paymentDetails: { orderId: string; paymentId: string; signature: string; amount: number; currency: string }): Promise<IEnrollment>;
    updatePaymentStatus(enrollmentId: Types.ObjectId, status: string, paymentDetails?: Partial<IEnrollment['paymentDetails']>): Promise<IEnrollment | null>;
    updateEnrollmentStatus(enrollmentId: Types.ObjectId, status: string): Promise<IEnrollment | null>;
    updateAdminApprovalStatus(enrollmentId: Types.ObjectId, status: string): Promise<IEnrollment | null>;
    getEnrollmentById(enrollmentId: Types.ObjectId): Promise<IEnrollmentPopulated | null>;
    getAllEnrollments(): Promise<IEnrollment[]>;
    getEnrollmentsByCourse(courseId: Types.ObjectId): Promise<IEnrollment[]>;
    getUserEnrollments(userId: Types.ObjectId): Promise<IEnrollmentPopulated[]>;
    getEnrollmentProgress(enrollmentId: Types.ObjectId): Promise<ILessonProgress[] | null>;
    unlockLesson(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, adminOrTeacherId: Types.ObjectId, role: string): Promise<IEnrollment | null>;
    lockLesson(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, adminOrTeacherId: Types.ObjectId, role: string): Promise<IEnrollment | null>;
    markLessonComplete(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, userId: Types.ObjectId): Promise<IEnrollment | null>;
    findByUserAndCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment | null>;
    getEnrollmentsForAdminApproval(): Promise<IEnrollment[]>;
    updateEnrollmentSessionCount(enrollmentId: Types.ObjectId, sessionCount: number): Promise<IEnrollment | null>;
    assignTeacher(enrollmentId: Types.ObjectId, teacherId: Types.ObjectId): Promise<IEnrollment | null>;
    delete(enrollmentId: Types.ObjectId): Promise<boolean>;
    getEnrollmentsWithPaymentDetails(): Promise<IEnrollmentPopulated[]>;
}
