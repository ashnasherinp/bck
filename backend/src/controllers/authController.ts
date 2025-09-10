

// backend/src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../utils/dependecy-container';
import { IUser, TeacherRequestStatus, UserRole } from '../interfaces/userInterface';
import { Types } from 'mongoose';
import passport from 'passport';
import { config } from '../config/env';
import { CustomRequest } from '../utils/types';
import { IProfileUpdateData } from '../interfaces/authServiceInterface';

const container = DependencyContainer.getInstance();
const authService = container.getAuthService();

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const result = await authService.signup(req.body);
        return res.status(201).json({ userId: result.userId, message: 'User created, OTP sent' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
        next(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyOTP(email, otp);
        if (!result) {
            throw new Error('Invalid OTP or email');
        }
        return res.status(200).json({ token: result.token, message: result.message });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'OTP verification failed' });
        next(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const { email, password, role } = req.body;
        const result = await authService.login({ email, password, role });
        return res.status(200).json({ token: result.token, user: result.user });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
        next(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        await authService.forgotPassword(req.body.email);
        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
        next(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        await authService.resetPassword(req.body.token, req.body.newPassword);
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
        next(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const resendOTP = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        await authService.resendOTP(req.body.email);
        return res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
        next(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getProfile = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const userId = req.user?._id;
        if (!userId || !Types.ObjectId.isValid(userId)) {
            console.log('[authController] Invalid user ID:', userId);
            return res.status(401).json({ message: 'User ID not found or invalid' });
        }
        const profile = await authService.getProfile(userId);
        if (!profile) {
            console.log('[authController] Profile not found:', userId);
            return res.status(404).json({ message: 'Profile not found' });
        }
        console.log('[authController] Profile fetched:', profile.email);
        return res.status(200).json(profile);
    } catch (error: any) {
        console.error('[authController] Error fetching profile:', error.message);
        res.status(400).json({ message: error.message });
        next(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateProfile = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId || !Types.ObjectId.isValid(userId)) {
            console.log('[authController] Invalid user ID:', userId);
            res.status(401).json({ message: 'User ID not found or invalid' });
            return;
        }

        let classesToTeachArray: string[] | undefined;
        if (req.body.classesToTeach) {
            if (Array.isArray(req.body.classesToTeach)) {
                classesToTeachArray = req.body.classesToTeach;
            } else if (typeof req.body.classesToTeach === 'string') {
                classesToTeachArray = req.body.classesToTeach.split(',').map((s: string) => s.trim()).filter(s => s);
            }
        }

        const updateData: IProfileUpdateData = {
            name: req.body.name,
            phone: req.body.phone,
            className: req.body.className,
            experience: req.body.experience,
            classesToTeach: classesToTeachArray,
            syllabus: req.body.syllabus,
        };

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const profilePictureFile = files?.profilePicture?.[0];
        const certificateFile = files?.certificate?.[0];


        console.log('[authController] Update profile request:', {
            userId: userId.toString(),
            updateData,
            profilePicture: profilePictureFile ? {
                originalname: profilePictureFile.originalname,
                mimetype: profilePictureFile.mimetype,
                size: profilePictureFile.size,
                buffer: profilePictureFile.buffer ? 'Present' : 'Not Present', 
            } : null,
            certificate: certificateFile ? {
                originalname: certificateFile.originalname,
                mimetype: certificateFile.mimetype,
                size: certificateFile.size,
                buffer: certificateFile.buffer ? 'Present' : 'Not Present', 
            } : null,
        });

        const profile = await authService.updateProfile(userId, updateData, profilePictureFile, certificateFile);

        if (!profile) {
            console.log('[authController] Profile update failed:', userId);
            res.status(404).json({ message: 'Profile update failed' });
            return;
        }

        console.log('[authController] Profile updated:', {
            email: profile.email,
            profilePicture: profile.profilePicture,
            certificates: profile.certificates,
        });
        res.status(200).json(profile);
    } catch (error: any) {
        console.error('[authController] Error updating profile:', {
            error: error.message,
            stack: error.stack,
        });
        next(error);
    }
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as unknown as IUser;

        if (!user) {
            console.error('[authController] Google Callback Error: User not found in req.user after authentication.');
            return res.redirect(`${config.corsOrigin}/login?error=${encodeURIComponent('Google login failed: User data missing')}`);
        }
        const token = await authService.generateToken(user);
        const encodedUser = encodeURIComponent(JSON.stringify(user));
        const redirectUrl = `${config.corsOrigin}/auth/google/callback?token=${token}&user=${encodedUser}`;
        console.log('[authController] Redirecting to frontend with token:', redirectUrl);
        return res.redirect(redirectUrl);

    } catch (error: any) {
        console.error('[authController] Error during Google callback:', error.message);
        return res.redirect(`${config.corsOrigin}/login?error=${encodeURIComponent(error.message || 'Google login failed')}`);
    }
};
