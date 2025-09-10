


// // backend/src/routes/adminRoutes.ts
import express from 'express';
import { asyncMiddleware } from '../utils/middleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import {
    getUsers,
    approveTeacher,
    rejectTeacher,
    blockUser,
    unblockUser,
    deleteUser,
    getDetailedEnrollments,
    getPlatformStats,
} from '../controllers/adminController';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createCourse,
    updateCourse,
    deleteCourse,
    approveCourse,
    rejectCourse,
} from '../controllers/adminCourseController';
import {
    createLesson,
    updateLesson,
    deleteLesson,
    publishLesson,
    unpublishLesson,
} from '../controllers/lessonController';
import {
    createAssessment,
    updateAssessment,
    deleteAssessment,
    publishAssessment,
    unpublishAssessment,
    createQuestion,
    getQuestionsByAssessment,
    updateQuestion,
    deleteQuestion,
} from '../controllers/assessmentController';
import { uploadMemory } from '../middleware/multterMIddleware';

const router = express.Router();

router.use(asyncMiddleware(authMiddleware));
router.use(asyncMiddleware(adminMiddleware));

// User Management Routes
router.get('/users', asyncMiddleware(getUsers));
router.patch('/users/:userId/approve', asyncMiddleware(approveTeacher));
router.patch('/users/:userId/reject', asyncMiddleware(rejectTeacher));
router.patch('/users/:userId/block', asyncMiddleware(blockUser));
router.patch('/users/:userId/unblock', asyncMiddleware(unblockUser));
router.delete('/users/:userId', asyncMiddleware(deleteUser));

router.get('/enrollments/detailed', asyncMiddleware(getDetailedEnrollments));
router.get('/stats', asyncMiddleware(getPlatformStats));

// Category Management Routes
router.get('/categories', asyncMiddleware(getCategories));
router.post('/categories', asyncMiddleware(createCategory));
router.put('/categories/:id', asyncMiddleware(updateCategory));
router.delete('/categories/:id', asyncMiddleware(deleteCategory));

// Course Management Routes
router.post('/courses', uploadMemory.single('image'), asyncMiddleware(createCourse));
router.put('/courses/:id', uploadMemory.single('image'), asyncMiddleware(updateCourse));
router.delete('/courses/:id', asyncMiddleware(deleteCourse));
router.patch('/courses/:id/approve', asyncMiddleware(approveCourse));
router.patch('/courses/:id/reject', asyncMiddleware(rejectCourse));

// Lesson Management Routes
router.post('/lessons', asyncMiddleware(createLesson));
router.patch('/lessons/:lessonId', asyncMiddleware(updateLesson));
router.delete('/lessons/:lessonId', asyncMiddleware(deleteLesson));
router.patch('/lessons/:lessonId/publish', asyncMiddleware(publishLesson));
router.patch('/lessons/:lessonId/unpublish', asyncMiddleware(unpublishLesson));

// Assessment Management Routes
router.post('/assessments', asyncMiddleware(createAssessment));
router.put('/assessments/:assessmentId', asyncMiddleware(updateAssessment));
router.delete('/assessments/:assessmentId', asyncMiddleware(deleteAssessment));
router.patch('/assessments/:assessmentId/publish', asyncMiddleware(publishAssessment));
router.patch('/assessments/:assessmentId/unpublish', asyncMiddleware(unpublishAssessment));

router.post('/assessments/:assessmentId/questions', uploadMemory.single('questionImage'), asyncMiddleware(createQuestion));
router.get('/assessments/:assessmentId/questions', asyncMiddleware(getQuestionsByAssessment));
router.put('/questions/:questionId', uploadMemory.single('questionImage'), asyncMiddleware(updateQuestion));
router.delete('/questions/:questionId', asyncMiddleware(deleteQuestion));

export default router;
