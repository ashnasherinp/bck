import mongoose, { Schema, model, Document } from 'mongoose';
import { IMaterialBase, MaterialType } from '../interfaces/materialInterface';

const MaterialSchema = new Schema<IMaterialBase & Document>({
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(MaterialType), required: true },
    content: { type: String, required: true }, // For text, URL, or Cloudinary URL
    description: { type: String, trim: true },
    orderIndex: { type: Number, required: true, min: 0 },
}, { timestamps: true });

// Add a compound unique index to ensure orderIndex is unique per lesson
MaterialSchema.index({ lessonId: 1, orderIndex: 1 }, { unique: true });

// Ensure title is unique per lesson
MaterialSchema.index({ lessonId: 1, title: 1 }, { unique: true });

export const MaterialModel = model<IMaterialBase & Document>('Material', MaterialSchema);