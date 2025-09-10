


// // --- MODIFIED: backend/src/models/courseModel.ts ---
// import mongoose, { Schema } from 'mongoose';
// import { ICourseBase } from '../interfaces/courseInterface';

// const courseSchema = new Schema<ICourseBase>({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
//     level: { type: String, required: true },
//     // --- NEW: Pricing Fields ---
//     price: { type: Number, required: true, min: 0 }, // Price of the course
//     discountPrice: { type: Number, default: 0, min: 0 }, // Discounted price
//     // --- END NEW ---
//     enrolledUsers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
//     imageUrl: { type: String, default: '' },
//     isApproved: { type: Boolean, default: false },
// }, { timestamps: true });

// courseSchema.index({ creatorId: 1 });
// courseSchema.index({ categoryId: 1 });
// courseSchema.index({ isApproved: 1 });

// export const CourseModel = mongoose.model<ICourseBase>('Course', courseSchema);


// backend/src/models/courseModel.ts
import mongoose, { Schema, model, Document } from 'mongoose';
import { ICourseBase, CourseStatus } from '../interfaces/courseInterface'; // Import CourseStatus enum

const CourseSchema = new Schema<ICourseBase & Document>({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Changed from 'CourseCategory' to 'Category' based on your model export
    level: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    effectivePrice: { type: Number, required: true, default: 0 }, // Added, with a default
    enrolledUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Now in ICourseBase
    imageUrl: { type: String },
    videoUrl: { type: String }, // Now in ICourseBase
    isApproved: { type: Boolean, default: false }, // Now in ICourseBase
    status: { type: String, enum: Object.values(CourseStatus), default: CourseStatus.Draft }, // Now in ICourseBase
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }], // Now in ICourseBase
    assessments: [{ type: Schema.Types.ObjectId, ref: 'Assessment' }], // Now in ICourseBase
    ratings: [{ type: Number }], // Now in ICourseBase
    averageRating: { type: Number, default: 0 }, // Now in ICourseBase
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }], // Now in ICourseBase
    enrollmentCount: { type: Number, default: 0 }, // Now in ICourseBase
    duration: { type: String }, // Now in ICourseBase
    quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }], // Now in ICourseBase
}, { timestamps: true });

CourseSchema.index({ creatorId: 1, title: 1 }, { unique: true });

export const CourseModel = model<ICourseBase & Document>('Course', CourseSchema);