// import { Types, Document } from 'mongoose';
// import { IQuestionPopulated } from './questionInterface';

// export enum AssessmentType {
//     Quiz = 'quiz', // Multiple choice, true/false
//     Exam = 'exam', // Could be longer, timed quizzes
//     Assignment = 'assignment', // Requires text input or file upload
// }

// export interface IAssessmentBase {
//     _id?: Types.ObjectId;
//     courseId: Types.ObjectId; // Link to the parent course
//     lessonId?: Types.ObjectId; // Optional link to a specific lesson (if lesson-specific)
//     title: string;
//     description?: string;
//     type: AssessmentType;
//     questions: Types.ObjectId[]; // Array of Question IDs
//     maxScore?: number; // Total possible score for the assessment
//     durationMinutes?: number; // For timed assessments
//     isPublished: boolean;
//     passPercentage?: number; // Minimum percentage to pass
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// export interface IAssessmentPopulated extends Omit<IAssessmentBase, 'questions'>, Document {
//     _id: Types.ObjectId;
//     questions: IQuestionPopulated[];
// }

// export interface ICreateAssessmentData {
//     courseId: string;
//     lessonId?: string;
//     title: string;
//     description?: string;
//     type: AssessmentType;
//     maxScore?: number;
//     durationMinutes?: number;
//     passPercentage?: number;
//     // Questions will be added separately or in a nested structure if preferred later
// }

// // backend/src/interfaces/assessmentInterface.ts
// import { Types, Document } from 'mongoose';
// import { IQuestion, IQuestionPopulated } from './questionInterface'; // Assuming you have this interface

// export enum AssessmentType {
//     Quiz = 'Quiz',
//     Exam = 'Exam',
//     Assignment = 'Assignment',
//     Practice = 'Practice',
// }

// export interface IAssessmentBase {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId; // Optional, if it's a lesson-level assessment
//     lessonId?: Types.ObjectId; // Optional, if it's a course-level assessment
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     questions: Types.ObjectId[]; // Array of Question IDs
//     isPublished: boolean;
//     // Add other relevant fields
// }

// // IAssessment extends Document for Mongoose
// export interface IAssessment extends IAssessmentBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // IAssessmentPopulated for when references are resolved
// export interface IAssessmentPopulated extends Omit<IAssessmentBase, 'questions'>, Document {
//     _id: Types.ObjectId;
//     questions: IQuestionPopulated[]; // Populated array of Question objects
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // Data structure for creating a new assessment
// export interface ICreateAssessmentData {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     isPublished?: boolean;
// }


// // backend/src/interfaces/assessmentInterface.ts
// import { Types, Document } from 'mongoose';
// import { IQuestion, IQuestionPopulated } from './questionInterface';

// export enum AssessmentType {
//     Quiz = 'Quiz',
//     Exam = 'Exam',
//     Assignment = 'Assignment',
//     Practice = 'Practice',
// }

// export interface IAssessmentBase {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     questions: Types.ObjectId[]; // This is the ID array
//     isPublished: boolean;
//     maxScore?: number;
//     passPercentage?: number;
// }

// // IAssessment (the base Mongoose Document type)
// export interface IAssessment extends IAssessmentBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // IAssessmentPopulated: This should combine the base properties, but with 'questions' re-typed.
// // It should also implicitly carry the Document properties if it's based on an IAssessment.
// // We make a new interface that picks all properties from IAssessment, then overrides 'questions'.
// export interface IAssessmentPopulated extends Pick<IAssessment, Exclude<keyof IAssessment, 'questions'>> {
//     questions: IQuestionPopulated[]; // This overrides the 'questions' property from IAssessment
// }



// export interface ICreateAssessmentData {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     isPublished?: boolean;
//     maxScore?: number;
//     passPercentage?: number;
// }

// // backend/src/interfaces/assessmentInterface.ts
// import { Types, Document } from 'mongoose';
// import { IQuestion, IQuestionPopulated } from './questionInterface'; // IQuestion is now correctly exported

// export enum AssessmentType {
//     Quiz = 'Quiz',
//     Exam = 'Exam',
//     Assignment = 'Assignment',
//     Practice = 'Practice',
// }

// export interface IAssessmentBase {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     questions: Types.ObjectId[]; // Array of Question IDs
//     isPublished: boolean;
//     maxScore?: number;
//     passPercentage?: number;
// }

// // IAssessment: This interface represents a Mongoose Document.
// // It explicitly defines _id as required, resolving the conflict.
// export interface IAssessment extends IAssessmentBase {
//     _id: Types.ObjectId; // Explicitly required here
//     createdAt?: Date;
//     updatedAt?: Date;
//     // Mongoose Document methods (save, exec, etc.) are implicitly added by the Model type.
//     // We don't extend 'Document' directly here to avoid the '_id' conflict.
// }

// // IAssessmentPopulated: This should represent a populated IAssessment.
// // It extends IAssessment (which has _id and other base properties)
// // and then overrides the 'questions' property with the populated type.
// export interface IAssessmentPopulated extends Omit<IAssessment, 'questions'> {
//     questions: IQuestionPopulated[]; // Populated array of Question objects
// }

// // Data structure for creating a new assessment
// export interface ICreateAssessmentData {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     isPublished?: boolean;
//     maxScore?: number;
//     passPercentage?: number;
// }

// // backend/src/interfaces/assessmentInterface.ts
// import { Types, Document } from 'mongoose';
// import { IQuestion, IQuestionPopulated } from './questionInterface'; // IQuestion is now correctly exported

// export enum AssessmentType {
//     Quiz = 'Quiz',
//     Exam = 'Exam',
//     Assignment = 'Assignment',
//     Practice = 'Practice',
// }

// export interface IAssessmentBase {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     questions: Types.ObjectId[]; // Array of Question IDs
//     isPublished: boolean;
//     maxScore?: number;
//     passPercentage?: number;
// }

// // IAssessment: This interface represents a Mongoose Document.
// // It explicitly defines _id as required, resolving the conflict.
// export interface IAssessment extends IAssessmentBase {
//     _id: Types.ObjectId; // Explicitly required here
//     createdAt?: Date;
//     updatedAt?: Date;
//     // Mongoose Document methods (save, exec, etc.) are implicitly added by the Model type.
//     // We don't extend 'Document' directly here to avoid the '_id' conflict.
// }

// // IAssessmentPopulated: This should represent a populated IAssessment.
// // It extends IAssessment (which has _id and other base properties)
// // and then overrides the 'questions' property with the populated type.
// export interface IAssessmentPopulated extends Omit<IAssessment, 'questions'> {
//     questions: IQuestionPopulated[]; // Populated array of Question objects
// }

// // Data structure for creating a new assessment
// export interface ICreateAssessmentData {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     isPublished?: boolean;
//     maxScore?: number;
//     passPercentage?: number;
// // }
// // backend/src/interfaces/assessmentInterface.ts
// import { Types, Document } from 'mongoose'; // Keep Document
// import { IQuestion, IQuestionPopulated } from './questionInterface'; // Ensure IQuestion and IQuestionPopulated are here and correct

// export enum AssessmentType {
//     Quiz = 'Quiz',
//     Exam = 'Exam',
//     Assignment = 'Assignment',
//     Practice = 'Practice',
// }

// export interface IAssessmentBase {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     questions: Types.ObjectId[]; // Array of Question IDs
//     isPublished: boolean;
//     maxScore?: number;
//     passPercentage?: number;
// }

// // IAssessment: This interface represents a Mongoose Document.
// // It extends IAssessmentBase AND Document.
// // We explicitly define _id here to ensure it's a Types.ObjectId and required on the Document.
// export interface IAssessment extends IAssessmentBase, Document {
//     _id: Types.ObjectId; // Make _id explicitly required and of Types.ObjectId
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // IAssessmentPopulated: This should represent a populated IAssessment.
// // It extends IAssessment (which now includes Document properties and _id).
// // We then override the 'questions' property with the populated type.
// export interface IAssessmentPopulated extends Omit<IAssessment, 'questions'> {
//     questions: IQuestionPopulated[]; // Populated array of Question objects
// }

// // Data structure for creating a new assessment
// export interface ICreateAssessmentData {
//     title: string;
//     description?: string;
//     courseId?: Types.ObjectId;
//     lessonId?: Types.ObjectId;
//     type: AssessmentType;
//     durationMinutes?: number;
//     passMarkPercentage?: number;
//     totalMarks?: number;
//     isPublished?: boolean;
//     maxScore?: number;
//     passPercentage?: number;
// }

// backend/src/interfaces/assessmentInterface.ts
import { Types, Document } from 'mongoose';
import { IQuestion, IQuestionPopulated } from './questionInterface'; // Ensure these are correct

export enum AssessmentType {
    Quiz = 'Quiz',
    Exam = 'Exam',
    Assignment = 'Assignment',
    Practice = 'Practice',
}

export interface IAssessmentBase {
    title: string;
    description?: string;
    courseId?: Types.ObjectId;
    lessonId?: Types.ObjectId;
    type: AssessmentType;
    durationMinutes?: number;
    passMarkPercentage?: number;
    totalMarks?: number;
    questions: Types.ObjectId[]; // Array of Question IDs
    isPublished: boolean;
    maxScore?: number;
    passPercentage?: number;
}

export interface IAssessment extends IAssessmentBase, Document {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// FIX: IAssessmentPopulated should NOT extend IAssessment (which includes Document)
// It should be a plain object with all expected fields including populated ones.
export interface IAssessmentPopulated {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number; // Add version key for leaned objects

    title: string;
    description?: string;
    courseId?: Types.ObjectId; // Remains ObjectId unless populated
    lessonId?: Types.ObjectId; // Remains ObjectId unless populated
    type: AssessmentType;
    durationMinutes?: number;
    passMarkPercentage?: number;
    totalMarks?: number;
    isPublished: boolean;
    maxScore?: number;
    passPercentage?: number;

    questions: IQuestionPopulated[]; // Populated array of Question objects (plain objects)
}

export interface ICreateAssessmentData {
    title: string;
    description?: string;
    courseId?: Types.ObjectId;
    lessonId?: Types.ObjectId;
    type: AssessmentType;
    durationMinutes?: number;
    passMarkPercentage?: number;
    totalMarks?: number;
    isPublished?: boolean;
    maxScore?: number;
    passPercentage?: number;
}