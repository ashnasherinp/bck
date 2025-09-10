


import { Types } from 'mongoose';
import { IEnrollmentService } from '../interfaces/enrollmentServiceInterface';
import { IEnrollmentRepository } from '../interfaces/enrollmentRepositoryInterface';
import { ICourseRepository } from '../interfaces/courseRepositoryInterface';
import { IPaymentService } from '../interfaces/paymentServiceInterface';
import { IUserRepository } from '../interfaces/userRepositoryinterface';
import { ILessonRepository } from '../interfaces/lessonRepositoryInterface';
import { IEnrollment, EnrollmentStatus, PaymentStatus, AdminApprovalStatus, ILessonProgress, IEnrollmentPopulated, IPaymentDetails } from '../interfaces/enrollmentInterface';
import { EnrollmentModel } from '../models/EnrollmentModel';
import AppError from '../utils/appError';

export class EnrollmentService implements IEnrollmentService {
    private enrollmentRepository: IEnrollmentRepository;
    private courseRepository: ICourseRepository;
    private paymentService: IPaymentService;
    private userRepository: IUserRepository;
    private lessonRepository: ILessonRepository;

    constructor(
        enrollmentRepository: IEnrollmentRepository,
        courseRepository: ICourseRepository,
        paymentService: IPaymentService,
        userRepository: IUserRepository,
        lessonRepository: ILessonRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.paymentService = paymentService;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
    }

    async createEnrollment(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment> {
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid user or course ID format', 400);
        }

        const course = await this.courseRepository.findById(courseId);
        if (!course) {
            throw new AppError('Course not found', 404);
        }

        const existingEnrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
        if (existingEnrollment) {
            if (existingEnrollment.paymentStatus === PaymentStatus.Completed && existingEnrollment.adminApprovalStatus === AdminApprovalStatus.Approved) {
                throw new AppError('User already fully enrolled in this course', 409);
            }
            throw new AppError('User already has a pending enrollment for this course.', 409);
        }

        const lessonsInCourse = await this.lessonRepository.findByCourseId(courseId);
        const lessonProgress: ILessonProgress[] = lessonsInCourse.map(lesson => ({
            lessonId: lesson._id,
            completed: false,
            isLocked: true,
        }));

        if (lessonProgress.length > 0) {
            lessonProgress[0].isLocked = false;
        }

        const newEnrollmentData: Partial<IEnrollment> = {
            userId,
            courseId,
            enrollmentDate: new Date(),
            status: EnrollmentStatus.InProgress,
            sessionCountAttended: 0,
            paymentStatus: PaymentStatus.Pending,
            adminApprovalStatus: AdminApprovalStatus.Pending,
            progress: lessonProgress,
        };

        return await this.enrollmentRepository.create(newEnrollmentData);
    }

    async enrollUserInCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment> {
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid user or course ID format', 400);
        }

        const course = await this.courseRepository.findById(courseId);
        if (!course) {
            throw new AppError('Course not found', 404);
        }

        let enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);

        if (enrollment) {
            if (enrollment.paymentStatus === PaymentStatus.Completed && enrollment.adminApprovalStatus === AdminApprovalStatus.Approved) {
                throw new AppError('User already fully enrolled in this course', 409);
            }
            enrollment = await this.enrollmentRepository.update(enrollment._id, {
                paymentStatus: PaymentStatus.Completed,
                adminApprovalStatus: AdminApprovalStatus.Approved,
                status: EnrollmentStatus.InProgress,
            });
            if (!enrollment) {
                throw new AppError('Failed to update existing free enrollment', 500);
            }
            return enrollment;
        }

        const newEnrollment = await this.createEnrollment(userId, courseId);
        const finalEnrollment = await this.enrollmentRepository.update(newEnrollment._id, {
            paymentStatus: PaymentStatus.Completed,
            adminApprovalStatus: AdminApprovalStatus.Approved,
            status: EnrollmentStatus.InProgress,
        });
        if (!finalEnrollment) {
            throw new AppError('Failed to finalize free course enrollment', 500);
        }
        return finalEnrollment;
    }

async initiateEnrollment(userId: Types.ObjectId, courseId: Types.ObjectId, amount: number, currency: string): Promise<{ enrollment: IEnrollment; order: any }> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(courseId)) {
        throw new AppError('Invalid user or course ID format', 400);
    }

  
    if (!Number.isInteger(amount) || amount < 100 || amount > 10000000) {
        console.error(`[initiateEnrollment] Invalid amount: ${amount} paise for course ${courseId}. Must be an integer between 100 and 10000000 paise.`);
        throw new AppError('Invalid amount: Amount must be between 100 and 10000000 paise and an integer.', 400);
    }

    const course = await this.courseRepository.findById(courseId);
    if (!course) {
        throw new AppError('Course not found', 404);
    }

    let enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);

    if (enrollment) {
        if (enrollment.paymentStatus === PaymentStatus.Completed && enrollment.adminApprovalStatus === AdminApprovalStatus.Approved) {
            throw new AppError('User is already fully enrolled in this course', 409);
        }
        enrollment = await this.enrollmentRepository.update(enrollment._id, {
            paymentStatus: PaymentStatus.Pending,
            adminApprovalStatus: AdminApprovalStatus.Pending,
        });
        if (!enrollment) {
            throw new AppError('Failed to prepare existing enrollment for new payment attempt', 500);
        }
    } else {
        enrollment = await this.createEnrollment(userId, courseId);
    }

    const order = await this.paymentService.createOrder(amount, currency, enrollment._id.toHexString());

    const newPaymentDetails: IPaymentDetails = {
        orderId: order.id,
        amount,
        totalAmount: amount, 
        currency,
        paymentDate: new Date(),
        status: 'initiated',
    };

    const updatedEnrollment = await this.enrollmentRepository.update(enrollment._id, {
        paymentDetails: newPaymentDetails,
        adminApprovalStatus: AdminApprovalStatus.Pending,
    });

    if (!updatedEnrollment) {
        throw new AppError('Failed to update enrollment with payment order details', 500);
    }

    return { enrollment: updatedEnrollment, order };
}
    async handlePaymentSuccess(
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string,
        userId: Types.ObjectId,
        courseId: Types.ObjectId
    ): Promise<IEnrollment> {
        const enrollment = await this.enrollmentRepository.findByOrderId(razorpayOrderId);

        if (!enrollment) {
            throw new AppError('Enrollment not found for this order.', 404);
        }

        const enrollmentUserId = enrollment.userId instanceof Types.ObjectId ? enrollment.userId : enrollment.userId._id;
        const enrollmentCourseId = enrollment.courseId instanceof Types.ObjectId ? enrollment.courseId : enrollment.courseId._id;

        if (!enrollmentUserId.equals(userId) || !enrollmentCourseId.equals(courseId)) {
            throw new AppError('User or course mismatch for this enrollment.', 404);
        }

        if (enrollment.paymentStatus === PaymentStatus.Completed) {
            return enrollment;
        }

        const isVerified = await this.paymentService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!isVerified) {
            throw new AppError('Payment signature verification failed.', 400);
        }

        const newPaymentDetails: IPaymentDetails = {
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
            amount: enrollment.paymentDetails?.amount || 0,
            totalAmount: enrollment.paymentDetails?.amount || 0,
            currency: enrollment.paymentDetails?.currency || 'INR',
            paymentDate: new Date(),
            status: 'success',
        };

        const updatedEnrollment = await this.enrollmentRepository.update(enrollment._id, {
            paymentStatus: PaymentStatus.Completed,
            adminApprovalStatus: AdminApprovalStatus.Pending,
            paymentDetails: newPaymentDetails,
        });

        if (!updatedEnrollment) {
            throw new AppError('Failed to update enrollment status after successful payment.', 500);
        }

        return updatedEnrollment;
    }

    async handlePaymentFailure(razorpayOrderId: string): Promise<IEnrollment | null> {
        const enrollment = await this.enrollmentRepository.findByOrderId(razorpayOrderId);

        if (!enrollment) {
            console.warn(`[handlePaymentFailure] Enrollment not found for order ID: ${razorpayOrderId}`);
            return null;
        }

        if (enrollment.paymentStatus === PaymentStatus.Failed) {
            return enrollment;
        }

        const newPaymentDetails: IPaymentDetails = {
            orderId: razorpayOrderId,
            amount: enrollment.paymentDetails?.amount || 0,
            totalAmount: enrollment.paymentDetails?.amount || 0,
            currency: enrollment.paymentDetails?.currency || 'INR',
            paymentDate: new Date(),
            status: 'failed',
        };

        const updatedEnrollment = await this.enrollmentRepository.update(enrollment._id, {
            paymentStatus: PaymentStatus.Failed,
            adminApprovalStatus: AdminApprovalStatus.Pending,
            paymentDetails: newPaymentDetails,
        });

        if (!updatedEnrollment) {
            throw new AppError('Failed to update enrollment status after payment failure.', 500);
        }
        return updatedEnrollment;
    }

    async approveEnrollmentByAdmin(enrollmentId: Types.ObjectId): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found.', 404);
        }

        if (enrollment.paymentStatus !== PaymentStatus.Completed) {
            throw new AppError('Cannot approve enrollment with unconfirmed payment.', 400);
        }

        if (enrollment.adminApprovalStatus === AdminApprovalStatus.Approved) {
            return enrollment;
        }

        const updatedEnrollment = await this.enrollmentRepository.update(enrollmentId, {
            adminApprovalStatus: AdminApprovalStatus.Approved,
            status: EnrollmentStatus.InProgress,
        });

        if (!updatedEnrollment) {
            throw new AppError('Failed to approve enrollment by admin.', 500);
        }

        return updatedEnrollment;
    }

    async completeEnrollment(enrollmentId: Types.ObjectId, paymentDetails: { orderId: string; paymentId: string; signature: string; amount: number; currency: string }): Promise<IEnrollment> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found', 404);
        }

        if (enrollment.paymentStatus === PaymentStatus.Completed) {
            throw new AppError('Enrollment already paid', 409);
        }

        const completePaymentDetails: IPaymentDetails = {
            ...paymentDetails,
            totalAmount: paymentDetails.amount,
            paymentDate: new Date(),
            status: 'completed',
        };

        const updatedEnrollment = await this.enrollmentRepository.update(enrollmentId, {
            paymentStatus: PaymentStatus.Completed,
            paymentDetails: completePaymentDetails,
            adminApprovalStatus: AdminApprovalStatus.Pending,
        });

        if (!updatedEnrollment) {
            throw new AppError('Failed to complete enrollment after payment', 500);
        }
        return updatedEnrollment;
    }

    async updatePaymentStatus(enrollmentId: Types.ObjectId, status: PaymentStatus, paymentDetails?: Partial<IPaymentDetails>): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }

        const updateData: Partial<IEnrollment> = { paymentStatus: status };
        if (paymentDetails) {
            updateData.paymentDetails = {
                ...paymentDetails,
                totalAmount: paymentDetails.amount || 0,
            } as IPaymentDetails;
        }

        return await this.enrollmentRepository.update(enrollmentId, updateData);
    }

    async updateEnrollmentStatus(enrollmentId: Types.ObjectId, status: EnrollmentStatus): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found.', 404);
        }

        const updatedEnrollment = await this.enrollmentRepository.update(enrollmentId, { status });
        if (!updatedEnrollment) {
            throw new AppError('Failed to update enrollment status.', 500);
        }

        return updatedEnrollment;
    }

    async updateAdminApprovalStatus(enrollmentId: Types.ObjectId, status: AdminApprovalStatus): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found', 404);
        }

        if (enrollment.paymentStatus !== PaymentStatus.Completed && status === AdminApprovalStatus.Approved) {
            throw new AppError('Cannot approve enrollment without confirmed payment.', 400);
        }

        return await this.enrollmentRepository.update(enrollmentId, { adminApprovalStatus: status });
    }

    async getEnrollmentById(enrollmentId: Types.ObjectId): Promise<IEnrollmentPopulated | null> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }

        const enrollmentDoc = await EnrollmentModel.findById(enrollmentId)
            .populate('userId', 'username email profile.firstName profile.lastName')
            .populate({
                path: 'courseId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'creatorId', select: 'username email profile.firstName profile.lastName' },
                ],
            })
            .populate('teacherId', 'username email profile.firstName profile.lastName')
            .lean()
            .exec();

        if (!enrollmentDoc) {
            return null;
        }

        return {
            _id: enrollmentDoc._id as Types.ObjectId,
            userId: enrollmentDoc.userId as any,
            courseId: enrollmentDoc.courseId as any,
            teacherId: enrollmentDoc.teacherId as any,
            enrollmentDate: enrollmentDoc.enrollmentDate,
            status: enrollmentDoc.status,
            paymentStatus: enrollmentDoc.paymentStatus,
            adminApprovalStatus: enrollmentDoc.adminApprovalStatus,
            progress: enrollmentDoc.progress as ILessonProgress[],
            sessionCountAttended: enrollmentDoc.sessionCountAttended,
            paymentDetails: enrollmentDoc.paymentDetails,
            completionDate: enrollmentDoc.completionDate,
            createdAt: enrollmentDoc.createdAt,
            updatedAt: enrollmentDoc.updatedAt,
        };
    }

    async getAllEnrollments(): Promise<IEnrollment[]> {
        return await this.enrollmentRepository.findAll();
    }

    async getEnrollmentsByCourse(courseId: Types.ObjectId): Promise<IEnrollment[]> {
        if (!Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid course ID format', 400);
        }
        return await this.enrollmentRepository.findByCourseId(courseId);
    }

    async getUserEnrollments(userId: Types.ObjectId): Promise<IEnrollmentPopulated[]> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new AppError('Invalid user ID format', 400);
        }

        const enrollments = await EnrollmentModel.find({ userId })
            .populate('userId', 'username email profile.firstName profile.lastName')
            .populate({
                path: 'courseId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'creatorId', select: 'username email profile.firstName profile.lastName' },
                ],
            })
            .populate('teacherId', 'username email profile.firstName profile.lastName')
            .lean()
            .exec();

        return enrollments.map(enrollmentDoc => ({
            _id: enrollmentDoc._id as Types.ObjectId,
            userId: enrollmentDoc.userId as any,
            courseId: enrollmentDoc.courseId as any,
            teacherId: enrollmentDoc.teacherId as any,
            enrollmentDate: enrollmentDoc.enrollmentDate,
            status: enrollmentDoc.status,
            paymentStatus: enrollmentDoc.paymentStatus,
            adminApprovalStatus: enrollmentDoc.adminApprovalStatus,
            progress: enrollmentDoc.progress as ILessonProgress[],
            sessionCountAttended: enrollmentDoc.sessionCountAttended,
            paymentDetails: enrollmentDoc.paymentDetails,
            completionDate: enrollmentDoc.completionDate,
            createdAt: enrollmentDoc.createdAt,
            updatedAt: enrollmentDoc.updatedAt,
        }));
    }

    async getEnrollmentsWithPaymentDetails(): Promise<IEnrollmentPopulated[]> {
        const enrollments = await EnrollmentModel.find({
            paymentStatus: PaymentStatus.Completed,
            adminApprovalStatus: AdminApprovalStatus.Pending,
        })
            .populate('userId', 'username email profile.firstName profile.lastName')
            .populate({
                path: 'courseId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'creatorId', select: 'username email profile.firstName profile.lastName' },
                ],
            })
            .populate('teacherId', 'username email profile.firstName profile.lastName')
            .lean()
            .exec();

        return enrollments.map(enrollmentDoc => ({
            _id: enrollmentDoc._id as Types.ObjectId,
            userId: enrollmentDoc.userId as any,
            courseId: enrollmentDoc.courseId as any,
            teacherId: enrollmentDoc.teacherId as any,
            enrollmentDate: enrollmentDoc.enrollmentDate,
            status: enrollmentDoc.status,
            paymentStatus: enrollmentDoc.paymentStatus,
            adminApprovalStatus: enrollmentDoc.adminApprovalStatus,
            progress: enrollmentDoc.progress as ILessonProgress[],
            sessionCountAttended: enrollmentDoc.sessionCountAttended,
            paymentDetails: enrollmentDoc.paymentDetails,
            completionDate: enrollmentDoc.completionDate,
            createdAt: enrollmentDoc.createdAt,
            updatedAt: enrollmentDoc.updatedAt,
        }));
    }

    async getEnrollmentProgress(enrollmentId: Types.ObjectId): Promise<ILessonProgress[] | null> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        return enrollment ? enrollment.progress : null;
    }

    async unlockLesson(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, adminOrTeacherId: Types.ObjectId, role: string): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId) || !Types.ObjectId.isValid(lessonId) || !Types.ObjectId.isValid(adminOrTeacherId)) {
            throw new AppError('Invalid ID format for enrollment, lesson, or user', 400);
        }

        if (role !== 'admin' && role !== 'teacher') {
            throw new AppError('Unauthorized: Only admins or teachers can unlock lessons', 403);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found', 404);
        }

        const lessonIndex = enrollment.progress.findIndex(lp => lp.lessonId.equals(lessonId));
        if (lessonIndex === -1) {
            throw new AppError('Lesson not found in this enrollment', 404);
        }

        if (role === 'teacher') {
            const courseId = enrollment.courseId instanceof Types.ObjectId ? enrollment.courseId : enrollment.courseId._id;
            const course = await this.courseRepository.findById(courseId);
            if (!course || !course.creatorId.equals(adminOrTeacherId)) {
                throw new AppError('Unauthorized: Teacher is not the creator of this course', 403);
            }
        }

        if (!enrollment.progress[lessonIndex].isLocked) {
            return enrollment;
        }

        enrollment.progress[lessonIndex].isLocked = false;
        return await this.enrollmentRepository.update(enrollmentId, { progress: enrollment.progress });
    }

    async lockLesson(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, adminOrTeacherId: Types.ObjectId, role: string): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId) || !Types.ObjectId.isValid(lessonId) || !Types.ObjectId.isValid(adminOrTeacherId)) {
            throw new AppError('Invalid ID format for enrollment, lesson, or user', 400);
        }

        if (role !== 'admin' && role !== 'teacher') {
            throw new AppError('Unauthorized: Only admins or teachers can lock lessons', 403);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found', 404);
        }

        const lessonIndex = enrollment.progress.findIndex(lp => lp.lessonId.equals(lessonId));
        if (lessonIndex === -1) {
            throw new AppError('Lesson not found in this enrollment', 404);
        }

        if (role === 'teacher') {
            const courseId = enrollment.courseId instanceof Types.ObjectId ? enrollment.courseId : enrollment.courseId._id;
            const course = await this.courseRepository.findById(courseId);
            if (!course || !course.creatorId.equals(adminOrTeacherId)) {
                throw new AppError('Unauthorized: Teacher is not the creator of this course', 403);
            }
        }

        if (enrollment.progress[lessonIndex].isLocked) {
            return enrollment;
        }

        enrollment.progress[lessonIndex].isLocked = true;
        enrollment.progress[lessonIndex].completed = false;
        enrollment.progress[lessonIndex].completedAt = undefined;

        return await this.enrollmentRepository.update(enrollmentId, { progress: enrollment.progress });
    }

    async markLessonComplete(enrollmentId: Types.ObjectId, lessonId: Types.ObjectId, userId: Types.ObjectId): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId) || !Types.ObjectId.isValid(lessonId) || !Types.ObjectId.isValid(userId)) {
            throw new AppError('Invalid ID format for enrollment, lesson, or user', 400);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found', 404);
        }

        const enrollmentUserId = enrollment.userId instanceof Types.ObjectId ? enrollment.userId : enrollment.userId._id;
        if (!enrollmentUserId.equals(userId)) {
            throw new AppError('Unauthorized: User is not associated with this enrollment', 403);
        }

        const lessonIndex = enrollment.progress.findIndex(lp => lp.lessonId.equals(lessonId));
        if (lessonIndex === -1) {
            throw new AppError('Lesson not found in this enrollment', 404);
        }

        if (enrollment.progress[lessonIndex].isLocked) {
            throw new AppError('Cannot mark locked lesson as complete. Please unlock it first.', 400);
        }

        if (enrollment.progress[lessonIndex].completed) {
            return enrollment;
        }

        enrollment.progress[lessonIndex].completed = true;
        enrollment.progress[lessonIndex].completedAt = new Date();

        const updatedEnrollment = await this.enrollmentRepository.update(enrollmentId, { progress: enrollment.progress });
        if (!updatedEnrollment) {
            throw new AppError('Failed to mark lesson complete', 500);
        }

        return updatedEnrollment;
    }

    async findByUserAndCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid user or course ID format', 400);
        }
        return await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
    }

    async getEnrollmentsForAdminApproval(): Promise<IEnrollment[]> {
        return await this.enrollmentRepository.find({
            paymentStatus: PaymentStatus.Completed,
            adminApprovalStatus: AdminApprovalStatus.Pending,
        });
    }

    async updateEnrollmentSessionCount(enrollmentId: Types.ObjectId, sessionCount: number): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found.', 404);
        }

        const updatedEnrollment = await this.enrollmentRepository.update(enrollmentId, { sessionCountAttended: sessionCount });
        if (!updatedEnrollment) {
            throw new AppError('Failed to update enrollment session count.', 500);
        }

        return updatedEnrollment;
    }

    async assignTeacher(enrollmentId: Types.ObjectId, teacherId: Types.ObjectId): Promise<IEnrollment | null> {
        if (!Types.ObjectId.isValid(enrollmentId) || !Types.ObjectId.isValid(teacherId)) {
            throw new AppError('Invalid enrollment or teacher ID format', 400);
        }

        const enrollment = await this.enrollmentRepository.findById(enrollmentId);
        if (!enrollment) {
            throw new AppError('Enrollment not found', 404);
        }

        const teacher = await this.userRepository.findById(teacherId);
        if (!teacher || teacher.role !== 'Teacher') {
            throw new AppError('Invalid teacher ID or user is not a teacher', 400);
        }

        return await this.enrollmentRepository.update(enrollmentId, { teacherId });
    }

    async delete(enrollmentId: Types.ObjectId): Promise<boolean> {
        if (!Types.ObjectId.isValid(enrollmentId)) {
            throw new AppError('Invalid enrollment ID format', 400);
        }
        return await this.enrollmentRepository.delete(enrollmentId);
    }
}
