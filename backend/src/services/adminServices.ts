

// // backend/src/services/adminServices.ts



import { Types } from 'mongoose';
import { IAdminService } from '../interfaces/adminserviceInterface';
import { IUserRepository } from '../interfaces/userRepositoryinterface';
import { IEnrollmentRepository } from '../interfaces/enrollmentRepositoryInterface';
import { IUser, TeacherRequestStatus, UserRole } from '../interfaces/userInterface';
import { PlatformStats } from '../interfaces/userRepositoryinterface';

export class AdminServiceImpl implements IAdminService {
    private userRepository: IUserRepository;
    private enrollmentRepository: IEnrollmentRepository;

    constructor(userRepository: IUserRepository, enrollmentRepository: IEnrollmentRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    async getUsers(query: any = {}): Promise<IUser[]> {
        return await this.userRepository.find(query);
    }

    async approveTeacher(userId: Types.ObjectId): Promise<IUser | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        if (user.role !== UserRole.Teacher) {
            throw new Error('Only teachers can be approved.');
        }
        if (user.teacherRequestStatus === TeacherRequestStatus.Approved) {
            throw new Error('Teacher is already approved.');
        }
        const updatedUser = await this.userRepository.update(userId, {
            isApproved: true,
            teacherRequestStatus: TeacherRequestStatus.Approved,
            teacherRequestRejectionReason: undefined,
        });
        return updatedUser;
    }

    async rejectTeacher(userId: Types.ObjectId, reason: string): Promise<IUser | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        if (user.role !== UserRole.Teacher) {
            throw new Error('Only teachers can be rejected.');
        }
        if (user.teacherRequestStatus === TeacherRequestStatus.Rejected) {
            throw new Error('Teacher request is already rejected.');
        }
        const updatedUser = await this.userRepository.update(userId, {
            isApproved: false,
            teacherRequestStatus: TeacherRequestStatus.Rejected,
            teacherRequestRejectionReason: reason,
        });
        return updatedUser;
    }

    async blockUser(userId: Types.ObjectId): Promise<IUser | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        if (user.isBlocked) {
            throw new Error('User is already blocked.');
        }
        const updatedUser = await this.userRepository.update(userId, { isBlocked: true });
        return updatedUser;
    }

    async unblockUser(userId: Types.ObjectId): Promise<IUser | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        if (!user.isBlocked) {
            throw new Error('User is not blocked.');
        }
        const updatedUser = await this.userRepository.update(userId, { isBlocked: false });
        return updatedUser;
    }

    async deleteUser(userId: Types.ObjectId): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        await this.userRepository.delete(userId);
    }

    async getPlatformStats(): Promise<PlatformStats> {
        const [users, enrollments] = await Promise.all([
            this.userRepository.find({}),
            this.enrollmentRepository.find({}),
        ]);

        const totalUsers = users.length;
        const totalEnrollments = enrollments.length;
        const totalRevenue = enrollments.reduce((sum, enrollment) => {
            return sum + (enrollment.paymentDetails?.totalAmount || 0);
        }, 0);
        const usersByRole = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        return {
            totalUsers,
            totalEnrollments,
            totalRevenue,
            usersByRole,
        };
    }
}
