

// backend/src/services/courseCategoryService.ts
import { Types, Document } from 'mongoose';
import { ICourseCategoryService } from '../interfaces/courseCategoryServiceInterface';
import { ICourseCategoryRepository } from '../interfaces/courseCategoryRepositoryInterface';
import { ICourseCategory, ICourseCategoryPopulated, ICourseCategoryBase } from '../interfaces/courseCategoryInterface';
import AppError from '../utils/appError';
import { CourseModel } from '../models/courseModel';
import { UserRole } from '../interfaces/userInterface';

export class CourseCategoryService implements ICourseCategoryService {
    private categoryRepository: ICourseCategoryRepository;

    constructor(categoryRepository: ICourseCategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async createCategory(name: string, description: string, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<ICourseCategory> {
        if (creatorRole !== UserRole.Admin) {
            throw new AppError('Unauthorized: Only administrators can create categories', 403);
        }

        const existingCategory = await this.categoryRepository.findByName(name);
        if (existingCategory) {
            throw new AppError('Category with this name already exists', 409);
        }

        const newCategory = await this.categoryRepository.create({ name, description });
        return newCategory;
    }

    async getCategories(): Promise<ICourseCategoryPopulated[]> {
        return await this.categoryRepository.findAll();
    }


    async getCategoryById(id: Types.ObjectId): Promise<ICourseCategory | null> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
        return null;
    }
    return category; 
}

    async updateCategory(id: Types.ObjectId, updateData: Partial<ICourseCategoryBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<ICourseCategory | null> {
        // if (!Types.ObjectId.isValid(id)) { 
        //     throw new AppError('Invalid Category ID', 400);
        // }
        if (editorRole !== UserRole.Admin) {
            throw new AppError('Unauthorized: Only administrators can update categories', 403);
        }


        const category = await this.categoryRepository.findById(id); 
        if (!category) {
            throw new AppError('Category not found', 404);
        }

        if (updateData.name && updateData.name !== category.name) {
            const existing = await this.categoryRepository.findByName(updateData.name);
            if (existing && !existing._id.equals(id)) {
                throw new AppError('Category with this name already exists', 409);
            }
        }

        return await this.categoryRepository.update(id, updateData); 
    }


    async deleteCategory(id: Types.ObjectId, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean> {
        // if (!Types.ObjectId.isValid(id)) {
        //     throw new AppError('Invalid Category ID', 400);
        // }
        if (deleterRole !== UserRole.Admin) {
            throw new AppError('Unauthorized: Only administrators can delete categories', 403);
        }

        const category = await this.categoryRepository.findById(id); 
        if (!category) {
            throw new AppError('Category not found', 404);
        }

        const coursesCount = await CourseModel.countDocuments({ categoryId: id }).exec();
        if (coursesCount > 0) {
            throw new AppError('Cannot delete category: Courses are associated with it. Please reassign or delete associated courses first.', 400);
        }

        const deleted = await this.categoryRepository.delete(id);
        if (!deleted) {
            throw new AppError('Failed to delete category', 500);
        }
        return deleted;
    }
}