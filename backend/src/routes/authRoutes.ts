

// backend/src/routes/authRoutes.ts
import express from 'express';
import { asyncMiddleware } from '../utils/middleware'; 
import { signup, login, verifyOTP, resendOTP, googleAuth, googleCallback, forgotPassword, resetPassword, updateProfile, getProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import {  uploadMemory  } from '../middleware/multterMIddleware';
import passport from 'passport';
const router = express.Router();

router.post('/signup', asyncMiddleware(signup));
router.post('/login', asyncMiddleware(login));
router.post('/verify-otp', asyncMiddleware(verifyOTP));
router.post('/resend-otp', asyncMiddleware(resendOTP));
router.get('/google', asyncMiddleware(googleAuth));
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=GoogleAuthFailed`,
        session: false
    }),
    asyncMiddleware(googleCallback)
);
router.post('/forgot-password', asyncMiddleware(forgotPassword));
router.post('/reset-password', asyncMiddleware(resetPassword));


router.patch(
    '/profile',
    asyncMiddleware(authMiddleware), 
     uploadMemory .fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'certificate', maxCount: 1 }    
    ]),
    asyncMiddleware(updateProfile) 
);


router.get('/profile', asyncMiddleware(authMiddleware), asyncMiddleware(getProfile));

export default router;