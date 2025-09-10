


// backend/src/services/assessmentService.ts
import { Types } from 'mongoose';
import { IAssessmentService } from '../interfaces/assessmentServiceInterface';
import { IAssessmentRepository } from '../interfaces/assessmentRepositoryInterface';
import { ICourseRepository } from '../interfaces/courseRepositoryInterface';
import { ILessonRepository } from '../interfaces/lessonRepositoryInterface';
import { IQuestionRepository } from '../interfaces/questionRepositoryInterface';
import { IAssessmentBase, ICreateAssessmentData, IAssessmentPopulated } from '../interfaces/assessmentInterface';
import AppError from '../utils/appError';
import { UserRole } from '../interfaces/userInterface';
import { ICourse } from '../interfaces/courseInterface';

export class AssessmentService implements IAssessmentService {
    private assessmentRepository: IAssessmentRepository;
    private courseRepository: ICourseRepository;
    private lessonRepository: ILessonRepository;
    private questionRepository: IQuestionRepository;

    constructor(
        assessmentRepository: IAssessmentRepository,
        courseRepository: ICourseRepository,
        lessonRepository: ILessonRepository,
        questionRepository: IQuestionRepository
    ) {
        this.assessmentRepository = assessmentRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
    }

    private async checkCourseOwnership(courseId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
        const course: ICourse | null = await this.courseRepository.findById(courseId);
        return course ? course.creatorId.equals(userId) : false;
    }

    private async checkLessonOwnership(lessonId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
        const lesson = await this.lessonRepository.findById(lessonId);
        if (!lesson) return false;
        return await this.checkCourseOwnership(lesson.courseId, userId);
    }

    async createAssessment(data: ICreateAssessmentData, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<IAssessmentBase> {
        if (!data.courseId) {
            throw new AppError('Course ID is required', 400);
        }

        const course = await this.courseRepository.findById(data.courseId);
        if (!course) {
            throw new AppError('Course not found', 404);
        }

        if (creatorRole !== UserRole.Admin && !course.creatorId.equals(creatorId)) {
            throw new AppError('Unauthorized to create assessment for this course', 403);
        }

        if (data.lessonId) {
            const lesson = await this.lessonRepository.findById(data.lessonId);
            if (!lesson || !lesson.courseId.equals(data.courseId)) {
                throw new AppError('Lesson not found or does not belong to the specified course', 404);
            }
        }

        const existingAssessment = data.lessonId
            ? await this.assessmentRepository.findByTitleAndLesson(data.title, data.lessonId)
            : await this.assessmentRepository.findByTitleAndCourse(data.title, data.courseId);
        if (existingAssessment) {
            throw new AppError('Assessment with this title already exists for this course or lesson', 409);
        }

        const assessmentData: Partial<IAssessmentBase> = {
            courseId: data.courseId,
            lessonId: data.lessonId,
            title: data.title,
            description: data.description,
            type: data.type,
            maxScore: data.maxScore,
            durationMinutes: data.durationMinutes,
            passPercentage: data.passPercentage,
            isPublished: data.isPublished || false,
            questions: [],
        };

        const newAssessment = await this.assessmentRepository.create(assessmentData);
        return newAssessment;
    }

    async getAssessmentById(assessmentId: string): Promise<IAssessmentPopulated | null> {
        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID', 400);
        }
        return await this.assessmentRepository.findByIdPopulated(new Types.ObjectId(assessmentId));
    }

    async updateAssessment(assessmentId: string, updateData: Partial<IAssessmentBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<IAssessmentBase | null> {
        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID', 400);
        }
        const assessment = await this.assessmentRepository.findById(new Types.ObjectId(assessmentId));
        if (!assessment) {
            throw new AppError('Assessment not found', 404);
        }
        const course = await this.courseRepository.findById(assessment.courseId);
        if (!course) {
            throw new AppError('Course not found', 404);
        }
        if (editorRole !== UserRole.Admin && !course.creatorId.equals(editorId)) {
            throw new AppError('Unauthorized to update this assessment', 403);
        }
        return await this.assessmentRepository.update(new Types.ObjectId(assessmentId), updateData);
    }

    async deleteAssessment(assessmentId: string, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean> {
        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID', 400);
        }
        const assessment = await this.assessmentRepository.findById(new Types.ObjectId(assessmentId));
        if (!assessment) {
            throw new AppError('Assessment not found', 404);
        }
        const course = await this.courseRepository.findById(assessment.courseId);
        if (!course) {
            throw new AppError('Course not found', 404);
        }
        if (deleterRole !== UserRole.Admin && !course.creatorId.equals(deleterId)) {
            throw new AppError('Unauthorized to delete this assessment', 403);
        }
        await this.questionRepository.deleteMany({ assessmentId: new Types.ObjectId(assessmentId) });
        return await this.assessmentRepository.delete(new Types.ObjectId(assessmentId));
    }

    async getAssessmentsByCourseId(courseId: string): Promise<IAssessmentBase[]> {
        if (!Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid course ID', 400);
        }
        return await this.assessmentRepository.findByCourseId(new Types.ObjectId(courseId));
    }

    async getAssessmentsByLessonId(lessonId: string): Promise<IAssessmentBase[]> {
        if (!Types.ObjectId.isValid(lessonId)) {
            throw new AppError('Invalid lesson ID', 400);
        }
        return await this.assessmentRepository.findByLessonId(new Types.ObjectId(lessonId));
    }

    async publishAssessment(assessmentId: string, adminId: Types.ObjectId): Promise<IAssessmentBase | null> {
        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID', 400);
        }
        const assessment = await this.assessmentRepository.findById(new Types.ObjectId(assessmentId));
        if (!assessment) {
            throw new AppError('Assessment not found', 404);
        }
        return await this.assessmentRepository.update(new Types.ObjectId(assessmentId), { isPublished: true });
    }

    async unpublishAssessment(assessmentId: string, adminId: Types.ObjectId): Promise<IAssessmentBase | null> {
        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID', 400);
        }
        const assessment = await this.assessmentRepository.findById(new Types.ObjectId(assessmentId));
        if (!assessment) {
            throw new AppError('Assessment not found', 404);
        }
        return await this.assessmentRepository.update(new Types.ObjectId(assessmentId), { isPublished: false });
    }
}