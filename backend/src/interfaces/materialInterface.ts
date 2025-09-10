// import { Types, Document } from 'mongoose';

// export enum MaterialType {
//     Text = 'text',
//     Image = 'image',
//     Video = 'video',
//     PDF = 'pdf',
//     PPT = 'ppt', // For PowerPoint files
//     Audio = 'audio',
//     URL = 'url', // For external links
// }

// export interface IMaterialBase {
//     _id?: Types.ObjectId;
//     lessonId: Types.ObjectId; // Link to the parent lesson
//     title: string;
//     type: MaterialType;
//     content: string; // Stores text content, URL, or Cloudinary file URL
//     description?: string; // Optional description for the material
//     orderIndex: number; // To maintain the order of materials within a lesson
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// export interface IMaterialPopulated extends IMaterialBase, Document {
//     _id: Types.ObjectId;
// }

// export interface ICreateMaterialData {
//     lessonId: string; // From request body
//     title: string;
//     type: MaterialType;
//     content: string; // Direct content (text) or URL/file path
//     description?: string;
//     orderIndex: number;
//     // For file uploads, the actual file will be handled by multer/controller
// }

// // backend/src/interfaces/materialInterface.ts
// import { Types, Document } from 'mongoose'; // Keep Document for IMaterial

// export enum MaterialType {
//     Text = 'text',
//     Image = 'image',
//     Video = 'video',
//     PDF = 'pdf',
//     PPT = 'ppt', // For PowerPoint files
//     Audio = 'audio',
//     URL = 'url', // For external links
// }

// export interface IMaterialBase {
//     // _id should not be optional in base if it's always created by Mongoose
//     lessonId: Types.ObjectId; // Link to the parent lesson
//     title: string;
//     type: MaterialType;
//     content: string; // Stores text content, URL, or Cloudinary file URL
//     description?: string; // Optional description for the material
//     orderIndex: number; // To maintain the order of materials within a lesson
// }

// export interface IMaterial extends IMaterialBase, Document {
//     _id: Types.ObjectId; // Explicitly make _id required for the Document
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // FIX: IMaterialPopulated should NOT extend Document
// // It's a plain object representation of the populated data.
// export interface IMaterialPopulated {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
//     __v?: number; // Add version key for leaned objects

//     lessonId: Types.ObjectId; // Remains ObjectId unless populated
//     title: string;
//     type: MaterialType;
//     content: string;
//     description?: string;
//     orderIndex: number;
// }

// export interface ICreateMaterialData {
//     lessonId: string; // Keep as string for DTO, convert to Types.ObjectId in service/controller
//     title: string;
//     type: MaterialType;
//     content: string;
//     description?: string;
//     orderIndex: number;
// }

// // backend/src/interfaces/materialInterface.ts
// import { Types, Document } from 'mongoose';

// export enum MaterialType {
//     Text = 'text',
//     Image = 'image',
//     Video = 'video',
//     PDF = 'pdf',
//     PPT = 'ppt',
//     Audio = 'audio',
//     URL = 'url',
// }

// export interface IMaterialBase {
//     lessonId: Types.ObjectId;
//     title: string;
//     type: MaterialType;
//     content: string;
//     description?: string;
//     orderIndex: number;
// }

// export interface IMaterial extends IMaterialBase, Document {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// // Ensure this interface is a plain object type
// export interface IMaterialPopulated {
//     _id: Types.ObjectId;
//     createdAt?: Date;
//     updatedAt?: Date;
//     __v?: number; // Crucial for leaned objects

//     lessonId: Types.ObjectId; // Unless you're populating lessonId here
//     title: string;
//     type: MaterialType;
//     content: string;
//     description?: string;
//     orderIndex: number;
// }

// export interface ICreateMaterialData {
//     lessonId: string;
//     title: string;
//     type: MaterialType;
//     content: string;
//     description?: string;
//     orderIndex: number;
// }

// backend/src/interfaces/materialInterface.ts
import { Types, Document } from 'mongoose';
import { ILessonPopulated } from './lessonInterface'; // FIX: Add this import if you intend to populate lessonId

export enum MaterialType {
    Text = 'text',
    Image = 'image',
    Video = 'video',
    PDF = 'pdf',
    PPT = 'ppt',
    Audio = 'audio',
    URL = 'url',
}

export interface IMaterialBase {
    lessonId: Types.ObjectId;
    title: string;
    type: MaterialType;
    content: string;
    description?: string;
    orderIndex: number;
}

export interface IMaterial extends IMaterialBase, Document {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Ensure this interface is a plain object type
export interface IMaterialPopulated {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number; // Crucial for leaned objects

    // FIX: Change lessonId to populated type if you intend to populate it.
    // Otherwise, keep it as Types.ObjectId. Assuming you want it populated.
    lessonId: ILessonPopulated | { _id: Types.ObjectId; title: string; }; // Example: Populated lesson object, or just its ID and title
    title: string;
    type: MaterialType;
    content: string;
    description?: string;
    orderIndex: number;
}

export interface ICreateMaterialData {
    lessonId: Types.ObjectId; // FIX: Change from string to Types.ObjectId
    title: string;
    type: MaterialType;
    content: string;
    description?: string;
    orderIndex?: number; // Made optional if it's auto-generated in service
}