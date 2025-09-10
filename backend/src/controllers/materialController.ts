

import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../utils/dependecy-container';
import { IMaterialService } from '../interfaces/materialServiceInterface';
import { AuthenticatedRequest } from '../types/express';
import AppError from '../utils/appError';
import { handleControllerError } from '../utils/handleControllerError';
import { UserRole } from '../interfaces/userInterface';
import { Types } from 'mongoose';
import cloudinary from '../config/cloudinaryConfig';
import { ICreateMaterialData, MaterialType } from '../interfaces/materialInterface';

const container = DependencyContainer.getInstance();
const materialService: IMaterialService = container.getMaterialService();

export const createMaterial = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { lessonId, title, type, description } = req.body;
        const creatorId = req.user._id;
        const creatorRole = req.user.role as UserRole;

        console.log('[createMaterial] FormData received:', { lessonId, title, type, description, file: req.file?.originalname });

        if (!lessonId || !title || !type || !Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Lesson ID, title, and type are required, and lessonId must be a valid ObjectId.', 400);
        }

        if (!req.file) {
            throw new AppError('Material file is required.', 400);
        }

        if (!req.file.buffer) {
            console.error('[createMaterial] req.file.buffer is undefined:', req.file);
            throw new AppError('Material file buffer is missing.', 400);
        }

        const allowedMimeTypes: { [key in MaterialType]?: string[] } = {
            [MaterialType.Image]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            [MaterialType.Video]: ['video/mp4', 'video/webm', 'video/quicktime'],
            [MaterialType.PDF]: ['application/pdf'],
            [MaterialType.PPT]: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
            [MaterialType.Audio]: ['audio/mpeg', 'audio/wav'],
            [MaterialType.Text]: ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        };

        if (!Object.values(MaterialType).includes(type)) {
            throw new AppError(`Invalid material type. Allowed types: ${Object.values(MaterialType).join(', ')}`, 400);
        }

        if (allowedMimeTypes[type as MaterialType] && !allowedMimeTypes[type as MaterialType]!.includes(req.file.mimetype)) {
            throw new AppError(`Invalid file type for material type "${type}". Allowed types: ${allowedMimeTypes[type as MaterialType]!.join(', ')}`, 400);
        }

        let fileUrl: string | undefined;
        try {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
            const uploadOptions: any = { folder: 'edupro_materials' };
            if (type === MaterialType.Video || type === MaterialType.Audio) {
                uploadOptions.resource_type = 'video';
            } else if (type === MaterialType.PDF || type === MaterialType.PPT || type === MaterialType.Text) {
                uploadOptions.resource_type = 'raw';
            } else {
                uploadOptions.resource_type = 'image';
            }
            const uploadResult = await cloudinary.uploader.upload(dataURI, uploadOptions);
            fileUrl = uploadResult.secure_url;
            console.log('[createMaterial] Cloudinary upload success:', fileUrl);
        } catch (uploadError: any) {
            console.error('[Cloudinary Upload Error]:', uploadError);
            throw new AppError('Failed to upload material to Cloudinary.', 500);
        }

        const materialData: ICreateMaterialData = {
            lessonId: new Types.ObjectId(lessonId),
            title,
            type: type as MaterialType,
            content: fileUrl,
            description,
            orderIndex: req.body.orderIndex ? parseInt(req.body.orderIndex) : undefined,
        };

        const newMaterial = await materialService.createMaterial(materialData, creatorId, creatorRole);
        return res.status(201).json(newMaterial);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error creating material');
    }
};

export const getMaterialsByLesson = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { lessonId } = req.params;
        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }
        const materials = await materialService.getMaterialsByLessonId(lessonId);
        return res.status(200).json(materials);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error fetching materials');
    }
};

export const updateMaterial = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { materialId } = req.params;
        const { title, type, description, orderIndex } = req.body;
        const editorId = req.user._id;
        const editorRole = req.user.role as UserRole;

        if (!Types.ObjectId.isValid(materialId)) {
            throw new AppError('Invalid Material ID', 400);
        }

        let fileUrl: string | undefined;
        if (req.file) {
            if (!req.file.buffer) {
                console.error('[updateMaterial] req.file.buffer is undefined:', req.file);
                throw new AppError('Material file buffer is missing.', 400);
            }

            const allowedMimeTypes: { [key in MaterialType]?: string[] } = {
                [MaterialType.Image]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                [MaterialType.Video]: ['video/mp4', 'video/webm', 'video/quicktime'],
                [MaterialType.PDF]: ['application/pdf'],
                [MaterialType.PPT]: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
                [MaterialType.Audio]: ['audio/mpeg', 'audio/wav'],
                [MaterialType.Text]: ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            };

            if (!Object.values(MaterialType).includes(type)) {
                throw new AppError(`Invalid material type. Allowed types: ${Object.values(MaterialType).join(', ')}`, 400);
            }

            if (allowedMimeTypes[type as MaterialType] && !allowedMimeTypes[type as MaterialType]!.includes(req.file.mimetype)) {
                throw new AppError(`Invalid file type for material type "${type}". Allowed types: ${allowedMimeTypes[type as MaterialType]!.join(', ')}`, 400);
            }

            try {
                const b64 = Buffer.from(req.file.buffer).toString('base64');
                const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
                const uploadOptions: any = { folder: 'edupro_materials' };
                if (type === MaterialType.Video || type === MaterialType.Audio) {
                    uploadOptions.resource_type = 'video';
                } else if (type === MaterialType.PDF || type === MaterialType.PPT || type === MaterialType.Text) {
                    uploadOptions.resource_type = 'raw';
                } else {
                    uploadOptions.resource_type = 'image';
                }
                const uploadResult = await cloudinary.uploader.upload(dataURI, uploadOptions);
                fileUrl = uploadResult.secure_url;
                console.log('[updateMaterial] Cloudinary upload success:', fileUrl);
            } catch (uploadError: any) {
                console.error('[Cloudinary Update Upload Error]:', uploadError);
                throw new AppError('Failed to upload new material to Cloudinary.', 500);
            }
        }

        const updateData: Partial<ICreateMaterialData> = {
            title,
            type: type ? (type as MaterialType) : undefined,
            content: fileUrl,
            description,
            orderIndex: orderIndex ? parseInt(orderIndex) : undefined,
        };

        const updatedMaterial = await materialService.updateMaterial(materialId, updateData, editorId, editorRole);
        if (!updatedMaterial) {
            throw new AppError('Material not found or update failed', 404);
        }
        return res.status(200).json(updatedMaterial);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error updating material');
    }
};

export const deleteMaterial = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { materialId } = req.params;
        const deleterId = req.user._id;
        const deleterRole = req.user.role as UserRole;

        if (!Types.ObjectId.isValid(materialId)) {
            throw new AppError('Invalid Material ID', 400);
        }

        const deleted = await materialService.deleteMaterial(materialId, deleterId, deleterRole);
        if (!deleted) {
            throw new AppError('Material not found or could not be deleted', 404);
        }
        return res.status(204).send();
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error deleting material');
    }
};