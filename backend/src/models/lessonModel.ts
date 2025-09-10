import mongoose, { Schema, model, Document } from 'mongoose';
import { ILessonBase } from '../interfaces/lessonInterface';

const LessonSchema = new Schema<ILessonBase & Document>({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    orderIndex: { type: Number, required: true, min: 0 },
    materials: [{ type: Schema.Types.ObjectId, ref: 'Material' }],
    assessments: [{ type: Schema.Types.ObjectId, ref: 'Assessment' }],
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });

// Add a compound unique index to ensure orderIndex is unique per course
LessonSchema.index({ courseId: 1, orderIndex: 1 }, { unique: true });

// Ensure title is unique per course
LessonSchema.index({ courseId: 1, title: 1 }, { unique: true });

export const LessonModel = model<ILessonBase & Document>('Lesson', LessonSchema);