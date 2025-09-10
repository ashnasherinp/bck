
// // backend/src/interfaces/questionRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// // FIX: Import IQuestion directly, as it includes Document and _id
// import { IQuestionBase, IQuestion, IQuestionPopulated } from './questionInterface';

// export interface IQuestionRepository {
//     // FIX: Change return type to IQuestion
//     create(questionData: Partial<IQuestionBase>): Promise<IQuestion>;
//     // FIX: Change return type to IQuestion
//     findById(id: Types.ObjectId): Promise<IQuestion | null>;
//     // FIX: Change return type to IQuestion
//     update(id: Types.ObjectId, updateData: Partial<IQuestionBase>): Promise<IQuestion | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
//     // FIX: Change return type to IQuestion[]
//     findByAssessmentId(assessmentId: Types.ObjectId): Promise<IQuestion[]>;
//     findByIdPopulated(id: Types.ObjectId): Promise<IQuestionPopulated | null>;
//     findLastOrderIndex(assessmentId: Types.ObjectId): Promise<number>;
// }

// backend/src/interfaces/questionRepositoryInterface.ts
import { Types } from 'mongoose';
import { IQuestion, IQuestionPopulated } from './questionInterface';

export interface IQuestionRepository {
    create(questionData: Partial<IQuestion>): Promise<IQuestion>;
    findById(id: Types.ObjectId): Promise<IQuestion | null>;
    update(id: Types.ObjectId, updateData: Partial<IQuestion>): Promise<IQuestion | null>;
    delete(id: Types.ObjectId): Promise<boolean>;
    findByAssessmentId(assessmentId: Types.ObjectId): Promise<IQuestion[]>;
    findByIdPopulated(id: Types.ObjectId): Promise<IQuestionPopulated | null>;
    findLastOrderIndex(assessmentId: Types.ObjectId): Promise<number>;
    deleteMany(query: { assessmentId: Types.ObjectId }): Promise<boolean>; // Add deleteMany
}