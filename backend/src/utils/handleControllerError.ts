


// backend/src/utils/handleControllerError.ts
import { Response, NextFunction } from 'express';
import AppError from './appError';

export const handleControllerError = (error: any, res: Response, next: NextFunction, defaultMessage: string) => {
    if (error instanceof AppError) {
     
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }

    console.error(`[Controller Error] ${defaultMessage}:`, error);
    return res.status(500).json({
        status: 'error',
        message: defaultMessage || 'Something went wrong on the server.',
    });
};