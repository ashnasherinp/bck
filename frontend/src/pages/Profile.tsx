// // frontend/src/pages/Profile.tsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getProfile, updateProfileWithFile } from '../services/authServices';
// import { UserRole } from '../interfaces/userInterface';
// import type { User, Profile } from '../interfaces/userInterface';
// import UserSidebar from '../components/common/UserSidebar';
// import '../styles/Profile.css';

// const MAX_FILE_SIZE_MB = 5;

// const Profile: React.FC = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<User | null>(null);
//   const [formData, setFormData] = useState<Partial<User>>({
//     name: '',
//     className: '',
//     experience: '',
//     classesToTeach: [],
//     syllabus: '',
//     profile: {
//       firstName: '',
//       lastName: '',
//       phone: '',
//       alternatePhone: '',
//     },
//   });
//   const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
//   const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
//   const [imageLoadError, setImageLoadError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         console.log('[Profile.tsx] Fetching user profile');
//         const userData = await getProfile();
//         if (userData) {
//           setUser(userData);
//           setFormData({
//             name: userData.name || '',
//             className: userData.className || '',
//             experience: userData.experience || '',
//             classesToTeach: userData.classesToTeach || [],
//             syllabus: userData.syllabus || '',
//             profile: {
//               firstName: userData.profile?.firstName || '',
//               lastName: userData.profile?.lastName || '',
//               phone: userData.profile?.phone || '',
//               alternatePhone: userData.profile?.alternatePhone || '',
//             },
//           });
//           setProfilePicturePreview(userData.profilePicture || null);
//           console.log('[Profile.tsx] User profile fetched:', {
//             email: userData.email,
//             name: userData.name,
//             role: userData.role,
//             profilePicture: userData.profilePicture,
//             profile: userData.profile,
//           });
//         } else {
//           setError('User data is empty.');
//         }
//       } catch (err: any) {
//         console.error('[Profile.tsx] Error fetching profile:', err.message);
//         setError('Failed to load profile');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     nestedField?: keyof Profile
//   ) => {
//     const { name, value } = e.target;
//     if (nestedField) {
//       setFormData({
//         ...formData,
//         profile: {
//           ...formData.profile,
//           [nestedField]: value,
//         },
//       });
//     } else if (name === 'classesToTeach') {
//       setFormData({
//         ...formData,
//         [name]: value.split(',').map(item => item.trim()).filter(item => item),
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//         setError(`Profile picture size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
//         setProfilePictureFile(null);
//         setProfilePicturePreview(null);
//       } else if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
//         setError('Only JPEG, PNG, or GIF images are allowed.');
//         setProfilePictureFile(null);
//         setProfilePicturePreview(null);
//       } else {
//         setProfilePictureFile(file);
//         setProfilePicturePreview(URL.createObjectURL(file));
//         setError(null);
//         setImageLoadError(null);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     const data = new FormData();
//     data.append('name', formData.name || '');
//     if (formData.profile?.phone) data.append('profile.phone', formData.profile.phone);
//     if (formData.profile?.firstName) data.append('profile.firstName', formData.profile.firstName);
//     if (formData.profile?.lastName) data.append('profile.lastName', formData.profile.lastName);
//     if (formData.profile?.alternatePhone) data.append('profile.alternatePhone', formData.profile.alternatePhone);
//     if (formData.className) data.append('className', formData.className);
//     if (user?.role === UserRole.Teacher) {
//       if (formData.experience) data.append('experience', formData.experience);
//       if (formData.classesToTeach && formData.classesToTeach.length > 0) {
//         data.append('classesToTeach', formData.classesToTeach.join(','));
//       }
//       if (formData.syllabus) data.append('syllabus', formData.syllabus);
//     }
//     if (profilePictureFile) {
//       data.append('profilePicture', profilePictureFile);
//     }

//     console.log('[Profile.tsx] Submitting profile update:', {
//       formDataKeys: Array.from(data.keys()),
//       formDataValues: Array.from(data.entries()).map(([key, value]) => ({
//         key,
//         value: value instanceof File ? { name: value.name, size: value.size, type: value.type } : value,
//       })),
//     });

//     try {
//       const updatedUser = await updateProfileWithFile(data);
//       console.log('[Profile.tsx] Profile updated:', {
//         email: updatedUser.email,
//         name: updatedUser.name,
//         profilePicture: updatedUser.profilePicture,
//         profile: updatedUser.profile,
//       });
//       setUser(updatedUser);
//       setFormData({
//         name: updatedUser.name || '',
//         className: updatedUser.className || '',
//         experience: updatedUser.experience || '',
//         classesToTeach: updatedUser.classesToTeach || [],
//         syllabus: updatedUser.syllabus || '',
//         profile: {
//           firstName: updatedUser.profile?.firstName || '',
//           lastName: updatedUser.profile?.lastName || '',
//           phone: updatedUser.profile?.phone || '',
//           alternatePhone: updatedUser.profile?.alternatePhone || '',
//         },
//       });
//       setProfilePicturePreview(updatedUser.profilePicture || null);
//       setProfilePictureFile(null);
//       setSuccess('Profile updated successfully');
//     } catch (err: any) {
//       console.error('[Profile.tsx] Update error:', err.message);
//       setError(err.message || 'Failed to update profile');
//       setSuccess(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (profilePicturePreview && profilePicturePreview.startsWith('blob:')) {
//         URL.revokeObjectURL(profilePicturePreview);
//       }
//     };
//   }, [profilePicturePreview]);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="dashboard-layout">
//       {user && <UserSidebar user={user} />}
//       <div className="profile-container">
//         <h1>Profile</h1>
//         {success && <div className="success">{success}</div>}
//         {error && <div className="error">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="profile-picture-section">
//             <label>Profile Picture</label>
//             <div className="profile-picture-preview-container">
//               {profilePicturePreview ? (
//                 <>
//                   <img
//                     src={profilePicturePreview}
//                     alt="Profile"
//                     className="profile-picture-preview"
//                     onError={(e) => {
//                       console.error('[Profile.tsx] Profile picture load error:', profilePicturePreview);
//                       setImageLoadError('Failed to load image');
//                       e.currentTarget.style.display = 'none';
//                     }}
//                   />
//                   {imageLoadError && (
//                     <div className="profile-picture-error">{imageLoadError}</div>
//                   )}
//                 </>
//               ) : (
//                 <div className="profile-picture-placeholder">No Image</div>
//               )}
//             </div>
//             <input
//               type="file"
//               id="profile-picture-upload"
//               name="profilePicture"
//               accept="image/jpeg,image/png,image/gif"
//               onChange={handleProfilePictureChange}
//               style={{ display: 'none' }}
//             />
//             <label htmlFor="profile-picture-upload" className="upload-button">
//               {profilePicturePreview ? 'Change Picture' : 'Upload Picture'}
//             </label>
//             {profilePictureFile && (
//               <div className="file-name">
//                 Selected: {profilePictureFile.name}
//               </div>
//             )}
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               value={user?.email || ''}
//               disabled
//               className="form-input disabled"
//             />
//           </div>
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleInputChange}
//               className="form-input"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.profile?.firstName || ''}
//               onChange={(e) => handleInputChange(e, 'firstName')}
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <label>Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.profile?.lastName || ''}
//               onChange={(e) => handleInputChange(e, 'lastName')}
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <label>Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.profile?.phone || ''}
//               onChange={(e) => handleInputChange(e, 'phone')}
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <label>Alternate Phone</label>
//             <input
//               type="text"
//               name="alternatePhone"
//               value={formData.profile?.alternatePhone || ''}
//               onChange={(e) => handleInputChange(e, 'alternatePhone')}
//               className="form-input"
//             />
//           </div>
//           {user?.role === UserRole.Learner && (
//             <div className="form-group">
//               <label>Class</label>
//               <input
//                 type="text"
//                 name="className"
//                 value={formData.className || ''}
//                 onChange={handleInputChange}
//                 className="form-input"
//               />
//             </div>
//           )}
//           {user?.role === UserRole.Teacher && (
//             <>
//               <div className="form-group">
//                 <label>Experience (in years)</label>
//                 <input
//                   type="text"
//                   name="experience"
//                   value={formData.experience || ''}
//                   onChange={handleInputChange}
//                   className="form-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Classes to Teach (comma-separated)</label>
//                 <input
//                   type="text"
//                   name="classesToTeach"
//                   value={formData.classesToTeach?.join(', ') || ''}
//                   onChange={handleInputChange}
//                   className="form-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Syllabus</label>
//                 <input
//                   type="text"
//                   name="syllabus"
//                   value={formData.syllabus || ''}
//                   onChange={handleInputChange}
//                   className="form-input"
//                 />
//               </div>
//             </>
//           )}
//           <button type="submit" className="submit-btn" disabled={loading}>
//             {loading ? 'Updating...' : 'Update Profile'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;
















// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getProfile, updateProfileWithFile } from '../services/authServices'; // Keep updateProfileWithFile
// import { User, UserRole } from '../interfaces/userInterface';
// import UserSidebar from '../components/common/UserSidebar';
// import '../styles/Profile.css'; // Ensure this CSS file exists for styling

// const MAX_FILE_SIZE_MB = 5; // Max size for profile picture

// const Profile: React.FC = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<User | null>(null);
//   const [formData, setFormData] = useState<Partial<User>>({
//     name: '',
//     phone: '',
//     className: '',
//     experience: '', // Add for teachers
//     classesToTeach: [], // Add for teachers
//     syllabus: '', // Add for teachers
//   });
//   const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
//   const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         console.log('[Profile.tsx] Fetching user profile');
//         const userData = await getProfile();
//         if (userData) {
//           setUser(userData);
//           setFormData({
//             name: userData.name || '',
//             phone: userData.phone || '',
//             className: userData.className || '',
//             // Populate teacher-specific fields if user is a teacher
//             experience: userData.experience || '',
//             classesToTeach: userData.classesToTeach || [],
//             syllabus: userData.syllabus || '',
//           });
//           // Set profile picture preview if already exists
//           if (userData.profilePicture) {
//             setProfilePicturePreview(userData.profilePicture);
//           }
//           console.log('[Profile.tsx] User profile fetched:', {
//             email: userData.email,
//             name: userData.name,
//             role: userData.role,
//             profilePicture: userData.profilePicture,
//           });
//         } else {
//             setError('User data is empty.');
//         }

//       } catch (err: any) {
//         console.error('[Profile.tsx] Error fetching profile:', err.message);
//         setError('Failed to load profile');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     // Special handling for classesToTeach if it's a string input
//     if (name === 'classesToTeach') {
//         // Assuming user types comma-separated values
//         setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()).filter(item => item) });
//     } else {
//         setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//         setError(Profile picture size exceeds the ${MAX_FILE_SIZE_MB}MB limit.);
//         setProfilePictureFile(null);
//         setProfilePicturePreview(null);
//       } else {
//         setProfilePictureFile(file);
//         setProfilePicturePreview(URL.createObjectURL(file)); // Create local URL for preview
//         setError(null);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     const data = new FormData();
//     data.append('name', formData.name || '');
//     data.append('phone', formData.phone || '');
//     if (formData.className) data.append('className', formData.className);
    
//     // Append teacher-specific fields if present
//     if (user?.role === UserRole.Teacher) {
//         if (formData.experience) data.append('experience', formData.experience);
//         if (formData.classesToTeach && formData.classesToTeach.length > 0) {
//             // Append each item of the array, or join them if backend expects a single string
//             data.append('classesToTeach', formData.classesToTeach.join(',')); 
//         }
//         if (formData.syllabus) data.append('syllabus', formData.syllabus);
//     }

//     // Append profile picture file if selected
//     if (profilePictureFile) {
//       data.append('profilePicture', profilePictureFile);
//     }

//     try {
//       console.log('[Profile.tsx] Submitting profile update with file(s)');
//       const updatedUser = await updateProfileWithFile(data); // Using the service that sends FormData
//       setUser(updatedUser.user); // Assuming backend returns { message, user }
//       setSuccess('Profile updated successfully');
//       console.log('[Profile.tsx] Profile updated:', updatedUser);
//       // Clear file input after successful upload to prevent re-upload on subsequent saves
//       setProfilePictureFile(null); 
//     } catch (err: any) {
//       console.error('[Profile.tsx] Update error:', err.message);
//       setError(err.message || 'Failed to update profile');
//       setSuccess(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }
//   // if (!user || Object.keys(user).length === 0) {
//   //   return <div className="error">{error || 'User not found or data is empty.'}</div>;
//   // }

//   return (
//     <div className="dashboard-layout">
//       {user && <UserSidebar user={user} />}
//       <div className="profile-container">
//         <h1>Profile</h1>
//         {success && <div className="success">{success}</div>}
//         {error && <div className="error">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="profile-picture-section">
//             <label>Profile Picture</label>
//             <div className="profile-picture-preview-container">
//               {profilePicturePreview ? (
//                 <img src={profilePicturePreview} alt="Profile" className="profile-picture-preview" />
//               ) : (
//                 <div className="profile-picture-placeholder">No Image</div>
//               )}
//             </div>
//             <input
//               type="file"
//               id="profile-picture-upload"
//               name="profilePicture"
//               accept="image/*" // Only allow image files for profile picture
//               onChange={handleProfilePictureChange}
//               style={{ display: 'none' }} // Hide default input
//             />
//             <label htmlFor="profile-picture-upload" className="upload-button">
//               {profilePicturePreview ? 'Change Picture' : 'Upload Picture'}
//             </label>
//             {profilePictureFile && (
//               <div className="file-name">
//                 Selected: {profilePictureFile.name}
//               </div>
//             )}
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               value={user?.email || ''}
//               disabled
//               className="form-input disabled"
//             />
//           </div>
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleInputChange}
//               className="form-input"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone || ''}
//               onChange={handleInputChange}
//               className="form-input"
//             />
//           </div>
//           {user?.role === UserRole.Learner && (
//             <div className="form-group">
//               <label>Class</label>
//               <input
//                 type="text"
//                 name="className"
//                 value={formData.className || ''}
//                 onChange={handleInputChange}
//                 className="form-input"
//               />
//             </div>
//           )}
//           {user?.role === UserRole.Teacher && (
//             <>
//               <div className="form-group">
//                 <label>Experience (in years)</label>
//                 <input
//                   type="text"
//                   name="experience"
//                   value={formData.experience || ''}
//                   onChange={handleInputChange}
//                   className="form-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Classes to Teach (comma-separated)</label>
//                 <input
//                   type="text"
//                   name="classesToTeach"
//                   value={formData.classesToTeach?.join(', ') || ''} // Display as comma-separated string
//                   onChange={handleInputChange}
//                   className="form-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Syllabus</label>
//                 <input
//                   type="text"
//                   name="syllabus"
//                   value={formData.syllabus || ''}
//                   onChange={handleInputChange}
//                   className="form-input"
//                 />
//               </div>
//               {/* Note: Certificate upload is typically part of TeacherOnboarding,
//                   but if you want it here too, you'd add similar file input logic.
//                   For now, assuming it's handled during onboarding. */}
//             </>
//           )}
//           <button type="submit" className="submit-btn">
//             {loading ? 'Updating...' : 'Update Profile'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfileWithFile } from '../services/authServices';
import { User, UserRole } from '../interfaces/userInterface';
import UserSidebar from '../components/common/UserSidebar';
import '../styles/Profile.css';

const MAX_FILE_SIZE_MB = 5; // Max size for profile picture

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    className: '',
    experience: '',
    classesToTeach: [],
    syllabus: '',
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      alternatePhone: '',
    },
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<string | null>(null); // New state for image load error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('[Profile.tsx] Fetching user profile');
        const userData = await getProfile();
        if (userData) {
          setUser(userData);
    setFormData({
  name: userData.name || '',
  className: userData.className || '',
  experience: userData.experience || '',
  classesToTeach: userData.classesToTeach || [],
  syllabus: userData.syllabus || '',
  profile: {
    firstName: userData.profile?.firstName || '',
    lastName: userData.profile?.lastName || '',
    phone: userData.profile?.phone || '',
    alternatePhone: userData.profile?.alternatePhone || '',
  },
});

          setProfilePicturePreview(userData.profilePicture || null);
          console.log('[Profile.tsx] User profile fetched:', {
            email: userData.email,
            name: userData.name,
            role: userData.role,
            profilePicture: userData.profilePicture,
          });
        } else {
          setError('User data is empty.');
        }
      } catch (err: any) {
        console.error('[Profile.tsx] Error fetching profile:', err.message);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === 'classesToTeach') {
    setFormData({
      ...formData,
      classesToTeach: value.split(',').map(item => item.trim()).filter(item => item),
    });
  } else if (['firstName', 'lastName', 'phone', 'alternatePhone'].includes(name)) {
    // Update inside profile
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        [name]: value,
      },
    });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`Profile picture size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
      } else if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('Only JPEG, PNG, or GIF images are allowed.');
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
      } else {
        setProfilePictureFile(file);
        setProfilePicturePreview(URL.createObjectURL(file));
        setError(null);
        setImageLoadError(null); // Clear any previous image load error
      }
    }
  };


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append('name', formData.name || '');
   if (formData.profile?.phone) {
  data.append('phone', formData.profile.phone);
}
if (formData.profile?.alternatePhone) {
  data.append('alternatePhone', formData.profile.alternatePhone);
}
    if (formData.className) data.append('className', formData.className);
    if (user?.role === UserRole.Teacher) {
      if (formData.experience) data.append('experience', formData.experience);
      if (formData.classesToTeach && formData.classesToTeach.length > 0) {
        data.append('classesToTeach', formData.classesToTeach.join(','));
      }
      if (formData.syllabus) data.append('syllabus', formData.syllabus);
    }
    if (profilePictureFile) {
      data.append('profilePicture', profilePictureFile);
    }

    console.log('[Profile.tsx] Submitting profile update:', {
      formDataKeys: Array.from(data.keys()),
      formDataValues: Array.from(data.entries()).map(([key, value]) => ({
        key,
        value: value instanceof File ? { name: value.name, size: value.size, type: value.type } : value,
      })),
    });

    try {
      const updatedUser = await updateProfileWithFile(data);
      console.log('[Profile.tsx] Profile updated:', {
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      });
      setUser(updatedUser);
      setProfilePicturePreview(updatedUser.profilePicture || null);
      setProfilePictureFile(null);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      console.error('[Profile.tsx] Update error:', err.message);
      setError(err.message || 'Failed to update profile');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
};


  useEffect(() => {
    return () => {
      if (profilePicturePreview && profilePicturePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      {user && <UserSidebar user={user} />}
      <div className="profile-container">
        <h1>Profile</h1>
        {success && <div className="success">{success}</div>}
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="profile-picture-section">
            <label>Profile Picture</label>
            <div className="profile-picture-preview-container">
              {profilePicturePreview ? (
                <>
                  <img
                    src={profilePicturePreview}
                    alt="Profile"
                    className="profile-picture-preview"
                    onError={(e) => {
                      console.error('[Profile.tsx] Profile picture load error:', profilePicturePreview);
                      setImageLoadError('Failed to load image');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {imageLoadError && (
                    <div className="profile-picture-error">{imageLoadError}</div>
                  )}
                </>
              ) : (
                <div className="profile-picture-placeholder">No Image</div>
              )}
            </div>
            <input
              type="file"
              id="profile-picture-upload"
              name="profilePicture"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="profile-picture-upload" className="upload-button">
              {profilePicturePreview ? 'Change Picture' : 'Upload Picture'}
            </label>
            {profilePictureFile && (
              <div className="file-name">
                Selected: {profilePictureFile.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="form-input disabled"
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
          <input
  type="text"
  name="phone"
  value={formData.profile?.phone || ''}
  onChange={handleInputChange}
  className="form-input"
/>
          </div>
          {user?.role === UserRole.Learner && (
            <div className="form-group">
              <label>Class</label>
              <input
                type="text"
                name="className"
                value={formData.className || ''}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          )}
          {user?.role === UserRole.Teacher && (
            <>
              <div className="form-group">
                <label>Experience (in years)</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Classes to Teach (comma-separated)</label>
                <input
                  type="text"
                  name="classesToTeach"
                  value={formData.classesToTeach?.join(', ') || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Syllabus</label>
                <input
                  type="text"
                  name="syllabus"
                  value={formData.syllabus || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </>
          )}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
  
