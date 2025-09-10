

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { IUser, UserRole } from '../interfaces/userInterface';
import { Types } from 'mongoose';
import { DependencyContainer } from '../utils/dependecy-container';

interface JwtPayload {
  _id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

const container = DependencyContainer.getInstance();
const authService = container.getAuthService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(`[AuthMiddleware] Token for ${req.method} ${req.originalUrl}:`, token ? 'Present' : 'No token');
  if (!token) {
    console.log('[AuthMiddleware] No token provided');
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    console.log('[AuthMiddleware] Decoded JWT:', {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
      iat: new Date(decoded.iat! * 1000).toISOString(),
      exp: new Date(decoded.exp! * 1000).toISOString(),
    });
    if (!Types.ObjectId.isValid(decoded._id)) {
      console.log('[AuthMiddleware] Invalid user ID in token:', decoded._id);
      res.status(401).json({ message: 'Invalid user ID in token' });
      return;
    }
    if (!Object.values(UserRole).includes(decoded.role)) {
      console.log('[AuthMiddleware] Invalid role in token:', decoded.role);
      res.status(401).json({ message: 'Invalid role in token' });
      return;
    }
    const userId = new Types.ObjectId(decoded._id);
    const user = await authService.getProfile(userId);
    if (!user) {
      console.log('[AuthMiddleware] User not found in database:', decoded._id);
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = user;
    console.log('[AuthMiddleware] User set:', { _id: req.user._id, email: req.user.email, role: req.user.role });
    next();
  } catch (error) {
    console.error('[AuthMiddleware] JWT Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};