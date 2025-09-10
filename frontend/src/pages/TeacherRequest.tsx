//teacherrequest.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/button';
import { createTeacherRequest } from '../services/authServices';
import '../styles/Login.css'; // Reusing Login.css for consistent styling

const TeacherRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createTeacherRequest();
      setSuccess('Your request to become a teacher has been submitted and is awaiting admin approval.');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Teacher Request</h2>
      <p>
        Click the button below to submit a request to become a teacher. An admin will review your profile and approve your request.
      </p>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <Button onClick={handleRequest} disabled={loading}>
        {loading ? 'Submitting...' : 'Request Teacher Access'}
      </Button>
      <div className="login-link">
        <a href="/dashboard">Back to Dashboard</a>
      </div>
    </div>
  );
};

export default TeacherRequest;