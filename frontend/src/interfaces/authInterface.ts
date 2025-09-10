//frontend/src/interfaces/authInterfaces
import { UserRole } from './userInterface';
import { User } from './userInterface'; 

export interface SignupData {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  className?: string;
  qualifications?: string[];
  experience?: string;
  certificates?: string[];
}

export interface LoginData {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  userId: string;
  message: string;
}

export interface VerifyOTPResponse {
  token: string;
  message: string;
}