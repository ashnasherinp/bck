

// // backend/src/controllers/adminCourseController.ts


import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../utils/dependecy-container';
import { ICourseService } from '../interfaces/courseserviceInterface';
import { ICourseCategoryService } from '../interfaces/courseCategoryServiceInterface';
import { ICreateCourseData } from '../interfaces/courseInterface';
import { Types } from 'mongoose';
import cloudinary from '../config/cloudinaryConfig';
import { AuthenticatedRequest } from '../types/express';
import AppError from '../utils/appError';
import { handleControllerError } from '../utils/handleControllerError';
import { UserRole } from '../interfaces/userInterface';

const container = DependencyContainer.getInstance();
const courseService: ICourseService = container.getCourseService();
const courseCategoryService: ICourseCategoryService = container.getCourseCategoryService();

// --- Category Management ---
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const categories = await courseCategoryService.getCategories();
        return res.status(200).json(categories);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error fetching categories');
    }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { name, description } = req.body;
        if (!name) {
            throw new AppError('Category name is required.', 400);
        }
        const creatorId = req.user._id;
        const creatorRole = req.user.role as UserRole;
        const newCategory = await courseCategoryService.createCategory(name, description, creatorId, creatorRole);
        return res.status(201).json(newCategory);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error creating category');
    }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid category ID format.', 400);
        }
        const categoryId = new Types.ObjectId(id);
        const editorId = req.user._id;
        const editorRole = req.user.role as UserRole;
        const updatedCategory = await courseCategoryService.updateCategory(categoryId, req.body, editorId, editorRole);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found or update failed.' });
        }
        return res.status(200).json(updatedCategory);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error updating category');
    }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid category ID format.', 400);
        }
        const categoryId = new Types.ObjectId(id);
        const deleterId = req.user._id;
        const deleterRole = req.user.role as UserRole;
        const deleted = await courseCategoryService.deleteCategory(categoryId, deleterId, deleterRole);
        if (!deleted) {
            return res.status(404).json({ message: 'Category not found or could not be deleted.' });
        }
        return res.status(204).send();
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error deleting category');
    }
};

export const createCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        console.log('[createCourse] req.file:', req.file);
        console.log('[createCourse] req.body:', req.body);
        console.log('[createCourse] FormData fields:', Object.keys(req.body));
        const { title, description, categoryId, level, price: priceString, discountPrice: discountPriceString } = req.body;
        const creatorId = req.user._id;
        const creatorRole = req.user.role as UserRole;

        if (!req.file) {
            throw new AppError('Course image file is required.', 400);
        }


        if (!req.file.buffer) {
            console.error('[createCourse] req.file.buffer is undefined:', req.file);
            throw new AppError('Course image buffer is missing.', 400);
        }

        let imageUrl: string | undefined;
        try {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'edupro_course_images',
                resource_type: 'image',
                quality: 'auto:low',
                fetch_format: 'auto',
            });
            imageUrl = uploadResult.secure_url;
            console.log('[createCourse] Cloudinary upload success:', imageUrl);
        } catch (uploadError: any) {
            console.error('[Cloudinary Upload Error]:', uploadError);
            throw new AppError('Failed to upload course image to Cloudinary.', 500);
        }

        const price = priceString ? parseFloat(priceString) : undefined;
        const discountPrice = discountPriceString ? parseFloat(discountPriceString) : undefined;

        if (!title || !description || !categoryId || !level || price === undefined || isNaN(price)) {
            throw new AppError('Missing required course fields (title, description, category, level, price).', 400);
        }

        if (!imageUrl) {
            throw new AppError('Course image URL is missing after upload attempt.', 500);
        }

        if (!Types.ObjectId.isValid(categoryId)) {
            throw new AppError('Invalid ID format for category.', 400);
        }

        if (discountPrice !== undefined && (isNaN(discountPrice) || discountPrice < 0)) {
            throw new AppError('Invalid discount price provided.', 400);
        }
        if (discountPrice !== undefined && discountPrice > price) {
            throw new AppError('Discount price cannot be greater than original price.', 400);
        }

        const courseData: ICreateCourseData = {
            title,
            description,
            categoryId: new Types.ObjectId(categoryId),
            level,
            price,
            discountPrice,
            imageUrl,
            isApproved: creatorRole === UserRole.Admin,
            creatorId,
        };

        const newCourse = await courseService.createCourse(courseData, creatorId, creatorRole);
        return res.status(201).json(newCourse);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error creating course by admin');
    }
};

export const updateCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid course ID format.', 400);
        }
        const courseId = new Types.ObjectId(id);
        const updateData: Partial<ICreateCourseData> = { ...req.body };

        if (req.file) {
            if (!req.file.buffer) {
                console.error('[updateCourse] req.file.buffer is undefined:', req.file);
                throw new AppError('Course image buffer is missing.', 400);
            }
            try {
                const b64 = Buffer.from(req.file.buffer).toString('base64');
                const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
                const uploadResult = await cloudinary.uploader.upload(dataURI, {
                    folder: 'edupro_course_images',
                    resource_type: 'image',
                    quality: 'auto:low',
                    fetch_format: 'auto',
                });
                updateData.imageUrl = uploadResult.secure_url;
                console.log('[updateCourse] Cloudinary upload success:', updateData.imageUrl);
            } catch (uploadError: any) {
                console.error('[Cloudinary Update Upload Error]:', uploadError);
                throw new AppError('Failed to upload new course image to Cloudinary during update.', 500);
            }
        }

        if (updateData.categoryId && !Types.ObjectId.isValid(updateData.categoryId)) {
            throw new AppError('Invalid category ID format.', 400);
        }

        if (updateData.price !== undefined) {
            const parsedPrice = parseFloat(updateData.price as any);
            if (isNaN(parsedPrice)) {
                throw new AppError('Invalid price provided for update.', 400);
            }
            updateData.price = parsedPrice;
        }
        if (updateData.discountPrice !== undefined) {
            const parsedDiscountPrice = parseFloat(updateData.discountPrice as any);
            if (isNaN(parsedDiscountPrice) || parsedDiscountPrice < 0) {
                throw new AppError('Invalid discount price provided for update.', 400);
            }
            updateData.discountPrice = parsedDiscountPrice;
        }

        if (updateData.price !== undefined && updateData.discountPrice !== undefined && updateData.discountPrice > updateData.price) {
            throw new AppError('Updated discount price cannot be greater than original price.', 400);
        }

        const editorId = req.user._id;
        const editorRole = req.user.role as UserRole;
        const updatedCourse = await courseService.updateCourse(courseId, updateData, editorId, editorRole);
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found or update failed.' });
        }
        return res.status(200).json(updatedCourse);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error updating course by admin');
    }
};

export const deleteCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid course ID format.', 400);
        }
        const courseId = new Types.ObjectId(id);
        const deleterId = req.user._id;
        const deleterRole = req.user.role as UserRole;
        const deleted = await courseService.deleteCourse(courseId, deleterId, deleterRole);
        if (!deleted) {
            return res.status(404).json({ message: 'Course not found or could not be deleted.' });
        }
        return res.status(204).send();
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error deleting course by admin');
    }
};

export const approveCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid course ID format.', 400);
        }
        const courseId = new Types.ObjectId(id);
        const adminId = req.user._id;
        const approvedCourse = await courseService.approveCourse(courseId, adminId);
        if (!approvedCourse) {
            return res.status(404).json({ message: 'Course not found or could not be approved.' });
        }
        return res.status(200).json({ message: 'Course approved successfully.', course: approvedCourse });
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error approving course');
    }
};

export const rejectCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid course ID format.', 400);
        }
        const courseId = new Types.ObjectId(id);
        const adminId = req.user._id;
        const rejectedCourse = await courseService.rejectCourse(courseId, adminId);
        if (!rejectedCourse) {
            return res.status(404).json({ message: 'Course not found or could not be rejected.' });
        }
        return res.status(200).json({ message: 'Course rejected successfully.', course: rejectedCourse });
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error rejecting course');
    }
};
