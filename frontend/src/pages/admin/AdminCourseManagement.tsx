


// frontend/src/components/admin/AdminCourseManagement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse } from '../../services/CourseServices';
import { Course } from '../../interfaces/courseInterface';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/Dashboard.css';

const AdminCourseManagement: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const allCourses: Course[] = await getCourses();
            
            setCourses(allCourses);
            console.log('[AdminCourseManagement] Fetched courses:', allCourses);
        } catch (err: any) {
            console.error('[AdminCourseManagement] Error fetching courses:', err);
            setError(err.message || 'Failed to fetch courses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDeleteCourse = async (courseId: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(courseId);
                setCourses(courses.filter(course => course._id !== courseId));
                alert('Course deleted successfully!');
            } catch (err: any) {
                console.error('[AdminCourseManagement] Error deleting course:', err);
                setError(err.message || 'Failed to delete course.');
            }
        }
    };

    if (loading) return <div className="loading-message">Loading Courses...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-layout">
            <AdminSidebar />
            <div className="dashboard-content">
                <h2>Course Management</h2>
                <button className="btn-create-new" onClick={() => navigate('/admin/courses/create')}>
                    Create New Course
                </button>
                {courses.length === 0 ? (
                    <p>No courses found. Create one from the sidebar!</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Creator</th>
                                <th>Level</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Effective Price</th>
                                <th>Approved</th>
                                <th>Actions</th>
                              
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course._id}>
                                    <td>{course.title}</td>
                                    <td>{course.categoryId?.name || 'N/A'}</td>
                                    <td>{course.creatorId?.name || 'N/A'}</td>
                                    <td>{course.level}</td>
                                    <td>₹{course.price?.toFixed(2) || '0.00'}</td>
                                    <td>{course.discountPrice ? `₹${course.discountPrice.toFixed(2)}` : 'N/A'}</td>
                                    <td>₹{course.effectivePrice?.toFixed(2) || '0.00'}</td>
                                    <td>{course.isApproved ? 'Yes' : 'No'}</td>
                                    <td>
                                        <button onClick={() => navigate(`/courses/${course._id}`)} className="btn-view">View</button>
                                        <button onClick={() => navigate(`/admin/courses/edit/${course._id}`)} className="btn-edit">Edit</button>
                                        <button onClick={() => handleDeleteCourse(course._id)} className="btn-delete">Delete</button>
                                    </td>
                                    <td>{course.effectivePrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminCourseManagement;