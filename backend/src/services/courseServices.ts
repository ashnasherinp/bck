

// backend/src/services/courseServices.ts
import { Document, Types } from 'mongoose';
import { ICourseService } from '../interfaces/courseserviceInterface';
import { ICourseRepository } from '../interfaces/courseRepositoryInterface';
import { ICourseCategoryRepository } from '../interfaces/courseCategoryRepositoryInterface';
import { IEnrollmentRepository } from '../interfaces/enrollmentRepositoryInterface';
import { ILessonRepository } from '../interfaces/lessonRepositoryInterface';
import { IAssessmentRepository } from '../interfaces/assessmentRepositoryInterface';
import { IMaterialRepository } from '../interfaces/materialRepositoryInterface';
import { ICourseBase, ICoursePopulated, ICreateCourseData, ICourse } from '../interfaces/courseInterface';
import { UserRole } from '../interfaces/userInterface';
import { EnrollmentStatus, PaymentStatus, AdminApprovalStatus } from '../interfaces/enrollmentInterface';
import AppError from '../utils/appError';

export class CourseService implements ICourseService {
    private courseRepository: ICourseRepository;
    private categoryRepository: ICourseCategoryRepository;
    private enrollmentRepository: IEnrollmentRepository;
    private lessonRepository: ILessonRepository;
    private assessmentRepository: IAssessmentRepository;
    private materialRepository: IMaterialRepository;

    constructor(
        courseRepository: ICourseRepository,
        categoryRepository: ICourseCategoryRepository,
        enrollmentRepository: IEnrollmentRepository,
        lessonRepository: ILessonRepository,
        assessmentRepository: IAssessmentRepository,
        materialRepository: IMaterialRepository
    ) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.assessmentRepository = assessmentRepository;
        this.materialRepository = materialRepository;
    }

    async getApprovedCourses(): Promise<ICoursePopulated[]> {
        const courses = await this.courseRepository.findApprovedCourses();
        return courses.map(course => ({
            ...course,
            effectivePrice: course.discountPrice !== undefined && course.discountPrice < course.price
                ? course.discountPrice
                : course.price
        }));
    }

    async getNewCourses(): Promise<ICoursePopulated[]> {
        const courses = await this.courseRepository.findNewCourses();
        return courses.map(course => ({
            ...course,
            effectivePrice: course.discountPrice !== undefined && course.discountPrice < course.price
                ? course.discountPrice
                : course.price
        }));
    }

    async getCoursesByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]> {
        const courses = await this.courseRepository.findByCreator(creatorId);
        return courses.map(course => ({
            ...course,
            effectivePrice: course.discountPrice !== undefined && course.discountPrice < course.price
                ? course.discountPrice
                : course.price
        }));
    }

    async getCategories(): Promise<any[]> {
        return this.categoryRepository.findAll();
    }



async createCourse(courseData: ICreateCourseData, creatorId: Types.ObjectId, creatorRole: UserRole): Promise<ICoursePopulated> {
    const category = await this.categoryRepository.findById(courseData.categoryId as Types.ObjectId);
    if (!category) {
        throw new AppError('Course category not found', 404);
    }
    
    const existingCourse = await this.courseRepository.findByTitleAndCreator(courseData.title, creatorId);
    if (existingCourse) {
        throw new AppError('Course with this title already exists for this creator', 409);
    }

  
    const newCourseData = {
        ...courseData,
        creatorId: creatorId,
        isApproved: creatorRole === UserRole.Admin,
    };

    const newCourse = await this.courseRepository.create(newCourseData);
    const populatedCourse = await this.courseRepository.findByIdPopulated(newCourse._id);

    if (!populatedCourse) {
        throw new AppError('Failed to retrieve created course with populated data', 500);
    }
    
    return {
        ...populatedCourse,
        effectivePrice: populatedCourse.discountPrice !== undefined && populatedCourse.discountPrice < populatedCourse.price
            ? populatedCourse.discountPrice
            : populatedCourse.price
    };
}

    async getAllCourses(): Promise<ICoursePopulated[]> {
        const courses = await this.courseRepository.findAllPopulated();
        return courses.map(course => ({
            ...course,
            effectivePrice: course.discountPrice !== undefined && course.discountPrice < course.price
                ? course.discountPrice
                : course.price
        }));
    }


    async getCourseById(id: Types.ObjectId): Promise<ICoursePopulated | null> {
    
        const course = await this.courseRepository.findByIdPopulated(id);
        if (course) {
            return {
                ...course,
                effectivePrice: course.discountPrice !== undefined && course.discountPrice < course.price
                    ? course.discountPrice
                    : course.price
            };
        }
        return null;
    }

    async updateCourse(id: Types.ObjectId, updateData: Partial<ICourseBase>, editorId: Types.ObjectId, editorRole: UserRole): Promise<ICoursePopulated | null> {
        const course = await this.courseRepository.findById(id);
        if (!course) {
            throw new AppError('Course not found', 404);
        }

        if (editorRole !== UserRole.Admin && !(editorRole === UserRole.Teacher && course.creatorId.equals(editorId))) {
            throw new AppError('Unauthorized to update this course', 403);
        }

        delete updateData.lessons;
        delete updateData.assessments;
        delete updateData.enrolledUsers;

        if (updateData.title && updateData.title !== course.title) {
            const existingCourse = await this.courseRepository.findByTitleAndCreator(updateData.title, course.creatorId);
            if (existingCourse && !existingCourse._id.equals(id)) {
                throw new AppError('Course with this title already exists for this creator', 409);
            }
        }

        const updatedCourse = await this.courseRepository.update(id, updateData);

        if (!updatedCourse) {
            return null;
        }

        const populatedUpdatedCourse = await this.courseRepository.findByIdPopulated(updatedCourse._id);
        if (!populatedUpdatedCourse) {
            throw new AppError('Failed to retrieve updated course with populated data', 500);
        }

        return {
            ...populatedUpdatedCourse,
            effectivePrice: populatedUpdatedCourse.discountPrice !== undefined && populatedUpdatedCourse.discountPrice < populatedUpdatedCourse.price
                ? populatedUpdatedCourse.discountPrice
                : populatedUpdatedCourse.price
        };
    }

    // Changed id: string to id: Types.ObjectId
    async deleteCourse(id: Types.ObjectId, deleterId: Types.ObjectId, deleterRole: UserRole): Promise<boolean> {

        const course = await this.courseRepository.findById(id);
        if (!course) {
            throw new AppError('Course not found', 404);
        }

        if (deleterRole === UserRole.Teacher && !course.creatorId.equals(deleterId)) {
            throw new AppError('Unauthorized to delete this course', 403);
        }
    

        const lessons = await this.lessonRepository.findByCourseId(id);
        const lessonIds = lessons.map(lesson => lesson._id);

        if (lessonIds.length > 0) {
            await Promise.all([
                this.materialRepository.deleteMany({ lessonId: { $in: lessonIds } }),
                this.assessmentRepository.deleteMany({ lessonId: { $in: lessonIds } })
            ]);
        }

        await this.assessmentRepository.deleteMany({ courseId: id, lessonId: { $exists: false } });

        await this.lessonRepository.deleteMany({ courseId: id });

        await this.enrollmentRepository.deleteManyByCourseId(id);

        const deleted = await this.courseRepository.delete(id);
        if (!deleted) {
            throw new AppError('Failed to delete course', 500);
        }
        return deleted;
    }

    async approveCourse(courseId: Types.ObjectId, adminId: Types.ObjectId): Promise<ICoursePopulated | null> {
     
        const course = await this.courseRepository.findById(courseId); 
        if (!course) {
            throw new AppError('Course not found', 404);
        }
        if (course.isApproved) {
            throw new AppError('Course is already approved', 409);
        }
        const updatedCourse = await this.courseRepository.update(courseId, { isApproved: true }); 
        if (!updatedCourse) {
            return null;
        }
        return await this.courseRepository.findByIdPopulated(updatedCourse._id);
    }

    async rejectCourse(courseId: Types.ObjectId, adminId: Types.ObjectId): Promise<ICoursePopulated | null> {
     
        const course = await this.courseRepository.findById(courseId); 
        if (!course) {
            throw new AppError('Course not found', 404);
        }
        if (!course.isApproved) {
            throw new AppError('Course is already rejected or pending approval', 409);
        }
        const updatedCourse = await this.courseRepository.update(courseId, { isApproved: false }); 
        if (!updatedCourse) {
            return null;
        }
        return await this.courseRepository.findByIdPopulated(updatedCourse._id);
    }

    async enrollUserInCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<boolean> {
     
        const course = await this.courseRepository.findById(courseId); 
        if (!course) {
            throw new AppError('Course not found', 404);
        }

        const alreadyEnrolled = await this.enrollmentRepository.findByUserAndCourse(userId, courseId); 
        if (alreadyEnrolled) {
            throw new AppError('User is already enrolled in this course', 409);
        }

        const enrollmentCreated = await this.enrollmentRepository.create({
            userId,
            courseId: courseId, 
            enrollmentDate: new Date(),
            status: EnrollmentStatus.InProgress,
            paymentStatus: PaymentStatus.Pending,
            adminApprovalStatus: AdminApprovalStatus.Pending,
            progress: [],
        });

        if (!enrollmentCreated) {
            throw new AppError('Failed to create enrollment', 500);
        }

        const addedToCourse = await this.courseRepository.addUserToEnrolled(courseId, userId); 
        if (!addedToCourse) {
            console.error(`Failed to add user ${userId} to enrolledUsers of course ${courseId}`);
            throw new AppError('Failed to update course with enrolled user', 500);
        }

        return true;
    }

    async getEnrolledCoursesForUser(userId: Types.ObjectId): Promise<ICoursePopulated[]> {
        const enrollments = await this.enrollmentRepository.findByUserIdPopulated(userId);
        return enrollments.map(enrollment => {
            const course = enrollment.courseId as ICoursePopulated;
            if (course) {
                return {
                    ...course,
                    effectivePrice: course.discountPrice !== undefined && course.discountPrice < course.price
                        ? course.discountPrice
                        : course.price
                };
            }
            return course;
        }).filter(Boolean) as ICoursePopulated[];
    }
}