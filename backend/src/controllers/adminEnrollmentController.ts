

// backend/src/controllers/adminEnrollmentController.ts
import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../utils/dependecy-container';
import { Types } from 'mongoose';
import { IEnrollmentService } from '../interfaces/enrollmentServiceInterface';
import { AuthenticatedRequest } from '../types/express';
import AppError from '../utils/appError';
import { AdminApprovalStatus } from '../interfaces/enrollmentInterface';

const container = DependencyContainer.getInstance();
const enrollmentService: IEnrollmentService = container.getEnrollmentService();

export const getPendingEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const enrollments = await enrollmentService.getEnrollmentsForAdminApproval();
        return res.status(200).json(enrollments);
    } catch (error: any) {
        console.error('[adminEnrollmentController] Error fetching pending enrollments:', error.message);
        res.status(400).json({ message: error.message || 'Failed to fetch pending enrollments.' });
        next(error);
    }
};

export const getEnrollmentDetails = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid enrollment ID format.' });
        }
        const enrollment = await enrollmentService.getEnrollmentById(new Types.ObjectId(id));
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        return res.status(200).json(enrollment);
    } catch (error: any) {
        console.error('[adminEnrollmentController] Error fetching enrollment details:', error.message);
        res.status(400).json({ message: error.message || 'Failed to fetch enrollment details.' });
        next(error);
    }
};

export const approveEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid enrollment ID format.' });
        }
        const enrollment = await enrollmentService.approveEnrollmentByAdmin(new Types.ObjectId(id));
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        return res.status(200).json({ message: 'Enrollment approved successfully.', enrollment });
    } catch (error: any) {
        console.error('[adminEnrollmentController] Error approving enrollment:', error.message);
        res.status(400).json({ message: error.message || 'Failed to approve enrollment.' });
        next(error);
    }
};

export const rejectEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid enrollment ID format.' });
        }
        const enrollment = await enrollmentService.updateAdminApprovalStatus(new Types.ObjectId(id), AdminApprovalStatus.Rejected);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        return res.status(200).json({ message: 'Enrollment rejected successfully.', enrollment });
    } catch (error: any) {
        console.error('[adminEnrollmentController] Error rejecting enrollment:', error.message);
        res.status(400).json({ message: error.message || 'Failed to reject enrollment.' });
        next(error);
    }
};

export const assignTeacherToEnrollment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params;
        const { teacherId } = req.body;
        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({ message: 'Invalid enrollment or teacher ID format.' });
        }
        const enrollmentId = new Types.ObjectId(id);
        const teacherObjectId = new Types.ObjectId(teacherId);

        const adminId = req.user?._id;
        if (!adminId) {
            throw new AppError('Admin authentication information missing.', 401);
        }

        const updatedEnrollment = await enrollmentService.assignTeacher(enrollmentId, teacherObjectId);
        if (!updatedEnrollment) {
            return res.status(404).json({ message: 'Enrollment not found or could not assign teacher.' });
        }
        return res.status(200).json({ message: 'Teacher assigned successfully.', enrollment: updatedEnrollment });
    } catch (error: any) {
        console.error('[adminEnrollmentController] Error assigning teacher:', error.message);
        res.status(400).json({ message: error.message || 'Failed to assign teacher.' });
        next(error);
    }
};
