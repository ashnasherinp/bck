

// backend/src/types/express.d.ts
import { Request } from 'express';
import { Types } from 'mongoose';
import { IAuthenticatedUserPayload } from '../../interfaces/userInterface'; 


declare module 'express-serve-static-core' {
    interface Request {
        user?: IAuthenticatedUserPayload;
        file?: Express.Multer.File; 
    }
}
export interface AuthenticatedRequest extends Request {
    user: IAuthenticatedUserPayload; 
    file?: Express.Multer.File;
}