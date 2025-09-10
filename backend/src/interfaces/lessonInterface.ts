

// // backend/src/interfaces/lessonInterface.ts
// import { Types, Document } from 'mongoose';
// import { IMaterialPopulated } from './materialInterface';
// import { IAssessmentPopulated } from './assessmentInterface';
// import { ICoursePopulated } from './courseInterface';

// export interface ILessonBase {
//     courseId: Types.ObjectId;
//     title: string;
//     description?: string;
//     orderIndex: number;
//     materials: Types.ObjectId[]; // IDs
//     assessments: Types.ObjectId[]; // IDs
//     isPublished: boolean;
// }

// // FIX: Explicitly define _id as Types.ObjectId here for clarity and to prevent 'unknown' inference.
// // This is the most robust way to ensure TypeScript knows the _id type.
// export interface ILesson extends ILessonBase, Document {
//     _id: Types.ObjectId; // <--- This line is critical for resolving the error
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// export interface ILessonPopulated {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
//     __v?: number;

//     // Assuming courseId is populated. Adjust if it's not always populated.
//     courseId: ICoursePopulated | Types.ObjectId; // It could be populated or just the ID
//     title: string;
//     description?: string;
//     orderIndex: number;
//     isPublished: boolean;

//     materials: IMaterialPopulated[];
//     assessments: IAssessmentPopulated[];
// }

// export interface ICreateLessonData {
//     courseId: Types.ObjectId;
//     title: string;
//     description?: string;
//     orderIndex?: number;
//     isPublished?: boolean;
// }

// backend/src/interfaces/lessonInterface.ts
import { Types, Document } from 'mongoose';
import { IMaterialPopulated } from './materialInterface';
import { IAssessmentPopulated } from './assessmentInterface';
import { ICoursePopulated } from './courseInterface';

export interface ILessonBase {
    courseId: Types.ObjectId;
    title: string;
    description?: string;
    orderIndex: number;
    materials: Types.ObjectId[]; // IDs
    assessments: Types.ObjectId[]; // IDs
    isPublished: boolean;
}

// FIX: This is already correct. Explicitly define _id as Types.ObjectId.
export interface ILesson extends ILessonBase, Document {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ILessonPopulated {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;

    // Assuming courseId is populated. Adjust if it's not always populated.
    courseId: ICoursePopulated | Types.ObjectId; // It could be populated or just the ID
    title: string;
    description?: string;
    orderIndex: number;
    isPublished: boolean;

    materials: IMaterialPopulated[];
    assessments: IAssessmentPopulated[];
}

export interface ICreateLessonData {
    courseId: Types.ObjectId;
    title: string;
    description?: string;
    orderIndex?: number;
    isPublished?: boolean;
}