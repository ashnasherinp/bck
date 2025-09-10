

// import api from './api';
// import { Course, Category } from '../interfaces/courseInterface';

// export const createCourse = async (data: FormData): Promise<Course> => {
//     try {
//         const response = await api.post<Course>('/admin/courses', data);
//         console.log('[CourseServices] Course created:', response.data);
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error creating course:', error.response?.data || error);
//         throw new Error(error.response?.data?.message || 'Failed to create course');
//     }
// };

// export const getCourses = async (role?: string): Promise<Course[]> => {
//     try {
//         const response = await api.get('/courses', {
//             params: role ? { role } : {},
//         });
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error fetching courses:', error.response?.status, error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to fetch courses');
//     }
// };

// export const getCourseById = async (courseId: string): Promise<Course> => {
//     try {
//         const response = await api.get(`/courses/${courseId}`);
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error fetching course:', error.response?.status, error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to fetch course');
//     }
// };

// export const getTeacherCourses = async (teacherId: string): Promise<Course[]> => {
//     try {
//         const response = await api.get('/courses', {
//             params: { creatorId: teacherId }
//         });
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error fetching teacher courses:', error.response?.status, error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to fetch teacher courses.');
//     }
// };

// export const getCategories = async (): Promise<Category[]> => {
//     try {
//         const response = await api.get('/admin/categories');
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error fetching categories:', error.response?.status, error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to fetch categories');
//     }
// };

// export const createCategory = async (categoryData: { name: string }): Promise<Category> => {
//     try {
//         const response = await api.post('/admin/categories', categoryData);
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error creating category:', error.response?.status, error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to create category');
//     }
// };

// // export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<Course> => {
// //     try {
// //         const response = await api.patch(`/admin/courses/${courseId}`, courseData);
// //         return response.data;
// //     } catch (error: any) {
// //         console.error('[CourseServices] Error updating course:', error.response?.status, error.response?.data || error.message);
// //         throw new Error(error.response?.data?.message || 'Failed to update course');
// //     }
// // };



// export const updateCourse = async (courseId: string, courseData: FormData): Promise<Course> => {
//     try {
//         const response = await api.put<Course>(`/admin/courses/${courseId}`, courseData);
//         console.log('[CourseServices] Course updated:', response.data);
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error updating course:', error.response?.data || error);
//         throw new Error(error.response?.data?.message || 'Failed to update course');
//     }
// };

// export const deleteCourse = async (courseId: string): Promise<void> => {
//     try {
//         await api.delete(`/admin/courses/${courseId}`);
//     } catch (error: any) {
//         console.error('[CourseServices] Error deleting course:', error.response?.status, error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to delete course');
//     }
// };

// export const getLessonsByCourse = async (courseId: string): Promise<any[]> => {
//     try {
//         const response = await api.get(`/lessons/course/${courseId}`);
//         return response.data;
//     } catch (error: any) {
//         console.error('[CourseServices] Error fetching lessons:', error.response?.status, error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
//     }
// };





import api from './api';
import { Course, Category } from '../interfaces/courseInterface';

export const createCourse = async (data: FormData): Promise<Course> => {
    try {
        const response = await api.post<Course>('/admin/courses', data);
        console.log('[CourseServices] Course created:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('[CourseServices] Error creating course:', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Failed to create course');
    }
};

export const getCourses = async (role?: string): Promise<Course[]> => {
    try {
        const response = await api.get('/courses', {
            params: role ? { role } : {},
        });
        return response.data;
    } catch (error: any) {
        console.error('[CourseServices] Error fetching courses:', error.response?.status, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
};

export const getCourseById = async (courseId: string): Promise<Course> => {
    try {
        const response = await api.get(`/courses/${courseId}?include=lessons,assessments`);
        return response.data;
    } catch (error: any) {
        console.error('[CourseServices] Error fetching course:', error.response?.status, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch course');
    }
};

export const getTeacherCourses = async (teacherId: string): Promise<Course[]> => {
    try {
        const response = await api.get('/courses', {
            params: { creatorId: teacherId }
        });
        return response.data;
    } catch (error: any) {
        console.error('[CourseServices] Error fetching teacher courses:', error.response?.status, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch teacher courses.');
    }
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/admin/categories');
        return response.data;
    } catch (error: any) {
        console.error('[CourseServices] Error fetching categories:', error.response?.status, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
};

export const createCategory = async (categoryData: { name: string }): Promise<Category> => {
    try {
        const response = await api.post('/admin/categories', categoryData);
        return response.data;
    } catch (error: any) {
        console.error('[CourseServices] Error creating category:', error.response?.status, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to create category');
    }
};

export const updateCourse = async (courseId: string, courseData: FormData): Promise<Course> => {
    try {
        const response = await api.put<Course>(`/admin/courses/${courseId}`, courseData);
        console.log('[CourseServices] Course updated:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('[CourseServices] Error updating course:', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Failed to update course');
    }
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    try {
        await api.delete(`/admin/courses/${courseId}`);
    } catch (error: any) {
        console.error('[CourseServices] Error deleting course:', error.response?.status, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete course');
    }
};

export const getLessonsByCourse = async (courseId: string): Promise<any[]> => {
    try {
        const response = await api.get(`/lessons/course/${courseId}`);
        return response.data;
    } catch (error: any) {
        console.error('[CourseServices] Error fetching lessons:', error.response?.status, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
    }
};