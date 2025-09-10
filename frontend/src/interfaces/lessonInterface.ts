// frontend/src/interfaces/lessonInterface.ts

export interface Lesson {
    _id: string;
    courseId: string;
    title: string;
    description: string;
    orderIndex: number;
    isPublished: boolean;
    materials: string[]; 
}