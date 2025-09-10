
// backend/src/repositories/questionRepository.ts
import { Types } from 'mongoose';
import { IQuestionRepository } from '../interfaces/questionRepositoryInterface';
import { IQuestion, IQuestionPopulated } from '../interfaces/questionInterface';
import { QuestionModel } from '../models/questionModel';

export class QuestionRepository implements IQuestionRepository {
    async create(questionData: Partial<IQuestion>): Promise<IQuestion> {
        const question = new QuestionModel(questionData);
        return await question.save() as unknown as IQuestion;
    }

    async findById(id: Types.ObjectId): Promise<IQuestion | null> {
        return await QuestionModel.findById(id).lean(true) as unknown as IQuestion | null;
    }

    async findByIdPopulated(id: Types.ObjectId): Promise<IQuestionPopulated | null> {
        return await QuestionModel.findById(id)
            .populate('assessmentId', 'title courseId')
            .lean(true) as unknown as IQuestionPopulated | null;
    }

    async findByAssessmentId(assessmentId: Types.ObjectId): Promise<IQuestion[]> {
        return await QuestionModel.find({ assessmentId })
            .sort({ orderIndex: 1 })
            .lean(true) as unknown as IQuestion[];
    }

    async update(id: Types.ObjectId, updateData: Partial<IQuestion>): Promise<IQuestion | null> {
        return await QuestionModel.findByIdAndUpdate(id, updateData, { new: true })
            .lean(true) as unknown as IQuestion | null;
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await QuestionModel.findByIdAndDelete(id);
        return !!result;
    }

    async findLastOrderIndex(assessmentId: Types.ObjectId): Promise<number> {
        const lastQuestion = await QuestionModel.findOne({ assessmentId })
            .sort({ orderIndex: -1 })
            .lean(true);
        return lastQuestion?.orderIndex || 0;
    }

    async deleteMany(query: { assessmentId: Types.ObjectId }): Promise<boolean> {
        const result = await QuestionModel.deleteMany({ assessmentId: query.assessmentId });
        return result.deletedCount > 0;
    }
}