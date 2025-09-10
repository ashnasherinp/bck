
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import adminRoutes from './routes/adminRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import userRoutes from './routes/userRoutes';
import materialRoutes from './routes/materialRoutes'; 
import assessmentRoutes from './routes/assessmentRoutes'; 
import lessonRoutes from './routes/lessonRoutes'; 
import adminEnrollmentRoutes from './routes/adminEnrollmentRoutes'; 
import { errorHandler } from './middleware/errorMiddleware';
import { notFound } from './middleware/notFoundMidlleware';
import { config } from './config/env';
import dotenv from 'dotenv';
import path from 'path';
import './models/index';

dotenv.config();

import './config/passport';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  throw new Error('Missing Google OAuth environment variables');
}

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[Request] ${req.method} ${req.originalUrl}`);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enrollments', enrollmentRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/assessments', assessmentRoutes);
app.use('/api/materials', materialRoutes); 
app.use('/api/lessons', lessonRoutes); 
app.use('/api/admin/enrollments', adminEnrollmentRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Edupro Backend');
});

app.use(notFound);
app.use(errorHandler);

export default app;