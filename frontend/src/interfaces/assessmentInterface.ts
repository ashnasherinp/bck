// frontend/src/interfaces/assessmentInterface.ts
export enum AssessmentType {
    Quiz = 'Quiz',
    Exam = 'Exam',
    Assignment = 'Assignment',
    Practice = 'Practice',
}

export interface IAssessmentBase {
    _id: string;
    courseId: string;
    lessonId?: string;
    title: string;
    description?: string;
    type: AssessmentType;
    maxScore: number;
    durationMinutes: number;
    passPercentage: number;
    isPublished: boolean;
    questions: string[];
}

export interface IAssessmentPopulated {
    _id: string;
    courseId: string;
    lessonId?: string;
    title: string;
    description?: string;
    type: AssessmentType;
    maxScore: number;
    durationMinutes: number;
    passPercentage: number;
    isPublished: boolean;
    questions: Array<{
        _id: string;
        questionText: string;
        options: string[];
        correctAnswer: number;
        imageUrl?: string;
    }>;
}