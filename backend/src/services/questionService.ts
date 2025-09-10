
// backend/src/services/questionService.ts
import { Types } from 'mongoose';
import { IQuestionService } from '../interfaces/questionServiceInterface';
import { IQuestionRepository } from '../interfaces/questionRepositoryInterface';
import { IAssessmentRepository } from '../interfaces/assessmentRepositoryInterface';
import { ICourseRepository } from '../interfaces/courseRepositoryInterface';
import { ILessonRepository } from '../interfaces/lessonRepositoryInterface';
import { IQuestion, IQuestionBase, ICreateQuestionData, QuestionType } from '../interfaces/questionInterface';
import AppError from '../utils/appError';
import { v2 as cloudinary } from 'cloudinary';

export class QuestionService implements IQuestionService {
    private questionRepository: IQuestionRepository;
    private assessmentRepository: IAssessmentRepository;
    private courseRepository: ICourseRepository;
    private lessonRepository: ILessonRepository;

    constructor(
        questionRepository: IQuestionRepository,
        assessmentRepository: IAssessmentRepository,
        courseRepository: ICourseRepository,
        lessonRepository: ILessonRepository
    ) {
        this.questionRepository = questionRepository;
        this.assessmentRepository = assessmentRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
    }

    private async checkAssessmentOwnership(assessmentId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
        const assessment = await this.assessmentRepository.findById(assessmentId);
        if (!assessment) return false;

        if (assessment.lessonId) {
            const lesson = await this.lessonRepository.findById(assessment.lessonId);
            if (!lesson) return false;
            const course = await this.courseRepository.findById(lesson.courseId);
            return course ? course.creatorId.equals(userId) : false;
        } else {
            const course = await this.courseRepository.findById(assessment.courseId);
            return course ? course.creatorId.equals(userId) : false;
        }
    }

    async createQuestion(data: ICreateQuestionData, creatorId: Types.ObjectId, creatorRole: string): Promise<IQuestion> {
        const assessmentObjectId = new Types.ObjectId(data.assessmentId);

        const assessment = await this.assessmentRepository.findById(assessmentObjectId);
        if (!assessment) {
            throw new AppError('Assessment not found', 404);
        }

        if (creatorRole !== 'Admin' && !(creatorRole === 'Teacher' && await this.checkAssessmentOwnership(assessmentObjectId, creatorId))) {
            throw new AppError('Unauthorized to create question for this assessment', 403);
        }

        const lastOrderIndex = await this.questionRepository.findLastOrderIndex(assessmentObjectId);
        const newOrderIndex = lastOrderIndex + 1;

        const questionData: Partial<IQuestion> = {
            assessmentId: assessmentObjectId,
            questionText: data.questionText,
            type: data.type,
            options: data.options,
            correctAnswer: data.correctAnswer,
            points: data.points,
            imageUrl: data.imageUrl,
            pdfUrl: data.pdfUrl,
            orderIndex: data.orderIndex !== undefined ? data.orderIndex : newOrderIndex,
        };

        const newQuestion = await this.questionRepository.create(questionData);
        await this.assessmentRepository.addQuestionToAssessment(assessmentObjectId, newQuestion._id);
        return newQuestion;
    }

    async findById(id: Types.ObjectId): Promise<IQuestion | null> {
        return await this.questionRepository.findById(id);
    }

    async findByAssessmentId(assessmentId: Types.ObjectId): Promise<IQuestion[]> {
        return await this.questionRepository.findByAssessmentId(assessmentId);
    }

    async findLastOrderIndex(assessmentId: Types.ObjectId): Promise<number> {
        return await this.questionRepository.findLastOrderIndex(assessmentId);
    }

    async updateQuestion(questionId: string, updateData: Partial<IQuestionBase>, editorId: Types.ObjectId, editorRole: string): Promise<IQuestion | null> {
        if (!Types.ObjectId.isValid(questionId)) {
            throw new AppError('Invalid Question ID', 400);
        }
        const questionObjectId = new Types.ObjectId(questionId);

        const question = await this.questionRepository.findById(questionObjectId);
        if (!question) {
            throw new AppError('Question not found', 404);
        }

        if (editorRole !== 'admin' && !(editorRole === 'teacher' && await this.checkAssessmentOwnership(question.assessmentId, editorId))) {
            throw new AppError('Unauthorized to update this question', 403);
        }

        delete updateData.assessmentId;

        if (updateData.orderIndex !== undefined && updateData.orderIndex !== question.orderIndex) {
            const lastOrderIndex = await this.questionRepository.findLastOrderIndex(question.assessmentId);
            if (updateData.orderIndex < 0 || updateData.orderIndex > lastOrderIndex + 1) {
                throw new AppError('Invalid order index for question', 400);
            }
        }

        return await this.questionRepository.update(questionObjectId, updateData);
    }

    async deleteQuestion(questionId: string, deleterId: Types.ObjectId, deleterRole: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(questionId)) {
            throw new AppError('Invalid Question ID', 400);
        }
        const questionObjectId = new Types.ObjectId(questionId);

        const question = await this.questionRepository.findById(questionObjectId);
        if (!question) {
            throw new AppError('Question not found', 404);
        }

        if (deleterRole !== 'admin' && !(deleterRole === 'teacher' && await this.checkAssessmentOwnership(question.assessmentId, deleterId))) {
            throw new AppError('Unauthorized to delete this question', 403);
        }

        await this.assessmentRepository.removeQuestionFromAssessment(question.assessmentId, questionObjectId);

        const deleted = await this.questionRepository.delete(questionObjectId);
        if (!deleted) {
            throw new AppError('Failed to delete question', 500);
        }

        if (question.imageUrl) {
            const publicIdMatch = question.imageUrl.match(/\/v\d+\/(.+?)\.(jpe?g|png|gif|webp)$/);
            if (publicIdMatch && publicIdMatch[1]) {
                const publicId = publicIdMatch[1];
                // await cloudinary.uploader.destroy(publicId);
            }
        }
        if (question.pdfUrl) {
            const publicIdMatch = question.pdfUrl.match(/\/v\d+\/(.+?)\.pdf$/);
            if (publicIdMatch && publicIdMatch[1]) {
                const publicId = publicIdMatch[1];
                // await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
            }
        }

        return deleted;
    }

    async uploadQuestionFile(file: Express.Multer.File, type: QuestionType): Promise<string> {
        if (!file) {
            throw new AppError('No file uploaded', 400);
        }
        if (type !== QuestionType.FileUpload) {
            const allowedMimeTypes = {
                'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                'pdf': ['application/pdf']
            };
            let isAllowed = false;
            if (file.mimetype.startsWith('image/') && allowedMimeTypes.image.includes(file.mimetype)) {
                isAllowed = true;
            } else if (file.mimetype === 'application/pdf' && allowedMimeTypes.pdf.includes(file.mimetype)) {
                isAllowed = true;
            }

            if (!isAllowed) {
                throw new AppError(`Invalid file type for question media. Allowed types: JPEG, PNG, GIF, WebP, PDF.`, 400);
            }
        }

        try {
            const uploadOptions: any = { folder: 'question_media' };
            if (file.mimetype.startsWith('image/')) {
                uploadOptions.resource_type = 'image';
            } else if (file.mimetype === 'application/pdf') {
                uploadOptions.resource_type = 'raw';
            } else {
                uploadOptions.resource_type = 'raw';
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