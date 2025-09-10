

// backend/src/controllers/enrollmentController.ts
import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../utils/dependecy-container';
import { Types } from 'mongoose';
import { CustomRequest } from '../utils/types';
import { IEnrollmentService } from '../interfaces/enrollmentServiceInterface';
import { ICourseService } from '../interfaces/courseserviceInterface';

const container = DependencyContainer.getInstance();
const enrollmentService: IEnrollmentService = container.getEnrollmentService();
const courseService: ICourseService = container.getCourseService();

export const initiatePayment = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userId = req.user?._id;
        const { courseId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated or invalid ID.' });
        }
        if (!courseId || !Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Course ID is required and must be valid.' });
        }
        const courseObjectId = new Types.ObjectId(courseId);

        const course = await courseService.getCourseById(courseObjectId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        const amount = course.effectivePrice !== undefined ? course.effectivePrice : course.price;
        const currency = 'INR';

        if (amount <= 0) {
            const enrollment = await enrollmentService.enrollUserInCourse(userId, courseObjectId);
            return res.status(200).json({
                message: 'Course enrolled successfully (free course).',
                enrollmentId: enrollment._id,
                isFreeCourse: true,
            });
        }

        const { enrollment, order } = await enrollmentService.initiateEnrollment(userId, courseObjectId, amount, currency);

        return res.status(200).json({
            message: 'Payment order created.',
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            enrollmentId: enrollment._id,
        });
    } catch (error: any) {
        console.error('[enrollmentController] Error initiating payment:', error.message);
        res.status(400).json({ message: error.message || 'Failed to initiate payment.' });
        next(error);
    }
};

export const handlePaymentSuccess = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated or invalid ID.' });
        }
        if (!courseId || !Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Course ID is required and must be valid.' });
        }
        const courseObjectId = new Types.ObjectId(courseId);

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing Razorpay payment details.' });
        }

        const updatedEnrollment = await enrollmentService.handlePaymentSuccess(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            courseObjectId
        );

        if (!updatedEnrollment) {
            throw new Error('Payment processing failed: Enrollment not found or updated.');
        }

        return res.status(200).json({
            message: 'Payment successful. Awaiting admin approval.',
            enrollment: updatedEnrollment,
        });
    } catch (error: any) {
        console.error('[enrollmentController] Error handling payment success:', error.message);
        res.status(400).json({ message: error.message || 'Payment verification failed.' });
        next(error);
    }
};

export const handlePaymentFailure = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { razorpay_order_id } = req.body;

        if (!razorpay_order_id) {
            return res.status(400).json({ message: 'Missing Razorpay order ID for payment failure.' });
        }

        const updatedEnrollment = await enrollmentService.handlePaymentFailure(razorpay_order_id);

        return res.status(200).json({
            message: 'Payment failed and enrollment status updated.',
            enrollment: updatedEnrollment,
        });
    } catch (error: any) {
        console.error('[enrollmentController] Error handling payment failure:', error.message);
        res.status(400).json({ message: error.message || 'Failed to process payment failure.' });
        next(error);
    }
};

export const getUserEnrollments = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated or invalid ID.' });
        }

        const enrollments = await enrollmentService.getUserEnrollments(userId);
        return res.status(200).json(enrollments);
    } catch (error: any) {
        console.error('[enrollmentController] Error fetching user enrollments:', error.message);
        res.status(400).json({ message: error.message || 'Failed to fetch enrollments.' });
        next(error);
    }
};

export const unenrollUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userId = req.user?._id;
        const { courseId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated or invalid ID.' });
        }
        if (!courseId || !Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Course ID is required and must be valid.' });
        }

        const enrollment = await enrollmentService.findByUserAndCourse(userId, new Types.ObjectId(courseId));
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }

        const deleted = await enrollmentService.delete(enrollment._id);
        if (!deleted) {
            return res.status(500).json({ message: 'Failed to unenroll from course.' });
        }

        return res.status(200).json({ message: 'Successfully unenrolled from course.' });
    } catch (error: any) {
        console.error('[enrollmentController] Error unenrolling user:', error.message);
        res.status(400).json({ message: error.message || 'Failed to unenroll from course.' });
        next(error);
    }
};
