



// backend/src/controllers/assessmentController.ts
import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../utils/dependecy-container';
import { IAssessmentService } from '../interfaces/assessmentServiceInterface';
import { IQuestionService } from '../interfaces/questionServiceInterface';
import { AuthenticatedRequest } from '../types/express';
import AppError from '../utils/appError';
import { handleControllerError } from '../utils/handleControllerError';
import { Types } from 'mongoose';
import { AssessmentType, IAssessmentBase } from '../interfaces/assessmentInterface';
import { IQuestion, IQuestionBase, ICreateQuestionData, QuestionType } from '../interfaces/questionInterface';

const container = DependencyContainer.getInstance();
const assessmentService: IAssessmentService = container.getAssessmentService();
const questionService: IQuestionService = container.getQuestionService();

export const createAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { courseId, lessonId, title, description, type, maxScore, durationMinutes, passPercentage, isPublished } = req.body;
        const creatorId = req.user._id;
        const creatorRole = req.user.role;

        if (!courseId || !title || !type) {
            throw new AppError('Course ID, title, and type are required.', 400);
        }

        if (!Types.ObjectId.isValid(courseId) || (lessonId && !Types.ObjectId.isValid(lessonId))) {
            throw new AppError('Invalid Course ID or Lesson ID format.', 400);
        }

        if (!Object.values(AssessmentType).includes(type)) {
            throw new AppError(`Type must be one of: ${Object.values(AssessmentType).join(', ')}`, 400);
        }

        const maxScoreNum = parseFloat(maxScore);
        const durationMinutesNum = parseInt(durationMinutes);
        const passPercentageNum = parseFloat(passPercentage);

        if (maxScore && (isNaN(maxScoreNum) || maxScoreNum <= 0)) {
            throw new AppError('Max score must be a positive number.', 400);
        }
        if (durationMinutes && (isNaN(durationMinutesNum) || durationMinutesNum <= 0)) {
            throw new AppError('Duration must be a positive integer.', 400);
        }
        if (passPercentage && (isNaN(passPercentageNum) || passPercentageNum < 0 || passPercentageNum > 100)) {
            throw new AppError('Pass percentage must be between 0 and 100.', 400);
        }

        const assessmentData = {
            courseId: new Types.ObjectId(courseId),
            lessonId: lessonId ? new Types.ObjectId(lessonId) : undefined,
            title,
            description,
            type,
            maxScore: maxScoreNum,
            durationMinutes: durationMinutesNum,
            passPercentage: passPercentageNum,
            isPublished: isPublished || false,
        };

        const newAssessment = await assessmentService.createAssessment(assessmentData, creatorId, creatorRole);
        return res.status(201).json(newAssessment);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error creating assessment');
    }
};

export const updateAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { assessmentId } = req.params;
        const { title, description, type, maxScore, durationMinutes, passPercentage, isPublished } = req.body;
        const editorId = req.user._id;
        const editorRole = req.user.role;

        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID.', 400);
        }

        const updateData: Partial<IAssessmentBase> = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (type) {
            if (!Object.values(AssessmentType).includes(type)) {
                throw new AppError(`Type must be one of: ${Object.values(AssessmentType).join(', ')}`, 400);
            }
            updateData.type = type;
        }
        if (maxScore) {
            const maxScoreNum = parseFloat(maxScore);
            if (isNaN(maxScoreNum) || maxScoreNum <= 0) {
                throw new AppError('Max score must be a positive number.', 400);
            }
            updateData.maxScore = maxScoreNum;
        }
        if (durationMinutes) {
            const durationMinutesNum = parseInt(durationMinutes);
            if (isNaN(durationMinutesNum) || durationMinutesNum <= 0) {
                throw new AppError('Duration must be a positive integer.', 400);
            }
            updateData.durationMinutes = durationMinutesNum;
        }
        if (passPercentage) {
            const passPercentageNum = parseFloat(passPercentage);
            if (isNaN(passPercentageNum) || passPercentageNum < 0 || passPercentageNum > 100) {
                throw new AppError('Pass percentage must be between 0 and 100.', 400);
            }
            updateData.passPercentage = passPercentageNum;
        }
        if (typeof isPublished === 'boolean') updateData.isPublished = isPublished;

        const updatedAssessment = await assessmentService.updateAssessment(assessmentId, updateData, editorId, editorRole);
        if (!updatedAssessment) {
            throw new AppError('Assessment not found.', 404);
        }
        return res.status(200).json(updatedAssessment);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error updating assessment');
    }
};

export const deleteAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { assessmentId } = req.params;
        const deleterId = req.user._id;
        const deleterRole = req.user.role;

        const success = await assessmentService.deleteAssessment(assessmentId, deleterId, deleterRole);
        if (!success) {
            throw new AppError('Assessment not found.', 404);
        }
        return res.status(204).send();
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error deleting assessment');
    }
};

export const publishAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { assessmentId } = req.params;
        const adminId = req.user._id;

        const updatedAssessment = await assessmentService.publishAssessment(assessmentId, adminId);
        if (!updatedAssessment) {
            throw new AppError('Assessment not found.', 404);
        }
        return res.status(200).json(updatedAssessment);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error publishing assessment');
    }
};

export const unpublishAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { assessmentId } = req.params;
        const adminId = req.user._id;

        const updatedAssessment = await assessmentService.unpublishAssessment(assessmentId, adminId);
        if (!updatedAssessment) {
            throw new AppError('Assessment not found.', 404);
        }
        return res.status(200).json(updatedAssessment);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error unpublishing assessment');
    }
};

export const getAssessmentsByCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { courseId } = req.params;
        if (!Types.ObjectId.isValid(courseId)) {
            throw new AppError('Invalid course ID.', 400);
        }
        const assessments = await assessmentService.getAssessmentsByCourseId(courseId);
        return res.status(200).json(assessments);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error fetching assessments');
    }
};

export const getAssessmentById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { assessmentId } = req.params;
        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID.', 400);
        }
        const assessment = await assessmentService.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new AppError('Assessment not found.', 404);
        }
        return res.status(200).json(assessment);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error fetching assessment');
    }
};

export const submitAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { assessmentId } = req.params;
        const { submission } = req.body;
        const userId = req.user._id;

        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID.', 400);
        }
        if (!Array.isArray(submission)) {
            throw new AppError('Submission must be an array.', 400);
        }

        const assessment = await assessmentService.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new AppError('Assessment not found.', 404);
        }

        let score = 0;
        for (const answer of submission) {
            const question = await questionService.findById(new Types.ObjectId(answer.questionId));
            if (!question) {
                throw new AppError(`Question ${answer.questionId} not found.`, 404);
            }
            if (question.type === 'MultipleChoice' && answer.selectedOption === question.correctAnswer) {
                score += question.points || 1;
            } else if (question.type === 'TrueFalse' && answer.selectedOption === question.correctAnswer) {
                score += question.points || 1;
            }
        }

        return res.status(200).json({ score, maxScore: assessment.maxScore });
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error submitting assessment');
    }
};

export const createQuestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { assessmentId } = req.params;
        const creatorId = req.user._id;
        const creatorRole = req.user.role;

     
        console.log('[createQuestion] FormData received:');
        for (const [key, value] of Object.entries(req.body)) {
            console.log(`[FormData] ${key}:`, value);
        }

 
        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID.', 400);
        }

        const assessment = await assessmentService.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new AppError('Assessment not found.', 404);
        }
        console.log(`[createQuestion] Assessment:`, { assessmentId, courseId: assessment.courseId });
        console.log(`[createQuestion] User:`, { creatorId, creatorRole });


        const questionText = req.body.questionText;
        const type = req.body.type as QuestionType;
        const points = parseInt(req.body.points);
        let options = req.body.options ? JSON.parse(req.body.options) : undefined;
        let correctAnswer = req.body.correctAnswer;
        if (!questionText || !type || isNaN(points) || points < 0) {
            throw new AppError('Question text, type, and valid points are required.', 400);
        }

       
        if (!Object.values(QuestionType).includes(type)) {
            throw new AppError(`Invalid question type: ${type}. Must be one of: ${Object.values(QuestionType).join(', ')}`, 400);
        }

        if (type === QuestionType.MultipleChoice) {
            if (!Array.isArray(options) || options.length !== 4 || options.some(opt => !opt)) {
                throw new AppError('Multiple choice questions require four non-empty options.', 400);
            }
            const correctAnswerNum = parseInt(correctAnswer);
            if (isNaN(correctAnswerNum) || correctAnswerNum < 0 || correctAnswerNum > 3) {
                throw new AppError('Correct answer must be a number between 0 and 3 for multiple choice.', 400);
            }
            correctAnswer = correctAnswerNum;
        } else if (type === QuestionType.TrueFalse) {
            if (!['true', 'false'].includes(correctAnswer)) {
                throw new AppError('Correct answer must be "true" or "false" for true/false questions.', 400);
            }
            correctAnswer = correctAnswer === 'true';
        } else if (type === QuestionType.FileUpload) {
            correctAnswer = undefined;
            options = undefined;
        }

  
        let imageUrl: string | undefined;
        if (req.file) {
            imageUrl = await questionService.uploadQuestionFile(req.file, type);
        }

        const questionData: ICreateQuestionData = {
            assessmentId: new Types.ObjectId(assessmentId),
            questionText,
            type,
            options,
            correctAnswer,
            points,
            imageUrl,
            orderIndex: await questionService.findLastOrderIndex(new Types.ObjectId(assessmentId)) + 1,
        };

        const newQuestion = await questionService.createQuestion(questionData, creatorId, creatorRole);
        return res.status(201).json(newQuestion);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error creating question');
    }
};

export const getQuestionsByAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { assessmentId } = req.params;
        if (!Types.ObjectId.isValid(assessmentId)) {
            throw new AppError('Invalid assessment ID.', 400);
        }
        const questions = await questionService.findByAssessmentId(new Types.ObjectId(assessmentId));
        return res.status(200).json(questions);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error fetching questions');
    }
};

export const updateQuestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { questionId } = req.params;
        const { questionText, type, options, correctAnswer, points } = req.body;
        const editorId = req.user._id;
        const editorRole = req.user.role;

        if (!Types.ObjectId.isValid(questionId)) {
            throw new AppError('Invalid question ID.', 400);
        }

        const updateData: Partial<IQuestionBase> = {};
        if (questionText) updateData.questionText = questionText;
        if (type) updateData.type = type;
        if (Array.isArray(options) && options.length === 4) updateData.options = options;
        if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer;
        if (Number.isInteger(points) && points >= 0) updateData.points = points;
        if (req.file) updateData.imageUrl = await questionService.uploadQuestionFile(req.file, type || 'MultipleChoice');

        const updatedQuestion = await questionService.updateQuestion(questionId, updateData, editorId, editorRole);
        if (!updatedQuestion) {
            throw new AppError('Question not found.', 404);
        }
        return res.status(200).json(updatedQuestion);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error updating question');
    }
};

export const deleteQuestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { questionId } = req.params;
        const deleterId = req.user._id;
        const deleterRole = req.user.role;

        const success = await questionService.deleteQuestion(questionId, deleterId, deleterRole);
        if (!success) {
            throw new AppError('Question not found.', 404);
        }
        return res.status(204).send();
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error deleting question');
    }
};
