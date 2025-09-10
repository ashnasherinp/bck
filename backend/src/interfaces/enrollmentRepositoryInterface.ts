

// // backend/src/interfaces/enrollmentRepositoryInterface.ts
// import { Types } from 'mongoose';
// import { IEnrollment, ILessonProgress, IEnrollmentPopulated } from './enrollmentInterface';

// export interface IEnrollmentRepository {
//     create(enrollmentData: Partial<IEnrollment>): Promise<IEnrollment>;
//     findById(id: Types.ObjectId): Promise<IEnrollment | null>;
//     update(id: Types.ObjectId, updateData: Partial<IEnrollment>): Promise<IEnrollment | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
//     findByUserAndCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment | null>;
//     findByUserId(userId: Types.ObjectId): Promise<IEnrollment[]>;
//     findByUserIdPopulated(userId: Types.ObjectId): Promise<IEnrollmentPopulated[]>;
//     findByCourseId(courseId: Types.ObjectId): Promise<IEnrollment[]>;
//     deleteManyByCourseId(courseId: Types.ObjectId): Promise<number>;
//     updateLessonProgress(
//         enrollmentId: Types.ObjectId,
//         lessonId: Types.ObjectId,
//         updateData: Partial<ILessonProgress>
//     ): Promise<IEnrollment | null>;
//     find(query: Record<string, any>): Promise<IEnrollment[]>;
//     findAll(): Promise<IEnrollment[]>;

//     // RE-ADDED: findByOrderId
//     findByOrderId(orderId: string): Promise<IEnrollment | null>;
// }

// backend/src/interfaces/enrollmentRepositoryInterface.ts
import { Types } from 'mongoose';
import { IEnrollment, IEnrollmentPopulated } from './enrollmentInterface';

export interface IEnrollmentRepository {
    create(data: Partial<IEnrollment>): Promise<IEnrollment>;
    findById(id: Types.ObjectId): Promise<IEnrollment | null>;
    findByUserAndCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment | null>;
    findByOrderId(orderId: string): Promise<IEnrollment | null>;
    findByUserId(userId: Types.ObjectId): Promise<IEnrollment[]>;
    findByUserIdPopulated(userId: Types.ObjectId): Promise<IEnrollmentPopulated[]>;
    findByCourseId(courseId: Types.ObjectId): Promise<IEnrollment[]>;
    findAll(): Promise<IEnrollment[]>;
    find(query: any): Promise<IEnrollment[]>;
    update(id: Types.ObjectId, data: Partial<IEnrollment>): Promise<IEnrollment | null>;
    delete(id: Types.ObjectId): Promise<boolean>;
    deleteManyByCourseId(courseId: Types.ObjectId): Promise<boolean>;
}