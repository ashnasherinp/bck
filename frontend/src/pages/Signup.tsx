

// import React, { useState } from 'react';
//   import { useNavigate } from 'react-router-dom';
//   import Input from '../components/common/Input';
//   import Button from '../components/common/button';
//   import { signup, verifyOTP, resendOTP } from '../services/authServices';
//   import { SignupData, SignupResponse, VerifyOTPResponse } from '../interfaces/authInterface';
//   import { UserRole } from '../interfaces/userInterface';
//   import './Signup.css';

//   const Signup: React.FC = () => {
//     const navigate = useNavigate();
//     const [role, setRole] = useState<UserRole>(UserRole.Learner);
//     const [formData, setFormData] = useState<SignupData>({
//       email: '',
//       password: '',
//       role: UserRole.Learner,
//       name: '',
//       phone: '',
//       className: '',
//       qualifications: [],
//       experience: '',
//       certificates: [],
//     });
//     const [otpSent, setOtpSent] = useState(false);
//     const [otp, setOtp] = useState('');
//     const [error, setError] = useState<string | null>(null);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       if (name === 'qualifications' || name === 'certificates') {
//         setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()).filter(item => item) });
//       } else {
//         setFormData({ ...formData, [name]: value });
//       }
//     };

//     const handleRoleChange = (newRole: UserRole) => {
//       setRole(newRole);
//       setFormData({ ...formData, role: newRole });
//     };

//     const handleSignup = async (e: React.FormEvent) => {
//       e.preventDefault();
//       console.log('[Signup] Signup Payload:', { ...formData, password: '***' });
//       try {
//         const response: SignupResponse = await signup(formData);
//         console.log('[Signup] Signup Response:', response);
//         if (response.userId) {
//           setOtpSent(true);
//           setError(null);
//         }
//       } catch (err: any) {
//         console.error('[Signup] Signup Error:', err.response?.data || err.message);
//         setError(err.response?.data?.message || 'Signup failed');
//       }
//     };

// const handleVerifyOTP = async () => {
//     if (!otp.trim()) {
//       setError('Please enter OTP');
//       return;
//     }
//     try {
//       const response: VerifyOTPResponse = await verifyOTP(formData.email, otp);
//       console.log('[Signup] OTP Verification Response:', response);
//       navigate('/profile'); 
//     } catch (err: any) {
//       console.error('[Signup] Verify OTP Error:', err.response?.data || err.message);
//       setError(err.response?.data?.message || 'OTP verification failed');
//     }
// };


//     const handleResendOTP = async () => {
//       try {
//         await resendOTP(formData.email);
//         setError(null);
//         alert('OTP resent successfully'); 
//       } catch (err: any) {
//         console.error('[Signup] Resend OTP Error:', err.response?.data || err.message);
//         setError(err.response?.data?.message || 'Failed to resend OTP');
//       }
//     };

//     const handleGoogleSignup = () => {
//       window.location.href = 'http://localhost:5000/api/auth/google';
//     };

//     return (
//       <div className="signup-container">
//         <h2>Sign Up</h2>
//         <div className="role-toggle">
//           <button
//             className={`role-button ${role === UserRole.Learner ? 'active' : ''}`}
//             onClick={() => handleRoleChange(UserRole.Learner)}
//           >
//             Learner
//           </button>
//           <button
//             className={`role-button ${role === UserRole.Teacher ? 'active' : ''}`}
//             onClick={() => handleRoleChange(UserRole.Teacher)}
//           >
//             Teacher
//           </button>
//         </div>
//         {!otpSent ? (
//           <form onSubmit={handleSignup}>
//             <div className="form-group">
//               <Input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="Enter your name"
//                 label="Name"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <Input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Enter your email"
//                 label="Email"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <Input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Enter your password"
//                 label="Password"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <Input
//                 type="text"
//                 name="phone"
//                 value={formData.phone || ''}
//                 onChange={handleInputChange}
//                 placeholder="Enter your phone number"
//                 label="Phone"
//               />
//             </div>
//             {role === UserRole.Learner && (
//               <div className="form-group">
//                 <Input
//                   type="text"
//                   name="className"
//                   value={formData.className || ''}
//                   onChange={handleInputChange}
//                   placeholder="Enter your class name"
//                   label="Class Name"
//                 />
//               </div>
//             )}
//             {role === UserRole.Teacher && (
//               <>
//                 <div className="form-group">
//                   <Input
//                     type="text"
//                     name="qualifications"
//                     value={formData.qualifications?.join(',') || ''}
//                     onChange={handleInputChange}
//                     placeholder="Enter qualifications "
//                     label="Qualifications"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <Input
//                     type="text"
//                     name="experience"
//                     value={formData.experience || ''}
//                     onChange={handleInputChange}
//                     placeholder="Enter your experience"
//                     label="Experience"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <Input
//                     type="text"
//                     name="certificates"
//                     value={formData.certificates?.join(',') || ''}
//                     onChange={handleInputChange}
//                     placeholder="Enter certificates (comma-separated)"
//                     label="Certificates"
//                   />
//                 </div>
//               </>
//             )}
//             {error && <div className="error">{error}</div>}
//             <Button type="submit">Sign Up</Button>
//             <Button type="button" onClick={handleGoogleSignup}>Sign Up with Google</Button>
//           </form>
//         ) : (
//           <div>
//             <h3>Enter OTP</h3>
//             <div className="form-group">
//               <Input
//                 type="text"
//                 name="otp"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter OTP"
//                 label="OTP"
//                 required
//               />
//             </div>
//             {error && <div className="error">{error}</div>}
//             <Button type="button" onClick={handleVerifyOTP}>Verify OTP</Button>
//             <Button type="button" onClick={handleResendOTP}>Resend OTP</Button>
//           </div>
//         )}
//         <div className="login-link">
//           Already have an account? <a href="/login">Login</a>
//         </div>
//       </div>
//     );
//   };

//   export default Signup;




import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/button';
import { signup, verifyOTP, resendOTP } from '../services/authServices';
import { SignupData, SignupResponse, VerifyOTPResponse } from '../interfaces/authInterface';
import { UserRole } from '../interfaces/userInterface';
import './Signup.css';

const RESEND_OTP_COOLDOWN_SECONDS = 60; 

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(UserRole.Learner);
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    role: UserRole.Learner,
    name: '',
    phone: '',
    className: '',
    qualifications: [],
    experience: '',
    certificates: [],
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null); 
  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (resendTimer === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(RESEND_OTP_COOLDOWN_SECONDS);
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'qualifications' || name === 'certificates') {
      setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()).filter(item => item) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setFormData({ ...formData, role: newRole });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Signup] Signup Payload:', { ...formData, password: '***' });
    try {
      const response: SignupResponse = await signup(formData);
      console.log('[Signup] Signup Response:', response);
      if (response.userId) {
        setOtpSent(true);
        setError(null);
        startResendTimer();
      }
    } catch (err: any) {
      console.error('[Signup] Signup Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter OTP');
      return;
    }
    try {
      const response: VerifyOTPResponse = await verifyOTP(formData.email, otp);
      console.log('[Signup] OTP Verification Response:', response);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      navigate('/profile'); 
    } catch (err: any) {
      console.error('[Signup] Verify OTP Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };


  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      setError(`Please wait ${resendTimer} seconds before resending OTP.`);
      return;
    }
    try {
      await resendOTP(formData.email);
      setError(null);
      startResendTimer(); 
      setError('New OTP sent successfully!');
    } catch (err: any) {
      console.error('[Signup] Resend OTP Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };


  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="role-toggle">
        <button
          className={`role-button ${role === UserRole.Learner ? 'active' : ''}`}
          onClick={() => handleRoleChange(UserRole.Learner)}
        >
          Learner
        </button>
        <button
          className={`role-button ${role === UserRole.Teacher ? 'active' : ''}`}
          onClick={() => handleRoleChange(UserRole.Teacher)}
        >
          Teacher
        </button>
      </div>
      {!otpSent ? (
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              label="Name"
              required
            />
          </div>
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
          <div className="form-group">
            <Input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              label="Phone"
            />
          </div>
          {role === UserRole.Learner && (
            <div className="form-group">
              <Input
                type="text"
                name="className"
                value={formData.className || ''}
                onChange={handleInputChange}
                placeholder="Enter your class name"
                label="Class Name"
              />
            </div>
          )}
          {role === UserRole.Teacher && (
            <>
              <div className="form-group">
                <Input
                  type="text"
                  name="qualifications"
                  value={formData.qualifications?.join(',') || ''}
                  onChange={handleInputChange}
                  placeholder="Enter qualifications "
                  label="Qualifications"
                />
              </div>
              <div className="form-group">
                <Input
                  type="text"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your experience"
                  label="Experience"
                />
              </div>
              <div className="form-group">
                <Input
                  type="text"
                  name="certificates"
                  value={formData.certificates?.join(',') || ''}
                  onChange={handleInputChange}
                  placeholder="Enter certificates (comma-separated)"
                  label="Certificates"
                />
              </div>
            </>
          )}
          {error && <div className="error">{error}</div>}
          <Button type="submit">Sign Up</Button>
          <Button type="button" onClick={handleGoogleSignup}>Sign Up with Google</Button>
        </form>
      ) : (
        <div>
          <h3>Enter OTP</h3>
          <div className="form-group">
            <Input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              label="OTP"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <Button type="button" onClick={handleVerifyOTP}>Verify OTP</Button>
          {}
          <Button 
            type="button" 
            onClick={handleResendOTP} 
            disabled={resendTimer > 0} 
            // style={{ marginLeft: '10px' }}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </Button>
          {}
        </div>
      )}
      <div className="login-link">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Signup;