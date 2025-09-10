
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getProfile } from '../services/authServices';
// import { getUserEnrollments } from '../services/enrollmentServices';
// import { User, UserRole } from '../interfaces/userInterface';
// import { IEnrollmentPopulated, AdminApprovalStatus, ILessonProgress } from '../interfaces/enrollmentInterface';
// import TeacherSidebar from '../components/common/UserSidebar';
// import Button from '../components/common/button';
// import Avatar from '@mui/material/Avatar';
// import Typography from '@mui/material/Typography';
// import '../styles/Dashboard.css';
// import '../styles/EnrolledCourses.css';

// const TeacherEnrollmentView: React.FC = () => {
//     const navigate = useNavigate();
//     const [user, setUser] = useState<User | null>(null);
//     const [enrollments, setEnrollments] = useState<IEnrollmentPopulated[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const userData = await getProfile();
//                 setUser(userData);
//                 if (userData.role === UserRole.Teacher) {
//                     const teacherEnrollments = await getUserEnrollments(); // Assumes API returns enrollments where teacherId matches
//                     setEnrollments(teacherEnrollments);
//                 } else {
//                     navigate('/dashboard');
//                 }
//             } catch (err: unknown) {
//                 const error = err as Error;
//                 setError('Failed to load assigned enrollments.');
//                 if (error.message.includes('not found')) {
//                     navigate('/login');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [navigate]);

//     if (loading) return <div className="loading-message">Loading Assigned Enrollments...</div>;
//     if (error) return <div className="error-message">{error}</div>;
//     if (!user || user.role !== UserRole.Teacher) {
//         return <div className="access-denied">Access Denied. This page is for teachers only.</div>;
//     }

//     return (
//         <div className="dashboard-layout">
//             <TeacherSidebar user={user} />
//             <div className="enrolled-courses-container">
//                 <h2>Assigned Enrollments</h2>
//                 {enrollments.length === 0 ? (
//                     <p>No students assigned to you yet.</p>
//                 ) : (
//                     <div className="enrollment-list">
//                         {enrollments.map((enrollment) => {
//                             const completedLessons = enrollment.progress.filter((lp: ILessonProgress) => lp.completed).length;
//                             const totalLessons = enrollment.progress.length;
//                             const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
//                             const isPending = enrollment.adminApprovalStatus !== AdminApprovalStatus.Approved;

//                             return (
//                                 <div key={enrollment._id.toString()} className="enrollment-item">
//                                     <div className="course-info">
//                                         <h3>{enrollment.courseId.title}</h3>
//                                         <p>{enrollment.courseId.description}</p>
//                                         <p>Enrolled on: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
//                                         <p>
//                                             Status:{' '}
//                                             <span className={`status-${enrollment.status.toLowerCase()}`}>
//                                                 {enrollment.status}
//                                             </span>
//                                         </p>
//                                         {isPending && (
//                                             <Typography color="warning.main">
//                                                 Pending Admin Approval
//                                             </Typography>
//                                         )}
//                                         <p>Lesson Progress: {completedLessons}/{totalLessons} ({progressPercentage}%)</p>
//                                         {enrollment.completionDate && (
//                                             <p>Completed on: {new Date(enrollment.completionDate).toLocaleDateString()}</p>
//                                         )}
//                                         <div className="student-info">
//                                             <h4>Assigned Student:</h4>
//                                             <div className="student-details">
//                                                 <Avatar
//                                                     src={enrollment.userId.profile?.picture || '/default-avatar.png'}
//                                                     alt={`${enrollment.userId.profile?.firstName} ${enrollment.userId.profile?.lastName}`}
//                                                     sx={{ width: 40, height: 40, mr: 1 }}
//                                                 />
//                                                 <div>
//                                                     <Typography>
//                                                         {enrollment.userId.profile?.firstName || enrollment.userId.name}{' '}
//                                                         {enrollment.userId.profile?.lastName || ''}
//                                                     </Typography>
//                                                     <Typography>
//                                                         Phone: {enrollment.userId.profile?.phone || 'Not provided'}
//                                                     </Typography>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="progress-section">
//                                         <Button
//                                             onClick={() => navigate(`/courses/${enrollment.courseId._id.toString()}`)}
//                                             disabled={isPending}
//                                         >
//                                             View Course
//                                         </Button>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TeacherEnrollmentView;

 // frontend/src/pages/TeacherEnrollmentView.tsx
import React from 'react';

const TeacherEnrollmentView: React.FC = () => {
    return (
        <div>
            <h2>Teacher Enrollment View</h2>
            <p>This is the teacher enrollment view page.</p>
          
        </div>
    );
};

export default TeacherEnrollmentView;
