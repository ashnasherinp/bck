
// backend/src/routes/lessonRoutes.ts
import express from 'express';
import { asyncMiddleware } from '../utils/middleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware'; 
import { getLessonsByCourse, createLesson, updateLesson, deleteLesson, publishLesson, unpublishLesson } from '../controllers/lessonController';

const router = express.Router();

router.get('/course/:courseId', asyncMiddleware(authMiddleware), asyncMiddleware(getLessonsByCourse));


router.post('/', asyncMiddleware(authMiddleware), asyncMiddleware(authMiddleware ), asyncMiddleware(createLesson));
router.patch('/:lessonId', asyncMiddleware(authMiddleware), asyncMiddleware(authMiddleware ), asyncMiddleware(updateLesson));
router.delete('/:lessonId', asyncMiddleware(authMiddleware), asyncMiddleware(authMiddleware ), asyncMiddleware(deleteLesson));

router.patch('/:lessonId/publish', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(publishLesson));
router.patch('/:lessonId/unpublish', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(unpublishLesson));

export default router;