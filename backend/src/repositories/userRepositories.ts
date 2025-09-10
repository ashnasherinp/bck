


import { Types, Document } from 'mongoose';
import { UserModel } from '../models/userModel';
import { IUserRepository, PlatformStats } from '../interfaces/userRepositoryinterface';
import { IUser } from '../interfaces/userInterface';
import { IEnrollmentRepository } from '../interfaces/enrollmentRepositoryInterface';

export class UserRepository implements IUserRepository {
    private enrollmentRepository: IEnrollmentRepository;

    constructor(enrollmentRepository: IEnrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return (await UserModel.findOne({ email }).lean()) as IUser | null;
    }

    async findById(id: Types.ObjectId): Promise<IUser | null> {
        return (await UserModel.findById(id).lean()) as IUser | null;
    }

    async findByIds(ids: Types.ObjectId[]): Promise<IUser[]> {
        return (await UserModel.find({ _id: { $in: ids } }).lean()) as IUser[];
    }

    async findByRole(role: string): Promise<IUser[]> {
        return (await UserModel.find({ role }).lean()) as IUser[];
    }

    async find(query: any): Promise<IUser[]> {
        return (await UserModel.find(query).lean()) as IUser[];
    }

    async create(user: Partial<IUser>): Promise<IUser & Document> {
        const newUser = new UserModel(user);
        return (await newUser.save()) as IUser & Document;
    }

    async update(id: Types.ObjectId, data: Partial<IUser>): Promise<IUser | null> {
        return (await UserModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean()) as IUser | null;
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await UserModel.deleteOne({ _id: id });
    }

    async findByIdPopulated(id: Types.ObjectId): Promise<IUser | null> {
        return (await UserModel.findById(id)
            .populate({
                path: 'enrolledCourses',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'creatorId', select: 'username email profile.firstName profile.lastName' },
                ],
            })
            .lean()) as IUser | null;
    }

    async findUsersByRoleWithEnrollments(role?: string): Promise<IUser[]> {
        const query: any = {};
        if (role) {
            query.role = role;
        }
        return (await UserModel.find(query)
            .populate({
                path: 'enrolledCourses',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'creatorId', select: 'username email profile.firstName profile.lastName' },
                ],
            })
            .lean()) as IUser[];
    }

    async findApprovedTeachers(): Promise<IUser[]> {
        return (await UserModel.find({ role: 'Teacher', isApproved: true }).lean()) as IUser[];
    }

    async getPlatformStats(): Promise<PlatformStats> {
        const [users, enrollments] = await Promise.all([
            UserModel.find({}).lean(),
            this.enrollmentRepository.find({}),
        ]);

        const totalUsers = users.length;
        const totalEnrollments = enrollments.length;
        const totalRevenue = enrollments.reduce((sum, enrollment) => {
            return sum + (enrollment.paymentDetails?.totalAmount || 0);
        }, 0);
        const usersByRole = users.reduce((acc, user: IUser) => {
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
