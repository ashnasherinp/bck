// // backend/src/interfaces/lessonRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { ILessonBase, ILessonPopulated } from './lessonInterface';

// export interface ILessonRepository {
//     create(lessonData: Partial<ILessonBase>): Promise<ILessonBase & Document>;
//     findById(id: Types.ObjectId): Promise<(ILessonBase & Document) | null>;
//     update(id: Types.ObjectId, updateData: Partial<ILessonBase>): Promise<(ILessonBase & Document) | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
//     findByCourseId(courseId: Types.ObjectId): Promise<(ILessonBase & Document)[]>;
//     findByCourseIdPopulated(courseId: Types.ObjectId): Promise<ILessonPopulated[]>;
//     findLastOrderIndex(courseId: Types.ObjectId): Promise<number>;
//     findByCourseAndTitle(courseId: Types.ObjectId, title: string): Promise<(ILessonBase & Document) | null>;
//     addMaterialToLesson(lessonId: Types.ObjectId, materialId: Types.ObjectId): Promise<boolean>;
//     removeMaterialFromLesson(lessonId: Types.ObjectId, materialId: Types.ObjectId): Promise<boolean>;
//     addAssessmentToLesson(lessonId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
//     removeAssessmentFromLesson(lessonId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
// }

// // backend/src/interfaces/lessonRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { ILessonBase, ILessonPopulated } from './lessonInterface';

// export interface ILessonRepository {
//     create(lessonData: Partial<ILessonBase>): Promise<ILessonBase & Document>;
//     findById(id: Types.ObjectId): Promise<(ILessonBase & Document) | null>;
//     update(id: Types.ObjectId, updateData: Partial<ILessonBase>): Promise<(ILessonBase & Document) | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
//     deleteMany(query: Record<string, any>): Promise<number>; // ADDED THIS LINE
//     findByCourseId(courseId: Types.ObjectId): Promise<(ILessonBase & Document)[]>;
//     findByCourseIdPopulated(courseId: Types.ObjectId): Promise<ILessonPopulated[]>;
//     findLastOrderIndex(courseId: Types.ObjectId): Promise<number>;
//     findByCourseAndTitle(courseId: Types.ObjectId, title: string): Promise<(ILessonBase & Document) | null>;
//     addMaterialToLesson(lessonId: Types.ObjectId, materialId: Types.ObjectId): Promise<boolean>;
//     removeMaterialFromLesson(lessonId: Types.ObjectId, materialId: Types.ObjectId): Promise<boolean>;
//     addAssessmentToLesson(lessonId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
//     removeAssessmentFromLesson(lessonId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
// }

// backend/src/interfaces/lessonRepositoryInterface.ts
import { Types, Document } from 'mongoose';
// FIX: Ensure ILesson is imported, and remove ILessonBase from the import if only ILesson is used for document types.
import { ILessonBase, ILesson, ILessonPopulated } from './lessonInterface'; // Keep ILessonBase as Partial<ILessonBase> is used

// FIX: Add 'export' if it's missing (it was mentioned in a previous error)
export interface ILessonRepository {
    // FIX: Change return types from (ILessonBase & Document) to ILesson
    create(lessonData: Partial<ILessonBase>): Promise<ILesson>;
    findById(id: Types.ObjectId): Promise<ILesson | null>;
    // FIX: Add findByIdPopulated
    findByIdPopulated(id: Types.ObjectId): Promise<ILessonPopulated | null>;
    update(id: Types.ObjectId, updateData: Partial<ILessonBase>): Promise<ILesson | null>;
    delete(id: Types.ObjectId): Promise<boolean>;
    deleteMany(query: Record<string, any>): Promise<number>;
    findByCourseId(courseId: Types.ObjectId): Promise<ILesson[]>; // FIX: Change to ILesson[]
    findByCourseIdPopulated(courseId: Types.ObjectId): Promise<ILessonPopulated[]>;
    findLastOrderIndex(courseId: Types.ObjectId): Promise<number>;
    findByCourseAndTitle(courseId: Types.ObjectId, title: string): Promise<ILesson | null>; // FIX: Change to ILesson
    addMaterialToLesson(lessonId: Types.ObjectId, materialId: Types.ObjectId): Promise<boolean>;
    removeMaterialFromLesson(lessonId: Types.ObjectId, materialId: Types.ObjectId): Promise<boolean>;
    addAssessmentToLesson(lessonId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
    removeAssessmentFromLesson(lessonId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
}