


// // backend/src/routes/adminEnrollmentRoutes.ts
import { Router } from 'express';
import { asyncMiddleware } from '../utils/middleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import {
    assignTeacherToEnrollment,
} from '../controllers/adminController';
import {
    getPendingEnrollments,
    getEnrollmentDetails,
    approveEnrollment,
    rejectEnrollment,
} from '../controllers/adminEnrollmentController';

const router = Router();

router.use(asyncMiddleware(authMiddleware), adminMiddleware);

router.get('/pending', asyncMiddleware(getPendingEnrollments));
router.get('/:id', asyncMiddleware(getEnrollmentDetails));
router.patch('/:id/approve', asyncMiddleware(approveEnrollment));
router.patch('/:id/reject', asyncMiddleware(rejectEnrollment));
router.patch('/:id/assign-teacher', asyncMiddleware(assignTeacherToEnrollment));

export default router;
