

// backend/src/services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { config } from '../config/env';
import cloudinary from '../config/cloudinaryConfig';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import crypto from 'crypto';

import { IAuthService, SignupData, LoginData, IProfileUpdateData } from '../interfaces/authServiceInterface';
import { IEmailService } from '../interfaces/emailServiceInterface';
import { IUser, UserRole, TeacherRequestStatus, Profile } from '../interfaces/userInterface';
import { IUserRepository } from '../interfaces/userRepositoryinterface';
import { IOTPRepository } from '../interfaces/otpRepositoryinterface';
import { IResetTokenRepository } from '../interfaces/resetToken.interface';

export class AuthServiceImpl implements IAuthService {
    private userRepository: IUserRepository;
    private otpRepository: IOTPRepository;
    private emailService: IEmailService;
    private resetTokenRepository: IResetTokenRepository;

    constructor(
        userRepository: IUserRepository,
        otpRepository: IOTPRepository,
        emailService: IEmailService,
        resetTokenRepository: IResetTokenRepository
    ) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.resetTokenRepository = resetTokenRepository;
    }

    async signup(data: SignupData): Promise<{ userId: string; message: string }> {
        const { email, password, role, name, phone, className, qualifications, experience, certificates } = data;
        const standardizedEmail = email.toLowerCase();

        const existingUser = await this.userRepository.findByEmail(standardizedEmail);
        if (existingUser && existingUser.isEmailVerified) {
            throw new Error('User already exists and verified. Please log in.');
        }
        if (existingUser && !existingUser.isEmailVerified) {
            await this.otpRepository.deleteByEmail(standardizedEmail);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
            await this.otpRepository.create({ email: standardizedEmail, otp, expiresAt, userId: existingUser._id! });

            await this.emailService.sendOTP(standardizedEmail, otp);
            return { userId: existingUser._id!.toString(), message: 'User already exists but not verified. New OTP sent.' };
        }

        const hashedPassword = await bcrypt.hash(password!, 10);
        const newUser = await this.userRepository.create({
            email: standardizedEmail,
            password: hashedPassword,
            role,
            name,
            profile: phone ? { phone } : undefined,
            className: role === UserRole.Learner ? className : undefined,
            qualifications: role === UserRole.Teacher ? qualifications : undefined,
            experience: role === UserRole.Teacher ? experience : undefined,
            certificates: role === UserRole.Teacher ? certificates : undefined,
            isEmailVerified: false,
            isBlocked: false,
            isApproved: role !== UserRole.Teacher,
            isGoogleAuth: false,
            teacherRequestStatus: role === UserRole.Teacher ? TeacherRequestStatus.Pending : TeacherRequestStatus.NotRequested,
            enrolledCourses: [],
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.otpRepository.create({ email: standardizedEmail, otp, expiresAt, userId: newUser._id! });
        await this.emailService.sendOTP(standardizedEmail, otp);

        return { userId: newUser._id!.toString(), message: 'User created successfully, OTP sent to your email.' };
    }

    async verifyOTP(email: string, otp: string): Promise<{ token: string; message: string }> {
        const standardizedEmail = email.toLowerCase();
        const trimmedOtp = otp.trim();

        console.log('Backend received OTP for email:', standardizedEmail, 'and OTP:', trimmedOtp);

        const user = await this.userRepository.findByEmail(standardizedEmail);
        if (!user) {
            throw new Error('User not found.');
        }
        if (user.isEmailVerified) {
            throw new Error('User is already verified. Please log in.');
        }

        const otpRecord = await this.otpRepository.findByEmailAndOTP(standardizedEmail, trimmedOtp);
        console.log(`[AuthService] OTP Query result:`, otpRecord);

        if (!otpRecord) {
            throw new Error('Invalid or expired OTP.');
        }

        await this.userRepository.update(user._id!, { isEmailVerified: true });
        await this.otpRepository.deleteByEmail(standardizedEmail);

        const token = await this.generateToken(user);
        return { token, message: 'OTP verified successfully, user activated.' };
    }

    async login(data: LoginData): Promise<{ token: string; user: IUser }> {
        const { email, password, role } = data;
        const standardizedEmail = email.toLowerCase();

        const user = await this.userRepository.findByEmail(standardizedEmail);
        if (!user) {
            throw new Error('Invalid credentials.');
        }
        if (!user.isEmailVerified) {
            throw new Error('Account not verified. Please verify your email with OTP.');
        }
        if (user.isBlocked) {
            throw new Error('Your account has been blocked. Please contact support.');
        }

        if (role && user.role !== (role as UserRole)) {
            throw new Error(`Invalid role for this account. You are a ${user.role}.`);
        }

        if (user.password && !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials.');
        }

        if (user.role === UserRole.Teacher && !user.isApproved) {
            throw new Error('Your teacher account is pending approval.');
        }

        const token = await this.generateToken(user);
        return { token, user: user };
    }

    async generateToken(user: IUser): Promise<string> {
        const payload = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(
            payload,
            config.jwtSecret as jwt.Secret,
            { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
        );
    }

    async forgotPassword(email: string): Promise<void> {
        const standardizedEmail = email.toLowerCase();
        const user = await this.userRepository.findByEmail(standardizedEmail);
        if (!user) {
            throw new Error('User not found.');
        }

        await this.resetTokenRepository.deleteByUserId(user._id!);

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000);
        await this.resetTokenRepository.create({ userId: user._id!, token, expiresAt });

        const resetUrl = `${config.corsOrigin}/reset-password?token=${token}`;
        await this.emailService.sendPasswordReset(standardizedEmail, resetUrl);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const resetToken = await this.resetTokenRepository.findByToken(token);
        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired password reset token.');
        }

        const user = await this.userRepository.findById(resetToken.userId);
        if (!user) {
            throw new Error('User associated with this token not found.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(user._id!, { password: hashedPassword });
        await this.resetTokenRepository.deleteByToken(token);
    }

    async resendOTP(email: string): Promise<void> {
        const standardizedEmail = email.toLowerCase();
        const user = await this.userRepository.findByEmail(standardizedEmail);
        if (!user) {
            throw new Error('User not found.');
        }
        if (user.isEmailVerified) {
            throw new Error('User is already verified. No need to resend OTP.');
        }

        await this.otpRepository.deleteByEmail(standardizedEmail);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        await this.otpRepository.create({ email: standardizedEmail, otp, expiresAt, userId: user._id! });
        await this.emailService.sendOTP(standardizedEmail, otp);
    }

    async getProfile(userId: Types.ObjectId): Promise<IUser | null> {
        return await this.userRepository.findByIdPopulated(userId);
    }

    async updateProfile(
        userId: Types.ObjectId,
        updateData: IProfileUpdateData,
        profilePictureFile?: Express.Multer.File,
        certificateFile?: Express.Multer.File
    ): Promise<IUser | null> {
        console.log('[authService] updateProfile called with:', {
            userId: userId.toString(),
            updateData,
            hasProfilePicture: !!profilePictureFile,
            profilePictureDetails: profilePictureFile ? {
                mimetype: profilePictureFile.mimetype,
                originalname: profilePictureFile.originalname,
                size: profilePictureFile.size,
                buffer: profilePictureFile.buffer ? 'Present' : 'Not Present',
            } : null,
            hasCertificate: !!certificateFile,
            certificateDetails: certificateFile ? {
                mimetype: certificateFile.mimetype,
                originalname: certificateFile.originalname,
                size: certificateFile.size,
                buffer: certificateFile.buffer ? 'Present' : 'Not Present',
            } : null,
        });

        const user = await this.userRepository.findById(userId);
        if (!user) {
            console.error('[authService] User not found:', userId.toString());
            throw new Error('User not found.');
        }

        const updatedFields: Partial<IUser> = { ...updateData };

        if (profilePictureFile) {
            if (!profilePictureFile.buffer) {
                console.error('[authService] Profile picture buffer is undefined:', {
                    originalname: profilePictureFile.originalname,
                    mimetype: profilePictureFile.mimetype,
                    size: profilePictureFile.size,
                });
                throw new Error('Profile picture buffer is missing.');
            }

            try {
                console.log('[authService] Uploading profile picture to Cloudinary from buffer:', {
                    filename: profilePictureFile.originalname,
                    mimetype: profilePictureFile.mimetype,
                    size: profilePictureFile.size,
                });
                const b64 = Buffer.from(profilePictureFile.buffer).toString('base64');
                const dataURI = `data:${profilePictureFile.mimetype};base64,${b64}`;

                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'profile_pictures',
                    resource_type: 'image',
                    public_id: `user_${userId}_${Date.now()}`,
                    overwrite: true,
                });
                updatedFields.profilePicture = result.secure_url;
                console.log('[authService] Profile picture uploaded successfully:', {
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    asset_id: result.asset_id,
                });
            } catch (error: any) {
                console.error('[authService] Error uploading profile picture to Cloudinary:', {
                    error: error.message,
                    stack: error.stack,
                    filename: profilePictureFile.originalname,
                });
                throw new Error(`Failed to upload profile picture: ${error.message}`);
            }
        }

        if (certificateFile && user.role === UserRole.Teacher) {
            if (!certificateFile.buffer) {
                console.error('[authService] Certificate buffer is undefined:', {
                    originalname: certificateFile.originalname,
                    mimetype: certificateFile.mimetype,
                    size: certificateFile.size,
                });
                throw new Error('Certificate buffer is missing.');
            }

            try {
                console.log('[authService] Uploading certificate to Cloudinary from buffer:', {
                    filename: certificateFile.originalname,
                    mimetype: certificateFile.mimetype,
                    size: certificateFile.size,
                });
                const b64 = Buffer.from(certificateFile.buffer).toString('base64');
                const dataURI = `data:${certificateFile.mimetype};base64,${b64}`;

                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'certificates',
                    resource_type: 'raw',
                    public_id: `cert_${userId}_${Date.now()}`,
                    overwrite: true,
                });
                updatedFields.certificates = [...(user.certificates || []), result.secure_url];
                console.log('[authService] Certificate uploaded successfully:', {
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    asset_id: result.asset_id,
                });
            } catch (error: any) {
                console.error('[authService] Error uploading certificate to Cloudinary:', {
                    error: error.message,
                    stack: error.stack,
                    filename: certificateFile.originalname,
                });
                throw new Error(`Failed to upload certificate: ${error.message}`);
            }
        } else if (certificateFile) {
            console.log('[authService] Skipping certificate upload: User is not a Teacher.');
        }

        console.log('[authService] Updating user with fields:', updatedFields);
        const updatedUser = await this.userRepository.update(userId, updatedFields);
        if (!updatedUser) {
            console.error('[authService] Failed to update user in repository:', userId.toString());
            throw new Error('Failed to update user in database.');
        }
        console.log('[authService] User updated successfully:', {
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            certificates: updatedUser.certificates,
        });
        return updatedUser;
    }

    async findOrCreateGoogleUser(profile: GoogleProfile): Promise<IUser> {
        const standardizedEmail = profile.emails![0].value.toLowerCase();
        let user = await this.userRepository.findByEmail(standardizedEmail);

        if (user) {
            if (!user.isGoogleAuth) {
                await this.userRepository.update(user._id!, {
                    isGoogleAuth: true,
                    googleId: profile.id,
                    isEmailVerified: true,
                });
                user = (await this.userRepository.findByEmail(standardizedEmail))!;
            }
        } else {
            const defaultRole = UserRole.Learner;
            const newUserPartial: Partial<IUser> = {
                email: standardizedEmail,
                name: profile.displayName || profile.name?.givenName || 'Google User',
                role: defaultRole,
                profile: { phone: '' },
                isEmailVerified: true,
                isBlocked: false,
                isApproved: defaultRole === UserRole.Learner,
                isGoogleAuth: true,
                googleId: profile.id,
                teacherRequestStatus: TeacherRequestStatus.NotRequested,
                profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
                enrolledCourses: [],
            };
            user = await this.userRepository.create(newUserPartial);
        }
        return user!;
    }
}