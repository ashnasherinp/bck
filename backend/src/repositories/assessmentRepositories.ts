

import { Types, Document } from 'mongoose';
import { AssessmentModel } from '../models/assessmentModel';

import { IAssessmentBase, IAssessmentPopulated, IAssessment } from '../interfaces/assessmentInterface';
import { IAssessmentRepository } from '../interfaces/assessmentRepositoryInterface';
import { IQuestionPopulated } from '../interfaces/questionInterface'; 

export class AssessmentRepository implements IAssessmentRepository {
    async create(assessmentData: Partial<IAssessmentBase>): Promise<IAssessment> {
        const assessment = new AssessmentModel(assessmentData);
        return (await assessment.save()) as IAssessment;
    }

    async findById(id: Types.ObjectId): Promise<IAssessment | null> {
        return await AssessmentModel.findById(id).exec() as IAssessment | null;
    }

    async update(id: Types.ObjectId, updateData: Partial<IAssessmentBase>): Promise<IAssessment | null> {
        return await AssessmentModel.findByIdAndUpdate(id, updateData, { new: true }).exec() as IAssessment | null;
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await AssessmentModel.deleteOne({ _id: id }).exec();
        return result.deletedCount === 1;
    }

    async deleteMany(query: Record<string, any>): Promise<number> {
        const result = await AssessmentModel.deleteMany(query).exec();
        return result.deletedCount || 0;
    }


    async findByCourseId(courseId: Types.ObjectId): Promise<IAssessment[]> {
        return await AssessmentModel.find({ courseId, lessonId: { $exists: false } }).sort({ title: 1 }).exec() as IAssessment[];
    }

    async findByLessonId(lessonId: Types.ObjectId): Promise<IAssessment[]> {
        return await AssessmentModel.find({ lessonId }).sort({ title: 1 }).exec() as IAssessment[];
    }

    async findByCourseOrLessonId(courseId?: Types.ObjectId, lessonId?: Types.ObjectId): Promise<IAssessment[]> {
        const query: any = {};
        if (courseId) {
            query.courseId = courseId;
            query.lessonId = { $exists: false };
        }
        if (lessonId) {
            query.lessonId = lessonId;
            delete query.courseId;
        }
        if (!courseId && !lessonId) {
            return [];
        }
        return await AssessmentModel.find(query).sort({ title: 1 }).exec() as IAssessment[];
    }

    async findByIdPopulated(id: Types.ObjectId): Promise<IAssessmentPopulated | null> {
        const result = await AssessmentModel.findById(id)
            .populate<{ questions: IQuestionPopulated[] }>({
                path: 'questions',
                model: 'Question',
                options: { sort: { orderIndex: 1 } }
            })
            .lean()
            .exec();

        return result as unknown as IAssessmentPopulated | null;
    }

    async findByTitleAndCourse(title: string, courseId: Types.ObjectId): Promise<IAssessment | null> {
        return await AssessmentModel.findOne({ title, courseId, lessonId: { $exists: false } }).exec() as IAssessment | null;
    }

    async findByTitleAndLesson(title: string, lessonId: Types.ObjectId): Promise<IAssessment | null> {
        return await AssessmentModel.findOne({ title, lessonId }).exec() as IAssessment | null;
    }

    async addQuestionToAssessment(assessmentId: Types.ObjectId, questionId: Types.ObjectId): Promise<boolean> {
        const result = await AssessmentModel.updateOne(
            { _id: assessmentId, 'questions': { $ne: questionId } },
            { $addToSet: { questions: questionId } }
        ).exec();
        return result.modifiedCount === 1;
    }

    async removeQuestionFromAssessment(assessmentId: Types.ObjectId, questionId: Types.ObjectId): Promise<boolean> {
        const result = await AssessmentModel.updateOne(
            { _id: assessmentId },
            { $pull: { questions: questionId } }
        ).exec();
        return result.modifiedCount === 1;
    }
}