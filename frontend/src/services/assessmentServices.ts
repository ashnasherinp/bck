

// frontend/src/services/assessmentServices.ts
import api from './api';
import { IAssessmentBase, IAssessmentPopulated } from '../interfaces/assessmentInterface';
import { IQuestion } from '../interfaces/questionInterface';


export const createAssessment = async (courseId: string, assessmentData: Partial<IAssessmentBase>): Promise<IAssessmentBase> =>{
    try {
        const response = await api.post('/admin/assessments', { ...assessmentData, courseId });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create assessment');
    }
};


export const getAssessmentsByCourse = async (courseId: string): Promise<IAssessmentBase[]> => {
    try {
  
        const response = await api.get(`/assessments/course/${courseId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch assessments');
    }
};


export const getAssessmentById = async (assessmentId: string): Promise<IAssessmentPopulated> => {
    try {
        
        const response = await api.get(`/assessments/${assessmentId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch assessment');
    }
};

export const updateAssessment = async (assessmentId: string, assessmentData: Partial<IAssessmentBase>): Promise<IAssessmentBase> => {
    try {
        const response = await api.put(`/admin/assessments/${assessmentId}`, assessmentData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update assessment');
    }
};

export const deleteAssessment = async (assessmentId: string): Promise<void> => {
    try {
        await api.delete(`/admin/assessments/${assessmentId}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete assessment');
    }
};


export const publishAssessment = async (assessmentId: string): Promise<void> => {
    try {
        await api.patch(`/admin/assessments/${assessmentId}/publish`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to publish assessment');
    }
};

export const unpublishAssessment = async (assessmentId: string): Promise<void> => {
    try {
        await api.patch(`/admin/assessments/${assessmentId}/unpublish`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to unpublish assessment');
    }
};

export const createQuestion = async (assessmentId: string, questionData: FormData): Promise<IQuestion> => {
    try {
        const response = await api.post(`/admin/assessments/${assessmentId}/questions`, questionData); 
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create question');
    }
};


export const getQuestionsByAssessment = async (assessmentId: string): Promise<IQuestion[]> => {
    try {
        const response = await api.get(`/admin/assessments/${assessmentId}/questions`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch questions');
    }
};

export const updateQuestion = async (questionId: string, questionData: FormData): Promise<IQuestion> => {
    try {
        const response = await api.put(`/admin/questions/${questionId}`, questionData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update question');
    }
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
    try {
        await api.delete(`/admin/questions/${questionId}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete question');
    }
};

export const submitAssessment = async (assessmentId: string, submission: { questionId: string; selectedOption: number }[]): Promise<{ score: number }> => {
    try {
        const response = await api.post(`/assessments/${assessmentId}/submit`, { submission });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to submit assessment');
    }
};