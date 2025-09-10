

import api from './api';
import { IEnrollmentPopulated, EnrollmentResponse, PaymentSuccessResponse, EnrollmentStatus } from '../interfaces/enrollmentInterface';

export interface EnrollmentStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export const getDetailedEnrollments = async (): Promise<IEnrollmentPopulated[]> => {
    try {
        const response = await api.get('/admin/enrollments/detailed');
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to fetch detailed enrollments');
    }
};

export const assignTeacher = async (enrollmentId: string, teacherId: string): Promise<void> => {
    try {
        await api.patch(`/admin/enrollments/${enrollmentId}/assign-teacher`, { teacherId });
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to assign teacher');
    }
};

export const approveEnrollment = async (enrollmentId: string): Promise<void> => {
    try {
        await api.patch(`/admin/enrollments/${enrollmentId}/approve`);
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to approve enrollment');
    }
};

export const rejectEnrollment = async (enrollmentId: string): Promise<void> => {
    try {
        await api.patch(`/admin/enrollments/${enrollmentId}/reject`);
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to reject enrollment');
    }
};

export const initiateEnrollment = async (courseId: string): Promise<EnrollmentResponse> => {
    try {
        const response = await api.post(`/enrollments/${courseId}/payment`, { courseId });
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to initiate enrollment');
    }
};

export const handlePaymentSuccess = async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    courseId: string;
    userId: string;
}): Promise<PaymentSuccessResponse> => {
    try {
        const response = await api.post('/enrollments/payment-success', data);
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to process payment');
    }
};

export const getUserEnrollments = async (): Promise<IEnrollmentPopulated[]> => {
    try {
        const response = await api.get('/enrollments/my');
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to fetch user enrollments');
    }
};

export const updateEnrollmentProgress = async (enrollmentId: string, progress: number): Promise<IEnrollmentPopulated> => {
    try {
        const response = await api.patch(`/enrollments/${enrollmentId}/progress`, { progress });
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to update enrollment progress');
    }
};

export const updateEnrollmentStatus = async (enrollmentId: string, status: EnrollmentStatus): Promise<IEnrollmentPopulated> => {
    try {
        const response = await api.patch(`/enrollments/${enrollmentId}/status`, { status });
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to update enrollment status');
    }
};

export const unenrollUserFromCourse = async (courseId: string): Promise<void> => {
    try {
        await api.delete(`/enrollments/${courseId}`);
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to unenroll from course');
    }
};

export const getEnrollmentStats = async (): Promise<EnrollmentStats> => {
    try {
        const response = await api.get('/admin/stats');
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to fetch enrollment statistics');
    }
};

export const getPendingEnrollments = async (): Promise<IEnrollmentPopulated[]> => {
    try {
        const response = await api.get('/admin/enrollments/pending');
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        throw new Error(err.response?.data?.message || 'Failed to fetch pending enrollments');
    }
};