


// backend/src/controllers/userCourseController.ts
import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../utils/dependecy-container';
import { Types } from 'mongoose';
import { CustomRequest } from '../utils/types';
import { IEnrollmentService } from '../interfaces/enrollmentServiceInterface';
import { EnrollmentStatus } from '../interfaces/enrollmentInterface';
import { ICourseService } from '../interfaces/courseserviceInterface';
import { IPaymentService } from '../interfaces/paymentServiceInterface';

const container = DependencyContainer.getInstance();
const enrollmentService: IEnrollmentService = container.getEnrollmentService();
const courseService: ICourseService = container.getCourseService();
const paymentService: IPaymentService = container.getPaymentService();

export const getApprovedCourses = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const courses = await courseService.getApprovedCourses();
        return res.status(200).json(courses);
    } catch (error: any) {
        console.error('[userCourseController] Error fetching approved courses:', error.message);
        res.status(500).json({ message: error.message || 'Failed to fetch approved courses.' });
        next(error);
    }
};

export const getApprovedCourseById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const courseId = req.params.id;
        if (!Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID format.' });
        }
        const course = await courseService.getCourseById(new Types.ObjectId(courseId));
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        return res.status(200).json(course);
    } catch (error: any) {
        console.error('[userCourseController] Error fetching approved course by ID:', error.message);
        res.status(500).json({ message: error.message || 'Failed to fetch course.' });
        next(error);
    }
};

export const enrollInCourse = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userId = req.user?._id;
        const courseId = req.params.courseId;
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: 'User not authenticated or invalid ID.' });
        }
        if (!courseId || !Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Course ID is required and must be valid.' });
        }

        const course = await courseService.getCourseById(new Types.ObjectId(courseId));
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        const effectivePrice = course.effectivePrice ?? course.price;
        console.log(`[enrollInCourse] Effective price for course ${courseId}: ${effectivePrice} INR`);

        if (!effectivePrice || typeof effectivePrice !== 'number' || effectivePrice <= 0) {
            const enrollment = await enrollmentService.enrollUserInCourse(userId, new Types.ObjectId(courseId));
            return res.status(200).json({
                message: 'Course enrolled successfully (free course).',
                enrollmentId: enrollment._id,
                isFreeCourse: true,
            });
        } else {
            const amountInPaise = Math.round(effectivePrice * 100);
            const currency = 'INR';
            const { enrollment, order } = await enrollmentService.initiateEnrollment(userId, new Types.ObjectId(courseId), amountInPaise, currency);
            return res.status(200).json({
                message: 'Payment order created. Proceed to payment.',
                orderId: order.id,
                amount: order.amount / 100,
                currency: order.currency,
                enrollmentId: enrollment._id,
                isFreeCourse: false,
            });
        }
    } catch (error: any) {
        console.error('[userCourseController] Error enrolling in course:', error.message);
        res.status(400).json({ message: error.message || 'Failed to enroll in course.' });
        next(error);
    }
};

export const handleRazorpayPaymentCallback = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId || !userId) {
            return res.status(400).json({ message: 'Missing required payment callback details.' });
        }
        if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID or Course ID format.' });
        }

        const isValidSignature = paymentService.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValidSignature) {
            await enrollmentService.handlePaymentFailure(razorpay_order_id);
            return res.status(400).json({ message: 'Payment verification failed: Invalid signature.' });
        }

        const updatedEnrollment = await enrollmentService.handlePaymentSuccess(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            new Types.ObjectId(userId),
            new Types.ObjectId(courseId)
        );

        if (!updatedEnrollment) {
            throw new Error('Payment successful, but enrollment update failed.');
        }

        const invoice = await paymentService.generateInvoice(
            razorpay_order_id,
            razorpay_payment_id,
            userId,
            courseId,
            updatedEnrollment.paymentDetails?.amount || 0,
            updatedEnrollment.paymentDetails?.currency || 'INR'
        );

        return res.status(200).json({
            message: 'Payment successful, enrollment pending admin approval.',
            enrollment: updatedEnrollment,
            invoice, 
        });
    } catch (error: any) {
        console.error('[userCourseController] Error handling Razorpay payment callback:', error.message);
        res.status(500).json({ message: error.message || 'Failed to process payment callback.' });
        next(error);
    }
};

export const getMyEnrollments = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userId = req.user?._id;
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: 'User not authenticated or invalid ID.' });
        }

        const enrollments = await enrollmentService.getUserEnrollments(userId);
        return res.status(200).json(enrollments);
    } catch (error: any) {
        console.error('[userCourseController] Error fetching user enrollments:', error.message);
        res.status(500).json({ message: error.message || 'Failed to fetch user enrollments.' });
        next(error);
    }
};

export const updateEnrollmentProgress = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userId = req.user?._id;
        const { enrollmentId } = req.params;
        const { sessionCountAttended } = req.body;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: 'User not authenticated or invalid ID.' });
        }
        if (!enrollmentId || !Types.ObjectId.isValid(enrollmentId)) {
            return res.status(400).json({ message: 'Enrollment ID is required and must be valid.' });
        }
        if (typeof sessionCountAttended !== 'number' || sessionCountAttended < 0) {
            return res.status(400).json({ message: 'Session count must be a non-negative number.' });
        }

        const existingEnrollment = await enrollmentService.getEnrollmentById(new Types.ObjectId(enrollmentId));
        if (!existingEnrollment || !existingEnrollment.userId._id.equals(userId)) {
            return res.status(403).json({ message: 'Access denied to this enrollment.' });
        }

        const updatedEnrollment = await enrollmentService.updateEnrollmentSessionCount(
            new Types.ObjectId(enrollmentId),
            sessionCountAttended
        );

        if (!updatedEnrollment) {
            return res.status(404).json({ message: 'Enrollment not found or update failed.' });
        }

        return res.status(200).json({ message: 'Enrollment progress updated successfully.', enrollment: updatedEnrollment });
    } catch (error: any) {
        console.error('[userCourseController] Error updating enrollment progress:', error.message);
        res.status(400).json({ message: error.message || 'Failed to update enrollment progress.' });
        next(error);
    }
};

export const updateEnrollmentStatus = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userId = req.user?._id;
        const { enrollmentId } = req.params;
        const { status } = req.body;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: 'User not authenticated or invalid ID.' });
        }
        if (!enrollmentId || !Types.ObjectId.isValid(enrollmentId)) {
            return res.status(400).json({ message: 'Enrollment ID is required and must be valid.' });
        }
        if (!Object.values(EnrollmentStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid enrollment status provided.' });
        }

        const existingEnrollment = await enrollmentService.getEnrollmentById(new Types.ObjectId(enrollmentId));
        if (!existingEnrollment || !existingEnrollment.userId._id.equals(userId)) {
            return res.status(403).json({ message: 'Access denied to this enrollment.' });
        }

        const updatedEnrollment = await enrollmentService.updateEnrollmentStatus(
            new Types.ObjectId(enrollmentId),
            status
        );

        if (!updatedEnrollment) {
            return res.status(404).json({ message: 'Enrollment not found or status update failed.' });
        }

        return res.status(200).json({ message: 'Enrollment status updated successfully.', enrollment: updatedEnrollment });
    } catch (error: any) {
        console.error('[userCourseController] Error updating enrollment status:', error.message);
        res.status(400).json({ message: error.message || 'Failed to update enrollment status.' });
        next(error);
    }
};