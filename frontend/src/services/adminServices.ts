

// frontend/src/services/adminServices.ts

import api from './api';
import { User, UserRole } from '../interfaces/userInterface';

export const getUsers = async (role: UserRole): Promise<User[]> => {
    console.log('[adminServices] Fetching users for role:', role);
    try {
        const response = await api.get('/admin/users', {
            params: { role },
        });
        console.log('[adminServices] GetUsers Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('[adminServices] Error fetching users:', error.response?.status, error.response?.data || error.message);
        if (error.response?.status === 403) {
            throw new Error('Admin access required');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
};

export const blockUser = async (userId: string): Promise<void> => {
    console.log('[adminServices] Blocking user:', userId);
    try {
        await api.patch(`/admin/users/block/${userId}`);
        console.log('[adminServices] User blocked successfully');
    } catch (error: any) {
        console.error('[adminServices] Error blocking user:', error.response?.status, error.response?.data || error.message);
        if (error.response?.status === 403) {
            throw new Error('Admin access required');
        }
        throw new Error(error.response?.data?.message || 'Failed to block user');
    }
};

export const unblockUser = async (userId: string): Promise<void> => {
    console.log('[adminServices] Unblocking user:', userId);
    try {
        await api.patch(`/admin/users/unblock/${userId}`);
        console.log('[adminServices] User unblocked successfully');
    } catch (error: any) {
        console.error('[adminServices] Error unblocking user:', error.response?.status, error.response?.data || error.message);
        if (error.response?.status === 403) {
            throw new Error('Admin access required');
        }
        throw new Error(error.response?.data?.message || 'Failed to unblock user');
    }
};


export const approveTeacher = async (userId: string): Promise<void> => {
    console.log('[adminServices] Approving teacher:', userId);
    try {
        await api.patch(`/admin/teachers/${userId}/approve`);
        console.log('[adminServices] Teacher approved successfully');
    } catch (error: any) {
        console.error('[adminServices] Error approving teacher:', error.response?.status, error.response?.data || error.message);
        if (error.response?.status === 403) {
            throw new Error('Admin access required');
        }
        throw new Error(error.response?.data?.message || 'Failed to approve teacher');
    }
};


export const rejectTeacher = async (userId: string, reason: string): Promise<void> => {
    console.log('[adminServices] Rejecting teacher:', userId, 'with reason:', reason);
    try {
    
        await api.patch(`/admin/teachers/${userId}/reject`, { reason });
        console.log('[adminServices] Teacher rejected successfully');
    } catch (error: any) {
        console.error('[adminServices] Error rejecting teacher:', error.response?.status, error.response?.data || error.message);
        if (error.response?.status === 403) {
            throw new Error('Admin access required');
        }
        throw new Error(error.response?.data?.message || 'Failed to reject teacher');
    }
};

export const deleteUser = async (userId: string): Promise<void> => {
    console.log('[adminServices] Deleting user:', userId);
    try {
     
        await api.delete(`/admin/users/${userId}`);
        console.log('[adminServices] User deleted successfully');
    } catch (error: any) {
        console.error('[adminServices] Error deleting user:', error.response?.status, error.response?.data || error.message);
        if (error.response?.status === 403) {
            throw new Error('Admin access required');
        }
        throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
};

