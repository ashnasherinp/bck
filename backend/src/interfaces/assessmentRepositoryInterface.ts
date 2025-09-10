

// import { Types, Document } from 'mongoose';
// import { IAssessmentBase, IAssessmentPopulated } from './assessmentInterface';

// export interface IAssessmentRepository {
//     create(assessmentData: Partial<IAssessmentBase>): Promise<IAssessmentBase & Document>;
//     findById(id: Types.ObjectId): Promise<(IAssessmentBase & Document) | null>;
//     update(id: Types.ObjectId, updateData: Partial<IAssessmentBase>): Promise<(IAssessmentBase & Document) | null>;
//     delete(id: Types.ObjectId): Promise<boolean>;
//     deleteMany(query: Record<string, any>): Promise<number>; // Added this
//     findByCourseId(courseId: Types.ObjectId): Promise<(IAssessmentBase & Document)[]>;
//     findByLessonId(lessonId: Types.ObjectId): Promise<(IAssessmentBase & Document)[]>;
//     findByCourseOrLessonId(courseId?: Types.ObjectId, lessonId?: Types.ObjectId): Promise<(IAssessmentBase & Document)[]>;
//     findByIdPopulated(id: Types.ObjectId): Promise<IAssessmentPopulated | null>;
//     findByTitleAndCourse(title: string, courseId: Types.ObjectId): Promise<(IAssessmentBase & Document) | null>;
//     findByTitleAndLesson(title: string, lessonId: Types.ObjectId): Promise<(IAssessmentBase & Document) | null>;
//     addQuestionToAssessment(assessmentId: Types.ObjectId, questionId: Types.ObjectId): Promise<boolean>;
//     removeQuestionFromAssessment(assessmentId: Types.ObjectId, questionId: Types.ObjectId): Promise<boolean>;
// }

// backend/src/interfaces/assessmentRepositoryInterface.ts
import { Types, Document } from 'mongoose';
// FIX: Import IAssessment directly, as it includes Document and _id
import { IAssessmentBase, IAssessment, IAssessmentPopulated } from './assessmentInterface';

export interface IAssessmentRepository {
    // FIX: Change return type to IAssessment
    create(assessmentData: Partial<IAssessmentBase>): Promise<IAssessment>;
    // FIX: Change return type to IAssessment
    findById(id: Types.ObjectId): Promise<IAssessment | null>;
    // FIX: Change return type to IAssessment
    update(id: Types.ObjectId, updateData: Partial<IAssessmentBase>): Promise<IAssessment | null>;
    delete(id: Types.ObjectId): Promise<boolean>;
    deleteMany(query: Record<string, any>): Promise<number>;
    // FIX: Change return type to IAssessment[]
    findByCourseId(courseId: Types.ObjectId): Promise<IAssessment[]>;
    // FIX: Change return type to IAssessment[]
    findByLessonId(lessonId: Types.ObjectId): Promise<IAssessment[]>;
    // FIX: Change return type to IAssessment[]
    findByCourseOrLessonId(courseId?: Types.ObjectId, lessonId?: Types.ObjectId): Promise<IAssessment[]>;
    findByIdPopulated(id: Types.ObjectId): Promise<IAssessmentPopulated | null>;
    // FIX: Change return type to IAssessment
    findByTitleAndCourse(title: string, courseId: Types.ObjectId): Promise<IAssessment | null>;
    // FIX: Change return type to IAssessment
    findByTitleAndLesson(title: string, lessonId: Types.ObjectId): Promise<IAssessment | null>;
    addQuestionToAssessment(assessmentId: Types.ObjectId, questionId: Types.ObjectId): Promise<boolean>;
    removeQuestionFromAssessment(assessmentId: Types.ObjectId, questionId: Types.ObjectId): Promise<boolean>;
}