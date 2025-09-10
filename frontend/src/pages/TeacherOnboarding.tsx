

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfileWithFile } from '../services/authServices';
import { User, TeacherRequestStatus } from '../interfaces/userInterface';
import Input from '../components/common/Input';
import Button from '../components/common/button';
import '../styles/Onboarding.css';

const MAX_FILE_SIZE_MB = 5;

const TeacherOnboarding: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    experience: '',
    classesToTeach: '',
    syllabus: '',
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (err: any) {
        setError('Failed to load user data.');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.isApproved) {
        navigate('/dashboard', { replace: true });
      } else if (user.teacherRequestStatus === TeacherRequestStatus.Pending) {
        setSubmissionMessage('Your application has been submitted for approval. Please wait for an admin to review it.');
      } else if (user.teacherRequestStatus === TeacherRequestStatus.Rejected) {
        setError(`Your previous application was rejected. Reason: ${user.teacherRequestRejectionReason}. Please update your information and resubmit.`);
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null;
  //   if (file) {
  //     if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
  //       setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
  //       setCertificateFile(null);
  //       setCertificatePreview(null);
  //     } else {
  //       setCertificateFile(file);
  //       setCertificatePreview(URL.createObjectURL(file));
  //       setError(null);
  //     }
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  //   setSubmissionMessage(null);

  //   const { experience, classesToTeach, syllabus } = formData;
  //   if (!experience || !classesToTeach || !syllabus || !certificateFile) {
  //     setError('Please fill out all fields and upload a certificate.');
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const data = new FormData();
  //     data.append('experience', experience);
  //     data.append('classesToTeach', classesToTeach);
  //     data.append('syllabus', syllabus);
  //     data.append('certificate', certificateFile);

  //     await updateProfileWithFile(data);

  //     setUser(prevUser => prevUser ? { ...prevUser, teacherRequestStatus: TeacherRequestStatus.Pending } : null);

  //     setSubmissionMessage('Your application has been submitted for approval. Please wait for an admin to review it.');
  //     setFormData({ experience: '', classesToTeach: '', syllabus: '' });
  //     setCertificateFile(null);
  //     setCertificatePreview(null);

  //   } catch (err: any) {
  //     setError(err.message || 'Failed to submit profile.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log('[TeacherOnboarding] Certificate file selected:', {
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size,
    });
    if (file) {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
            setCertificateFile(null);
            setCertificatePreview(null);
        } else {
            setCertificateFile(file);
            setCertificatePreview(URL.createObjectURL(file));
            setError(null);
        }
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmissionMessage(null);

    const { experience, classesToTeach, syllabus } = formData;
    console.log('[TeacherOnboarding] Form submission data:', {
        experience,
        classesToTeach,
        syllabus,
        certificateFile: certificateFile?.name,
    });

    if (!experience || !classesToTeach || !syllabus || !certificateFile) {
        setError('Please fill out all fields and upload a certificate.');
        setLoading(false);
        return;
    }

    try {
        const data = new FormData();
        data.append('experience', experience);
        data.append('classesToTeach', classesToTeach);
        data.append('syllabus', syllabus);
        data.append('certificate', certificateFile);

        await updateProfileWithFile(data);

        setUser(prevUser => prevUser ? { ...prevUser, teacherRequestStatus: TeacherRequestStatus.Pending } : null);

        setSubmissionMessage('Your application has been submitted for approval. Please wait for an admin to review it.');
        setFormData({ experience: '', classesToTeach: '', syllabus: '' });
        setCertificateFile(null);
        setCertificatePreview(null);
    } catch (err: any) {
        console.error('[TeacherOnboarding] Submission error:', err.message);
        setError(err.message || 'Failed to submit profile.');
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="onboarding-container">
      <div className="logout-button-container">
        <Button onClick={handleLogout} className="logout-btn">
          Logout
        </Button>
      </div>
      <h2>Complete Your Teacher Profile</h2>
      <p>Your account is currently pending admin approval. Please provide the following details to proceed.</p>
      
      {submissionMessage && <div className="info-message">{submissionMessage}</div>}
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <Input
            type="text"
            name="experience"
            label="Experience (in years)"
            value={formData.experience}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="classesToTeach"
            label="Classes to Teach (e.g., 8th, 9th)"
            value={formData.classesToTeach}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="syllabus"
            label="Syllabus (e.g., CBSE, ICSE)"
            value={formData.syllabus}
            onChange={handleInputChange}
            required
          />
          <div className="form-group file-upload-group">
            <input
              type="file"
              id="certificate-upload"
              name="certificate"
              accept="image/*,.pdf"
              onChange={handleCertificateChange}
            />
            <label htmlFor="certificate-upload" className="file-upload-label">
              Upload Certificate (Max {MAX_FILE_SIZE_MB}MB)
            </label>
            {certificateFile && (
              <div className="file-name">
                File selected: {certificateFile.name}
              </div>
            )}
            {certificatePreview && (
              <div className="certificate-preview">
                {certificateFile?.type.startsWith('image/') ? (
                  <img src={certificatePreview} alt="Certificate Preview" />
                ) : (
                  <p>PDF Preview</p>
                )}
              </div>
            )}
          </div>
          <Button type="submit">
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </fieldset>
      </form>
    </div>
  );
};

export default TeacherOnboarding;