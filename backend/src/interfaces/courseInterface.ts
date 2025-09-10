// // backend/src/interfaces/courseInterface.ts

// import { Types, Document } from 'mongoose';
// import { ILesson } from './lessonInterface';
// import { ICourseCategory, ICourseCategoryPopulated } from './courseCategoryInterface'; // Corrected import path, removed local definitions


// export enum CourseLevel {
//     Beginner = 'Beginner',
//     Intermediate = 'Intermediate',
//     Advanced = 'Advanced',
//     All = 'All Levels',
// }

// export interface ICourseBase {
//     title: string;
//     description: string;
//     imageUrl: string;
//     categoryId: Types.ObjectId;
//     creatorId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     isApproved: boolean;
//     rating: number;
//     reviewCount: number;
//     studentCount: number;
//     // content: Types.ObjectId[];
//     // assessments: Types.ObjectId[];
//     // prerequisites: string[];
//     // learningOutcomes: string[];
// }

// export interface ICreateCourseData {
//     title: string;
//     description: string;
//     imageUrl?: string;
//     categoryId: Types.ObjectId;
//     creatorId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     isApproved?: boolean;
// }

// export interface ICoursePopulated extends Omit<ICourseBase, 'categoryId' | 'creatorId'>, Document {
//     _id: Types.ObjectId;
//     categoryId: ICourseCategory; // Refers to the imported ICourseCategory
//     creatorId: {
//         _id: Types.ObjectId;
//         username?: string;
//         email: string;
//         profile: { firstName: string, lastName: string };
//     };
//     // content: ILesson[];
//     createdAt?: Date;
//     updatedAt?: Date;
// }


// // backend/src/interfaces/courseInterface.ts

// import { Types, Document } from 'mongoose';
// import { ILesson } from './lessonInterface';
// import { ICourseCategory, ICourseCategoryPopulated } from './courseCategoryInterface';


// export enum CourseLevel {
//     Beginner = 'Beginner',
//     Intermediate = 'Intermediate',
//     Advanced = 'Advanced',
//     All = 'All Levels',
// }

// export interface ICourseBase {
//     title: string;
//     description: string;
//     imageUrl: string;
//     categoryId: Types.ObjectId;
//     creatorId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     isApproved: boolean;
//     rating: number;
//     reviewCount: number;
//     studentCount: number;
// }

// export interface ICreateCourseData {
//     title: string;
//     description: string;
//     imageUrl?: string;
//     categoryId: Types.ObjectId;
//     creatorId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     isApproved?: boolean;
// }

// export interface ICoursePopulated extends Omit<ICourseBase, 'categoryId' | 'creatorId'>, Document {
//     _id: Types.ObjectId;
//     categoryId: ICourseCategory;
//     creatorId: {
//         _id: Types.ObjectId;
//         username?: string;
//         email: string;
//         profile: { firstName: string, lastName: string };
//     };
//     effectivePrice?: number; // <--- ADDED THIS PROPERTY
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // backend/src/interfaces/courseInterface.ts

// import { Document, Types } from 'mongoose';
// import { ICourseCategory } from './courseCategoryInterface'; // For populated category
// import { IUser } from './userInterface'; // For populated user/creator
// // Removed import for './moduleInterface'
// import { ILessonPopulated } from './lessonInterface'; // Keep if you intend to populate lessons directly on the course

// export enum CourseLevel {
//     Beginner = 'Beginner',
//     Intermediate = 'Intermediate',
//     Advanced = 'Advanced',
//     All = 'All',
// }

// export enum CourseStatus {
//     Pending = 'Pending',
//     Approved = 'Approved',
//     Rejected = 'Rejected',
//     Draft = 'Draft',
//     Published = 'Published', // Visible to users
//     Archived = 'Archived', // Hidden from users
// }

// export interface ICourseBase {
//     title: string;
//     description: string;
//     imageUrl?: string;
//     videoUrl?: string; // e.g., for an introductory video
//     price: number;
//     discountPrice?: number; // Price after discount
//     effectivePrice: number; // Calculated price (price - discount)
//     categoryId: Types.ObjectId; // Reference to CourseCategory
//     creatorId: Types.ObjectId; // Reference to User (Teacher or Admin)
//     level: CourseLevel;
//     // Removed 'modules'
//     lessons?: Types.ObjectId[]; // References to Lessons (assuming lessons are directly referenced as ObjectIds)
//     ratings?: number[]; // Array of star ratings
//     averageRating?: number;
//     reviews?: Types.ObjectId[]; // References to Reviews
//     enrollmentCount: number;
//     duration?: string; // e.g., "10 hours", "5 weeks"
//     quizzes?: Types.ObjectId[]; // References to Quizzes
//     isApproved: boolean; // For admin approval
//     status: CourseStatus; // Overall course status (Draft, Published, Archived)
// }

// // ICourse extends Document for Mongoose operations
// export interface ICourse extends ICourseBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // ICoursePopulated for when references are resolved
// export interface ICoursePopulated extends Omit<ICourseBase, 'categoryId' | 'creatorId' | 'lessons' | 'reviews' | 'quizzes'>, Document {
//     _id: Types.ObjectId;
//     categoryId: ICourseCategory; // Populated category object
//     creatorId: IUser; // Populated user (teacher/admin) object
//     // If you intend to populate lessons, you would use ILessonPopulated[] here.
//     // If lessons are only stored as ObjectIds on the course and not populated,
//     // then 'lessons' would not be omitted and would remain 'Types.ObjectId[]'.
//     // I'm keeping ILessonPopulated[] for now, assuming you *might* populate them.
//     // If 'lessons' property is not intended to be populated on the Course model,
//     // then you'd remove 'lessons' from the Omit clause and remove the ILessonPopulated import.
//     lessons?: ILessonPopulated[]; // Populated lesson objects (if lessons are directly on course)
//     reviews?: any[]; // Array of populated review objects (or specific IReview interface)
//     quizzes?: any[]; // Array of populated quiz objects (or specific IQuiz interface)
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // Data structure for creating a new course
// export interface ICreateCourseData {
//     title: string;
//     description: string;
//     categoryId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     imageUrl?: string;
//     videoUrl?: string;
//     creatorId?: Types.ObjectId;
//     isApproved?: boolean;
//     status?: CourseStatus;
// }

// // backend/src/interfaces/courseInterface.ts

// import { Document, Types } from 'mongoose';
// import { ICourseCategory } from './courseCategoryInterface';
// import { IUser } from './userInterface';
// import { ILessonPopulated } from './lessonInterface'; // Ensure this is present if lessons are populated

// export enum CourseLevel {
//     Beginner = 'Beginner',
//     Intermediate = 'Intermediate',
//     Advanced = 'Advanced',
//     All = 'All',
// }

// export enum CourseStatus {
//     Pending = 'Pending',
//     Approved = 'Approved',
//     Rejected = 'Rejected',
//     Draft = 'Draft',
//     Published = 'Published',
//     Archived = 'Archived',
// }

// export interface ICourseBase {
//     title: string;
//     description: string;
//     imageUrl?: string;
//     videoUrl?: string; // Add this if your schema has it
//     price: number;
//     discountPrice?: number;
//     effectivePrice: number; // Add this if your schema has it and you calculate it
//     categoryId: Types.ObjectId;
//     creatorId: Types.ObjectId;
//     level: CourseLevel;
//     lessons?: Types.ObjectId[]; // Add this if your schema has it
//     assessments?: Types.ObjectId[]; // Add this if your schema has it (ref: 'Assessment')
//     ratings?: number[]; // Add this if your schema has it
//     averageRating?: number; // Add this if your schema has it
//     reviews?: Types.ObjectId[]; // Add this if your schema has it (ref: 'Review')
//     enrollmentCount: number; // Add this if your schema has it
//     duration?: string; // Add this if your schema has it
//     quizzes?: Types.ObjectId[]; // Add this if your schema has it (ref: 'Quiz')
//     isApproved: boolean; // Add this if your schema has it
//     status: CourseStatus; // Add this if your schema has it (using the enum)
//     enrolledUsers?: Types.ObjectId[]; // Add this if your schema has it
// }

// // ... rest of courseInterface.ts (ICourse, ICoursePopulated, ICreateCourseData) remains the same as last provided,
// // ensuring ICoursePopulated has the corresponding populated types if needed.
// // For example, if 'assessments' is populated, it would be 'IAssessmentPopulated[]'.
// // If 'reviews' are populated, it would be 'IReviewPopulated[]'.


// // ICourse extends Document for Mongoose operations
// export interface ICourse extends ICourseBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // ICoursePopulated for when references are resolved
// export interface ICoursePopulated extends Omit<ICourseBase, 'categoryId' | 'creatorId' | 'lessons' | 'reviews' | 'quizzes'>, Document {
//     _id: Types.ObjectId;
//     categoryId: ICourseCategory; // Populated category object
//     creatorId: IUser; // Populated user (teacher/admin) object
//     // If you intend to populate lessons, you would use ILessonPopulated[] here.
//     // If lessons are only stored as ObjectIds on the course and not populated,
//     // then 'lessons' would not be omitted and would remain 'Types.ObjectId[]'.
//     // I'm keeping ILessonPopulated[] for now, assuming you *might* populate them.
//     // If 'lessons' property is not intended to be populated on the Course model,
//     // then you'd remove 'lessons' from the Omit clause and remove the ILessonPopulated import.
//     lessons?: ILessonPopulated[]; // Populated lesson objects (if lessons are directly on course)
//     reviews?: any[]; // Array of populated review objects (or specific IReview interface)
//     quizzes?: any[]; // Array of populated quiz objects (or specific IQuiz interface)
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // Data structure for creating a new course
// export interface ICreateCourseData {
//     title: string;
//     description: string;
//     categoryId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     imageUrl?: string;
//     videoUrl?: string;
//     creatorId?: Types.ObjectId;
//     isApproved?: boolean;
//     status?: CourseStatus;
// }

// // backend/src/interfaces/courseInterface.ts

// import { Document, Types } from 'mongoose';
// import { ICourseCategoryPopulated } from './courseCategoryInterface'; // Use the POPULATED category type
// import { IUserPopulated  } from './userInterface'; // Use the POPULATED user type
// import { ILessonPopulated } from './lessonInterface'; // Ensure this is present if lessons are populated

// export enum CourseLevel {
//     Beginner = 'Beginner',
//     Intermediate = 'Intermediate',
//     Advanced = 'Advanced',
//     All = 'All',
// }

// export enum CourseStatus {
//     Pending = 'Pending',
//     Approved = 'Approved',
//     Rejected = 'Rejected',
//     Draft = 'Draft',
//     Published = 'Published',
//     Archived = 'Archived',
// }

// export interface ICourseBase {
//     title: string;
//     description: string;
//     imageUrl?: string;
//     videoUrl?: string;
//     price: number;
//     discountPrice?: number;
//     effectivePrice: number;
//     categoryId: Types.ObjectId; // This remains ObjectId in the base
//     creatorId: Types.ObjectId; // This remains ObjectId in the base
//     level: CourseLevel;
//     lessons?: Types.ObjectId[]; // Lessons are ObjectIds in the base
//     assessments?: Types.ObjectId[];
//     ratings?: number[];
//     averageRating?: number;
//     reviews?: Types.ObjectId[];
//     enrollmentCount: number;
//     duration?: string;
//     quizzes?: Types.ObjectId[];
//     isApproved: boolean;
//     status: CourseStatus;
//     enrolledUsers?: Types.ObjectId[];
// }

// // ICourse extends Document for Mongoose operations (this is correct)
// export interface ICourse extends ICourseBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // IMPORTANT CHANGE HERE: ICoursePopulated should NOT extend Document
// // because it's the result of a .lean() query, which returns a plain object.
// // It should extend ICourseBase and then explicitly type the populated fields.
// export interface ICoursePopulated extends Omit<ICourseBase, 'categoryId' | 'creatorId' | 'lessons' | 'assessments' | 'reviews' | 'quizzes' | 'enrolledUsers'> {
//     _id: Types.ObjectId; // Add _id explicitly as it will be present
//     categoryId: ICourseCategoryPopulated; // Populated category object (use the POJO populated type)
//     creatorId: IUserPopulated ; // Populated user object (use the POJO populated type)
//     lessons?: ILessonPopulated[]; // Populated lesson objects (assuming you populate them)
//     assessments?: any[]; // For now, if populated, define a specific IAssessmentPopulated type here if available
//     reviews?: any[]; // Array of populated review objects (or specific IReviewPopulated type)
//     quizzes?: any[]; // Array of populated quiz objects (or specific IQuizPopulated type)
//     enrolledUsers?: IUserPopulated []; // If you ever populate enrolledUsers
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // Data structure for creating a new course (no change needed)
// export interface ICreateCourseData {
//     title: string;
//     description: string;
//     categoryId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     imageUrl?: string;
//     videoUrl?: string;
//     creatorId?: Types.ObjectId;
//     isApproved?: boolean;
//     status?: CourseStatus;
// }

// // backend/src/interfaces/courseInterface.ts

// import { Document, Types } from 'mongoose';
// import { ICourseCategoryPopulated } from './courseCategoryInterface'; // Already correct
// import { IUserPopulated } from './userInterface'; // Already correct
// import { ILessonPopulated } from './lessonInterface'; // Ensure this exists and is correct for populated lessons

// export enum CourseLevel {
//     Beginner = 'Beginner',
//     Intermediate = 'Intermediate',
//     Advanced = 'Advanced',
//     All = 'All',
// }

// export enum CourseStatus {
//     Pending = 'Pending',
//     Approved = 'Approved',
//     Rejected = 'Rejected',
//     Draft = 'Draft',
//     Published = 'Published',
//     Archived = 'Archived',
// }

// export interface ICourseBase {
//     title: string;
//     description: string;
//     imageUrl?: string;
//     videoUrl?: string;
//     price: number;
//     discountPrice?: number;
//     effectivePrice: number;
//     categoryId: Types.ObjectId; // This remains ObjectId in the base
//     creatorId: Types.ObjectId; // This remains ObjectId in the base
//     level: CourseLevel;
//     lessons?: Types.ObjectId[]; // Lessons are ObjectIds in the base
//     assessments?: Types.ObjectId[];
//     ratings?: number[];
//     averageRating?: number;
//     reviews?: Types.ObjectId[];
//     enrollmentCount: number;
//     duration?: string;
//     quizzes?: Types.ObjectId[];
//     isApproved: boolean;
//     status: CourseStatus;
//     enrolledUsers?: Types.ObjectId[];
// }

// // ICourse extends Document for Mongoose operations (this is correct and remains)
// export interface ICourse extends ICourseBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // ****** CRITICAL CHANGE HERE FOR ICoursePopulated ******
// // It should extend ICourseBase (for all base properties)
// // AND then explicitly override the populated fields.
// // It should NOT extend 'Document' if using .lean().
// export interface ICoursePopulated extends ICourseBase { // <--- NO 'Omit' or 'Document' here.
//     _id: Types.ObjectId; // Add _id, createdAt, updatedAt explicitly for a lean result
//     createdAt?: Date;
//     updatedAt?: Date;

//     // Override the ObjectId fields with their populated types
//     categoryId: ICourseCategoryPopulated; // Populated category object
//     creatorId: IUserPopulated; // Populated user object

//     // If these are also populated and are plain objects after .lean()
//     lessons?: ILessonPopulated[]; // Assuming ILessonPopulated is a plain object type
//     assessments?: any[]; // Define IAssessmentPopulated for this if you have it
//     reviews?: any[]; // Define IReviewPopulated for this if you have it
//     quizzes?: any[]; // Define IQuizPopulated for this if you have it
//     enrolledUsers?: IUserPopulated[]; // If populated, use IUserPopulated
// }

// // Data structure for creating a new course (no change needed)
// export interface ICreateCourseData {
//     title: string;
//     description: string;
//     categoryId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     imageUrl?: string;
//     videoUrl?: string;
//     creatorId?: Types.ObjectId;
//     isApproved?: boolean;
//     status?: CourseStatus;
// }


// // backend/src/interfaces/courseInterface.ts

// import { Document, Types } from 'mongoose';
// import { ICourseCategoryPopulated } from './courseCategoryInterface';
// import { IUserPopulated } from './userInterface';
// import { ILessonPopulated } from './lessonInterface'; // Ensure this exists and is correct for populated lessons
// // Make sure other populated interfaces (Assessments, Reviews, Quizzes) are imported if you intend to use them
// // import { IAssessmentPopulated } from './assessmentInterface';
// // import { IReviewPopulated } from './reviewInterface';
// // import { IQuizPopulated } from './quizInterface';


// export enum CourseLevel {
//     Beginner = 'Beginner',
//     Intermediate = 'Intermediate',
//     Advanced = 'Advanced',
//     All = 'All',
// }

// export enum CourseStatus {
//     Pending = 'Pending',
//     Approved = 'Approved',
//     Rejected = 'Rejected',
//     Draft = 'Draft',
//     Published = 'Published',
//     Archived = 'Archived',
// }

// export interface ICourseBase {
//     title: string;
//     description: string;
//     imageUrl?: string;
//     videoUrl?: string;
//     price: number;
//     discountPrice?: number;
//     effectivePrice: number;
//     categoryId: Types.ObjectId;
//     creatorId: Types.ObjectId;
//     level: CourseLevel;
//     lessons?: Types.ObjectId[];
//     assessments?: Types.ObjectId[];
//     ratings?: number[];
//     averageRating?: number;
//     reviews?: Types.ObjectId[];
//     enrollmentCount: number;
//     duration?: string;
//     quizzes?: Types.ObjectId[];
//     isApproved: boolean;
//     status: CourseStatus;
//     enrolledUsers?: Types.ObjectId[];
// }

// // ICourse extends Document for Mongoose operations
// export interface ICourse extends ICourseBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // ****** THIS MUST BE EXACTLY AS SHOWN FOR ICoursePopulated ******
// // It explicitly lists all expected properties from the lean result.
// // It DOES NOT use 'extends ICourseBase' or 'Omit' here.
// export interface ICoursePopulated {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;

//     // --- Properties from ICourseBase ---
//     title: string;
//     description: string;
//     imageUrl?: string;
//     videoUrl?: string;
//     price: number;
//     discountPrice?: number;
//     effectivePrice: number;
//     level: CourseLevel;
//     ratings?: number[];
//     averageRating?: number;
//     enrollmentCount: number;
//     duration?: string;
//     isApproved: boolean;
//     status: CourseStatus;

//     // --- Populated fields (overriding the ObjectId type) ---
//     categoryId: ICourseCategoryPopulated;
//     creatorId: IUserPopulated;

//     // --- Array fields that might be populated or remain ObjectIds ---
//     // If you intend to populate these, ensure ILessonPopulated, etc., are defined as plain objects.
//     lessons?: ILessonPopulated[]; // Changed from Types.ObjectId[]
//     assessments?: any[]; // Keep as any[] for now, or use IAssessmentPopulated[] if defined
//     reviews?: any[]; // Keep as any[] for now, or use IReviewPopulated[] if defined
//     quizzes?: any[]; // Keep as any[] for now, or use IQuizPopulated[] if defined
//     enrolledUsers?: IUserPopulated[]; // If you populate enrolled users, use IUserPopulated[]
// }

// export interface ICreateCourseData {
//     title: string;
//     description: string;
//     categoryId: Types.ObjectId;
//     level: CourseLevel;
//     price: number;
//     discountPrice?: number;
//     imageUrl?: string;
//     videoUrl?: string;
//     creatorId?: Types.ObjectId;
//     isApproved?: boolean;
//     status?: CourseStatus;
// }

// backend/src/interfaces/courseInterface.ts

import { Document, Types } from 'mongoose';
import { ICourseCategoryPopulated } from './courseCategoryInterface';
import { IUserPopulated } from './userInterface';
import { ILessonPopulated } from './lessonInterface'; // Make sure this exists and is correct (plain object, no Document)
// Ensure other populated interfaces (IAssessmentPopulated, IReviewPopulated, IQuizPopulated) are imported
// if you intend to populate those fields.

export enum CourseLevel {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
    All = 'All',
}

export enum CourseStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Draft = 'Draft',
    Published = 'Published',
    Archived = 'Archived',
}

export interface ICourseBase {
    title: string;
    description: string;
    imageUrl?: string;
    videoUrl?: string;
    price: number;
    discountPrice?: number;
    effectivePrice: number;
    categoryId: Types.ObjectId;
    creatorId: Types.ObjectId;
    level: CourseLevel;
    lessons?: Types.ObjectId[];
    assessments?: Types.ObjectId[];
    ratings?: number[];
    averageRating?: number;
    reviews?: Types.ObjectId[];
    enrollmentCount: number;
    duration?: string;
    quizzes?: Types.ObjectId[];
    isApproved: boolean;
    status: CourseStatus;
    enrolledUsers?: Types.ObjectId[];
}

// ICourse extends Document for Mongoose operations
export interface ICourse extends ICourseBase, Document {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// ****** CRITICAL: This is the definitive structure for ICoursePopulated ******
// It MUST contain all expected fields from the lean-populated document.
// It DOES NOT use 'extends ICourseBase' or 'Omit' here.
export interface ICoursePopulated {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number; // Mongoose's version key

    // All direct properties from your CourseModel schema (matching ICourseBase)
    title: string;
    description: string;
    imageUrl?: string;
    videoUrl?: string;
    price: number;
    discountPrice?: number;
    effectivePrice: number;
    level: CourseLevel;
    ratings?: number[];
    averageRating?: number;
    enrollmentCount: number;
    duration?: string;
    isApproved: boolean;
    status: CourseStatus;

    // Populated fields (these are the actual plain objects)
    categoryId: ICourseCategoryPopulated;
    creatorId: IUserPopulated;

    // Array fields that are populated (if applicable, ensure their types are plain objects)
    lessons?: ILessonPopulated[];
    assessments?: any[]; // Or IAssessmentPopulated[] if defined
    reviews?: any[];     // Or IReviewPopulated[] if defined
    quizzes?: any[];     // Or IQuizPopulated[] if defined
    enrolledUsers?: IUserPopulated[]; // Or Types.ObjectId[] if not populated for users
}
export interface ICreateCourseData {
    title: string;
    description: string;
    categoryId: Types.ObjectId;
    level: CourseLevel;
    price: number;
    discountPrice?: number;
    imageUrl?: string;
    videoUrl?: string;
    creatorId?: Types.ObjectId;
    isApproved?: boolean;
    status?: CourseStatus;
}