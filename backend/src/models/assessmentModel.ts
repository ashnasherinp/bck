// import mongoose, { Schema, model, Document } from 'mongoose';
// import { IAssessmentBase, AssessmentType } from '../interfaces/assessmentInterface';

// const AssessmentSchema = new Schema<IAssessmentBase & Document>({
//     courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
//     lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', index: true }, // Optional, can be course-level
//     title: { type: String, required: true, trim: true },
//     description: { type: String, trim: true },
//     type: { type: String, enum: Object.values(AssessmentType), required: true },
//     questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
//     maxScore: { type: Number, min: 0 },
//     durationMinutes: { type: Number, min: 1 },
//     isPublished: { type: Boolean, default: false },
//     passPercentage: { type: Number, min: 0, max: 100 },
// }, { timestamps: true });

// // Ensure title is unique per course (or per lesson if lessonId is present)
// AssessmentSchema.index({ courseId: 1, title: 1 }, { unique: true });
// AssessmentSchema.index({ lessonId: 1, title: 1 }, { unique: true, sparse: true }); // Sparse for when lessonId is null

// export const AssessmentModel = model<IAssessmentBase & Document>('Assessment', AssessmentSchema);


// // backend/src/models/assessmentModel.ts
// import mongoose, { Schema, model, Document } from 'mongoose';
// import { IAssessmentBase, AssessmentType } from '../interfaces/assessmentInterface';

// const AssessmentSchema = new Schema<IAssessmentBase & Document>({
//     courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
//     lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', index: true },
//     title: { type: String, required: true, trim: true },
//     description: { type: String, trim: true },
//     type: { type: String, enum: Object.values(AssessmentType), required: true },
//     questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
//     maxScore: { type: Number, min: 0 }, // Now exists in IAssessmentBase
//     durationMinutes: { type: Number, min: 1 }, // Now exists in IAssessmentBase
//     isPublished: { type: Boolean, default: false }, // Now exists in IAssessmentBase
//     passPercentage: { type: Number, min: 0, max: 100 }, // Now exists in IAssessmentBase
// }, { timestamps: true });

// AssessmentSchema.index({ courseId: 1, title: 1 }, { unique: true });
// AssessmentSchema.index({ lessonId: 1, title: 1 }, { unique: true, sparse: true });

// export const AssessmentModel = model<IAssessmentBase & Document>('Assessment', AssessmentSchema);

// // backend/src/models/assessmentModel.ts
// import mongoose, { Schema, model, Document } from 'mongoose'; // Keep Document for the model definition
// import { IAssessmentBase, AssessmentType, IAssessment } from '../interfaces/assessmentInterface'; // Import IAssessment

// const AssessmentSchema = new Schema<IAssessment>({ // Use IAssessment here
//     courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
//     lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', index: true },
//     title: { type: String, required: true, trim: true },
//     description: { type: String, trim: true },
//     type: { type: String, enum: Object.values(AssessmentType), required: true },
//     questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
//     maxScore: { type: Number, min: 0 },
//     durationMinutes: { type: Number, min: 1 },
//     isPublished: { type: Boolean, default: false },
//     passPercentage: { type: Number, min: 0, max: 100 },
// }, { timestamps: true });

// AssessmentSchema.index({ courseId: 1, title: 1 }, { unique: true });
// AssessmentSchema.index({ lessonId: 1, title: 1 }, { unique: true, sparse: true });

// export const AssessmentModel = model<IAssessment>('Assessment', AssessmentSchema); // Use IAssessment here


// backend/src/models/assessmentModel.ts
import mongoose, { Schema, model } from 'mongoose';
import { IAssessmentBase, AssessmentType, IAssessment } from '../interfaces/assessmentInterface';

// IMPORTANT CHANGE HERE: Define the Schema with IAssessment, not IAssessmentBase.
// Mongoose will correctly infer _id, createdAt, updatedAt, and Document methods.
const AssessmentSchema = new Schema<IAssessment>({ // <--- Change IAssessmentBase to IAssessment here
    // You only define the fields that are *part of your data structure*,
    // not the Mongoose-added properties like _id, createdAt, updatedAt.
    // Mongoose handles those based on the `IAssessment` type and `timestamps: true`.
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: Object.values(AssessmentType), required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    maxScore: { type: Number, min: 0 },
    durationMinutes: { type: Number, min: 1 },
    isPublished: { type: Boolean, default: false },
    passPercentage: { type: Number, min: 0, max: 100 },
}, { timestamps: true }); // timestamps: true will add createdAt and updatedAt automatically

AssessmentSchema.index({ courseId: 1, title: 1 }, { unique: true });
AssessmentSchema.index({ lessonId: 1, title: 1 }, { unique: true, sparse: true });

export const AssessmentModel = model<IAssessment>('Assessment', AssessmentSchema);