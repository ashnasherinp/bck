import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../utils/dependecy-container';
import { ILessonService } from '../interfaces/lessonServiceInterface';
import { AuthenticatedRequest } from '../types/express';
import AppError from '../utils/appError';
import { handleControllerError } from '../utils/handleControllerError';
import { UserRole } from '../interfaces/userInterface';
import { Types } from 'mongoose';

const container = DependencyContainer.getInstance();
const lessonService: ILessonService = container.getLessonService();

export const createLesson = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { courseId, title, description, orderIndex, isPublished } = req.body;
        const creatorId = req.user._id;
        const creatorRole = req.user.role as UserRole;

        if (!courseId || !title || !Types.ObjectId.isValid(courseId)) {
            throw new AppError('Course ID and title are required, and courseId must be a valid ObjectId.', 400);
        }

        const lessonData = {
            courseId: new Types.ObjectId(courseId),
            title,
            description,
            orderIndex: orderIndex ? parseInt(orderIndex) : undefined,
            isPublished: isPublished === true || isPublished === 'true',
        };

        const newLesson = await lessonService.createLesson(lessonData, creatorId, creatorRole);
        return res.status(201).json(newLesson);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error creating lesson');
    }
};

export const getLessonsByCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { courseId } = req.params;
        if (!Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid Course ID', 400);
        }
        const lessons = await lessonService.getLessonsByCourseId(courseId);
        return res.status(200).json(lessons);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error fetching lessons');
    }
};

export const updateLesson = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { lessonId } = req.params;
        const { title, description, orderIndex, isPublished } = req.body;
        const editorId = req.user._id;
        const editorRole = req.user.role as UserRole;

        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }

        const updateData = {
            title,
            description,
            orderIndex: orderIndex ? parseInt(orderIndex) : undefined,
            isPublished: isPublished !== undefined ? isPublished : undefined,
        };

        const updatedLesson = await lessonService.updateLesson(lessonId, updateData, editorId, editorRole);
        if (!updatedLesson) {
            throw new AppError('Lesson not found or update failed', 404);
        }
        return res.status(200).json(updatedLesson);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error updating lesson');
    }
};

export const deleteLesson = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { lessonId } = req.params;
        const deleterId = req.user._id;
        const deleterRole = req.user.role as UserRole;

        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }

        const deleted = await lessonService.deleteLesson(lessonId, deleterId, deleterRole);
        if (!deleted) {
            throw new AppError('Lesson not found or could not be deleted', 404);
        }
        return res.status(204).send();
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error deleting lesson');
    }
};

export const publishLesson = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { lessonId } = req.params;
        const adminId = req.user._id;

        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }

        const updatedLesson = await lessonService.publishLesson(lessonId, adminId);
        if (!updatedLesson) {
            throw new AppError('Lesson not found or could not be published', 404);
        }
        return res.status(200).json(updatedLesson);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error publishing lesson');
    }
};

export const unpublishLesson = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { lessonId } = req.params;
        const adminId = req.user._id;

        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }

        const updatedLesson = await lessonService.unpublishLesson(lessonId, adminId);
        if (!updatedLesson) {
            throw new AppError('Lesson not found or could not be unpublished', 404);
        }
        return res.status(200).json(updatedLesson);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error unpublishing lesson');
    }
};
