
import React, { useState, useEffect } from 'react';
import { getProfile } from '../services/authServices';
import { User, UserRole } from '../interfaces/userInterface';
import UserSidebar from '../components/common/UserSidebar';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (err: any) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !user) {
    return <div className="error">{error || 'User not found.'}</div>;
  }

  return (
    <div className="dashboard-layout">
      <UserSidebar user={user} />
      <div className="dashboard-content">
        <h2>Welcome, {user.name}</h2>
        <p>Your current role is: {user.role}</p>
        {/* <p>Here you can view a summary of your activities.</p> */}
        {user.role === UserRole.Learner && (
          <p>You are a learner. You can find courses, enroll, and manage your profile.</p>
        )}
        {user.role === UserRole.Teacher && (
          <p>You are a teacher. You can manage your courses and profile.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;