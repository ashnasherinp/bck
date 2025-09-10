

// backend/src/services/materialService.ts
import { Types } from 'mongoose';
import { IMaterialService } from '../interfaces/materialServiceInterface';
import { IMaterialRepository } from '../interfaces/materialRepositoryInterface'; // Ensure this path is correct based on your setup
import { ILessonRepository } from '../interfaces/lessonRepositoryInterface';
import { ICourseRepository } from '../interfaces/courseRepositoryInterface';
import { IMaterialBase, ICreateMaterialData, MaterialType } from '../interfaces/materialInterface';
import AppError from '../utils/appError';
import { v2 as cloudinary } from 'cloudinary';

// FIX: Import UserRole
import { UserRole } from '../interfaces/userInterface';
// FIX: Import ICourse and ILesson for type consistency when retrieving documents from repositories
import { ICourse } from '../interfaces/courseInterface';
import { ILesson } from '../interfaces/lessonInterface'; // Already present, good.

export class MaterialService implements IMaterialService {
    private materialRepository: IMaterialRepository;
    private lessonRepository: ILessonRepository;
    private courseRepository: ICourseRepository;

    constructor(
        materialRepository: IMaterialRepository,
        lessonRepository: ILessonRepository,
        courseRepository: ICourseRepository
    ) {
        this.materialRepository = materialRepository;
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    private async checkLessonOwnership(lessonId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
        const lesson: ILesson | null = await this.lessonRepository.findById(lessonId);
        if (!lesson) return false;
        const course: ICourse | null = await this.courseRepository.findById(lesson.courseId);
        return course ? course.creatorId.equals(userId) : false;
    }

    // FIX: creatorRole type
    async createMaterial(data: ICreateMaterialData, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<IMaterialBase> {
        const lessonObjectId = new Types.ObjectId(data.lessonId);

        const lesson: ILesson | null = await this.lessonRepository.findById(lessonObjectId);
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }

        if (creatorRole !== UserRole.Admin && !(creatorRole === UserRole.Teacher && await this.checkLessonOwnership(lessonObjectId, creatorId))) {
            throw new AppError('Unauthorized to create material for this lesson', 403);
        }

        const existingMaterial = await this.materialRepository.findByLessonAndTitle(lessonObjectId, data.title);
        if (existingMaterial) {
            throw new AppError('Material with this title already exists in the lesson', 409);
        }

        const lastOrderIndex = await this.materialRepository.findLastOrderIndex(lessonObjectId);
        const newOrderIndex = (data.orderIndex !== undefined && data.orderIndex >= 0) ? data.orderIndex : (lastOrderIndex + 1);

        const materialData: Partial<IMaterialBase> = {
            lessonId: lessonObjectId,
            title: data.title,
            type: data.type,
            content: data.content,
            description: data.description,
            orderIndex: newOrderIndex,
        };

        const newMaterial = await this.materialRepository.create(materialData);

        await this.lessonRepository.addMaterialToLesson(lessonObjectId, newMaterial._id as Types.ObjectId);

        return newMaterial;
    }

    async getMaterialById(materialId: string): Promise<IMaterialBase | null> {
        if (!Types.ObjectId.isValid(materialId)) {
            throw new AppError('Invalid Material ID', 400);
        }
        return await this.materialRepository.findById(new Types.ObjectId(materialId));
    }

    async getMaterialsByLessonId(lessonId: string): Promise<IMaterialBase[]> {
        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }
        return await this.materialRepository.findByLessonId(new Types.ObjectId(lessonId));
    }

    // FIX: editorRole type
    async updateMaterial(materialId: string, updateData: Partial<IMaterialBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<IMaterialBase | null> {
        if (!Types.ObjectId.isValid(materialId)) {
            throw new AppError('Invalid Material ID', 400);
        }
        const materialObjectId = new Types.ObjectId(materialId);

        const material = await this.materialRepository.findById(materialObjectId);
        if (!material) {
            throw new AppError('Material not found', 404);
        }

        if (editorRole !== UserRole.Admin && !(editorRole === UserRole.Teacher && await this.checkLessonOwnership(material.lessonId, editorId))) {
            throw new AppError('Unauthorized to update this material', 403);
        }

        const finalUpdateData = { ...updateData };
        delete finalUpdateData.lessonId;

        if (finalUpdateData.title && finalUpdateData.title !== material.title) {
            const existingMaterial = await this.materialRepository.findByLessonAndTitle(material.lessonId, finalUpdateData.title);
            if (existingMaterial) {
                throw new AppError('Material with this title already exists in the lesson', 409);
            }
        }

        if (finalUpdateData.orderIndex !== undefined && finalUpdateData.orderIndex !== material.orderIndex) {
            const lastOrderIndex = await this.materialRepository.findLastOrderIndex(material.lessonId);
            if (finalUpdateData.orderIndex < 0 || finalUpdateData.orderIndex > lastOrderIndex + 1) {
                throw new AppError('Invalid order index for material', 400);
            }
        }

        return await this.materialRepository.update(materialObjectId, finalUpdateData);
    }

    // FIX: deleterRole type
    async deleteMaterial(materialId: string, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean> {
        if (!Types.ObjectId.isValid(materialId)) {
            throw new AppError('Invalid Material ID', 400);
        }
        const materialObjectId = new Types.ObjectId(materialId);

        const material = await this.materialRepository.findById(materialObjectId);
        if (!material) {
            throw new AppError('Material not found', 404);
        }

        if (deleterRole !== UserRole.Admin && !(deleterRole === UserRole.Teacher && await this.checkLessonOwnership(material.lessonId, deleterId))) {
            throw new AppError('Unauthorized to delete this material', 403);
        }

        await this.lessonRepository.removeMaterialFromLesson(material.lessonId, materialObjectId);

        const deleted = await this.materialRepository.delete(materialObjectId);
        if (!deleted) {
            throw new AppError('Failed to delete material', 500);
        }

        if (material.type === MaterialType.Image || material.type === MaterialType.PDF || material.type === MaterialType.PPT || material.type === MaterialType.Video || material.type === MaterialType.Audio) {
            const publicIdMatch = material.content.match(/\/v\d+\/(.+?)\.(jpe?g|png|pdf|mp4|mp3|pptx?|docx?|xlsx?|mov|avi|webm|flv|wmv|ogg|ogv|aac|flac|m4a)$/);
            if (publicIdMatch && publicIdMatch[1]) {
                const publicId = publicIdMatch[1];
                let resource_type: 'image' | 'video' | 'raw' = 'raw';
                if (material.type === MaterialType.Image) resource_type = 'image';
                else if (material.type === MaterialType.Video || material.type === MaterialType.Audio) resource_type = 'video';
                try {
                    // await cloudinary.uploader.destroy(publicId, { resource_type: resource_type });
                    // console.log(`Deleted Cloudinary asset: ${publicId}`);
                } catch (cloudinaryError: any) {
                    console.error('Error deleting Cloudinary asset:', cloudinaryError);
                }
            }
        }

        return deleted;
    }

    async uploadMaterialFile(file: Express.Multer.File, type: MaterialType): Promise<string> {
        if (!file) {
            throw new AppError('No file uploaded', 400);
        }

        const allowedMimeTypes: { [key in MaterialType]?: string[] } = {
            [MaterialType.Image]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            [MaterialType.Video]: ['video/mp4', 'video/webm', 'video/quicktime'],
            [MaterialType.PDF]: ['application/pdf'],
            [MaterialType.PPT]: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
            [MaterialType.Audio]: ['audio/mpeg', 'audio/wav'],
            [MaterialType.Text]: ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        };

        const currentAllowedTypes = allowedMimeTypes[type];
        if (currentAllowedTypes && !currentAllowedTypes.includes(file.mimetype)) {
            throw new AppError(`Invalid file type for material type "${type}". Allowed types: ${currentAllowedTypes.join(', ')}`, 400);
        }

        try {
            const uploadOptions: any = { folder: 'course_materials' };
            if (type === MaterialType.Video) {
                uploadOptions.resource_type = 'video';
            } else if (type === MaterialType.Audio) {
                uploadOptions.resource_type = 'video';
            } else if (type === MaterialType.PDF || type === MaterialType.PPT || type === MaterialType.Text) {
                uploadOptions.resource_type = 'raw';
            } else if (type === MaterialType.Image) {
                uploadOptions.resource_type = 'image';
            } else {
                throw new AppError(`File upload not supported for material type "${type}"`, 400);
            }

            const result = await cloudinary.uploader.upload(file.path, uploadOptions);
            return result.secure_url;
        } catch (error: any) {
            console.error('Cloudinary upload error:', error);
            throw new AppError(`File upload failed: ${error.message}`, 500);
        } finally {
            import('fs').then(fs => fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting local file:', err);
            }));
        }
    }
}