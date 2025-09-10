

// frontend/src/interfaces/userInterface.ts
export enum UserRole {
  Learner = 'Learner',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

export enum TeacherRequestStatus {
  NotRequested = 'not requested',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface Profile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  alternatePhone?: string;
  picture?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  // isVerified: boolean;
    isEmailVerified:boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  className?: string;
  isApproved?: boolean;
  experience?: string;
  classesToTeach?: string[];
  syllabus?: string;
  certificates?: string[];
  qualifications?: string[];
  teacherRequestStatus?: TeacherRequestStatus;
  teacherRequestRejectionReason?: string;
  profilePicture?: string;
  enrolledCourses: string[];
  profile?: Profile;
}

export interface IUserPopulated extends User {
  profile: Profile;
}