
import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <p>Welcome to the admin panel. Use the sidebar to manage users, mentors, and courses.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;