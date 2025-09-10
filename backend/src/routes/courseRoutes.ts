


import express from 'express';
import { asyncMiddleware } from '../utils/middleware'; 
import { authMiddleware } from '../middleware/authMiddleware';
import { getCourses, getCourseById, getEnrolledCourses } from '../controllers/courseController'; 
import { getLessonsByCourse } from '../controllers/lessonController'; 
import { getAssessmentsByCourse } from '../controllers/assessmentController'; 

const router = express.Router();

router.get('/', asyncMiddleware(authMiddleware), asyncMiddleware(getCourses));
router.get('/:id', asyncMiddleware(authMiddleware), asyncMiddleware(getCourseById));
router.get('/enrolled', asyncMiddleware(authMiddleware), asyncMiddleware(getEnrolledCourses));
router.get('/lessons/course/:courseId', asyncMiddleware(authMiddleware), asyncMiddleware(getLessonsByCourse));
router.get('/assessments/course/:courseId', asyncMiddleware(authMiddleware), asyncMiddleware(getAssessmentsByCourse));

export default router;