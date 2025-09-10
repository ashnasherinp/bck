
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { UserRole } from '../interfaces/userInterface';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors.map((e) => e.message).join(', ') });
      } else {
        next(error);
      }
    }
  };
};

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.enum([UserRole.Learner, UserRole.Teacher, UserRole.Admin]),
  name: z.string().min(1),
  phone: z.string().optional(),
  className: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  experience: z.string().optional(),
  certificates: z.array(z.string()).optional(),
});


export const teacherOnboardingSchema = z.object({
  experience: z.string().nonempty('Experience is required'),
  classesToTeach: z.string().nonempty('Classes to teach are required'),
  syllabus: z.string().nonempty('Syllabus is required'),
});


export const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});

export const resendOTPSchema = z.object({
  email: z.string().email(),
});

export const courseSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  categoryId: z.string().nonempty(),
  creatorId: z.string().nonempty(), 
});

export const categorySchema = z.object({
  name: z.string().nonempty(),
});
