


// // backend/src/controllers/adminController.ts

import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { DependencyContainer } from '../utils/dependecy-container';
import { IAdminService } from '../interfaces/adminserviceInterface';
import { IEnrollmentService } from '../interfaces/enrollmentServiceInterface';
import { AuthenticatedRequest } from '../types/express';
import AppError from '../utils/appError';
import { handleControllerError } from '../utils/handleControllerError';

const container = DependencyContainer.getInstance();
const adminService: IAdminService = container.getAdminService();
const enrollmentService: IEnrollmentService = container.getEnrollmentService();

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { role, isApproved } = req.query;
        const query: any = {};
        if (role) query.role = role as string;
        if (isApproved !== undefined) query.isApproved = isApproved === 'true';
        const users = await adminService.getUsers(query);
        return res.status(200).json(users);
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error fetching users');
    }
};

export const approveTeacher = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.params;
        if (!Types.ObjectId.isValid(userId)) {
            throw new AppError('Invalid user ID format.', 400);
        }
        const userObjectId = new Types.ObjectId(userId);
        const updatedUser = await adminService.approveTeacher(userObjectId);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Teacher not found or approval failed' });
        }
        return res.status(200).json({ message: 'Teacher approved successfully', user: updatedUser });
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error approving teacher');
    }
};

export const rejectTeacher = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        if (!Types.ObjectId.isValid(userId)) {
            throw new AppError('Invalid user ID format.', 400);
        }
        const userObjectId = new Types.ObjectId(userId);
        if (!reason) {
            return res.status(400).json({ message: 'Rejection reason is required.' });
        }
        const updatedUser = await adminService.rejectTeacher(userObjectId, reason);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Teacher not found or rejection failed' });
        }
        return res.status(200).json({ message: 'Teacher request rejected successfully', user: updatedUser });
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error rejecting teacher');
    }
};

export const blockUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.params;
        if (!Types.ObjectId.isValid(userId)) {
            throw new AppError('Invalid user ID format.', 400);
        }
        const userObjectId = new Types.ObjectId(userId);
        const updatedUser = await adminService.blockUser(userObjectId);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or block failed' });
        }
        return res.status(200).json({ message: 'User blocked successfully', user: updatedUser });
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error blocking user');
    }
};

export const unblockUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.params;
        if (!Types.ObjectId.isValid(userId)) {
            throw new AppError('Invalid user ID format.', 400);
        }
        const userObjectId = new Types.ObjectId(userId);
        const updatedUser = await adminService.unblockUser(userObjectId);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or unblock failed' });
        }
        return res.status(200).json({ message: 'User unblocked successfully', user: updatedUser });
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error unblocking user');
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId } = req.params;
        if (!Types.ObjectId.isValid(userId)) {
            throw new AppError('Invalid user ID format.', 400);
        }
        const userObjectId = new Types.ObjectId(userId);
        await adminService.deleteUser(userObjectId);
        return res.status(204).send();
    } catch (error: any) {
        handleControllerError(error, res, next, 'Error deleting user');
    }
};

export const getDetailedEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const enrollments = await enrollmentService.getEnrollmentsWithPaymentDetails();
        return res.status(200).json(enrollments);
    } catch (error: any) {
        console.error('[adminController] Error fetching detailed enrollments:', error.message);
        res.status(400).json({ message: error.message || 'Failed to fetch detailed enrollments.' });
        next(error);
    }
};

export const getPlatformStats = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const stats = await adminService.getPlatformStats();
        return res.status(200).json(stats);
    } catch (error: any) {
        console.error('[adminController] Error fetching platform stats:', error.message);
        res.status(400).json({ message: error.message || 'Failed to fetch platform stats.' });
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
        console.error('[adminController] Error assigning teacher:', error.message);
        res.status(400).json({ message: error.message || 'Failed to assign teacher.' });
        next(error);
    }
};
