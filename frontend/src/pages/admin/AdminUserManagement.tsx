

import React, { useState, useEffect } from 'react';
import { getUsers, blockUser, unblockUser } from '../../services/adminServices';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/AdminUserManagement.css';
import { User, UserRole } from '../../interfaces/userInterface';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const learners = await getUsers(UserRole.Learner);
        setUsers(learners);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await unblockUser(userId);
      } else {
        await blockUser(userId);
      }
      setUsers(users.map((user) => (user._id === userId ? { ...user, isBlocked: !isBlocked } : user)));
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-user-management">
        <h2>User Management</h2>
        {error && <div className="error">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
              <th>em</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td>
                  <button onClick={() => handleBlockUser(user._id, user.isBlocked)}>
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
                <td>{user.email.slice(0,4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;