// // backend/src/interfaces/lessonServiceInterface.ts
// import { Types } from 'mongoose';
// import { ILessonBase, ILessonPopulated, ICreateLessonData } from './lessonInterface';
// import { AuthenticatedRequest } from '../types/express'; // Assuming this path

// export interface ILessonService {
//     // Admin/Teacher can create/edit lessons
//     createLesson(data: ICreateLessonData, creatorId: Types.ObjectId, creatorRole: string): Promise<ILessonBase>;
//     getLessonById(lessonId: string): Promise<ILessonPopulated | null>;
//     updateLesson(lessonId: string, updateData: Partial<ILessonBase>, editorId: Types.ObjectId, editorRole: string): Promise<ILessonBase | null>;
//     deleteLesson(lessonId: string, deleterId: Types.ObjectId, deleterRole: string): Promise<boolean>;
//     getLessonsByCourseId(courseId: string): Promise<ILessonPopulated[]>;
//     publishLesson(lessonId: string, adminId: Types.ObjectId): Promise<ILessonBase | null>;
//     unpublishLesson(lessonId: string, adminId: Types.ObjectId): Promise<ILessonBase | null>;
//     // For student access validation (can be in student-specific service too)
//     canAccessLesson(userId: Types.ObjectId, lessonId: string): Promise<boolean>;
// }


// backend/src/interfaces/lessonServiceInterface.ts
import { Types } from 'mongoose';
import { ILessonBase, ILessonPopulated, ICreateLessonData, ILesson } from './lessonInterface'; // FIX: Import ILesson
import { UserRole } from './userInterface'; // FIX: Import UserRole for creatorRole/editorRole
// import { AuthenticatedRequest } from '../types/express'; // If not used here, remove it

// FIX: Add 'export' keyword
export interface ILessonService {
    // FIX: creatorRole/editorRole to UserRole, return type to ILesson
    createLesson(data: ICreateLessonData, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<ILesson>;
    getLessonById(lessonId: string): Promise<ILessonPopulated | null>; // This is correct for populated
    // FIX: editorRole to UserRole, return type to ILesson
    updateLesson(lessonId: string, updateData: Partial<ILessonBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<ILesson | null>;
    // FIX: deleterRole to UserRole
    deleteLesson(lessonId: string, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean>;
    getLessonsByCourseId(courseId: string): Promise<ILessonPopulated[]>; // This is correct for populated
    // FIX: Return type to ILesson
    publishLesson(lessonId: string, adminId: Types.ObjectId): Promise<ILesson | null>;
    // FIX: Return type to ILesson
    unpublishLesson(lessonId: string, adminId: Types.ObjectId): Promise<ILesson | null>;
    canAccessLesson(userId: Types.ObjectId, lessonId: string): Promise<boolean>;
}