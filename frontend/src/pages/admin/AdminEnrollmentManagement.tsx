

import React, { useState, useEffect } from 'react';
import { getPendingEnrollments, approveEnrollment, rejectEnrollment, assignTeacher } from '../../services/enrollmentServices';
import { getUsers } from '../../services/adminServices';
import { UserRole } from '../../interfaces/userInterface';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { IEnrollmentPopulated, AdminApprovalStatus } from '../../interfaces/enrollmentInterface';
import { User } from '../../interfaces/userInterface';
import Button from '../../components/common/button';
import '../../styles/Dashboard.css';

const AdminEnrollmentManagement: React.FC = () => {
    const [enrollments, setEnrollments] = useState<IEnrollmentPopulated[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enrollmentData, teacherData] = await Promise.all([
                    getPendingEnrollments(),
                    getUsers(UserRole.Teacher).catch(() => []),
                ]);
                setEnrollments(enrollmentData);
                setTeachers(teacherData);
            } catch (err: unknown) {
                const error = err as Error;
                setError(error.message || 'Failed to fetch enrollments or teachers.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApprove = async (enrollmentId: string, teacherId?: string) => {
        try {
            if (teacherId) {
                await assignTeacher(enrollmentId, teacherId);
            }
            await approveEnrollment(enrollmentId);
            setEnrollments(enrollments.filter((e) => e._id.toString() !== enrollmentId));
            alert('Enrollment approved successfully!');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to approve enrollment.');
        }
    };

    const handleReject = async (enrollmentId: string) => {
        try {
            await rejectEnrollment(enrollmentId);
            setEnrollments(enrollments.filter((e) => e._id.toString() !== enrollmentId));
            alert('Enrollment rejected successfully!');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to reject enrollment.');
        }
    };

    if (loading) return <div className="loading-message">Loading Enrollments...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-layout">
            <AdminSidebar />
            <div className="dashboard-content">
                <h2>Enrollment Management</h2>
                {enrollments.length === 0 ? (
                    <p>No pending enrollments.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Course</th>
                                <th>Payment Status</th>
                                <th>Assign Teacher</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment._id.toString()}>
                                    <td>{enrollment.userId.profile?.firstName || enrollment.userId.name || 'Ashna'}</td>
                                    <td>{enrollment.courseId.title}</td>
                                    <td>{enrollment.paymentStatus || 'Free'}</td>
                                    <td>
                                        <select
                                            onChange={(e) => handleApprove(enrollment._id.toString(), e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="">Select Teacher (Optional)</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher._id} value={teacher._id}>
                                                    {teacher.profile?.firstName || teacher.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <Button onClick={() => handleApprove(enrollment._id.toString())}>Approve</Button>
                                        <Button onClick={() => handleReject(enrollment._id.toString())} className="btn-delete">
                                            Reject
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminEnrollmentManagement;