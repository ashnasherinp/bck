
// frontend/src/interfaces/materialInterface.ts

export interface Material {
    _id: string;
    lessonId: string;
    title: string;
    content: string; 
    type: string;
    createdAt: string;
}
export type MaterialUpdateData = FormData | {
    title: string;
    content?: string; 
    type: string;
    materialUrl?: string; 
};