

// // backend/src/utils/dependecy-container.ts


import { AuthServiceImpl } from '../services/authService';
import { AdminServiceImpl } from '../services/adminServices';
import { CourseService } from '../services/courseServices';
import { EmailServiceImpl } from '../services/emailService';
import { EnrollmentService } from '../services/enrollmentServices';
import { PaymentService } from '../services/paymentServices';
import { LessonService } from '../services/lessonService';
import { MaterialService } from '../services/materialService';
import { AssessmentService } from '../services/assessmentService';
import { QuestionService } from '../services/questionService';
import { CourseCategoryService } from '../services/courseCategoryService';

import { IAuthService } from '../interfaces/authServiceInterface';
import { IAdminService } from '../interfaces/adminserviceInterface';
import { ICourseService } from '../interfaces/courseserviceInterface';
import { IEmailService } from '../interfaces/emailServiceInterface';
import { IEnrollmentService } from '../interfaces/enrollmentServiceInterface';
import { IPaymentService } from '../interfaces/paymentServiceInterface';
import { ILessonService } from '../interfaces/lessonServiceInterface';
import { IMaterialService } from '../interfaces/materialServiceInterface';
import { IAssessmentService } from '../interfaces/assessmentServiceInterface';
import { IQuestionService } from '../interfaces/questionServiceInterface';
import { ICourseCategoryService } from '../interfaces/courseCategoryServiceInterface';

import { UserRepository } from '../repositories/userRepositories';
import { OTPRepository } from '../repositories/otpRepositories';
import { ResetTokenRepository } from '../repositories/resetTokenRepositories';
import { CourseRepository } from '../repositories/courseRepositories';
import { CourseCategoryRepository } from '../repositories/CoursecategoryRepositories';
import { EnrollmentRepository } from '../repositories/enrollmentRepositories';
import { LessonRepository } from '../repositories/lessonRepositories';
import { MaterialRepository } from '../repositories/materialRepositories';
import { AssessmentRepository } from '../repositories/assessmentRepositories';
import { QuestionRepository } from '../repositories/questionRepositories';

export class DependencyContainer {
    private static instance: DependencyContainer;

    private userRepository: UserRepository;
    private otpRepository: OTPRepository;
    private resetTokenRepository: ResetTokenRepository;
    private courseRepository: CourseRepository;
    private courseCategoryRepository: CourseCategoryRepository;
    private enrollmentRepository: EnrollmentRepository;
    private lessonRepository: LessonRepository;
    private materialRepository: MaterialRepository;
    private assessmentRepository: AssessmentRepository;
    private questionRepository: QuestionRepository;

    private authService: IAuthService;
    private adminService: IAdminService;
    private courseService: ICourseService;
    private emailService: IEmailService;
    private enrollmentService: IEnrollmentService;
    private paymentService: IPaymentService;
    private lessonService: ILessonService;
    private materialService: IMaterialService;
    private assessmentService: IAssessmentService;
    private questionService: IQuestionService;
    private courseCategoryService: ICourseCategoryService;

    private constructor() {
        // Instantiate Repositories
        this.enrollmentRepository = new EnrollmentRepository();
        this.userRepository = new UserRepository(this.enrollmentRepository);
        this.otpRepository = new OTPRepository();
        this.resetTokenRepository = new ResetTokenRepository();
        this.courseRepository = new CourseRepository();
        this.courseCategoryRepository = new CourseCategoryRepository();
        this.lessonRepository = new LessonRepository();
        this.materialRepository = new MaterialRepository();
        this.assessmentRepository = new AssessmentRepository();
        this.questionRepository = new QuestionRepository();

        // Instantiate core services
        this.emailService = new EmailServiceImpl();
        this.paymentService = new PaymentService();

        // Instantiate Authentication and Admin Services
        this.authService = new AuthServiceImpl(
            this.userRepository,
            this.otpRepository,
            this.emailService,
            this.resetTokenRepository
        );
        this.adminService = new AdminServiceImpl(this.userRepository, this.enrollmentRepository);

        // Instantiate content services
        this.lessonService = new LessonService(
            this.lessonRepository,
            this.courseRepository,
            this.materialRepository,
            this.assessmentRepository
        );
        this.materialService = new MaterialService(
            this.materialRepository,
            this.lessonRepository,
            this.courseRepository
        );
        this.assessmentService = new AssessmentService(
            this.assessmentRepository,
            this.courseRepository,
            this.lessonRepository,
            this.questionRepository
        );
        this.questionService = new QuestionService(
            this.questionRepository,
            this.assessmentRepository,
            this.courseRepository,
            this.lessonRepository
        );
        this.courseCategoryService = new CourseCategoryService(this.courseCategoryRepository);

        // Instantiate CourseService and EnrollmentService
        this.courseService = new CourseService(
            this.courseRepository,
            this.courseCategoryRepository,
            this.enrollmentRepository,
            this.lessonRepository,
            this.assessmentRepository,
            this.materialRepository
        );
        this.enrollmentService = new EnrollmentService(
            this.enrollmentRepository,
            this.courseRepository,
            this.paymentService,
            this.userRepository,
            this.lessonRepository
        );
    }

    public static getInstance(): DependencyContainer {
        if (!DependencyContainer.instance) {
            DependencyContainer.instance = new DependencyContainer();
        }
        return DependencyContainer.instance;
    }

    public getAuthService(): IAuthService { return this.authService; }
    public getAdminService(): IAdminService { return this.adminService; }
    public getCourseService(): ICourseService { return this.courseService; }
    public getEmailService(): IEmailService { return this.emailService; }
    public getEnrollmentService(): IEnrollmentService { return this.enrollmentService; }
    public getPaymentService(): IPaymentService { return this.paymentService; }
    public getLessonService(): ILessonService { return this.lessonService; }
    public getMaterialService(): IMaterialService { return this.materialService; }
    public getAssessmentService(): IAssessmentService { return this.assessmentService; }
    public getQuestionService(): IQuestionService { return this.questionService; }
    public getCourseCategoryService(): ICourseCategoryService { return this.courseCategoryService; }

    public getUserRepository(): UserRepository { return this.userRepository; }
    public getCourseRepository(): CourseRepository { return this.courseRepository; }
    public getEnrollmentRepository(): EnrollmentRepository { return this.enrollmentRepository; }
    public getLessonRepository(): LessonRepository { return this.lessonRepository; }
    public getMaterialRepository(): MaterialRepository { return this.materialRepository; }
    public getAssessmentRepository(): AssessmentRepository { return this.assessmentRepository; }
    public getQuestionRepository(): QuestionRepository { return this.questionRepository; }
}
