

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/authServices';
import { getUserEnrollments, updateEnrollmentProgress, updateEnrollmentStatus } from '../services/enrollmentServices';
import { User, UserRole } from '../interfaces/userInterface';
import { IEnrollmentPopulated, EnrollmentStatus, AdminApprovalStatus, ILessonProgress } from '../interfaces/enrollmentInterface';
import UserSidebar from '../components/common/UserSidebar';
import Button from '../components/common/button';
import Input from '../components/common/Input';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import '../styles/Dashboard.css';
import '../styles/EnrolledCourses.css';

const EnrolledCourses: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [enrollments, setEnrollments] = useState<IEnrollmentPopulated[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progressInput, setProgressInput] = useState<{ [key: string]: number }>({});
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getProfile();
                setUser(userData);
                if (userData.role === UserRole.Learner) {
                    const userEnrollments = await getUserEnrollments();
                    setEnrollments(userEnrollments);
                    const initialProgress = userEnrollments.reduce((acc: { [key: string]: number }, enrollment: IEnrollmentPopulated) => {
                        const totalLessons = enrollment.progress.length;
                        const completedLessons = enrollment.progress.filter((lp: ILessonProgress) => lp.completed).length;
                        acc[enrollment._id.toString()] = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                        return acc;
                    }, {});
                    setProgressInput(initialProgress);
                } else {
                    navigate('/dashboard');
                }
            } catch (err: unknown) {
                const error = err as Error;
                setError('Failed to load enrolled courses.');
                if (error.message.includes('not found')) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleProgressChange = (enrollmentId: string, value: string) => {
        const numValue = parseInt(value, 10);
        if (value === '') {
            setProgressInput(prev => ({ ...prev, [enrollmentId]: 0 }));
        } else if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setProgressInput(prev => ({ ...prev, [enrollmentId]: numValue }));
        }
    };

    const handleUpdateProgress = async (enrollmentId: string) => {
        setActionLoading(enrollmentId);
        setError(null);
        try {
            const enrollment = enrollments.find(e => e._id.toString() === enrollmentId);
            if (enrollment?.adminApprovalStatus !== AdminApprovalStatus.Approved) {
                throw new Error('Cannot update progress for a course pending admin approval.');
            }
            const progress = progressInput[enrollmentId];
            if (progress === undefined) {
                throw new Error('Progress value is missing.');
            }
            const updatedEnrollment = await updateEnrollmentProgress(enrollmentId, progress);
            setEnrollments(prev =>
                prev.map(enroll => (enroll._id.toString() === enrollmentId ? updatedEnrollment : enroll))
            );
            setProgressInput(prev => ({
                ...prev,
                [enrollmentId]: updatedEnrollment.progress.length > 0
                    ? Math.round((updatedEnrollment.progress.filter((lp: ILessonProgress) => lp.completed).length / updatedEnrollment.progress.length) * 100)
                    : 0,
            }));
            alert('Progress updated successfully!');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to update progress.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkAsCompleted = async (enrollmentId: string) => {
        setActionLoading(`complete-${enrollmentId}`);
        setError(null);
        try {
            const enrollment = enrollments.find(e => e._id.toString() === enrollmentId);
            if (enrollment?.adminApprovalStatus !== AdminApprovalStatus.Approved) {
                throw new Error('Cannot mark course as completed until admin approval.');
            }
            const updatedEnrollment = await updateEnrollmentStatus(enrollmentId, EnrollmentStatus.Completed);
            setEnrollments(prev =>
                prev.map(enroll => (enroll._id.toString() === enrollmentId ? updatedEnrollment : enroll))
            );
            setProgressInput(prev => ({ ...prev, [enrollmentId]: 100 }));
            alert('Course marked as completed!');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to mark course as completed.');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="loading-message">Loading My Enrollments...</div>;
    if (error && !actionLoading) return <div className="error-message">{error}</div>;
    if (!user || user.role !== UserRole.Learner) {
        return <div className="access-denied">Access Denied. This page is for learners only.</div>;
    }

    return (
        <div className="dashboard-layout">
            <UserSidebar user={user} />
            <div className="enrolled-courses-container">
                <h2>My Enrolled Courses</h2>
                {enrollments.length === 0 ? (
                    <p>
                        You are not enrolled in any courses yet.{' '}
                        <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
                    </p>
                ) : (
                    <div className="enrollment-list">
                        {enrollments.map((enrollment) => {
                            const completedLessons = enrollment.progress.filter((lp: ILessonProgress) => lp.completed).length;
                            const totalLessons = enrollment.progress.length;
                            const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                            const isPending = enrollment.adminApprovalStatus !== AdminApprovalStatus.Approved;

                            return (
                                <div key={enrollment._id.toString()} className="enrollment-item">
                                    <div className="course-info">
                                        <h3>{enrollment.courseId.title}</h3>
                                        <p>{enrollment.courseId.description}</p>
                                        <p>Enrolled on: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                                        <p>
                                            Status:{' '}
                                            <span className={`status-${enrollment.status.toLowerCase()}`}>
                                                {enrollment.status}
                                            </span>
                                        </p>
                                        <p>Payment Status: {enrollment.paymentStatus || 'Free'}</p>
                                        {isPending && (
                                            <Typography color="warning.main">
                                                Pending Admin Approval: You cannot access course content until approved.
                                            </Typography>
                                        )}
                                        <p>Lesson Progress: {completedLessons}/{totalLessons} ({progressPercentage}%)</p>
                                        {enrollment.completionDate && (
                                            <p>Completed on: {new Date(enrollment.completionDate).toLocaleDateString()}</p>
                                        )}
                                        {enrollment.teacherId && (
                                            <div className="teacher-info">
                                                <h4>Assigned Teacher:</h4>
                                                <div className="teacher-details">
                                                    <Avatar
                                                        src={enrollment.teacherId.profile?.picture || '/default-avatar.png'}
                                                        alt={`${enrollment.teacherId.profile?.firstName} ${enrollment.teacherId.profile?.lastName}`}
                                                        sx={{ width: 40, height: 40, mr: 1 }}
                                                    />
                                                    <div>
                                                        <Typography>
                                                            {enrollment.teacherId.profile?.firstName}{'ashique '}
                                                            {enrollment.teacherId.profile?.lastName}
                                                        </Typography>
                                                        <Typography>
                                                            Phone: {enrollment.teacherId.profile?.phone || 'Not provided'}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="progress-section">
                                        {/* <label htmlFor={`progress-${enrollment._id.toString()}`}>Progress:</label>
                                        <Input
                                            type="number"
                                            id={`progress-${enrollment._id.toString()}`}
                                            name={`progress-${enrollment._id.toString()}`}
                                            value={String(progressInput[enrollment._id.toString()] ?? progressPercentage)}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProgressChange(enrollment._id.toString(), e.target.value)}
                                            min={0}
                                            max={100}
                                            step={1}
                                            className="progress-input"
                                            disabled={isPending}
                                        />
                                        <span>%</span>
                                        <Button
                                            onClick={() => handleUpdateProgress(enrollment._id.toString())}
                                            disabled={actionLoading === enrollment._id.toString() || isPending}
                                        >
                                            {actionLoading === enrollment._id.toString() ? 'Updating...' : 'Update Progress'}
                                        </Button> */}
                                        {enrollment.status !== EnrollmentStatus.Completed && (
                                            <Button
                                                onClick={() => handleMarkAsCompleted(enrollment._id.toString())}
                                                disabled={actionLoading === `complete-${enrollment._id.toString()}` || isPending}
                                                className="complete-button"
                                            >
                                                {actionLoading === `complete-${enrollment._id.toString()}` ? 'Marking...' : 'Mark as Completed'}
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => navigate(`/courses/${enrollment.courseId._id.toString()}`)}
                                            disabled={isPending}
                                        >
                                            View Course
                                        </Button>
                                    </div>
                                    {error && (actionLoading === enrollment._id.toString() || actionLoading === `complete-${enrollment._id.toString()}`) && (
                                        <div className="error-message-item">{error}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledCourses;