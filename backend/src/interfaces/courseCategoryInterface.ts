// import { Types, Document } from 'mongoose';
// import { IMaterialPopulated } from './materialInterface';
// import { IAssessmentPopulated } from './assessmentInterface';

// export interface ILessonBase {
//     _id?: Types.ObjectId;
//     courseId: Types.ObjectId;
//     title: string;
//     description?: string;
//     orderIndex: number; // To maintain the order of lessons within a course
//     materials: Types.ObjectId[]; // Array of Material IDs
//     assessments: Types.ObjectId[]; // Array of Assessment IDs linked to this lesson
//     isPublished: boolean; // Whether the lesson is visible/accessible
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// export interface ILessonPopulated extends Omit<ILessonBase, 'materials' | 'assessments'>, Document {
//     _id: Types.ObjectId;
//     materials: IMaterialPopulated[];
//     assessments: IAssessmentPopulated[];
// }

// export interface ICreateLessonData {
//     courseId: string; // From request body
//     title: string;
//     description?: string;
//     orderIndex: number;
// }
// backend/src/interfaces/courseCategoryInterface.ts
import { Types, Document } from 'mongoose';

export interface ICourseCategoryBase {
    name: string;
    description?: string;
    discountPercentage?: number;
}

export interface ICourseCategory extends ICourseCategoryBase, Document {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICourseCategoryPopulated extends ICourseCategoryBase { // CHANGED
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    // No Document methods here, as it's a plain object from .lean()
}