

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/button';
import { login } from '../services/authServices';
import { LoginData } from '../interfaces/authInterface';
import { UserRole } from '../interfaces/userInterface';

interface LoginProps {
  onLogin?: () => void; 
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    role: UserRole.Learner,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setFormData({ ...formData, role: newRole });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('[Login.tsx] Submitting login with:', { ...formData, password: '***' });
      const response = await login(formData);
      console.log('[Login.tsx:132] Login Response:', response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('[Login.tsx] Token stored:', response.token);
      if (onLogin) {
        console.log('[Login.tsx] Calling onLogin callback');
        onLogin();
      }
      const targetPath = formData.role === UserRole.Admin ? '/admin/dashboard' : '/dashboard';
      console.log('[Login.tsx] Navigating to:', targetPath);
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      console.error('[Login.tsx:135] Login Error:', err.message);
      setError(err.message || 'Login failed');
    }
  };



  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="role-toggle">
        <button
          className={`role-button ${formData.role === UserRole.Learner ? 'active' : ''}`}
          onClick={() => handleRoleChange(UserRole.Learner)}
        >
          Learner
        </button>
        <button
          className={`role-button ${formData.role === UserRole.Teacher ? 'active' : ''}`}
          onClick={() => handleRoleChange(UserRole.Teacher)}
        >
          Teacher
        </button>
        <button
          className={`role-button ${formData.role === UserRole.Admin ? 'active' : ''}`}
          onClick={() => handleRoleChange(UserRole.Admin)}
        >
          Admin
        </button>
      </div>
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
      

      <div className="signup-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
};

export default Login;