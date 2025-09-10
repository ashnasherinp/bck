


// backend/src/routes/enrollmentRoutes.ts
import { Router } from 'express';
import { asyncMiddleware } from '../utils/middleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentFailure,
    getUserEnrollments,
    unenrollUser,
} from '../controllers/enrollmentController';

const router = Router();

router.use(asyncMiddleware(authMiddleware));

router.post('/:courseId/payment', asyncMiddleware(initiatePayment));
router.post('/payment-success', asyncMiddleware(handlePaymentSuccess));
router.post('/payment-failure', asyncMiddleware(handlePaymentFailure));
router.get('/my', asyncMiddleware(getUserEnrollments));
router.delete('/:courseId', asyncMiddleware(unenrollUser));



export default router;