

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { User, UserRole } from '../../interfaces/userInterface';
// import '../../styles/Sidebar.css';

// interface UserSidebarProps {
//   user: User;
// }

// const UserSidebar: React.FC<UserSidebarProps> = ({ user }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   if (!user || !user.role) {
//     return null;
//   }

//   const renderLinksByRole = () => {
//     switch (user.role) {
//       // case UserRole.Admin:
//       //   return (
//       //     <>
//       //       <Link to="/admin/dashboard" className="sidebar-link">Dashboard</Link>
//       //       <Link to="/admin/users" className="sidebar-link">User Managements</Link>
//       //       <Link to="/admin/mentors" className="sidebar-link">Mentor Management</Link>
//       //       <Link to="/admin/courses/create" className="sidebar-link">Create Course</Link>
//       //       <Link to="/admin/categories" className="sidebar-link">Categories</Link>
//       //       <Link to="/profile" className="sidebar-link">Profile</Link>
//       //     </>
//       //   );
//       case UserRole.Teacher:
//         return (
//           <>
//             <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
//             <Link to="/profile" className="sidebar-link">Profile</Link>
//             {/* <Link to="/teacher/onboarding" className="sidebar-link">Onboarding</Link> */}
//             <Link to="/courses" className="sidebar-link">My Coursess</Link>
//           </>
//         );
//       case UserRole.Learner:
//         return (
//           <>
//             <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
//             <Link to="/courses" className="sidebar-link">Coursess</Link>
//             <Link to="/enrolled-courses" className="sidebar-link">My Enrollments</Link>
//             <Link to="/profile" className="sidebar-link">Profile</Link>
//           </>
//         );
//       default:
//         return (
//           <>
//             <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
//             <Link to="/profile" className="sidebar-link">Profile</Link>
//           </>
//         );
//     }
//   };

//   return (
//     <div className="user-sidebar">
//       <div className="user-info">
//         <h3>{user.name}</h3>
//         <p>{user.email}</p>
//         <p>Role: {user.role}</p>
//       </div>
//       <nav className="sidebar-nav">
//         {renderLinksByRole()}
//       </nav>
//       <div className="logout-container">
//         <button onClick={handleLogout} className="logout-btn">
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserSidebar;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../interfaces/userInterface';
import '../../styles/Sidebar.css';

interface UserSidebarProps {
  user: User;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user || !user.role) {
    return null;
  }

  const renderLinksByRole = () => {
    switch (user.role) {
      case UserRole.Teacher:
        return (
          <>
            <Link to="/teacher/dashboard" className="sidebar-link">Dashboard</Link>
            <Link to="/profile" className="sidebar-link">Profile</Link>
            {/* <Link to="/teacher/courses/create" className="sidebar-link">Create Course</Link> */}
            {/* <Link to="/courses" className="sidebar-link">My Courses</Link> */}
            <Link to="/teacher/enrollments" className="sidebar-link">Enrollments</Link>
          </>
        );
      case UserRole.Learner:
        return (
          <>
            <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
            <Link to="/courses" className="sidebar-link">Courses</Link>
            <Link to="/enrolled-courses" className="sidebar-link">My Enrollments</Link>
            <Link to="/profile" className="sidebar-link">Profile</Link>
          </>
        );
      default:
        return (
          <>
            <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
            <Link to="/profile" className="sidebar-link">Profile</Link>
          </>
        );
    }
  };

  return (
    <div className="user-sidebar">
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>Role: {user.role}</p>
      </div>
      <nav className="sidebar-nav">
        {renderLinksByRole()}
      </nav>
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;