// backend/src/models/courseCategoryModel.ts
import mongoose, { Schema } from 'mongoose';
import { ICourseCategoryBase } from '../interfaces/courseCategoryInterface'; // Corrected import path

const courseCategorySchema = new Schema<ICourseCategoryBase>({
    name: { type: String, required: true, unique: true },
    description: { type: String },
}, { timestamps: true });

export const CourseCategoryModel = mongoose.model<ICourseCategoryBase>('Category', courseCategorySchema);