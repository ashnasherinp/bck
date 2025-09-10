
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCourses } from '../services/CourseServices';
// import '../styles/Home.css';

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   teacherId: string;
//   category: string;
//   level: string;
//   isApproved: boolean;
//   createdAt: string;
// }

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [role, setRole] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const decoded = JSON.parse(atob(token.split('.')[1]));
//           console.log('[Home] Decoded JWT:', decoded);
//           setRole(decoded.role);
//           const response = await getCourses(decoded.role); 
//           setCourses(response);
//         } else {
//           setError('No token found, please log in');
//           navigate('/login', { replace: true }); 
//         }
//       } catch (err: any) {
//         console.error('[Home] Fetch Courses Error:', err.response?.data || err);
//         setError(err.response?.data?.message || 'Failed to fetch courses');
//       }
//     };
//     fetchCourses();
//   }, [navigate]);

//   return (
//     <div className="home-container">
//       <h2>{role === 'Learner' ? 'Your Enrolled Courses' : role === 'Teacher' ? 'Your Created Courses' : 'Courses'}</h2>
//       {error && <div className="error">{error}</div>}
//       <div className="course-list">
//         {courses.length === 0 ? (
//           <p>No courses available</p> 
//         ) : (
//           courses.map(course => (
//             <div key={course._id} className="course-card">
//               <h3>{course.title}</h3>
//               <p>{course.description}</p>
//               <p>Category: {course.category}</p>
//               <p>Level: {course.level}</p>
//               <button onClick={() => navigate(`/course/${course._id}`)}>View Course</button>
//             </div>
//           ))
//         )}
//       </div>
//       {role === 'Teacher' && (
//         <button onClick={() => navigate('/course/create')}>Create New Course</button>
//       )}
//     </div>
//   );
// };

// export default Home;

// frontend/src/pages/Home.tsx (Updated)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../services/CourseServices'; // Make sure this path is correct if it's not api/
import { Course } from '../interfaces/courseInterface'; // Import the Course interface
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoursesData = async () => { // Renamed to avoid conflict
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          console.log('[Home] Decoded JWT:', decoded);
          setRole(decoded.role);
          // getCourses should return Course[] from interfaces
          const response = await getCourses(decoded.role);
          setCourses(response);
        } else {
          setError('No token found, please log in');
          navigate('/login', { replace: true });
        }
      } catch (err: any) {
        console.error('[Home] Fetch Courses Error:', err.response?.data || err);
        setError(err.response?.data?.message || 'Failed to fetch courses');
      }
    };
    fetchCoursesData();
  }, [navigate]);

  return (
    <div className="home-container">
      <h2>{role === 'Learner' ? 'Your Enrolled Courses' : role === 'Teacher' ? 'Your Created Courses' : 'Courses'}</h2>
      {error && <div className="error">{error}</div>}
      <div className="course-list">
        {courses.length === 0 ? (
          <p>No courses available</p>
        ) : (
          courses.map(course => (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              {/* Accessing category.name if category is an object */}
              <p>Category: {course.categoryId?.name || 'N/A'}</p>
              <p>Level: {course.level}</p>
              <button onClick={() => navigate(`/course/${course._id}`)}>View Course</button>
            </div>
          ))
        )}
      </div>
      {role === 'Teacher' && (
        <button onClick={() => navigate('/course/create')}>Create New Course</button>
      )}
    </div>
  );
};

export default Home;