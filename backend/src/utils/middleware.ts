
import { RequestHandler, Request, Response, NextFunction } from 'express';

export function asyncMiddleware(

    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        handler(req, res, next).catch(next);
    };
}