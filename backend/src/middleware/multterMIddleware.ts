


// backend/src/middleware/multerMiddleware.ts

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    console.log('[multerMiddleware] Processing file:', {
        fieldname: file.fieldname,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.size,
    });

    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const allowedCertificateTypes = /jpeg|jpg|png|gif|pdf/;
    const isProfilePicture = file.fieldname === 'profilePicture';
    const isCertificate = file.fieldname === 'certificate';
    const isCourseImage = file.fieldname === 'image';

    const allowedTypes = isCourseImage ? allowedImageTypes : (isProfilePicture ? allowedImageTypes : allowedCertificateTypes);
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        console.log('[multerMiddleware] File accepted:', file.originalname, 'MIME:', file.mimetype);
        cb(null, true);
    } else {
        console.error('[multerMiddleware] File rejected:', {
            fieldname: file.fieldname,
            mimetype: file.mimetype,
            originalname: file.originalname,
        });
        cb(new Error(`Only ${isCourseImage || isProfilePicture ? 'images (JPEG, PNG, JPG, GIF)' : 'images or PDFs'} are allowed for ${file.fieldname}.`));
    }
};


const storage = multer.memoryStorage();

export const uploadMemory = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});