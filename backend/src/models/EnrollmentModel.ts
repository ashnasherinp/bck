

// // backend/src/models/enrollmentModel.ts
// import mongoose, { Schema, model, Document } from 'mongoose';
// import { IEnrollment, EnrollmentStatus, PaymentStatus, AdminApprovalStatus, ILessonProgress } from '../interfaces/enrollmentInterface';

// const LessonProgressSchema = new Schema<ILessonProgress & Document>({
//     lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
//     isLocked: { type: Boolean, default: true }, // Now in ILessonProgress
//     completed: { type: Boolean, default: false }, // Corrected from isCompleted to match interface 'completed'
//     completedAt: { type: Date }, // Corrected from completionDate to match interface 'completedAt'
// }, { _id: false });

// const EnrollmentSchema = new Schema<IEnrollment & Document>({
//     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
//     enrollmentDate: { type: Date, required: true, default: Date.now },
//     status: { type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.InProgress }, // Now in IEnrollmentBase
//     sessionCountAttended: { type: Number, default: 0 }, // Now in IEnrollmentBase
//     completionDate: { type: Date }, // Now in IEnrollmentBase
//     paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.Pending }, // Now in IEnrollmentBase
//     paymentDetails: { // Now in IEnrollmentBase
//         orderId: { type: String },
//         paymentId: { type: String },
//         signature: { type: String },
//         amount: { type: Number },
//         currency: { type: String },
//     },
//     adminApprovalStatus: { type: String, enum: Object.values(AdminApprovalStatus), default: AdminApprovalStatus.Pending }, // Now in IEnrollmentBase
//     progress: [LessonProgressSchema], // Changed from 'lessonProgress' to 'progress' to match interface
// }, { timestamps: true });

// EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// export const EnrollmentModel = model<IEnrollment & Document>('Enrollment', EnrollmentSchema);
// backend/src/models/EnrollmentModel.ts
import mongoose, { Schema, model } from 'mongoose';
import { IEnrollment, ILessonProgress, IPaymentDetails, EnrollmentStatus, PaymentStatus, AdminApprovalStatus } from '../interfaces/enrollmentInterface';

const lessonProgressSchema = new Schema<ILessonProgress>({
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    isLocked: { type: Boolean, default: true },
});

const paymentDetailsSchema = new Schema<IPaymentDetails>({
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    status: { type: String, required: true },
});

const enrollmentSchema = new Schema<IEnrollment>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
        enrollmentDate: { type: Date, required: true },
        status: { type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.Pending},
        paymentStatus: { type: String, enum: Object.values(PaymentStatus) },
        adminApprovalStatus: { type: String, enum: Object.values(AdminApprovalStatus), default: AdminApprovalStatus.Pending },
        progress: [lessonProgressSchema],
        sessionCountAttended: { type: Number, default: 0 },
        paymentDetails: paymentDetailsSchema,
        completionDate: { type: Date },
    },
    { timestamps: true }
);

export const EnrollmentModel = model<IEnrollment>('Enrollment', enrollmentSchema);