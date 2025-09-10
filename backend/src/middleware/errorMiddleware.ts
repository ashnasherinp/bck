
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error('[errorMiddleware] Error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};