
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCourses } from '../services/CourseServices';
// import { getProfile } from '../services/authServices';
// import { User } from '../interfaces/userInterface';
// import UserSidebar from '../components/common/UserSidebar';
// import '../styles/Dashboard.css';

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   createdAt: string;
// }

// const CourseList: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userData = await getProfile();
//         setUser(userData);
//         console.log('[CourseList] Fetching courses for role:', userData.role);
//         const courseList = await getCourses(userData.role);
//         console.log('[CourseList] Fetched courses:', courseList);
//         setCourses(courseList);
//       } catch (err: any) {
//         console.error('[CourseList] Error fetching courses:', err);
//         setError('Failed to load courses');
//       }
//     };
//     fetchData();
//   }, []);

//   const handleCourseClick = (courseId: string) => {
//     navigate(`/courses/${courseId}`);
//   };

//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="dashboard-layout">
//       <UserSidebar user={user} />
//       <div className="dashboard-content">
//         <h2>Courses</h2>
//         {error && <div className="error">{error}</div>}
//         {courses.length === 0 ? (
//           <p>No courses available</p>
//         ) : (
//           <ul className="course-list">
//             {courses.map((course) => (
//               <li key={course._id} onClick={() => handleCourseClick(course._id)}>
//                 <h3>{course.title}</h3>
//                 <p>{course.description}</p>
//                 <p>Category: {course.category}</p>
//                 <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
//                 {}
//                 <button onClick={(e) => { e.stopPropagation();  }}>Enroll</button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseList;

// // frontend/src/pages/CourseList.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCourses } from '../services/CourseServices';
// import { getUserEnrollments } from '../services/enrollmentServices'; 
// import { getProfile } from '../services/authServices';
// import { User, UserRole } from '../interfaces/userInterface';
// import { Course } from '../interfaces/courseInterface';
// import { IEnrollmentPopulated } from '../interfaces/enrollmentInterface'; // NEW import
// import UserSidebar from '../components/common/UserSidebar';
// import CourseCard from '../components/CourseCard'; // NEW import
// import '../styles/Dashboard.css'; // For layout
// import '../styles/CourseList.css'; // For course cards grid

// const CourseList: React.FC = () => {
//   const [allCourses, setAllCourses] = useState<Course[]>([]);
//   const [user, setUser] = useState<User | null>(null);
//   const [userEnrollments, setUserEnrollments] = useState<IEnrollmentPopulated[]>([]); // To store user's enrollments
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userData = await getProfile();
//         setUser(userData);

//         let coursesData: Course[] = [];
//         let enrollmentsData: IEnrollmentPopulated[] = [];

//         // Fetch courses based on role
//         if (userData.role === UserRole.Teacher) {
//           // Teachers might see only their created courses, or all courses to manage
//           // For simplicity, let's assume getCourses returns courses created by *this* teacher for now
//           // If not, you might need a specific teacherCourses API or filter here.
//           coursesData = await getCourses('teacher'); // Adjust if backend doesn't filter by token
//         } else {
//           // Learners see all approved courses
//           coursesData = await getCourses('learner'); // Adjust if backend doesn't filter by token
//         }
//         setAllCourses(coursesData);
//         console.log('[CourseList] Fetched courses:', coursesData);

//         // Fetch user's enrollments for learners
//         if (userData.role === UserRole.Learner) {
//           enrollmentsData = await getUserEnrollments();
//           setUserEnrollments(enrollmentsData);
//           console.log('[CourseList] Fetched user enrollments:', enrollmentsData);
//         }
//       } catch (err: any) {
//         console.error('[CourseList] Error fetching data:', err);
//         setError('Failed to load courses or user data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Helper to check if a course is enrolled by the current user
//   const isCourseEnrolled = (courseId: string): boolean => {
//     return userEnrollments.some(enrollment => enrollment.courseId._id === courseId);
//   };

//   const handleEnrollOrUnenrollSuccess = (courseId: string) => {
//     // Re-fetch user enrollments to update state
//     getUserEnrollments()
//       .then(data => setUserEnrollments(data))
//       .catch(err => console.error("Failed to re-fetch enrollments after action:", err));

//     // Optionally, if your CourseCard needs the user object directly,
//     // you might need to update the user object here too to refresh enrolledCourses array
//     getProfile()
//       .then(data => setUser(data))
//       .catch(err => console.error("Failed to re-fetch user profile after action:", err));
//   };

//   if (loading) return <div>Loading Courses...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (!user) return <div>User data not available. Please log in.</div>;

//   const coursesToDisplay = allCourses.filter(course => {
//     // Admin and Teacher roles might see all their created courses or all courses
//     // Learners only see courses they haven't enrolled in or all courses with an "Enroll" button
//     if (user.role === UserRole.Learner) {
//         // Here, we want to show ALL available courses, and the CourseCard will decide
//         // whether to show "Enroll" or "View Enrollment".
//         return true;
//     }
//     // For teachers, this might only show their courses
//     // You might want a separate route/page for teachers to manage *all* courses.
//     return true; // For now, show all for other roles too
//   });


//   return (
//     <div className="dashboard-layout">
//       <UserSidebar user={user} />
//       <div className="dashboard-content">
//         <h2>{user.role === UserRole.Learner ? 'Browse All Courses' : 'Manage Courses'}</h2>
//         {coursesToDisplay.length === 0 ? (
//           <p>{user.role === UserRole.Teacher ? 'You have not created any courses yet.' : 'No courses available for enrollment.'}</p>
//         ) : (
//           <div className="course-grid"> {/* Apply grid styling here */}
//             {coursesToDisplay.map((course) => (
//               <CourseCard
//                 key={course._id}
//                 course={course}
//                 isEnrolledInitially={user.role === UserRole.Learner ? isCourseEnrolled(course._id) : false}
//                 onEnrollSuccess={handleEnrollOrUnenrollSuccess}
//                 onUnenrollSuccess={handleEnrollOrUnenrollSuccess}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseList;


// // frontend/src/pages/CourseList.tsx (No major changes needed based on previous fix, just confirm logic)
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCourses } from '../services/CourseServices'; // Make sure this is the correct path
// import { getUserEnrollments } from '../services/enrollmentServices';
// import { getProfile } from '../services/authServices';
// import { User, UserRole } from '../interfaces/userInterface';
// import { Course } from '../interfaces/courseInterface';
// import { IEnrollmentPopulated } from '../interfaces/enrollmentInterface';
// import UserSidebar from '../components/common/UserSidebar';
// import CourseCard from '../components/CourseCard';
// import '../styles/Dashboard.css';
// import '../styles/CourseList.css';

// const CourseList: React.FC = () => {
//     const [allCourses, setAllCourses] = useState<Course[]>([]);
//     const [user, setUser] = useState<User | null>(null);
//     const [userEnrollments, setUserEnrollments] = useState<IEnrollmentPopulated[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const userData = await getProfile();
//                 setUser(userData);

//                 let coursesData: Course[] = [];
//                 let enrollmentsData: IEnrollmentPopulated[] = [];

//                 // Fetch courses based on role and what the backend expects
//                 if (userData.role === UserRole.Teacher) {
//                     // Backend's getCourses now handles `role=teacher` to filter by creator.
//                     coursesData = await getCourses('teacher');
//                 } else if (userData.role === UserRole.Learner) {
//                     // Backend's getCourses now handles `role=learner` to fetch approved courses.
//                     coursesData = await getCourses('learner');
//                     enrollmentsData = await getUserEnrollments();
//                     setUserEnrollments(enrollmentsData);
//                     console.log('[CourseList] Fetched user enrollments:', enrollmentsData);
//                 } else if (userData.role === UserRole.Admin) {
//                     // Admins might just want all courses, or a specific admin view.
//                     // If backend getCourses without a 'role' param returns all, use that.
//                     // Otherwise, define a specific `getAllCoursesForAdmin` service/route.
//                     coursesData = await getCourses(); // Fetch all courses (no role filter, backend defaults to approved or all)
//                 }

//                 setAllCourses(coursesData);
//                 console.log('[CourseList] Fetched courses:', coursesData);

//             } catch (err: any) {
//                 console.error('[CourseList] Error fetching data:', err);
//                 setError('Failed to load courses or user data. Please ensure you are logged in.');
//                 // Handle redirection for auth errors if needed
//                 if (err.message && err.message.includes('Unauthorized')) {
//                     navigate('/login');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [navigate]); // Added navigate to dependencies

//     const isCourseEnrolled = (courseId: string): boolean => {
//         return userEnrollments.some(enrollment => enrollment.courseId._id === courseId);
//     };

//     const handleEnrollOrUnenrollSuccess = (courseId: string) => {
//         // Re-fetch user enrollments to update state
//         getUserEnrollments()
//             .then(data => setUserEnrollments(data))
//             .catch(err => console.error("Failed to re-fetch enrollments after action:", err));

//         // Re-fetch profile to potentially update user's enrolledCourses array if used elsewhere
//         getProfile()
//             .then(data => setUser(data))
//             .catch(err => console.error("Failed to re-fetch user profile after action:", err));
//     };

//     if (loading) return <div>Loading Courses...</div>;
//     if (error) return <div className="error">{error}</div>;
//     if (!user) return <div>User data not available. Please log in.</div>;

//     // Filter courses for display based on role (if `getCourses` didn't already filter perfectly)
//     // The filtering logic inside the useEffect now largely handles this.
//     // This `coursesToDisplay` might just be `allCourses` now.
//     const coursesToDisplay = allCourses;

//     return (
//         <div className="dashboard-layout">
//             <UserSidebar user={user} />
//             <div className="dashboard-content">
//                 <h2>{user.role === UserRole.Learner ? 'Browse All Courses' : 'Manage Courses'}</h2>
//                 {coursesToDisplay.length === 0 ? (
//                     <p>{user.role === UserRole.Teacher ? 'You have not created any courses yet.' : 'No courses available for enrollment.'}</p>
//                 ) : (
//                     <div className="course-grid">
//                         {coursesToDisplay.map((course) => (
//                             <CourseCard
//                                 key={course._id}
//                                 course={course}
//                                 // Pass true if the user is a learner and enrolled, otherwise false (for teachers/admins)
//                                 isEnrolledInitially={user.role === UserRole.Learner ? isCourseEnrolled(course._id) : false}
//                                 onEnrollSuccess={handleEnrollOrUnenrollSuccess}
//                                 onUnenrollSuccess={handleEnrollOrUnenrollSuccess}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CourseList;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../services/CourseServices';
import { getUserEnrollments } from '../services/enrollmentServices';
import { getProfile } from '../services/authServices';
import { User, UserRole } from '../interfaces/userInterface';
import { Course } from '../interfaces/courseInterface';
import { IEnrollmentPopulated } from '../interfaces/enrollmentInterface';
import UserSidebar from '../components/common/UserSidebar';
import CourseCard from '../components/CourseCard';
import '../styles/Dashboard.css';
import '../styles/CourseList.css';

const CourseList: React.FC = () => {
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [userEnrollments, setUserEnrollments] = useState<IEnrollmentPopulated[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getProfile();
                setUser(userData);

                let coursesData: Course[] = [];
                let enrollmentsData: IEnrollmentPopulated[] = [];

                if (userData.role === UserRole.Teacher) {
                    coursesData = await getCourses('teacher');
                } else if (userData.role === UserRole.Learner) {
                    coursesData = await getCourses('learner');
                    enrollmentsData = await getUserEnrollments();
                    setUserEnrollments(enrollmentsData);
                } else if (userData.role === UserRole.Admin) {
                    coursesData = await getCourses();
                }

                setAllCourses(coursesData);
            } catch (err: unknown) {
                const error = err as Error;
                console.error('[CourseList] Error fetching data:', error);
                setError('Failed to load courses or user data. Please ensure you are logged in.');
                if (error.message.includes('Unauthorized')) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const isCourseEnrolled = (courseId: string): boolean => {
        return userEnrollments.some(enrollment => enrollment.courseId._id === courseId);
    };

    const handleEnrollOrUnenrollSuccess = (courseId: string) => {
        getUserEnrollments()
            .then(data => setUserEnrollments(data))
            .catch(err => console.error("Failed to re-fetch enrollments after action:", err));

        getProfile()
            .then(data => setUser(data))
            .catch(err => console.error("Failed to re-fetch user profile after action:", err));
    };

    if (loading) return <div>Loading Courses...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return <div>User data not available. Please log in.</div>;

    const coursesToDisplay = allCourses;

    return (
        <div className="dashboard-layout">
            <UserSidebar user={user} />
            <div className="dashboard-content">
                <h2>{user.role === UserRole.Learner ? 'Browse All Courses' : 'Manage Courses'}</h2>
                {coursesToDisplay.length === 0 ? (
                    <p>{user.role === UserRole.Teacher ? 'You have not created any courses yet.' : 'No courses available for enrollment.'}</p>
                ) : (
                    <div className="course-grid">
                        {coursesToDisplay.map((course) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                isEnrolledInitially={user.role === UserRole.Learner ? isCourseEnrolled(course._id) : false}
                                onEnrollSuccess={handleEnrollOrUnenrollSuccess}
                                onUnenrollSuccess={handleEnrollOrUnenrollSuccess}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseList;