

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/common/Input';
import Button from '../../components/common/button';
import { login } from '../../services/authServices';
import { LoginData } from '../../interfaces/authInterface';
import { UserRole } from '../../interfaces/userInterface';

interface AdminLoginProps {
  onLogin?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    role: UserRole.Admin,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('[AdminLogin.tsx] Submitting login with:', { ...formData, password: '***' });
      const response = await login(formData);
      console.log('[AdminLogin.tsx] Login Response:', response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('[AdminLogin.tsx] Token stored:', response.token);
      if (onLogin) {
        console.log('[AdminLogin.tsx] Calling onLogin callback');
        onLogin();
      }
      console.log('[AdminLogin.tsx] Navigating to: /admin/dashboard');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      console.error('[AdminLogin.tsx] Login Error:', err.message);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            label="Email"
            required
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            label="Password"
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default AdminLogin;