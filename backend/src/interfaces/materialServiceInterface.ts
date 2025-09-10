// // backend/src/interfaces/materialServiceInterface.ts
// import { Types } from 'mongoose';
// import { IMaterialBase, ICreateMaterialData, MaterialType } from './materialInterface';

// export interface IMaterialService {
//     createMaterial(data: ICreateMaterialData, creatorId: Types.ObjectId, creatorRole: string): Promise<IMaterialBase>;
//     getMaterialById(materialId: string): Promise<IMaterialBase | null>;
//     updateMaterial(materialId: string, updateData: Partial<IMaterialBase>, editorId: Types.ObjectId, editorRole: string): Promise<IMaterialBase | null>;
//     deleteMaterial(materialId: string, deleterId: Types.ObjectId, deleterRole: string): Promise<boolean>;
//     getMaterialsByLessonId(lessonId: string): Promise<IMaterialBase[]>;
//     uploadMaterialFile(file: Express.Multer.File, type: MaterialType): Promise<string>; // Returns URL
// }

// backend/src/interfaces/materialServiceInterface.ts
import { Types } from 'mongoose';
import { IMaterialBase, ICreateMaterialData, MaterialType } from './materialInterface';
import { UserRole } from './userInterface'; // FIX: Import UserRole

export interface IMaterialService {
    createMaterial(data: ICreateMaterialData, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<IMaterialBase>; // FIX: Use UserRole
    getMaterialById(materialId: string): Promise<IMaterialBase | null>;
    updateMaterial(materialId: string, updateData: Partial<IMaterialBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<IMaterialBase | null>; // FIX: Use UserRole
    deleteMaterial(materialId: string, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean>; // FIX: Use UserRole
    getMaterialsByLessonId(lessonId: string): Promise<IMaterialBase[]>; // Assuming this returns non-populated base materials
    uploadMaterialFile(file: Express.Multer.File, type: MaterialType): Promise<string>; // Returns URL
}