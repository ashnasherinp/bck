

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Types } from 'mongoose';
import { DependencyContainer } from '../utils/dependecy-container';
import { IUser, UserRole } from '../interfaces/userInterface'; 
import { IAuthService } from '../interfaces/authServiceInterface'; 

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  throw new Error('Missing Google OAuth environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_CALLBACK_URL');
}

const container = DependencyContainer.getInstance();
const authService: IAuthService = container.getAuthService(); 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['profile', 'email'],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
      try {
        const user = await authService.findOrCreateGoogleUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  if (!user._id || !Types.ObjectId.isValid(user._id)) {
    return done(new Error('Invalid user ID'));
  }
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return done(new Error('Invalid user ID'));
    }
    const user = await authService.getProfile(new Types.ObjectId(id));
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;