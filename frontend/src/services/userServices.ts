import api from './api';
import { User, UserRole } from '../interfaces/userInterface';

export const getApprovedTeachers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/admin/users', {
            params: { role: UserRole.Teacher, isApproved: true },
        });
        return response.data;
    } catch (error: unknown) {
        const err = error as any;
        console.error('[UserServices] Error fetching approved teachers:', err.response?.status, err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch approved teachers');
    }
};