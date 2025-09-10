


// // backend/src/models/Usermodel.ts
// import { Schema, model } from 'mongoose';
// import { IUser, UserRole, TeacherRequestStatus } from '../interfaces/userInterface';

// const userSchema = new Schema<IUser>({
//     email: { type: String, required: true, unique: true },
//     password: { type: String },
//     name: { type: String, required: true },
//     role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.Learner },
//     phone: { type: String },
//     className: { type: String }, // Now in IUserBase
//     qualifications: [{ type: String }], // Now in IUserBase
//     experience: { type: String }, // Now in IUserBase
//     syllabus: { type: String }, // Now in IUserBase
//     certificates: [{ type: String }], // Now in IUserBase
//     classesToTeach: [{ type: String }], // Now in IUserBase
//     profilePicture: { type: String }, // Now in IUserBase
//     isEmailVerified: { type: Boolean, default: false },
//     isBlocked: { type: Boolean, default: false },
//     isApproved: { type: Boolean, default: false }, // Now in IUserBase
//     isGoogleAuth: { type: Boolean, default: false }, // Now in IUserBase
//     googleId: { type: String }, // Now in IUserBase
//     teacherRequestStatus: { type: String, enum: Object.values(TeacherRequestStatus), default: TeacherRequestStatus.NotRequested }, // Now in IUserBase
//     teacherRequestRejectionReason: { type: String }, // Now in IUserBase
//     resetPasswordToken: { type: String }, // Now in IUserBase
//     resetPasswordExpires: { type: Date }, // Now in IUserBase
//     enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }] // Now in IUserBase
// }, { timestamps: true });

// export const UserModel = model<IUser>('User', userSchema);


// backend/src/models/UserModel.ts
import { Schema, model } from 'mongoose';
import { IUser, UserRole, TeacherRequestStatus } from '../interfaces/userInterface';

const profileSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    alternatePhone: { type: String },
});

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.Learner },
    profile: { type: profileSchema, default: {} }, // Add profile subdocument
    className: { type: String },
    qualifications: [{ type: String }],
    experience: { type: String },
    syllabus: { type: String },
    certificates: [{ type: String }],
    classesToTeach: [{ type: String }],
    profilePicture: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isGoogleAuth: { type: Boolean, default: false },
    googleId: { type: String },
    teacherRequestStatus: { type: String, enum: Object.values(TeacherRequestStatus), default: TeacherRequestStatus.NotRequested },
    teacherRequestRejectionReason: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

export const UserModel = model<IUser>('User', userSchema);