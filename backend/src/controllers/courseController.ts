

// backend/controllers/courseController.ts
import { Request, Response, NextFunction } from 'express';

import { UserRole, IAuthenticatedUserPayload, IUser } from '../interfaces/userInterface';
import { Types } from 'mongoose';
import { DependencyContainer } from '../utils/dependecy-container';
import { ICreateCourseData, ICoursePopulated, ICourseBase } from '../interfaces/courseInterface';
import { ICourseService } from '../interfaces/courseserviceInterface';
import { AuthenticatedRequest } from '../types/express';
import AppError from '../utils/appError';
import { handleControllerError } from '../utils/handleControllerError';
import { ICourseCategory } from '../interfaces/courseCategoryInterface'; 

import cloudinary from '../config/cloudinaryConfig';
const container = DependencyContainer.getInstance();
const courseService: ICourseService = container.getCourseService();

export const getCourses = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const user = req.user;
        let courses: ICoursePopulated[];

        if (!user) {
            courses = await courseService.getApprovedCourses();
            return res.status(200).json(courses);
        }

        const userRole: UserRole = user.role as UserRole;

        if (userRole === UserRole.Admin) {
            courses = await courseService.getAllCourses();
        } else if (userRole === UserRole.Teacher) {
            courses = await courseService.getCoursesByCreator(user._id);
        } else if (userRole === UserRole.Learner) {
            courses = await courseService.getApprovedCourses();
        } else {
            throw new AppError('Access denied: Invalid user role.', 403);
        }

        return res.status(200).json(courses);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error in getCourses');
    }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid course ID format', 400);
        }
        const courseId = new Types.ObjectId(id);
        const course = await courseService.getCourseById(courseId);
        if (!course) {
            throw new AppError('Course not found', 404);
        }
        return res.json(course);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error in getCourseById');
    }
};

export const getEnrolledCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            throw new AppError('Authentication required to view enrolled courses.', 401);
        }
        const userId = user._id;
        const enrolledCourses = await courseService.getEnrolledCoursesForUser(userId);
        return res.json(enrolledCourses);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error in getEnrolledCourses');
    }
};

export const createCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const creatorId = req.user._id; // Guaranteed to exist by AuthenticatedRequest
        const creatorRole = req.user.role as UserRole; // Guaranteed to exist and cast to UserRole enum

        const { title, description, categoryId, level, imageUrl, price, discountPrice } = req.body;

        if (!title || !description || !categoryId || !level || price === undefined) {
            throw new AppError('Missing required course fields (title, description, categoryId, level, or price)', 400);
        }

        if (!Types.ObjectId.isValid(categoryId)) {
            throw new AppError('Invalid category ID format', 400);
        }

        const courseData: ICreateCourseData = {
            title,
            description,
            categoryId: new Types.ObjectId(categoryId),
            creatorId,
            level,
            price: price,
            discountPrice: discountPrice,
            imageUrl
        
        };

       
        const newCourse = await courseService.createCourse(courseData, creatorId, creatorRole);
     

        return res.status(201).json(newCourse);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error in createCourse');
    }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const categories = await courseService.getCategories();
        return res.status(200).json(categories);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error in getCategories');
    }
};

export const updateCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            throw new AppError('Invalid course ID format', 400);
        }
        const courseId = new Types.ObjectId(req.params.id);
        const userId = req.user._id;
        const userRole = req.user.role as UserRole;

        const updateData: Partial<ICourseBase> = req.body;

  
        if (req.file) {
            if (!req.file.buffer) {
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
            } catch (uploadError: any) {
                throw new AppError('Failed to upload new course image.', 500);
            }
        }

       if (updateData.categoryId && !Types.ObjectId.isValid(updateData.categoryId)) {
    throw new AppError('Invalid category ID format.', 400);
}

        if (updateData.price !== undefined) {
            const parsedPrice = parseFloat(updateData.price as any);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
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

        const updatedCourse = await courseService.updateCourse(courseId, updateData, userId, userRole);
        if (!updatedCourse) {
            throw new AppError('Course not found or update failed.', 404);
        }
        return res.status(200).json(updatedCourse);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error in updateCourse');
    }
};

export const deleteCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            throw new AppError('Invalid course ID format', 400);
        }
        const courseId = new Types.ObjectId(req.params.id);
        const userId = req.user._id;
        const userRole = req.user.role as UserRole;

        if (!userId) {
            throw new AppError('Authentication required to delete courses.', 401);
        }

        const deleted = await courseService.deleteCourse(courseId, userId, userRole);
        if (!deleted) {
            throw new AppError('Course not found or could not be deleted', 404);
        }
        return res.status(204).send();
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error in deleteCourse');
    }
};
