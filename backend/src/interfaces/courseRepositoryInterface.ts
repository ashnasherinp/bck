
// import { Types } from 'mongoose';
//   import { ICourse, ICourseCategory } from './courseInterface';

//   export interface LeanCourseCategory {
//     _id: string;
//     name: string;
//     createdAt: Date;
//   }

//   export interface ICourseRepository {
//     findAll(): Promise<ICourse[]>;
//     findByCreator(creatorId: Types.ObjectId): Promise<ICourse[]>;
//     findEnrolledCourses(userId: Types.ObjectId): Promise<ICourse[]>;
//     findById(courseId: Types.ObjectId): Promise<ICourse | null>;
//     create(course: Partial<ICourse>): Promise<ICourse>;
//     createCategory(category: Partial<ICourseCategory>): Promise<ICourseCategory>;
//     findAllCategories(): Promise<LeanCourseCategory[]>;
//   }

// // backend/src/interfaces/courseRepositoryInterface.ts
// import { Types } from 'mongoose';
// import { ICourse, ICourseCategory } from './courseInterface'; // Adjust path as needed

// // If you have a LeanCourseCategory, keep it. Otherwise, use ICourseCategory
// // export type LeanCourseCategory = ICourseCategory & { _id: string };

// export interface ICourseRepository {
//     create(courseData: Partial<ICourse>): Promise<ICourse>;
//     findById(id: Types.ObjectId): Promise<ICourse | null>;
//     findByCreator(creatorId: Types.ObjectId): Promise<ICourse[]>;
//     findApprovedCourses(): Promise<ICourse[]>;
//     findEnrolledCourses(userId: Types.ObjectId): Promise<ICourse[]>; // Keep for now, might be refactored later
//     update(id: Types.ObjectId, updateData: Partial<ICourse>): Promise<ICourse | null>; // **IMPORTANT: Added/Ensured**
//     delete(id: Types.ObjectId): Promise<void>;
//     findAll(): Promise<ICourse[]>;
//     findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICourse[]>; // **IMPORTANT: Added**

//     // These might be better in CourseCategoryRepositoryInterface if you use it
//     createCategory(categoryData: Partial<ICourseCategory>): Promise<ICourseCategory>;
//     findAllCategories(): Promise<ICourseCategory[]>; // Changed return to ICourseCategory[] for consistency
// }

// // backend/src/interfaces/courseRepositoryInterface.ts
// import { Types } from 'mongoose';
// import { ICourse, ICourseCategory } from './courseInterface';

// export interface ICourseRepository {
//     create(courseData: Partial<ICourse>): Promise<ICourse>;
//     findById(id: Types.ObjectId): Promise<ICourse | null>;
//     findByCreator(creatorId: Types.ObjectId): Promise<ICourse[]>;
//     findApprovedCourses(): Promise<ICourse[]>;
//     findEnrolledCourses(userId: Types.ObjectId): Promise<ICourse[]>;
    
//     update(id: Types.ObjectId, updateData: Partial<ICourse>): Promise<ICourse | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
    
//     findAll(): Promise<ICourse[]>;
//     findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICourse[]>;

//     // Category methods (if CourseRepository handles them. Better practice is a separate CourseCategoryRepositoryInterface)
//     createCategory(categoryData: Partial<ICourseCategory>): Promise<ICourseCategory>;
//     findAllCategories(): Promise<ICourseCategory[]>; // This specific method is not typically in CourseRepository, but if your CourseService calls it, it must exist.
// }

// // backend/src/interfaces/courseRepositoryInterface.ts
// import { Types, Document } from 'mongoose'; // Keep Document for model definitions
// import { ICourse } from './courseInterface'; // Use the simplified ICourse

// export interface ICourseRepository {
//     create(courseData: Partial<ICourse>): Promise<ICourse & Document>; // Create returns a full Mongoose Document
//     findById(id: Types.ObjectId): Promise<ICourse | null>; // Returns plain object
//     findByCreator(creatorId: Types.ObjectId): Promise<ICourse[]>; // Returns plain objects
//     findApprovedCourses(): Promise<ICourse[]>; // Returns plain objects
//     findEnrolledCourses(userId: Types.ObjectId): Promise<ICourse[]>; // Returns plain objects

//     update(id: Types.ObjectId, updateData: Partial<ICourse>): Promise<ICourse | null>; // Returns plain object
//     delete(id: Types.ObjectId): Promise<boolean>;

//     findAll(): Promise<ICourse[]>; // Returns plain objects
//     findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICourse[]>;
// }

// // backend/src/interfaces/courseRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { ICourseBase, ICoursePopulated } from './courseInterface'; // Import both

// export interface ICourseRepository {
//     create(courseData: Partial<ICourseBase>): Promise<ICourseBase & Document>; // Create accepts base, returns base & Document
//     findById(id: Types.ObjectId): Promise<ICoursePopulated | null>; // Returns populated
//     findByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]>; // Returns populated
//     findApprovedCourses(): Promise<ICoursePopulated[]>; // Returns populated
//     findEnrolledCourses(userId: Types.ObjectId): Promise<ICoursePopulated[]>; // Returns populated

//     update(id: Types.ObjectId, updateData: Partial<ICourseBase>): Promise<ICoursePopulated | null>; // Update accepts base, returns populated
//     delete(id: Types.ObjectId): Promise<boolean>;

//     findAll(): Promise<ICoursePopulated[]>; // Returns populated
//     findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICoursePopulated[]>; // Returns populated
// }'


// // backend/src/interfaces/courseRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { ICourseBase, ICoursePopulated } from './courseInterface';

// export interface ICourseRepository {
//     create(courseData: Partial<ICourseBase>): Promise<ICourseBase & Document>;
//     findById(id: Types.ObjectId): Promise<ICoursePopulated | null>;
//     findByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]>;
//     findApprovedCourses(): Promise<ICoursePopulated[]>;
//     findEnrolledCourses(userId: Types.ObjectId): Promise<ICoursePopulated[]>;

//     update(id: Types.ObjectId, updateData: Partial<ICourseBase>): Promise<ICoursePopulated | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;

//     findAll(): Promise<ICoursePopulated[]>;
//     findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICoursePopulated[]>;

//     // Add to ICourseRepository if not present
// addLessonToCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean>;
// removeLessonFromCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean>;
// addAssessmentToCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
// removeAssessmentFromCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
// addUserToEnrolled(courseId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean>;
// }

// // backend/src/interfaces/courseRepositoryInterface.ts
// import { Types, Document } from 'mongoose';
// import { ICourseBase, ICoursePopulated, ICourse } from './courseInterface'; // Import ICourse

// export interface ICourseRepository {
//     // FIX 2: Change return type from `ICourseBase & Document` to `ICourse`
//     create(courseData: Partial<ICourseBase>): Promise<ICourse>; // <--- CHANGE HERE
//     findById(id: Types.ObjectId): Promise<ICoursePopulated | null>;
//     findByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]>;
//     findApprovedCourses(): Promise<ICoursePopulated[]>;
//     findEnrolledCourses(userId: Types.ObjectId): Promise<ICoursePopulated[]>;

//     update(id: Types.ObjectId, updateData: Partial<ICourseBase>): Promise<ICoursePopulated | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;

//     findAll(): Promise<ICoursePopulated[]>;
//     findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICoursePopulated[]>;

//     addLessonToCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean>;
//     removeLessonFromCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean>;
//     addAssessmentToCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
//     removeAssessmentFromCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
//     addUserToEnrolled(courseId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean>;
// }

import { Types, Document } from 'mongoose';
import { ICourseBase, ICoursePopulated, ICourse } from './courseInterface';

export interface ICourseRepository {
    create(courseData: Partial<ICourseBase>): Promise<ICourse>;
    findById(id: Types.ObjectId): Promise<ICourse | null>; // Change to ICourse for non-populated
    findByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]>;
    findApprovedCourses(): Promise<ICoursePopulated[]>;
    findEnrolledCourses(userId: Types.ObjectId): Promise<ICoursePopulated[]>;
    findAll(): Promise<ICoursePopulated[]>; // Added
    findAllPopulated(): Promise<ICoursePopulated[]>; // Added for getAllCourses
    findByIdPopulated(id: Types.ObjectId): Promise<ICoursePopulated | null>; // Added for getCourseById
    findByTitleAndCreator(title: string, creatorId: Types.ObjectId): Promise<ICourse | null>; // Added
    findNewCourses(): Promise<ICoursePopulated[]>; // Added if you have a getNewCourses in service
    findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICoursePopulated[]>;

    update(id: Types.ObjectId, updateData: Partial<ICourseBase>): Promise<ICourse | null>; // Change to ICourse for non-populated update result
    delete(id: Types.ObjectId): Promise<boolean>;

    addLessonToCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean>;
    removeLessonFromCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean>;
    addAssessmentToCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
    removeAssessmentFromCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean>;
    addUserToEnrolled(courseId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean>;
}