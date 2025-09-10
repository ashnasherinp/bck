
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserRole } from '../interfaces/userInterface'; 

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user'); 
    const error = searchParams.get('error'); 

    if (token && userJson) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', userJson);

        const user = JSON.parse(userJson);
        let targetPath = '/dashboard'; 
        if (user.role === UserRole.Admin) {
          targetPath = '/admin/dashboard';
        } else if (user.role === UserRole.Teacher && !user.isApproved) {
          targetPath = '/teacher/onboarding';
        }
        
        console.log('[GoogleCallback] Google login successful, navigating to:', targetPath);
        navigate(targetPath, { replace: true });

      } catch (parseError) {
        console.error('[GoogleCallback] Failed to parse user data from Google callback:', parseError);
        navigate('/login?error=' + encodeURIComponent('Failed to process user data after Google login.'));
      }
    } else if (error) {
      console.error('[GoogleCallback] Google login error:', error);
      navigate('/login?error=' + error); 
    } else {
      console.warn('[GoogleCallback] Google callback received without token or user data.');
      navigate('/login?error=' + encodeURIComponent('Google login cancelled or failed.'));
    }
  }, [searchParams, navigate]);

  return <div>Processing Google Login...</div>;
};

export default GoogleCallback;