

import axios from './api';
import { User } from '../interfaces/userInterface';
import { SignupData, SignupResponse, VerifyOTPResponse } from '../interfaces/authInterface';

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData): Promise<{ token: string; user: User }> => {
  console.log('[authServices] Logging in with:', { ...data, password: '***' });
  try {
    const response = await axios.post('/auth/login', data);
    console.log('[authServices] Login Response:', response.data);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('[authServices] Token saved from login.');
    }
    return response.data;
  } catch (error: any) {
    console.error('[authServices] Login Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const getProfile = async (): Promise<User> => {
  console.log('[authServices] Fetching user profile');
  try {
    const response = await axios.get('/auth/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
    });
    console.log('[authServices] GetProfile Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[authServices] GetProfile Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const createTeacherRequest = async (): Promise<void> => {
  console.log('[authServices] Creating teacher request');
  try {
    await axios.post('/admin/teacher/request', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
    });
    console.log('[authServices] Teacher request created successfully');
  } catch (error: any) {
    console.error('[authServices] Error creating teacher request:', error.response?.status, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create teacher request');
  }
};

export const signup = async (data: SignupData): Promise<SignupResponse> => {
  console.log('[authServices] Signing up with:', { ...data, password: '***' });
  try {
    const response = await axios.post('/auth/signup', data);
    console.log('[authServices] Signup Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[authServices] Signup Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};


export const verifyOTP = async (email: string, otp: string): Promise<VerifyOTPResponse> => {
  console.log('[authServices] Verifying OTP for email:', email);
  try {
    const response = await axios.post('/auth/verify-otp', { email, otp });
    console.log('[authServices] Verify OTP Response:', response.data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('[authServices] New token saved from OTP verification.');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('[authServices] Verify OTP Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};


export const resendOTP = async (email: string): Promise<void> => {
  console.log('[authServices] Resending OTP for email:', email);
  try {
    await axios.post('/auth/resend-otp', { email });
    console.log('[authServices] OTP resent successfully');
  } catch (error: any) {
    console.error('[authServices] Resend OTP Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  console.log('[authServices] Sending password reset email for:', email);
  try {
    await axios.post('/auth/forgot-password', { email });
    console.log('[authServices] Password reset email sent');
  } catch (error: any) {
    console.error('[authServices] Forgot Password Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to send reset email');
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  console.log('[authServices] Resetting password');
  try {
    await axios.post('/auth/reset-password', { token, newPassword });
    console.log('[authServices] Password reset successfully');
  } catch (error: any) {
    console.error('[authServices] Reset Password Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  console.log('[authServices] Updating profile:', data);
  try {
    const response = await axios.patch('/auth/profile', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
    });
    console.log('[authServices] Profile updated:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[authServices] Update Profile Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const updateProfileWithFile = async (data: FormData): Promise<User> => {
    console.log('[authServices] Sending updateProfileWithFile request:', {
        formDataKeys: Array.from(data.keys()),
        formDataValues: Array.from(data.entries()).map(([key, value]) => ({
            key,
            value: value instanceof File ? value.name : value,
        })),
    });

    try {
        const response = await axios.patch('/auth/profile', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('[authServices] Update Profile With File Response:', {
            email: response.data.email,
            profilePicture: response.data.profilePicture,
            name: response.data.name,
            phone: response.data.phone,
            role: response.data.role,
        });
        return response.data as User;
    } catch (error: any) {
        console.error('[authServices] Update Profile With File Error:', {
            error: error.response?.data || error.message,
            status: error.response?.status,
        });
        throw new Error(error.response?.data?.message || 'Failed to update profile with file.');
    }
};
