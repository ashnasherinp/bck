// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getDetailedEnrollments, assignTeacher, approveEnrollment, rejectEnrollment } from '../../services/enrollmentServices';
// import { getApprovedTeachers } from '../../services/userServices';
// import { IEnrollmentPopulated, AdminApprovalStatus } from '../../interfaces/enrollmentInterface';
// import { User, UserRole } from '../../interfaces/userInterface';
// import Button from '../../components/common/button';
// import '../../styles/Dashboard.css';

// const AdminTeacherAssignment: React.FC = () => {
//     const navigate = useNavigate();
//     const [enrollments, setEnrollments] = useState<IEnrollmentPopulated[]>([]);
//     const [teachers, setTeachers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedTeachers, setSelectedTeachers] = useState<{ [key: string]: string }>({});

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const enrollmentsData = await getDetailedEnrollments();
//                 const teachersData = await getApprovedTeachers();
//                 setEnrollments(enrollmentsData.filter(e => e.adminApprovalStatus === AdminApprovalStatus.Pending));
//                 setTeachers(teachersData.filter((t: User) => t.isApproved));
//             } catch (err: unknown) {
//                 const error = err as Error;
//                 setError(error.message || 'Failed to load data.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     const handleTeacherChange = (enrollmentId: string, teacherId: string) => {
//         setSelectedTeachers(prev => ({ ...prev, [enrollmentId]: teacherId }));
//     };

//     const handleAssignTeacher = async (enrollmentId: string) => {
//         const teacherId = selectedTeachers[enrollmentId];
//         if (!teacherId) {
//             setError('Please select a teacher.');
//             return;
//         }
//         try {
//             await assignTeacher(enrollmentId, teacherId);
//             setEnrollments(prev => prev.filter(e => e._id.toString() !== enrollmentId));
//             alert('Teacher assigned successfully!');
//         } catch (err: unknown) {
//             const error = err as Error;
//             setError(error.message || 'Failed to assign teacher.');
//         }
//     };

//     const handleApprove = async (enrollmentId: string) => {
//         try {
//             await approveEnrollment(enrollmentId);
//             setEnrollments(prev => prev.filter(e => e._id.toString() === enrollmentId));
//             alert('Enrollment approved!');
//         } catch (err: unknown) {
//             const error = err as Error;
//             setError(error.message || 'Failed to approve enrollment.');
//         }
//     };

//     const handleReject = async (enrollmentId: string) => {
//         try {
//             await rejectEnrollment(enrollmentId);
//             setEnrollments(prev => prev.filter(e => e._id.toString() === enrollmentId));
//             alert('Enrollment rejected.');
//         } catch (err: unknown) {
//             const error = err as Error;
//             setError(error.message || 'Failed to reject enrollment.');
//         }
//     };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div className="error-message">{error}</div>;

//     return (
//         <div className="admin-teacher-assignment">
//             <h2>New Enrollments - Assign Teachers</h2>
//             {enrollments.length === 0 ? (
//                 <p>No pending enrollments.</p>
//             ) : (
//                 <div className="enrollment-list">
//                     {enrollments.map(enrollment => (
//                         <div key={enrollment._id.toString()} className="enrollment-item">
//                             <p>Student: {enrollment.userId.profile?.firstName} {enrollment.userId.profile?.lastName}</p>
//                             <p>Email: {enrollment.userId.email}</p>
//                             <p>Course: {enrollment.courseId.title}</p>
//                             <p>Payment: {enrollment.paymentDetails?.amount ? (enrollment.paymentDetails.amount / 100).toFixed(2) : '0.00'} {enrollment.paymentDetails?.currency || 'INR'}</p>
//                             <p>Order ID: {enrollment.paymentDetails?.orderId || 'N/A'}</p>
//                             <p>Payment ID: {enrollment.paymentDetails?.paymentId || 'N/A'}</p>
//                             <select
//                                 onChange={(e) => handleTeacherChange(enrollment._id.toString(), e.target.value)}
//                                 value={selectedTeachers[enrollment._id.toString()] || ''}
//                             >
//                                 <option value="">Select Teacher</option>
//                                 {teachers.map(teacher => (
//                                     <option key={teacher._id} value={teacher._id}>
//                                         {teacher.profile?.firstName} {teacher.profile?.lastName}
//                                     </option>
//                                 ))}
//                             </select>
//                             <Button onClick={() => handleAssignTeacher(enrollment._id.toString())}>Assign Teacher</Button>
//                             <Button onClick={() => handleApprove(enrollment._id.toString())}>Approve</Button>
//                             <Button onClick={() => handleReject(enrollment._id.toString())} className="danger-button">Reject</Button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminTeacherAssignment;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDetailedEnrollments, assignTeacher, approveEnrollment, rejectEnrollment } from '../../services/enrollmentServices';
import { getApprovedTeachers } from '../../services/userServices';
import { IEnrollmentPopulated, AdminApprovalStatus } from '../../interfaces/enrollmentInterface';
import { User, UserRole } from '../../interfaces/userInterface';
import Button from '../../components/common/button';
import AdminSidebar from '../../components/admin/AdminSidebar';
// import '../../styles/Admin.css';
import '../../styles/Dashboard.css';

const AdminTeacherAssignment: React.FC = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState<IEnrollmentPopulated[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeachers, setSelectedTeachers] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const enrollmentsData = await getDetailedEnrollments();
                const teachersData = await getApprovedTeachers();
                setEnrollments(enrollmentsData.filter(e => e.adminApprovalStatus === AdminApprovalStatus.Pending));
                setTeachers(teachersData.filter((t: User) => t.isApproved));
            } catch (err: unknown) {
                const error = err as Error;
                setError(error.message || 'Failed to load data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTeacherChange = (enrollmentId: string, teacherId: string) => {
        setSelectedTeachers(prev => ({ ...prev, [enrollmentId]: teacherId }));
    };

    const handleAssignTeacher = async (enrollmentId: string) => {
        const teacherId = selectedTeachers[enrollmentId];
        if (!teacherId) {
            setError('Please select a teacher.');
            return;
        }
        try {
            await assignTeacher(enrollmentId, teacherId);
            setEnrollments(prev => prev.filter(e => e._id.toString() !== enrollmentId));
            alert('Teacher assigned successfully!');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to assign teacher.');
        }
    };

    const handleApprove = async (enrollmentId: string) => {
        try {
            await approveEnrollment(enrollmentId);
            setEnrollments(prev => prev.filter(e => e._id.toString() !== enrollmentId));
            alert('Enrollment approved!');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to approve enrollment.');
        }
    };

    const handleReject = async (enrollmentId: string) => {
        try {
            await rejectEnrollment(enrollmentId);
            setEnrollments(prev => prev.filter(e => e._id.toString() !== enrollmentId));
            alert('Enrollment rejected.');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to reject enrollment.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-layout">
            <AdminSidebar />
            <div className="admin-teacher-assignment">
                <h2>New Enrollments - Assign Teachers</h2>
                {enrollments.length === 0 ? (
                    <p>No pending enrollments.</p>
                ) : (
                    <div className="enrollment-list">
                        {enrollments.map(enrollment => (
                            <div key={enrollment._id.toString()} className="enrollment-item">
                                <p>Student: {enrollment.userId.profile?.firstName} {enrollment.userId.profile?.lastName}</p>
                                <p>Email: {enrollment.userId.email}</p>
                                <p>Course: {enrollment.courseId.title}</p>
                                <p>Payment: {enrollment.paymentDetails?.amount ? (enrollment.paymentDetails.amount / 100).toFixed(2) : '0.00'} {enrollment.paymentDetails?.currency || 'INR'}</p>
                                <p>Order ID: {enrollment.paymentDetails?.orderId || 'N/A'}</p>
                                <p>Payment ID: {enrollment.paymentDetails?.paymentId || 'N/A'}</p>
                                <select
                                    onChange={(e) => handleTeacherChange(enrollment._id.toString(), e.target.value)}
                                    value={selectedTeachers[enrollment._id.toString()] || ''}
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.profile?.firstName} {teacher.profile?.lastName}
                                        </option>
                                    ))}
                                </select>
                                <Button onClick={() => handleAssignTeacher(enrollment._id.toString())}>Assign Teacher</Button>
                                <Button onClick={() => handleApprove(enrollment._id.toString())}>Approve</Button>
                                <Button onClick={() => handleReject(enrollment._id.toString())} className="danger-button">Reject</Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTeacherAssignment;