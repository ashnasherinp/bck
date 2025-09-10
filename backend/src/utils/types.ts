
// backend/src/utils/types.ts
import { Request } from 'express';
import { Types } from 'mongoose';
import { IAuthenticatedUserPayload } from '../interfaces/userInterface';
export interface CustomRequest extends Request {
    user?: IAuthenticatedUserPayload; 
    file?: Express.Multer.File; 
}

