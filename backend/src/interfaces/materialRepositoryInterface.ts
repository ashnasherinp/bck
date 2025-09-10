// // backend/src/interfaces/materialRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { IMaterialBase, IMaterialPopulated } from './materialInterface';

// export interface IMaterialRepository {
//     create(materialData: Partial<IMaterialBase>): Promise<IMaterialBase & Document>;
//     findById(id: Types.ObjectId): Promise<(IMaterialBase & Document) | null>;
//     update(id: Types.ObjectId, updateData: Partial<IMaterialBase>): Promise<(IMaterialBase & Document) | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
//     findByLessonId(lessonId: Types.ObjectId): Promise<(IMaterialBase & Document)[]>;
//     findByLessonIdPopulated(lessonId: Types.ObjectId): Promise<IMaterialPopulated[]>;
//     findLastOrderIndex(lessonId: Types.ObjectId): Promise<number>;
//     findByLessonAndTitle(lessonId: Types.ObjectId, title: string): Promise<(IMaterialBase & Document) | null>;
// }

import { Types, Document } from 'mongoose';
import { IMaterialBase, IMaterialPopulated } from './materialInterface';

export interface IMaterialRepository {
    create(materialData: Partial<IMaterialBase>): Promise<IMaterialBase & Document>;
    findById(id: Types.ObjectId): Promise<(IMaterialBase & Document) | null>;
    update(id: Types.ObjectId, updateData: Partial<IMaterialBase>): Promise<(IMaterialBase & Document) | null>;
    delete(id: Types.ObjectId): Promise<boolean>;
    deleteMany(query: Record<string, any>): Promise<number>; // Added this
    findByLessonId(lessonId: Types.ObjectId): Promise<(IMaterialBase & Document)[]>;
    findByLessonIdPopulated(lessonId: Types.ObjectId): Promise<IMaterialPopulated[]>;
    findLastOrderIndex(lessonId: Types.ObjectId): Promise<number>;
    findByLessonAndTitle(lessonId: Types.ObjectId, title: string): Promise<(IMaterialBase & Document) | null>;
}