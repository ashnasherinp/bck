// // // backend/src/interfaces/CourseCategoryRepositoryInterface.ts
// // import { Types } from 'mongoose';
// // import { ICourseCategory } from './courseInterface'; // Use the simplified ICourseCategory

// // export interface ICourseCategoryRepository {
// //     create(data: { name: string; description?: string }): Promise<ICourseCategory & Document>; // Create returns a full Mongoose Document
// //     findAll(): Promise<ICourseCategory[]>; // findAll returns plain objects
// //     findById(id: string | Types.ObjectId): Promise<ICourseCategory | null>; // findById returns plain object
// //     update(id: Types.ObjectId, data: Partial<ICourseCategory>): Promise<ICourseCategory | null>; // update returns plain object
// //     delete(id: Types.ObjectId): Promise<boolean>;
// // }


// // // backend/src/interfaces/CourseCategoryRepositoryInterface.ts
// // import { Types, Document } from 'mongoose';
// // import { ICourseCategoryBase, ICourseCategoryPopulated } from './courseInterface'; // Import both

// // export interface ICourseCategoryRepository {
// //     create(data: { name: string; description?: string }): Promise<ICourseCategoryBase & Document>; // Create accepts base, returns base & Document
// //     findAll(): Promise<ICourseCategoryPopulated[]>; // Returns populated
// //     findById(id: string | Types.ObjectId): Promise<ICourseCategoryPopulated | null>; // Returns populated
// //     update(id: Types.ObjectId, data: Partial<ICourseCategoryBase>): Promise<ICourseCategoryPopulated | null>; // Update accepts base, returns populated
// //     delete(id: Types.ObjectId): Promise<boolean>;
// // }


// // backend/src/interfaces/CourseCategoryRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { ICourseCategoryBase, ICourseCategoryPopulated } from './courseInterface';

// export interface ICourseCategoryRepository {
//     create(data: Partial<ICourseCategoryBase>): Promise<ICourseCategoryBase & Document>;
//     findAll(): Promise<ICourseCategoryPopulated[]>;
//     findById(id: string | Types.ObjectId): Promise<ICourseCategoryPopulated | null>;
//     update(id: Types.ObjectId, data: Partial<ICourseCategoryBase>): Promise<ICourseCategoryPopulated | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
// // }
// // backend/src/interfaces/courseCategoryRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { ICourseCategoryBase, ICourseCategoryPopulated, ICourseCategory } from './courseCategoryInterface';

// export interface ICourseCategoryRepository {
//     create(data: Partial<ICourseCategoryBase>): Promise<ICourseCategory>; // CHANGED
//     findAll(): Promise<ICourseCategoryPopulated[]>;
//     findById(id: string | Types.ObjectId): Promise<ICourseCategoryPopulated | null>;
//     update(id: Types.ObjectId, data: Partial<ICourseCategoryBase>): Promise<ICourseCategoryPopulated | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
// }

// backend/src/interfaces/courseCategoryRepositoryInterface.ts
import { Types, Document } from 'mongoose';
import { ICourseCategoryBase, ICourseCategory, ICourseCategoryPopulated } from './courseCategoryInterface';

export interface ICourseCategoryRepository {
    create(categoryData: Partial<ICourseCategoryBase>): Promise<ICourseCategory & Document>;
    findById(id: Types.ObjectId): Promise<(ICourseCategory & Document) | null>; // Or ICourseCategoryPopulated if always populated
    update(id: Types.ObjectId, updateData: Partial<ICourseCategoryBase>): Promise<(ICourseCategory & Document) | null>; // Or ICourseCategoryPopulated
    delete(id: Types.ObjectId): Promise<boolean>;
    findAll(): Promise<ICourseCategoryPopulated[]>; // Adjust this if not always populated
    findByName(name: string): Promise<(ICourseCategory & Document) | null>; // <<< ADD THIS LINE
}