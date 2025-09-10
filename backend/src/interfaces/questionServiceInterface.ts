// // backend/src/interfaces/questionServiceInterface.ts
// import { Types } from 'mongoose';
// import { IQuestionBase, ICreateQuestionData } from './questionInterface';
// import { AuthenticatedRequest } from '../types/express'; // Assuming this path
// import { QuestionType } from './questionInterface';

// export interface IQuestionService {
//     createQuestion(data: ICreateQuestionData, creatorId: Types.ObjectId, creatorRole: string): Promise<IQuestionBase>;
//     getQuestionById(questionId: string): Promise<IQuestionBase | null>;
//     updateQuestion(questionId: string, updateData: Partial<IQuestionBase>, editorId: Types.ObjectId, editorRole: string): Promise<IQuestionBase | null>;
//     deleteQuestion(questionId: string, deleterId: Types.ObjectId, deleterRole: string): Promise<boolean>;
//     getQuestionsByAssessmentId(assessmentId: string): Promise<IQuestionBase[]>;
//     uploadQuestionFile(file: Express.Multer.File, type: QuestionType): Promise<string>; // Returns URL for image/PDF
// }
// backend/src/interfaces/questionServiceInterface.ts
import { Types } from 'mongoose';
import { IQuestionBase, IQuestion, IQuestionPopulated, ICreateQuestionData } from './questionInterface';

export interface IQuestionService {
    createQuestion(
        questionData: ICreateQuestionData,
        creatorId: Types.ObjectId,
        creatorRole: string
    ): Promise<IQuestion>;
    findById(id: Types.ObjectId): Promise<IQuestion | null>;
    findByAssessmentId(assessmentId: Types.ObjectId): Promise<IQuestion[]>;
    updateQuestion(
        questionId: string,
        updateData: Partial<IQuestionBase>,
        editorId: Types.ObjectId,
        editorRole: string
    ): Promise<IQuestion | null>;
    deleteQuestion(
        questionId: string,
        deleterId: Types.ObjectId,
        deleterRole: string
    ): Promise<boolean>;
    findLastOrderIndex(assessmentId: Types.ObjectId): Promise<number>;
    uploadQuestionFile(file: Express.Multer.File, type: string): Promise<string>;
}