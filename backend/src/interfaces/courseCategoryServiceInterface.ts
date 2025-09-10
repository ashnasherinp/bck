
// // backend/src/interfaces/courseCategoryServiceInterface.ts
// import { Types } from 'mongoose';
// import { ICourseCategory, ICourseCategoryBase, ICourseCategoryPopulated } from './courseCategoryInterface';
// import { UserRole } from './userInterface'; // Make sure UserRole is imported

// export interface ICourseCategoryService {
//     createCategory(name: string, description: string, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<ICourseCategory>; // Return ICourseCategory (Document)
//     getCategories(): Promise<ICourseCategoryPopulated[]>; // Returns populated list
//     getCategoryById(id: string): Promise<ICourseCategoryPopulated | null>; // Accepts string ID, returns populated
//     updateCategory(id: string, updateData: Partial<ICourseCategoryBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<ICourseCategory | null>; // Accepts string ID, returns non-populated
//     deleteCategory(id: string, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean>;
// }

// backend/src/interfaces/courseCategoryServiceInterface.ts
import { Types } from 'mongoose';
import { ICourseCategory, ICourseCategoryBase, ICourseCategoryPopulated } from './courseCategoryInterface';
import { UserRole } from './userInterface';

export interface ICourseCategoryService {
    createCategory(name: string, description: string, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<ICourseCategory>;
    getCategories(): Promise<ICourseCategoryPopulated[]>;
    // Changed 'id: string' to 'id: Types.ObjectId'
    getCategoryById(id: Types.ObjectId): Promise<ICourseCategoryPopulated | null>;
    // Changed 'id: string' to 'id: Types.ObjectId'
    updateCategory(id: Types.ObjectId, updateData: Partial<ICourseCategoryBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<ICourseCategory | null>;
    // Changed 'id: string' to 'id: Types.ObjectId'
    deleteCategory(id: Types.ObjectId, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean>;
}