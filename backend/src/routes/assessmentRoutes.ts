

// backend/src/routes/assessmentRoutes.ts

import express from 'express';
import { asyncMiddleware } from '../utils/middleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware'; 

import { 
  createAssessment, 
  getAssessmentsByCourse, 
  getAssessmentById, 
  updateAssessment, 
  deleteAssessment, 
  publishAssessment, 
  unpublishAssessment, 
  submitAssessment,
  createQuestion, 
  getQuestionsByAssessment,
  updateQuestion,
  deleteQuestion
} from '../controllers/assessmentController'; 

const router = express.Router();

// Public routes for user access
router.get('/course/:courseId', asyncMiddleware(authMiddleware), asyncMiddleware(getAssessmentsByCourse));
router.get('/:assessmentId', asyncMiddleware(authMiddleware), asyncMiddleware(getAssessmentById));
router.post('/:assessmentId/submit', asyncMiddleware(authMiddleware), asyncMiddleware(submitAssessment));

// Admin routes for assessments
router.post('/', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(createAssessment));
router.put('/:assessmentId', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(updateAssessment));
router.delete('/:assessmentId', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(deleteAssessment));
router.patch('/:assessmentId/publish', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(publishAssessment));
router.patch('/:assessmentId/unpublish', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(unpublishAssessment));

// Admin routes for questions
router.post('/:assessmentId/questions', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(createQuestion));
router.get('/:assessmentId/questions', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(getQuestionsByAssessment));
router.put('/questions/:questionId', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(updateQuestion));
router.delete('/questions/:questionId', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(deleteQuestion));

export default router;