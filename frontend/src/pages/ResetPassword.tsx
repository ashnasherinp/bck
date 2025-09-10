import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/button';
import { resetPassword, forgotPassword } from '../services/authServices';
import '../styles/Login.css';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSuccess('Password reset email sent. Check your inbox.');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      setSuccess(null);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(token, newPassword);
      setSuccess('Password reset successfully. Redirecting to login...');
      setError(null);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      setSuccess(null);
    }
  };

  return (
    <div className="login-container">
      <h2>{token ? 'Reset Password' : 'Forgot Password'}</h2>
      {!token ? (
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <Input
              type="email"
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              label="Email"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <Button type="submit">Send Reset Email</Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <Input
              type="password"
              name="newPassword" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              label="New Password"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <Button type="submit">Reset Password</Button>
        </form>
      )}
      <div className="login-link">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default ResetPassword;