

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { getProfile } from './services/authServices';
import { User, UserRole } from './interfaces/userInterface';
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import GoogleCallback from './pages/GoogleCallback';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminMentorManagement from './pages/admin/AdminMentorManagement';
import AdminCourseManagement from './pages/admin/AdminCourseManagement';
import CourseCreate from './pages/CourseCreate';
import CategoryCreate from './pages/CategoryCreate';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import EnrolledCourses from './pages/EnrolledCourses';
import TeacherOnboarding from './pages/TeacherOnboarding';
import Home from './pages/Home';
import TeacherEnrollmentView from './pages/TeacherEnrollmentView';
import AdminEnrollmentManagement from './pages/admin/AdminEnrollmentManagement';
import AdminTeacherAssignment from './pages/admin/AdminTeacherAssignment';
import AdminStats from './pages/admin/AdminStats';
import CourseEdit from './pages/admin/CourseEdit';
import LessonManager from './components/LessonManager';
import MaterialManager from './components/MaterialManager';
import AssessmentManager from './components/AssessmentManager';
import QuestionManager from './components/QuestionManager';
import AssessmentTake from './pages/AssessmentTake';
import './App.css';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getProfile();
                    setIsAuthenticated(true);
                    setUser(userData);
                    if (userData.role === UserRole.Teacher && !userData.isApproved) {
                        navigate('/teacher/onboarding', { replace: true });
                    } else if (userData.role === UserRole.Teacher && userData.isApproved && window.location.pathname === '/') {
                        navigate('/teacher/dashboard', { replace: true });
                    } else if (userData.role === UserRole.Admin && window.location.pathname === '/') {
                        navigate('/admin/dashboard', { replace: true });
                    } else if (userData.role === UserRole.Learner && window.location.pathname === '/') {
                        navigate('/dashboard', { replace: true });
                    }
                } catch (error) {
                    console.error("Authentication check failed:", error);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser(null);
                    navigate('/login', { replace: true });
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                if (!['/', '/login', '/signup', '/reset-password', '/auth/google/callback', '/admin/login'].includes(window.location.pathname)) {
                    navigate('/login', { replace: true });
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const userRole = user?.role;
    const isTeacherOrAdmin = userRole === UserRole.Teacher || userRole === UserRole.Admin;
    const isApprovedTeacher = userRole === UserRole.Teacher && user?.isApproved;

    return (
        <div className="App">
            <Routes>
              
                <Route path="/" element={<Home />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to={userRole === UserRole.Admin ? "/admin/dashboard" : (isApprovedTeacher ? "/teacher/dashboard" : "/dashboard")} /> : <Login />} />
                <Route path="/admin/login" element={isAuthenticated ? <Navigate to={userRole === UserRole.Admin ? "/admin/dashboard" : "/dashboard"} /> : <AdminLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />

             
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/courses" element={isAuthenticated ? <CourseList /> : <Navigate to="/login" />} />
                <Route path="/courses/:id" element={isAuthenticated ? <CourseDetail /> : <Navigate to="/login" />} />
                <Route path="/enrolled-courses" element={isAuthenticated && userRole === UserRole.Learner ? <EnrolledCourses /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
<Route path="/assessments/:assessmentId/take" element={isAuthenticated && userRole === UserRole.Learner ? <AssessmentTake /> : <Navigate to="/login" />} />
               
                <Route path="/admin/dashboard" element={isAuthenticated && userRole === UserRole.Admin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/users" element={isAuthenticated && userRole === UserRole.Admin ? <AdminUserManagement /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/mentors" element={isAuthenticated && userRole === UserRole.Admin ? <AdminMentorManagement /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/courses" element={isAuthenticated && userRole === UserRole.Admin ? <AdminCourseManagement /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/categories" element={isAuthenticated && userRole === UserRole.Admin ? <CategoryCreate /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/courses/create" element={isAuthenticated && userRole === UserRole.Admin ? <CourseCreate /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/courses/edit/:courseId" element={isAuthenticated && userRole === UserRole.Admin ? <CourseEdit /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/enrollments" element={isAuthenticated && userRole === UserRole.Admin ? <AdminEnrollmentManagement /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/teacher-assignment" element={isAuthenticated && userRole === UserRole.Admin ? <AdminTeacherAssignment /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/stats" element={isAuthenticated && userRole === UserRole.Admin ? <AdminStats /> : <Navigate to="/admin/login" />} />

               
                <Route path="/teacher/onboarding" element={isAuthenticated && userRole === UserRole.Teacher && !user?.isApproved ? <TeacherOnboarding /> : (isApprovedTeacher ? <Navigate to="/teacher/dashboard" /> : <Navigate to="/login" />)} />
                <Route path="/teacher/dashboard" element={isApprovedTeacher ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/teacher/courses/create" element={isApprovedTeacher ? <CourseCreate /> : <Navigate to="/login" />} />
                <Route path="/teacher/enrollments" element={isApprovedTeacher ? <TeacherEnrollmentView /> : <Navigate to="/login" />} />
                <Route path="/teacher/courses/edit/:courseId" element={isTeacherOrAdmin ? <CourseEdit /> : <Navigate to="/login" />} />
                <Route path="/teacher/lessons/:courseId" element={isTeacherOrAdmin ? <LessonManager /> : <Navigate to="/login" />} />
                <Route path="/teacher/lessons/:lessonId/materials" element={isTeacherOrAdmin ? <MaterialManager /> : <Navigate to="/login" />} />
                <Route path="/teacher/assessments/:courseId" element={isTeacherOrAdmin ? <AssessmentManager /> : <Navigate to="/login" />} />
                <Route path="/teacher/assessments/:assessmentId/questions" element={isTeacherOrAdmin ? <QuestionManager /> : <Navigate to="/login" />} />

                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </div>
    );
};

export default App;