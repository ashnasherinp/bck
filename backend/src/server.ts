
import mongoose from 'mongoose';
import app from './app';
import { config } from './config/env';

console.log('Starting server...');

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(' Connected to MongoDB');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(` Routes available: /api/auth, /api/course`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();