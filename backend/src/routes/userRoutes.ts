

// backend/src/routes/userRoutes.ts
import express from 'express';
import { asyncMiddleware } from '../utils/middleware';
import { authMiddleware } from '../middleware/authMiddleware';

import {
    getApprovedCourses,
    getApprovedCourseById,
    enrollInCourse,
    handleRazorpayPaymentCallback,
    getMyEnrollments,
    updateEnrollmentProgress,
    updateEnrollmentStatus,
} from '../controllers/userCourseController';

const router = express.Router();


router.post('/payment/callback', asyncMiddleware(handleRazorpayPaymentCallback));


router.get('/courses', asyncMiddleware(authMiddleware), asyncMiddleware(getApprovedCourses));
router.get('/courses/:id', asyncMiddleware(authMiddleware), asyncMiddleware(getApprovedCourseById));

router.post('/enroll/:courseId', asyncMiddleware(authMiddleware), asyncMiddleware(enrollInCourse));

router.get('/my-enrollments', asyncMiddleware(authMiddleware), asyncMiddleware(getMyEnrollments));

router.patch('/enrollments/:enrollmentId/progress', asyncMiddleware(authMiddleware), asyncMiddleware(updateEnrollmentProgress));
router.patch('/enrollments/:enrollmentId/status', asyncMiddleware(authMiddleware), asyncMiddleware(updateEnrollmentStatus));

export default router;