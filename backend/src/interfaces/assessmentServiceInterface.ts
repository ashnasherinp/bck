// // backend/src/interfaces/assessmentServiceInterface.ts
// import { Types } from 'mongoose';
// import { IAssessmentBase, IAssessmentPopulated, ICreateAssessmentData } from './assessmentInterface';

// export interface IAssessmentService {
//     createAssessment(data: ICreateAssessmentData, creatorId: Types.ObjectId, creatorRole: string): Promise<IAssessmentBase>;
//     getAssessmentById(assessmentId: string): Promise<IAssessmentPopulated | null>;
//     updateAssessment(assessmentId: string, updateData: Partial<IAssessmentBase>, editorId: Types.ObjectId, editorRole: string): Promise<IAssessmentBase | null>;
//     deleteAssessment(assessmentId: string, deleterId: Types.ObjectId, deleterRole: string): Promise<boolean>;
//     getAssessmentsByCourseId(courseId: string): Promise<IAssessmentBase[]>; // Course-level assessments
//     getAssessmentsByLessonId(lessonId: string): Promise<IAssessmentBase[]>; // Lesson-level assessments
//     publishAssessment(assessmentId: string, adminId: Types.ObjectId): Promise<IAssessmentBase | null>;
//     unpublishAssessment(assessmentId: string, adminId: Types.ObjectId): Promise<IAssessmentBase | null>;
// }


// backend/src/interfaces/assessmentServiceInterface.ts
import { Types } from 'mongoose';
import { IAssessmentBase, IAssessmentPopulated, ICreateAssessmentData } from './assessmentInterface';

export interface IAssessmentService {
    createAssessment(data: ICreateAssessmentData, creatorId: Types.ObjectId, creatorRole: string): Promise<IAssessmentBase>;
    getAssessmentById(assessmentId: string): Promise<IAssessmentPopulated | null>;
    updateAssessment(assessmentId: string, updateData: Partial<IAssessmentBase>, editorId: Types.ObjectId, editorRole: string): Promise<IAssessmentBase | null>;
    deleteAssessment(assessmentId: string, deleterId: Types.ObjectId, deleterRole: string): Promise<boolean>;
    getAssessmentsByCourseId(courseId: string): Promise<IAssessmentBase[]>; // Course-level assessments
    getAssessmentsByLessonId(lessonId: string): Promise<IAssessmentBase[]>; // Lesson-level assessments
    publishAssessment(assessmentId: string, adminId: Types.ObjectId): Promise<IAssessmentBase | null>;
    unpublishAssessment(assessmentId: string, adminId: Types.ObjectId): Promise<IAssessmentBase | null>;
}