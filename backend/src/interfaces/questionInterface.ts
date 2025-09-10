

// // backend/src/interfaces/questionInterface.ts
// import { Document, Types } from 'mongoose';

// export enum QuestionType {
//     MultipleChoice = 'multiple_choice',
//     SingleChoice = 'single_choice',
//     TrueFalse = 'true_false',
//     ShortAnswer = 'short_answer',
//     LongAnswer = 'long_answer',
//     FileUpload = 'file_upload',
// }

// export interface IQuestionBase {
//     assessmentId: Types.ObjectId;
//     questionText: string;
//     type: QuestionType;
//     options?: string[];
//     correctAnswer?: string | string[];
//     points: number;
//     imageUrl?: string;
//     pdfUrl?: string;
//     orderIndex: number;
// }

// export interface IQuestion extends IQuestionBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // FIX: IQuestionPopulated should NOT extend IQuestion (which includes Document)
// // It's a plain object representation of the populated data.
// export interface IQuestionPopulated {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
//     __v?: number; // Add version key for leaned objects

//     assessmentId: Types.ObjectId; // Remains ObjectId unless populated
//     questionText: string;
//     type: QuestionType;
//     options?: string[];
//     correctAnswer?: string | string[];
//     points: number;
//     imageUrl?: string;
//     pdfUrl?: string;
//     orderIndex: number;
// }

// export interface ICreateQuestionData {
//     assessmentId: Types.ObjectId;
//     questionText: string;
//     type: QuestionType;
//     options?: string[];
//     correctAnswer?: string | string[];
//     points: number;
//     orderIndex: number;
// }

// backend/src/interfaces/questionInterface.ts
import { Types, Document } from 'mongoose';

export enum QuestionType {
    MultipleChoice = 'MultipleChoice',
    TrueFalse = 'TrueFalse',
    FileUpload = 'FileUpload',
}

export interface IQuestionBase {
    assessmentId: Types.ObjectId;
    questionText: string;
    type: QuestionType;
    options?: string[];
    correctAnswer: string | string[] | boolean;
    points: number;
    imageUrl?: string;
    pdfUrl?: string;
    orderIndex: number;
}

export interface ICreateQuestionData {
    assessmentId: Types.ObjectId;
    questionText: string;
    type: QuestionType;
    options?: string[];
    correctAnswer: string | string[] | boolean;
    points: number;
    imageUrl?: string;
    pdfUrl?: string;
    orderIndex?: number;
}

export interface IQuestion extends IQuestionBase {
    _id: Types.ObjectId;
}

export interface IQuestionPopulated {
    _id: Types.ObjectId;
    questionText: string;
    type: QuestionType;
    options?: string[];
    correctAnswer: string | string[] | boolean;
    points: number;
    imageUrl?: string;
    pdfUrl?: string;
    orderIndex: number;
    assessmentId: {
        _id: Types.ObjectId;
        title: string;
        courseId: Types.ObjectId;
    };
}

export interface IQuestionDocument extends IQuestionBase, Document {}