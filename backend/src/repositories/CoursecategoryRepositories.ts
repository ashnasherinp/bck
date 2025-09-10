

// backend/src/repositories/courseCategoryRepository.ts
import { Types, Document, Query } from 'mongoose';
import { CourseCategoryModel } from '../models/courseCategoryModel'; 
import { ICourseCategoryRepository } from '../interfaces/courseCategoryRepositoryInterface';
import { ICourseCategoryBase, ICourseCategory, ICourseCategoryPopulated } from '../interfaces/courseCategoryInterface';

export class CourseCategoryRepository implements ICourseCategoryRepository {
    async create(categoryData: Partial<ICourseCategoryBase>): Promise<ICourseCategory & Document> {
        const category = new CourseCategoryModel(categoryData);
        return await category.save();
    }

    async findById(id: Types.ObjectId): Promise<(ICourseCategory & Document) | null> {
    
        return await CourseCategoryModel.findById(id).exec();
    }

    async update(id: Types.ObjectId, updateData: Partial<ICourseCategoryBase>): Promise<(ICourseCategory & Document) | null> {
        return await CourseCategoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await CourseCategoryModel.deleteOne({ _id: id }).exec();
        return result.deletedCount === 1;
    }

    async findAll(): Promise<ICourseCategoryPopulated[]> {

        return await CourseCategoryModel.find().lean().exec() as ICourseCategoryPopulated[];
    }

    async findByName(name: string): Promise<(ICourseCategory & Document) | null> {

        return await CourseCategoryModel.findOne({ name }).exec();
    }
}