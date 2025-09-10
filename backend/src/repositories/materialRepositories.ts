

import { Types, Document } from 'mongoose';
import { MaterialModel } from '../models/materialModel';
import { IMaterialBase, IMaterialPopulated } from '../interfaces/materialInterface';
import { IMaterialRepository } from '../interfaces/materialRepositoryInterface';

export class MaterialRepository implements IMaterialRepository {
    async create(materialData: Partial<IMaterialBase>): Promise<IMaterialBase & Document> {
        const material = new MaterialModel(materialData);
        return await material.save();
    }

    async findById(id: Types.ObjectId): Promise<(IMaterialBase & Document) | null> {
        return await MaterialModel.findById(id).exec();
    }

    async update(id: Types.ObjectId, updateData: Partial<IMaterialBase>): Promise<(IMaterialBase & Document) | null> {
        return await MaterialModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await MaterialModel.deleteOne({ _id: id }).exec();
        return result.deletedCount === 1;
    }

    async deleteMany(query: Record<string, any>): Promise<number> {
        const result = await MaterialModel.deleteMany(query).exec();
        return result.deletedCount || 0;
    }

    async findByLessonId(lessonId: Types.ObjectId): Promise<(IMaterialBase & Document)[]> {
        return await MaterialModel.find({ lessonId }).sort({ orderIndex: 1 }).exec();
    }

    async findByLessonIdPopulated(lessonId: Types.ObjectId): Promise<IMaterialPopulated[]> {
        const materials = await MaterialModel.find({ lessonId })
            .sort({ orderIndex: 1 })
            .lean()
            .exec();
        return materials as unknown as IMaterialPopulated[];
    }

    async findLastOrderIndex(lessonId: Types.ObjectId): Promise<number> {
        const lastMaterial = await MaterialModel.findOne({ lessonId }).sort({ orderIndex: -1 }).exec();
        return lastMaterial ? lastMaterial.orderIndex : -1;
    }

    async findByLessonAndTitle(lessonId: Types.ObjectId, title: string): Promise<(IMaterialBase & Document) | null> {
        return await MaterialModel.findOne({ lessonId, title }).exec();
    }
}