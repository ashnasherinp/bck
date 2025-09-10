
// // backend/src/interfaces/courseserviceInterface.ts
// import { ICourseBase, ICoursePopulated, ICreateCourseData } from './courseInterface';
// import { Document, Types } from 'mongoose';
// import { UserRole } from './userInterface';
// import { ICourseCategory } from './courseCategoryInterface';

// export interface ICourseService {
//     getApprovedCourses(): Promise<ICoursePopulated[]>;
//     getAllCourses(): Promise<ICoursePopulated[]>;
//     getNewCourses(): Promise<ICoursePopulated[]>;
//     getCoursesByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]>;
//     getCourseById(id: string): Promise<ICoursePopulated | null>;
//     getEnrolledCoursesForUser(userId: Types.ObjectId): Promise<ICoursePopulated[]>; // Corrected method name and userId type

//     createCourse(courseData: ICreateCourseData, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<ICoursePopulated>;
//     getCategories(): Promise<ICourseCategory[]>;

//     updateCourse(id: string, updateData: Partial<ICourseBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<ICoursePopulated | null>;
//     deleteCourse(id: string, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean>;

//     approveCourse(courseId: string, adminId: Types.ObjectId): Promise<ICoursePopulated | null>;
//     rejectCourse(courseId: string, adminId: Types.ObjectId): Promise<ICoursePopulated | null>;

//     enrollUserInCourse(userId: Types.ObjectId, courseId: string): Promise<boolean>;
// }

// backend/src/interfaces/courseserviceInterface.ts
import { ICourseBase, ICoursePopulated, ICreateCourseData } from './courseInterface';
import { Document, Types } from 'mongoose';
import { UserRole } from './userInterface';
import { ICourseCategory } from './courseCategoryInterface';

export interface ICourseService {
    getApprovedCourses(): Promise<ICoursePopulated[]>;
    getAllCourses(): Promise<ICoursePopulated[]>;
    getNewCourses(): Promise<ICoursePopulated[]>;
    getCoursesByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]>;
    // Changed 'id: string' to 'id: Types.ObjectId'
    getCourseById(id: Types.ObjectId): Promise<ICoursePopulated | null>;
    getEnrolledCoursesForUser(userId: Types.ObjectId): Promise<ICoursePopulated[]>;

    createCourse(courseData: ICreateCourseData, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<ICoursePopulated>;
    getCategories(): Promise<ICourseCategory[]>;

    // Changed 'id: string' to 'id: Types.ObjectId'
    updateCourse(id: Types.ObjectId, updateData: Partial<ICourseBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<ICoursePopulated | null>;
    // Changed 'id: string' to 'id: Types.ObjectId'
    deleteCourse(id: Types.ObjectId, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean>;

    // Changed 'courseId: string' to 'courseId: Types.ObjectId'
    approveCourse(courseId: Types.ObjectId, adminId: Types.ObjectId): Promise<ICoursePopulated | null>;
    // Changed 'courseId: string' to 'courseId: Types.ObjectId'
    rejectCourse(courseId: Types.ObjectId, adminId: Types.ObjectId): Promise<ICoursePopulated | null>;

    // Changed 'courseId: string' to 'courseId: Types.ObjectId'
    enrollUserInCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<boolean>;
}