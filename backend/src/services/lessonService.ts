
// backend/src/services/lessonService.ts
import { Types } from 'mongoose';
import { ILessonService } from '../interfaces/lessonServiceInterface';
import { ILessonRepository } from '../interfaces/lessonRepositoryInterface';
import { ICourseRepository } from '../interfaces/courseRepositoryInterface';
import { IAssessmentRepository } from '../interfaces/assessmentRepositoryInterface';
import { IMaterialRepository } from '../interfaces/materialRepositoryInterface';
import { ILessonBase, ICreateLessonData, ILessonPopulated, ILesson } from '../interfaces/lessonInterface';
import AppError from '../utils/appError';
import { UserRole } from '../interfaces/userInterface';
import { ICourse } from '../interfaces/courseInterface';

export class LessonService implements ILessonService {
    private lessonRepository: ILessonRepository;
    private courseRepository: ICourseRepository;
    private materialRepository: IMaterialRepository;
    private assessmentRepository: IAssessmentRepository;

    constructor(
        lessonRepository: ILessonRepository,
        courseRepository: ICourseRepository,
        materialRepository: IMaterialRepository,
        assessmentRepository: IAssessmentRepository
    ) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.materialRepository = materialRepository;
        this.assessmentRepository = assessmentRepository;
    }

    private async checkCourseOwnership(courseId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
        const course: ICourse | null = await this.courseRepository.findById(courseId);
        return course ? course.creatorId.equals(userId) : false;
    }

    private async checkLessonOwnership(lessonId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
        const lesson: ILesson | null = await this.lessonRepository.findById(lessonId);
        if (!lesson) return false;
        const course: ICourse | null = await this.courseRepository.findById(lesson.courseId);
        return course ? course.creatorId.equals(userId) : false;
    }

    async createLesson(data: ICreateLessonData, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<ILesson> {
        const course: ICourse | null = await this.courseRepository.findById(data.courseId);
        if (!course) {
            throw new AppError('Course not found', 404);
        }

        if (creatorRole !== UserRole.Admin && !(creatorRole === UserRole.Teacher && course.creatorId.equals(creatorId))) {
            throw new AppError('Unauthorized to create lesson in this course', 403);
        }

        const existingLesson = await this.lessonRepository.findByCourseAndTitle(data.courseId, data.title);
        if (existingLesson) {
            throw new AppError('Lesson with this title already exists in the course', 409);
        }

        const lastOrderIndex = await this.lessonRepository.findLastOrderIndex(data.courseId);
        const newOrderIndex = data.orderIndex !== undefined ? data.orderIndex : (lastOrderIndex + 1);

        const lessonData: Partial<ILessonBase> = {
            courseId: data.courseId,
            title: data.title,
            description: data.description,
            orderIndex: newOrderIndex,
            isPublished: data.isPublished !== undefined ? data.isPublished : (creatorRole === UserRole.Admin),
            materials: [],
            assessments: [],
        };

        const newLesson: ILesson = await this.lessonRepository.create(lessonData);

        await this.courseRepository.addLessonToCourse(data.courseId, newLesson._id);

        return newLesson;
    }

    async getLessonById(lessonId: string): Promise<ILessonPopulated | null> {
        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }
        return await this.lessonRepository.findByIdPopulated(new Types.ObjectId(lessonId));
    }

    async getLessonsByCourseId(courseId: string): Promise<ILessonPopulated[]> {
        if (!Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid Course ID', 400);
        }
        return await this.lessonRepository.findByCourseIdPopulated(new Types.ObjectId(courseId));
    }

    async updateLesson(lessonId: string, updateData: Partial<ILessonBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<ILesson | null> {
        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }
        const lessonObjectId = new Types.ObjectId(lessonId);

        const lesson: ILesson | null = await this.lessonRepository.findById(lessonObjectId);
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }

        const course: ICourse | null = await this.courseRepository.findById(lesson.courseId);
        if (!course) {
            throw new AppError('Associated course not found', 404);
        }

        if (editorRole !== UserRole.Admin && !(editorRole === UserRole.Teacher && course.creatorId.equals(editorId))) {
            throw new AppError('Unauthorized to update this lesson', 403);
        }

        const finalUpdateData = { ...updateData };
        delete finalUpdateData.courseId;
        delete finalUpdateData.materials;
        delete finalUpdateData.assessments;

        if (finalUpdateData.title && finalUpdateData.title !== lesson.title) {
            const existingLesson = await this.lessonRepository.findByCourseAndTitle(lesson.courseId, finalUpdateData.title);
            if (existingLesson) {
                throw new AppError('Lesson with this title already exists in the course', 409);
            }
        }

        if (finalUpdateData.orderIndex !== undefined && finalUpdateData.orderIndex !== lesson.orderIndex) {
            const lastOrderIndex = await this.lessonRepository.findLastOrderIndex(lesson.courseId);
            if (finalUpdateData.orderIndex < 0 || finalUpdateData.orderIndex > lastOrderIndex + 1) {
                throw new AppError('Invalid order index for lesson', 400);
            }
        }

        return await this.lessonRepository.update(lessonObjectId, finalUpdateData);
    }

    async deleteLesson(lessonId: string, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean> {
        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }
        const lessonObjectId = new Types.ObjectId(lessonId);

        const lesson: ILesson | null = await this.lessonRepository.findById(lessonObjectId);
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }

        const course: ICourse | null = await this.courseRepository.findById(lesson.courseId);
        if (!course) {
            throw new AppError('Associated course not found', 404);
        }

        if (deleterRole !== UserRole.Admin && !(deleterRole === UserRole.Teacher && course.creatorId.equals(deleterId))) {
            throw new AppError('Unauthorized to delete this lesson', 403);
        }

        await Promise.all([
            this.materialRepository.deleteMany({ lessonId: lessonObjectId }),
            this.assessmentRepository.deleteMany({ lessonId: lessonObjectId })
        ]);

        await this.courseRepository.removeLessonFromCourse(lesson.courseId, lessonObjectId);

        const deleted = await this.lessonRepository.delete(lessonObjectId);
        if (!deleted) {
            throw new AppError('Failed to delete lesson', 500);
        }
        return deleted;
    }

    async publishLesson(lessonId: string, adminId: Types.ObjectId): Promise<ILesson | null> {
        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }
        const lessonObjectId = new Types.ObjectId(lessonId);

        const lesson: ILesson | null = await this.lessonRepository.findById(lessonObjectId);
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }
        if (lesson.isPublished) {
            throw new AppError('Lesson is already published', 409);
        }

        return await this.lessonRepository.update(lessonObjectId, { isPublished: true });
    }

    async unpublishLesson(lessonId: string, adminId: Types.ObjectId): Promise<ILesson | null> {
        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid Lesson ID', 400);
        }
        const lessonObjectId = new Types.ObjectId(lessonId);

        const lesson: ILesson | null = await this.lessonRepository.findById(lessonObjectId);
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }
        if (!lesson.isPublished) {
            throw new AppError('Lesson is already unpublished', 409);
        }

        return await this.lessonRepository.update(lessonObjectId, { isPublished: false });
    }

    async canAccessLesson(userId: Types.ObjectId, lessonId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(lessonId)) {
            return false;
        }
        const lessonObjectId = new Types.ObjectId(lessonId);

        const lesson: ILesson | null = await this.lessonRepository.findById(lessonObjectId);
        if (!lesson) {
            return false;
        }

        return lesson.isPublished;
    }
}