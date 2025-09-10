import api from './api';

export const initiatePayment = async (courseId: string): Promise<any> => {
    try {
        const response = await api.post('/enrollments/initiate-payment', { courseId });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to initiate payment');
    }
};