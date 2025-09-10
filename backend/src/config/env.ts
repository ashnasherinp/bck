
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/edupro-f',
    port: parseInt(process.env.PORT || '5000', 10),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    emailUser: process.env.EMAIL_USER || '',
    emailPass: process.env.EMAIL_PASS || '',
    emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

if (!config.mongoUri || !config.jwtSecret || !config.googleClientId || !config.googleClientSecret || !config.googleCallbackUrl || !config.emailUser || !config.emailPass || !config.emailHost || !config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET || !config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    throw new Error('Missing required environment variables in config/env.ts');
}