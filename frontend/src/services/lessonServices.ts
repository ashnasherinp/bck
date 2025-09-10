

// import api from './api';

// export const createLesson = async (courseId: string, lessonData: { title: string; description: string; orderIndex: number; isPublished: boolean }): Promise<any> => {
//     try {
//         const response = await api.post('/admin/lessons', { ...lessonData, courseId });
//         console.log('[CourseServices] Lesson created:', response.data);
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error creating lesson:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to create lesson');
//     }
// };

// export const getLessonsByCourse = async (courseId: string): Promise<any[]> => {
//     try {
//         const response = await api.get(`/admin/lessons/course/${courseId}`);
//         console.log('[CourseServices] Lessons fetched:', response.data);
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error fetching lessons:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
//     }
// };

// export const updateLesson = async (lessonId: string, lessonData: { title?: string; description?: string; orderIndex?: number; isPublished?: boolean }): Promise<any> => {
//     try {
//         const response = await api.patch(`/admin/lessons/${lessonId}`, lessonData);
//         console.log('[CourseServices] Lesson updated:', response.data);
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error updating lesson:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to update lesson');
//     }
// };

// export const deleteLesson = async (lessonId: string): Promise<void> => {
//     try {
//         await api.delete(`/admin/lessons/${lessonId}`);
//         console.log('[CourseServices] Lesson deleted:', lessonId);
//     } catch (error: any) {
//         console.error('[CourseServices] Error deleting lesson:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to delete lesson');
//     }
// };

// export const publishLesson = async (lessonId: string): Promise<void> => {
//     try {
//         await api.patch(`/admin/lessons/${lessonId}/publish`);
//         console.log('[CourseServices] Lesson published:', lessonId);
//     } catch (error: any) {
//         console.error('[CourseServices] Error publishing lesson:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to publish lesson');
//     }
// };

// export const unpublishLesson = async (lessonId: string): Promise<void> => {
//     try {
//         await api.patch(`/admin/lessons/${lessonId}/unpublish`);
//         console.log('[CourseServices] Lesson unpublished:', lessonId);
//     } catch (error: any) {
//         console.error('[CourseServices] Error unpublishing lesson:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to unpublish lesson');
//     }
// };


// frontend/src/services/lessonServices.ts
import api from './api';

export const createLesson = async (courseId: string, lessonData: { title: string; description: string; orderIndex: number; isPublished: boolean }): Promise<any> => {
    try {

        const response = await api.post('/lessons', { ...lessonData, courseId });
        console.log('[LessonServices] Lesson created:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('[LessonServices] Error creating lesson:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to create lesson');
    }
};

export const getLessonsByCourse = async (courseId: string): Promise<any[]> => {
    try {
        const response = await api.get(`/lessons/course/${courseId}`);
        console.log('[LessonServices] Lessons fetched:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('[LessonServices] Error fetching lessons:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
    }
};

export const updateLesson = async (lessonId: string, lessonData: { title?: string; description?: string; orderIndex?: number; isPublished?: boolean }): Promise<any> => {
    try {
       
        const response = await api.patch(`/lessons/${lessonId}`, lessonData);
        console.log('[LessonServices] Lesson updated:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('[LessonServices] Error updating lesson:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update lesson');
    }
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
    try {

        await api.delete(`/lessons/${lessonId}`);
        console.log('[LessonServices] Lesson deleted:', lessonId);
    } catch (error: any) {
        console.error('[LessonServices] Error deleting lesson:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete lesson');
    }
};

export const publishLesson = async (lessonId: string): Promise<void> => {
    try {

        await api.patch(`/lessons/${lessonId}/publish`);
        console.log('[LessonServices] Lesson published:', lessonId);
    } catch (error: any) {
        console.error('[LessonServices] Error publishing lesson:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to publish lesson');
    }
};

export const unpublishLesson = async (lessonId: string): Promise<void> => {
    try {

        await api.patch(`/lessons/${lessonId}/unpublish`);
        console.log('[LessonServices] Lesson unpublished:', lessonId);
    } catch (error: any) {
        console.error('[LessonServices] Error unpublishing lesson:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to unpublish lesson');
    }
};