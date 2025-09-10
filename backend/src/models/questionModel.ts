// import mongoose, { Schema, model, Document } from 'mongoose';
// import { IQuestionBase, QuestionType } from '../interfaces/questionInterface';

// const QuestionSchema = new Schema<IQuestionBase & Document>({
//     assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
//     questionText: { type: String, required: true, trim: true },
//     type: { type: String, enum: Object.values(QuestionType), required: true },
//     options: [{ type: String }], // For multiple choice
//     correctAnswer: Schema.Types.Mixed, // Can be string, array of strings, or boolean for True/False
//     points: { type: Number, required: true, min: 0 },
//     imageUrl: { type: String }, // Cloudinary URL
//     pdfUrl: { type: String }, // Cloudinary URL
//     orderIndex: { type: Number, required: true, min: 0 },
// }, { timestamps: true });

// // Add a compound unique index to ensure orderIndex is unique per assessment
// QuestionSchema.index({ assessmentId: 1, orderIndex: 1 }, { unique: true });

// export const QuestionModel = model<IQuestionBase & Document>('Question', QuestionSchema);

// backend/src/models/questionModel.ts
import mongoose, { Schema, model, Document } from 'mongoose';
import { IQuestionBase, QuestionType } from '../interfaces/questionInterface';

const QuestionSchema = new Schema<IQuestionBase & Document>({
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    questionText: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(QuestionType), required: true },
    options: [{ type: String }],
    correctAnswer: Schema.Types.Mixed,
    points: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    pdfUrl: { type: String },
    orderIndex: { type: Number, required: true, min: 0 },
}, { timestamps: true });

QuestionSchema.index({ assessmentId: 1, orderIndex: 1 }, { unique: true });

export const QuestionModel = model<IQuestionBase & Document>('Question', QuestionSchema);