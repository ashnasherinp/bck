
// backend/src/repositories/enrollmentRepositories.ts
import { Types } from 'mongoose';
import { EnrollmentModel } from '../models/EnrollmentModel';
import { IEnrollment, IEnrollmentPopulated} from '../interfaces/enrollmentInterface';
import { IEnrollmentRepository } from '../interfaces/enrollmentRepositoryInterface';
import AppError from '../utils/appError';

export class EnrollmentRepository implements IEnrollmentRepository {
    async create(data: Partial<IEnrollment>): Promise<IEnrollment> {
        const enrollment = await EnrollmentModel.create(data);
        return enrollment.toObject();
    }

    async findById(id: Types.ObjectId): Promise<IEnrollment | null> {
        const enrollment = await EnrollmentModel.findById(id).lean();
        return enrollment as IEnrollment | null;
    }

    async findByUserAndCourse(userId: Types.ObjectId, courseId: Types.ObjectId): Promise<IEnrollment | null> {
        const enrollment = await EnrollmentModel.findOne({ userId, courseId }).lean();
        return enrollment as IEnrollment | null;
    }

    async findByOrderId(orderId: string): Promise<IEnrollment | null> {
        const enrollment = await EnrollmentModel.findOne({ 'paymentDetails.orderId': orderId }).lean();
        return enrollment as IEnrollment | null;
    }

    async findByUserId(userId: Types.ObjectId): Promise<IEnrollment[]> {
        const enrollments = await EnrollmentModel.find({ userId }).lean();
        return enrollments as IEnrollment[];
    }

    async findByUserIdPopulated(userId: Types.ObjectId): Promise<IEnrollmentPopulated[]> {
        const enrollments = await EnrollmentModel.find({ userId })
            .populate('userId', 'username email profile.firstName profile.lastName')
            .populate({
                path: 'courseId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'creatorId', select: 'username email profile.firstName profile.lastName' },
                ],
            })
            .populate('teacherId', 'username email profile.firstName profile.lastName')
            .lean()
            .exec();

        return enrollments.map(enrollmentDoc => ({
            _id: enrollmentDoc._id as Types.ObjectId,
            userId: enrollmentDoc.userId as any,
            courseId: enrollmentDoc.courseId as any,
            teacherId: enrollmentDoc.teacherId as any,
            enrollmentDate: enrollmentDoc.enrollmentDate,
            status: enrollmentDoc.status,
            paymentStatus: enrollmentDoc.paymentStatus,
            adminApprovalStatus: enrollmentDoc.adminApprovalStatus,
            progress: enrollmentDoc.progress,
            sessionCountAttended: enrollmentDoc.sessionCountAttended,
            paymentDetails: enrollmentDoc.paymentDetails,
            completionDate: enrollmentDoc.completionDate,
            createdAt: enrollmentDoc.createdAt,
            updatedAt: enrollmentDoc.updatedAt,
        }));
    }

    async findByCourseId(courseId: Types.ObjectId): Promise<IEnrollment[]> {
        const enrollments = await EnrollmentModel.find({ courseId }).lean();
        return enrollments as IEnrollment[];
    }

    async findAll(): Promise<IEnrollment[]> {
        const enrollments = await EnrollmentModel.find().lean();
        return enrollments as IEnrollment[];
    }

    async find(query: any): Promise<IEnrollment[]> {
        const enrollments = await EnrollmentModel.find(query).lean();
        return enrollments as IEnrollment[];
    }

    async update(id: Types.ObjectId, data: Partial<IEnrollment>): Promise<IEnrollment | null> {
        const enrollment = await EnrollmentModel.findByIdAndUpdate(id, data, { new: true }).lean();
        return enrollment as IEnrollment | null;
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await EnrollmentModel.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }

    async deleteManyByCourseId(courseId: Types.ObjectId): Promise<boolean> {
        const result = await EnrollmentModel.deleteMany({ courseId });
        return result.deletedCount > 0;
    }
}