

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../../styles/AdminSidebar.css';

// const AdminSidebar: React.FC = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/admin/login');
//   };

//   return (
//     <div className="admin-sidebar">
//       <h3>Admin Panel</h3>
//       <ul>
//         <li onClick={() => navigate('/admin/dashboard')}>Dashboard</li>
//         <li onClick={() => navigate('/admin/users')}>User Management</li>
//         <li onClick={() => navigate('/admin/mentors')}>Mentor Management</li>
//           <li onClick={() => navigate('/admin/courses')}>Course Management</li>
//         <li onClick={() => navigate('/admin/courses/create')}>Course Creations</li>
//         <li onClick={() => navigate('/admin/categories')}>Category Creation</li>
//       </ul>
//       <div className="admin-logout-container">
//         <button onClick={handleLogout} className="admin-logout-btn">
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../interfaces/userInterface';
import '../../styles/Sidebar.css';

interface AdminSidebarProps {
  user?: User; 
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="user-sidebar">
      <div className="user-info">
        {user ? (
          <>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
          </>
        ) : (
          <h3>Admin Dashboard</h3>
        )}
      </div>
      <nav className="sidebar-nav">
        <Link to="/admin/dashboard" className="sidebar-link">Dashboard</Link>
        <Link to="/admin/users" className="sidebar-link">User Management</Link>
        <Link to="/admin/mentors" className="sidebar-link">Mentor Management</Link>
        <Link to="/admin/courses" className="sidebar-link">Course Management</Link>
        <Link to="/admin/courses/create" className="sidebar-link">Create Course</Link>
        <Link to="/admin/categories" className="sidebar-link">Categories</Link>
        <Link to="/admin/enrollments" className="sidebar-link">Enrollment Management</Link>
        {/* <Link to="/admin/teacher-assignment" className="sidebar-link">Teacher Assignment</Link> */}
        {/* <Link to="/admin/stats" className="sidebar-link">Statistics</Link> */}
        <Link to="/profile" className="sidebar-link">Profile</Link>
      </nav>
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;