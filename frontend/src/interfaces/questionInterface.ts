
// frontend/src/interfaces/questionInterface.ts
export enum QuestionType {
    MultipleChoice = 'MultipleChoice',
    TrueFalse = 'TrueFalse',
    FileUpload = 'FileUpload',
}

export interface IQuestion {
    _id: string;
    assessmentId: string;
    questionText: string; 
    type: QuestionType; 
    options: string[];
    correctAnswer: number | boolean; 
    points: number; 
    imageUrl?: string;
}