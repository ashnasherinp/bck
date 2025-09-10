
// backend/src/repositories/lessonRepositories.ts
import { Types, Document } from 'mongoose';
import { LessonModel } from '../models/lessonModel';
import { ILessonBase, ILesson, ILessonPopulated } from '../interfaces/lessonInterface';
import { ILessonRepository } from '../interfaces/lessonRepositoryInterface';

// import { IMaterial } from '../interfaces/materialInterface';
// import { IAssessment } from '../interfaces/assessmentInterface';
// import { IQuestion } from '../interfaces/questionInterface';

export class LessonRepository implements ILessonRepository {
    async create(lessonData: Partial<ILessonBase>): Promise<ILesson> {
        const lesson = new LessonModel(lessonData);
        return (await lesson.save()) as ILesson;
    }

    async findById(id: Types.ObjectId): Promise<ILesson | null> {
        return await LessonModel.findById(id).exec() as ILesson | null;
    }

    async findByIdPopulated(id: Types.ObjectId): Promise<ILessonPopulated | null> {
        const lesson = await LessonModel.findById(id)
            .populate({
                path: 'materials',
                model: 'Material',
                options: { sort: { orderIndex: 1 } }
            })
            .populate({
                path: 'assessments',
                model: 'Assessment',
                populate: {
                    path: 'questions',
                    model: 'Question',
                    options: { sort: { orderIndex: 1 } }
                },
                options: { sort: { title: 1 } }
            })

            // .populate({
            //     path: 'courseId',
            //     model: 'Course',
            // })
            .lean()
            .exec();

        return lesson as unknown as ILessonPopulated | null;
    }

    async update(id: Types.ObjectId, updateData: Partial<ILessonBase>): Promise<ILesson | null> {
        return await LessonModel.findByIdAndUpdate(id, updateData, { new: true }).exec() as ILesson | null;
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await LessonModel.deleteOne({ _id: id }).exec();
        return result.deletedCount === 1;
    }

    async deleteMany(query: Record<string, any>): Promise<number> {
        const result = await LessonModel.deleteMany(query).exec();
        return result.deletedCount || 0;
    }

    async findByCourseId(courseId: Types.ObjectId): Promise<ILesson[]> {
        return await LessonModel.find({ courseId }).sort({ orderIndex: 1 }).exec() as ILesson[];
    }

    async findByCourseIdPopulated(courseId: Types.ObjectId): Promise<ILessonPopulated[]> {
        const lessons = await LessonModel.find({ courseId })
            .populate({
                path: 'materials',
                model: 'Material',
                options: { sort: { orderIndex: 1 } }
            })
            .populate({
                path: 'assessments',
                model: 'Assessment',
                populate: {
                    path: 'questions',
                    model: 'Question',
                    options: { sort: { orderIndex: 1 } }
                },
                options: { sort: { title: 1 } }
            })
   
            // .populate({
            //     path: 'courseId',
            //     model: 'Course',
            // })
            .sort({ orderIndex: 1 })
            .lean()
            .exec();

        return lessons as unknown as ILessonPopulated[];
    }

    async findLastOrderIndex(courseId: Types.ObjectId): Promise<number> {
        const lastLesson = await LessonModel.findOne({ courseId }).sort({ orderIndex: -1 }).exec();
        return lastLesson ? lastLesson.orderIndex : -1;
    }

    async findByCourseAndTitle(courseId: Types.ObjectId, title: string): Promise<ILesson | null> {
        return await LessonModel.findOne({ courseId, title }).exec() as ILesson | null;
    }

    async addMaterialToLesson(lessonId: Types.ObjectId, materialId: Types.ObjectId): Promise<boolean> {
        const result = await LessonModel.updateOne(
            { _id: lessonId, 'materials': { $ne: materialId } },
            { $addToSet: { materials: materialId } }
        ).exec();
        return result.modifiedCount === 1;
    }

    async removeMaterialFromLesson(lessonId: Types.ObjectId, materialId: Types.ObjectId): Promise<boolean> {
        const result = await LessonModel.updateOne(
            { _id: lessonId },
            { $pull: { materials: materialId } }
        ).exec();
        return result.modifiedCount === 1;
    }

    async addAssessmentToLesson(lessonId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean> {
        const result = await LessonModel.updateOne(
            { _id: lessonId, 'assessments': { $ne: assessmentId } },
            { $addToSet: { assessments: assessmentId } }
        ).exec();
        return result.modifiedCount === 1;
    }

    async removeAssessmentFromLesson(lessonId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean> {
        const result = await LessonModel.updateOne(
            { _id: lessonId },
            { $pull: { assessments: assessmentId } }
        ).exec();
        return result.modifiedCount === 1;
    }
}