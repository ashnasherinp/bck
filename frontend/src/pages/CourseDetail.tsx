

// // frontend/src/pages/CourseDetail.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCourseById, getLessonsByCourse } from '../services/CourseServices';
// import { getProfile } from '../services/authServices';
// // CORRECTED: Changed `initiatePayment` to `initiateEnrollment`
// import { initiateEnrollment, handlePaymentSuccess, getUserEnrollments, markLessonComplete, unenrollUserFromCourse } from '../services/enrollmentServices';
// import { getMaterialsByLesson } from '../services/materialServices';
// import { getAssessmentsByCourse } from '../services/assessmentServices';
// import { Course } from '../interfaces/courseInterface';
// import { User, UserRole } from '../interfaces/userInterface';
// import { IEnrollmentPopulated, AdminApprovalStatus } from '../interfaces/enrollmentInterface';
// import { IAssessmentBase } from '../interfaces/assessmentInterface';
// import Button from '../components/common/button';
// import '../styles/Dashboard.css';
// import '../styles/CourseDetail.css';

// const CourseDetail: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const [course, setCourse] = useState<Course | null>(null);
//     const [user, setUser] = useState<User | null>(null);
//     const [enrollment, setEnrollment] = useState<IEnrollmentPopulated | null>(null);
//     const [lessons, setLessons] = useState<any[]>([]);
//     const [materials, setMaterials] = useState<{ [lessonId: string]: any[] }>({});
//     const [assessments, setAssessments] = useState<IAssessmentBase[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [sdkLoading, setSdkLoading] = useState(true);
//     const [actionLoading, setActionLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const loadRazorpayScript = () => {
//             try {
//                 const script = document.createElement('script');
//                 script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//                 script.async = true;
//                 script.onload = () => setSdkLoading(false);
//                 script.onerror = () => {
//                     setError('Failed to load payment gateway. Please try again.');
//                     setSdkLoading(false);
//                 };
//                 document.body.appendChild(script);
//                 return () => document.body.removeChild(script);
//             } catch {
//                 setError('Failed to load payment gateway script.');
//                 setSdkLoading(false);
//             }
//         };
//         loadRazorpayScript();
//     }, []);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!id) {
//                 setError('Course ID not provided.');
//                 setLoading(false);
//                 return;
//             }
//             try {
//                 setLoading(true);
//                 const [courseData, userData, userEnrollments, courseLessons, courseAssessments] = await Promise.all([
//                     getCourseById(id),
//                     getProfile().catch(() => null),
//                     getUserEnrollments().catch(() => []),
//                     getLessonsByCourse(id),
//                     getAssessmentsByCourse(id),
//                 ]);

//                 setCourse(courseData);
//                 setUser(userData);
//                 setLessons(courseLessons);
//                 setAssessments(courseAssessments);

//                 const enrollment = userEnrollments.find((e) => e.courseId._id.toString() === id);
//                 setEnrollment(enrollment || null);

//                 const materialsData: { [lessonId: string]: any[] } = {};
//                 for (const lesson of courseLessons) {
//                     materialsData[lesson._id] = await getMaterialsByLesson(lesson._id);
//                 }
//                 setMaterials(materialsData);
//             } catch (err: any) {
//                 console.error('Fetch error:', err.response?.data || err.message);
//                 setError(err.message || 'Failed to load course details or user data.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [id, navigate]);

//     const handleEnroll = async () => {
//         if (!user || !course || !id || sdkLoading) {
//             setError(sdkLoading ? 'Payment gateway is still loading.' : 'Please log in to enroll.');
//             return;
//         }
//         setActionLoading(true);
//         setError(null);
//         try {
//             const effectivePrice = course.effectivePrice ?? course.price ?? 0;
//             if (effectivePrice < 0) {
//                 throw new Error('Invalid course price.');
//             }

//             // CORRECTED: Call `initiateEnrollment` instead of `initiatePayment`
//             const paymentResponse = await initiateEnrollment(id);
//             if (paymentResponse.isFreeCourse) {
//                 setEnrollment(await getUserEnrollments().then((enrollments) => enrollments.find((e) => e.courseId._id.toString() === id) || null));
//                 setError('Enrolled in free course successfully. Awaiting admin approval.');
//                 setActionLoading(false);
//                 return;
//             }

//             const options = {
//                 key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
//                 amount: paymentResponse.amount,
//                 currency: paymentResponse.currency,
//                 name: 'Course Platform',
//                 description: `Payment for ${course.title}`,
//                 order_id: paymentResponse.orderId,
//                 handler: async (response: any) => {
//                     try {
//                         const successResponse = await handlePaymentSuccess({
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature,
//                             courseId: id,
//                         });
//                         setEnrollment(
//                             await getUserEnrollments().then((enrollments) => enrollments.find((e) => e.courseId._id.toString() === id) || null)
//                         );
//                         setError('Payment successful! Awaiting admin approval.');
//                     } catch (err: any) {
//                         setError(err.message || 'Payment verification failed.');
//                     }
//                 },
//                 prefill: {
//                     name: user.profile?.firstName || user.name || '',
//                     email: user.email || '',
//                     contact: user.profile?.phone || '',
//                 },
//                 theme: {
//                     color: '#3399cc',
//                 },
//             };

//             const rzp = new (window as any).Razorpay(options);
//             rzp.on('payment.failed', () => {
//                 setError('Payment failed. Please try again.');
//             });
//             rzp.open();
//         } catch (err: any) {
//             setError(err.message || 'Failed to initiate payment.');
//         } finally {
//             setActionLoading(false);
//         }
//     };

//     const handleUnenroll = async () => {
//         if (!enrollment || !course) return;
//         if (window.confirm('Are you sure you want to unenroll from this course?')) {
//             setActionLoading(true);
//             setError(null);
//             try {
//                 await unenrollUserFromCourse(course._id);
//                 setEnrollment(null);
//                 setError('Successfully unenrolled from course.');
//             } catch (err: any) {
//                 setError(err.message || 'Failed to unenroll from course.');
//             } finally {
//                 setActionLoading(false);
//             }
//         }
//     };

//     const handleMarkLessonComplete = async (lessonId: string) => {
//         if (!enrollment || enrollment.adminApprovalStatus !== AdminApprovalStatus.Approved) {
//             setError('Enrollment not approved yet.');
//             return;
//         }
//         setActionLoading(true);
//         setError(null);
//         try {
//             await markLessonComplete(enrollment._id, lessonId);
//             const updatedEnrollment = await getUserEnrollments().then((enrollments) => enrollments.find((e) => e._id.toString() === enrollment._id.toString()) || null);
//             setEnrollment(updatedEnrollment);
//         } catch (err: any) {
//             setError(err.message || 'Failed to mark lesson as complete.');
//         } finally {
//             setActionLoading(false);
//         }
//     };

//     const handleTakeAssessment = (assessmentId: string) => {
//         if (enrollment?.adminApprovalStatus !== AdminApprovalStatus.Approved) {
//             setError('Enrollment not approved yet.');
//             return;
//         }
//         navigate(`/assessments/${assessmentId}/take`);
//     };

//     if (loading) return <div className="loading-message">Loading Course Details...</div>;
//     if (error && !course) return <div className="error-message">{error}</div>;
//     if (!course) return <div className="not-found-message">Course not found.</div>;

//     const isEnrolledAndApproved = enrollment && enrollment.adminApprovalStatus === AdminApprovalStatus.Approved;

//     return (
//         <div className="course-detail-container">
//             {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="course-detail-image" />}
//             <h2>{course.title}</h2>
//             <p className="course-description">{course.description}</p>
//             {course.categoryId && <p className="course-meta">Category: {(course.categoryId as any).name ?? 'Unknown'}</p>}
//             <p className="course-meta">Level: {course.level}</p>
//             <p className="course-meta">Price: ₹{(course.effectivePrice ?? course.price ?? 0).toFixed(2)}</p>
//             <p className="course-meta">Created By: {(course.creatorId as any)?.name || 'Unknown Teacher'}</p>
//             <p className="course-meta">Created On: {new Date(course.createdAt).toLocaleDateString()}</p>

//             {enrollment && enrollment.adminApprovalStatus === AdminApprovalStatus.Pending && (
//                 <p className="info-message">Your enrollment is pending admin approval.</p>
//             )}

//             {isEnrolledAndApproved && (
//                 <>
//                     <h3>Lessons</h3>
//                     {lessons.length === 0 ? (
//                         <p>No lessons available.</p>
//                     ) : (
//                         lessons.map((lesson) => {
//                             const lessonProgress = enrollment?.progress.find((p) => p.lessonId.toString() === lesson._id);
//                             return (
//                                 <div key={lesson._id} className="lesson-item">
//                                     <h4>{lesson.title}</h4>
//                                     <p>{lesson.description}</p>
//                                     <p>Status: {lessonProgress?.completed ? 'Completed' : lessonProgress?.isLocked ? 'Locked' : 'Available'}</p>
//                                     {!lessonProgress?.isLocked && !lessonProgress?.completed && (
//                                         <Button
//                                             onClick={() => handleMarkLessonComplete(lesson._id)}
//                                             disabled={actionLoading}
//                                         >
//                                             Mark as Complete
//                                         </Button>
//                                     )}
//                                     <h5>Materials</h5>
//                                     {materials[lesson._id]?.length ? (
//                                         materials[lesson._id].map((material) => (
//                                             <div key={material._id}>
//                                                 <a href={material.materialUrl} target="_blank" rel="noopener noreferrer">
//                                                     {material.title}
//                                                 </a>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p>No materials available.</p>
//                                     )}
//                                 </div>
//                             );
//                         })
//                     )}

//                     <h3>Assessments</h3>
//                     {assessments.length === 0 ? (
//                         <p>No assessments available.</p>
//                     ) : (
//                         assessments.map((assessment) => (
//                             <div key={assessment._id} className="assessment-item">
//                                 <h4>{assessment.title}</h4>
//                                 <p>Type: {assessment.type}</p>
//                                 <p>Max Score: {assessment.maxScore}</p>
//                                 <p>Duration: {assessment.durationMinutes} minutes</p>
//                                 {assessment.isPublished && (
//                                     <Button
//                                         onClick={() => handleTakeAssessment(assessment._id)}
//                                         disabled={actionLoading || !isEnrolledAndApproved}
//                                     >
//                                         Take Assessment
//                                     </Button>
//                                 )}
//                             </div>
//                         ))
//                     )}
//                 </>
//             )}

//             {error && <div className="error-message">{error}</div>}

//             <div className="course-actions">
//                 {user?.role === UserRole.Learner && (
//                     enrollment ? (
//                         <>
//                             <Button onClick={() => navigate('/enrolled-courses')}>
//                                 View My Enrollments
//                             </Button>
//                             {isEnrolledAndApproved && (
//                                 <>
//                                     <Button
//                                         onClick={() => navigate(`/enrolled-courses/${enrollment._id}`)}
//                                         disabled={actionLoading}
//                                         className="secondary-button"
//                                     >
//                                         View Progress
//                                     </Button>
//                                     <Button
//                                         onClick={handleUnenroll}
//                                         disabled={actionLoading}
//                                         className="secondary-button"
//                                     >
//                                         {actionLoading ? 'Unenrolling...' : 'Unenroll'}
//                                     </Button>
//                                 </>
//                             )}
//                         </>
//                     ) : (
//                         <Button onClick={handleEnroll} disabled={actionLoading || sdkLoading || !user}>
//                             {actionLoading ? 'Processing...' : (course.effectivePrice ?? course.price ?? 0) > 0 ? 'Buy Now' : 'Enroll Now'}
//                         </Button>
//                     )
//                 )}
//                 {user?.role === UserRole.Teacher && user?._id === (course.creatorId as any)?._id && (
//                     <>
//                         <Button onClick={() => navigate(`/teacher/courses/edit/${course._id}`)}>Edit Course</Button>
//                         <Button onClick={() => navigate(`/teacher/lessons/${course._id}`)}>Manage Lessons</Button>
//                         <Button onClick={() => navigate(`/teacher/assessments/${course._id}`)}>Manage Assessments</Button>
//                     </>
//                 )}
//                 <Button onClick={() => navigate('/courses')} className="back-button">
//                     Back to All Courses
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default CourseDetail;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCourseById, getLessonsByCourse } from '../services/CourseServices';
// import { getProfile } from '../services/authServices';
// import { initiateEnrollment, handlePaymentSuccess, getUserEnrollments, unenrollUserFromCourse } from '../services/enrollmentServices';
// import { getMaterialsByLesson } from '../services/materialServices';
// import { getAssessmentsByCourse } from '../services/assessmentServices';
// import { Course } from '../interfaces/courseInterface';
// import { User, UserRole } from '../interfaces/userInterface';
// import { IEnrollmentPopulated, AdminApprovalStatus, EnrollmentResponse, PaymentSuccessResponse } from '../interfaces/enrollmentInterface';
// import { IAssessmentBase } from '../interfaces/assessmentInterface';
// import Button from '../components/common/button';
// import { Button as MuiButton } from '@mui/material';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import '../styles/Dashboard.css';
// import '../styles/CourseDetail.css';

// interface ILessonPopulated {
//     _id: string;
//     title: string;
//     description: string;
//     materialUrl?: string;
// }

// const CourseDetail: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const [course, setCourse] = useState<Course | null>(null);
//     const [user, setUser] = useState<User | null>(null);
//     const [enrollment, setEnrollment] = useState<IEnrollmentPopulated | null>(null);
//     const [lessons, setLessons] = useState<ILessonPopulated[]>([]);
//     const [materials, setMaterials] = useState<{ [lessonId: string]: any[] }>({});
//     const [assessments, setAssessments] = useState<IAssessmentBase[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [sdkLoading, setSdkLoading] = useState(true);
//     const [actionLoading, setActionLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [invoice, setInvoice] = useState<PaymentSuccessResponse['invoice'] | null>(null);
//     const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

//     const modalStyle = {
//         position: 'absolute' as 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: 400,
//         bgcolor: 'background.paper',
//         border: '2px solid #000',
//         boxShadow: 24,
//         p: 4,
//     };

//     useEffect(() => {
//         const loadRazorpayScript = () => {
//             try {
//                 const script = document.createElement('script');
//                 script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//                 script.async = true;
//                 script.onload = () => setSdkLoading(false);
//                 script.onerror = () => {
//                     setError('Failed to load payment gateway. Please try again.');
//                     setSdkLoading(false);
//                 };
//                 document.body.appendChild(script);
//                 return () => document.body.removeChild(script);
//             } catch {
//                 setError('Failed to load payment gateway script.');
//                 setSdkLoading(false);
//             }
//         };
//         loadRazorpayScript();
//     }, []);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!id) {
//                 setError('Course ID not provided.');
//                 setLoading(false);
//                 return;
//             }
//             try {
//                 setLoading(true);
//                 const [courseData, userData, userEnrollments, courseLessons, courseAssessments] = await Promise.all([
//                     getCourseById(id),
//                     getProfile().catch(() => null),
//                     getUserEnrollments().catch(() => []),
//                     getLessonsByCourse(id),
//                     getAssessmentsByCourse(id),
//                 ]);

//                 setCourse(courseData);
//                 setUser(userData);
//                 setLessons(courseLessons);
//                 setAssessments(courseAssessments);

//                 const enrollment = userEnrollments.find((e: IEnrollmentPopulated) => e.courseId._id.toString() === id);
//                 setEnrollment(enrollment || null);

//                 const materialsData: { [lessonId: string]: any[] } = {};
//                 for (const lesson of courseLessons) {
//                     materialsData[lesson._id] = await getMaterialsByLesson(lesson._id);
//                 }
//                 setMaterials(materialsData);
//             } catch (err: unknown) {
//                 const error = err as Error;
//                 console.error('Fetch error:', error.message);
//                 setError(error.message || 'Failed to load course details or user data.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [id, navigate]);

//     const handleEnroll = async () => {
//         if (!user || !course || !id || sdkLoading) {
//             setError(sdkLoading ? 'Payment gateway is still loading.' : 'Please log in to enroll.');
//             return;
//         }
//         setActionLoading(true);
//         setError(null);
//         try {
//             const effectivePrice = course.effectivePrice ?? course.price ?? 0;
//             if (effectivePrice < 0) {
//                 throw new Error('Invalid course price.');
//             }

//             const paymentResponse = await initiateEnrollment(id);
//             if (paymentResponse.isFreeCourse) {
//                 setEnrollment(await getUserEnrollments().then((enrollments: IEnrollmentPopulated[]) => enrollments.find((e) => e.courseId._id.toString() === id) || null));
//                 setError('Enrolled in free course successfully. Awaiting admin approval.');
//                 setActionLoading(false);
//                 return;
//             }

//             if (!paymentResponse.amount || !paymentResponse.currency || !paymentResponse.orderId) {
//                 throw new Error('Invalid order data: amount, currency, or orderId missing.');
//             }

//             const options = {
//                 key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
//                 amount: paymentResponse.amount * 100,
//                 currency: paymentResponse.currency,
//                 name: 'Course Platform',
//                 description: `Payment for ${course.title}`,
//                 order_id: paymentResponse.orderId,
//                 handler: async (response: any) => {
//                     try {
//                         const successResponse = await handlePaymentSuccess({
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature,
//                             courseId: id,
//                             userId: user._id,
//                         });
//                         setEnrollment(
//                             await getUserEnrollments().then((enrollments: IEnrollmentPopulated[]) => enrollments.find((e) => e.courseId._id.toString() === id) || null)
//                         );
//                         setInvoice(successResponse.invoice);
//                         setOpenInvoiceModal(true);
//                         setError('Payment successful! Awaiting admin approval.');
//                     } catch (err: unknown) {
//                         const error = err as Error;
//                         setError(error.message || 'Payment verification failed.');
//                     }
//                 },
//                 prefill: {
//                     name: user.profile?.firstName || user.name || '',
//                     email: user.email || '',
//                     contact: user.profile?.phone || '',
//                 },
//                 theme: {
//                     color: '#3399cc',
//                 },
//             };

//             const rzp = new (window as any).Razorpay(options);
//             rzp.on('payment.failed', () => {
//                 setError('Payment failed. Please try again.');
//             });
//             rzp.open();
//         } catch (err: unknown) {
//             const error = err as Error;
//             setError(error.message || 'Failed to initiate payment.');
//         } finally {
//             setActionLoading(false);
//         }
//     };

//     const handleUnenroll = async () => {
//         if (!enrollment || !course) return;
//         if (window.confirm('Are you sure you want to unenroll from this course?')) {
//             setActionLoading(true);
//             setError(null);
//             try {
//                 await unenrollUserFromCourse(course._id);
//                 setEnrollment(null);
//                 setError('Successfully unenrolled from course.');
//             } catch (err: unknown) {
//                 const error = err as Error;
//                 setError(error.message || 'Failed to unenroll from course.');
//             } finally {
//                 setActionLoading(false);
//             }
//         }
//     };

//     const handleTakeAssessment = (assessmentId: string) => {
//         if (!enrollment || enrollment.adminApprovalStatus !== AdminApprovalStatus.Approved) {
//             setError('Enrollment not approved yet.');
//             return;
//         }
//         navigate(`/assessments/${assessmentId}/take`);
//     };

//     const handleCloseInvoiceModal = () => {
//         setOpenInvoiceModal(false);
//     };

//     if (loading) return <div className="loading-message">Loading Course Details...</div>;
//     if (error && !course) return <div className="error-message">{error}</div>;
//     if (!course) return <div className="not-found-message">Course not found.</div>;

//     const isEnrolledAndApproved = enrollment && enrollment.adminApprovalStatus === AdminApprovalStatus.Approved;

//     return (
//         <div className="course-detail-container">
//             {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="course-detail-image" />}
//             <h2>{course.title}</h2>
//             <p className="course-description">{course.description}</p>
//             <p className="course-meta">Category: {course.categoryId.name}</p>
//             <p className="course-meta">Level: {course.level}</p>
//             <p className="course-meta">Price: ₹{(course.effectivePrice ?? course.price ?? 0).toFixed(2)}</p>
//             <p className="course-meta">Created By: {course.creatorId.name}</p>
//             <p className="course-meta">Created On: {new Date(course.createdAt).toLocaleDateString()}</p>

//             {enrollment && enrollment.adminApprovalStatus === AdminApprovalStatus.Pending && (
//                 <Typography color="warning.main" className="pending-message">
//                     Your enrollment is pending admin approval. You can only view lesson and assessment titles until approved.
//                 </Typography>
//             )}

//             <h3>Lessons</h3>
//             {lessons.length === 0 ? (
//                 <p>No lessons available.</p>
//             ) : (
//                 lessons.map((lesson) => (
//                     <div key={lesson._id} className="lesson-item">
//                         <h4>{lesson.title}</h4>
//                         {isEnrolledAndApproved ? (
//                             <>
//                                 <p>{lesson.description}</p>
//                                 <h5>Materials</h5>
//                                 {materials[lesson._id]?.length ? (
//                                     materials[lesson._id].map((material) => (
//                                         <div key={material._id}>
//                                             <a href={material.materialUrl} target="_blank" rel="noopener noreferrer">
//                                                 {material.title}
//                                             </a>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>No materials available.</p>
//                                 )}
//                             </>
//                         ) : (
//                             <p>Content locked until enrollment is approved.</p>
//                         )}
//                     </div>
//                 ))
//             )}

//             <h3>Assessments</h3>
//             {assessments.length === 0 ? (
//                 <p>No assessments available.</p>
//             ) : (
//                 assessments.map((assessment) => (
//                     <div key={assessment._id} className="assessment-item">
//                         <h4>{assessment.title}</h4>
//                         {isEnrolledAndApproved ? (
//                             <>
//                                 <p>Type: {assessment.type}</p>
//                                 <p>Max Score: {assessment.maxScore}</p>
//                                 <p>Duration: {assessment.durationMinutes} minutes</p>
//                                 {assessment.isPublished && (
//                                     <Button
//                                         onClick={() => handleTakeAssessment(assessment._id)}
//                                         disabled={actionLoading}
//                                     >
//                                         Take Assessment
//                                     </Button>
//                                 )}
//                             </>
//                         ) : (
//                             <p>Content locked until enrollment is approved.</p>
//                         )}
//                     </div>
//                 ))
//             )}

//             {error && <div className="error-message">{error}</div>}

//             <div className="course-actions">
//                 {user?.role === UserRole.Learner && (
//                     enrollment ? (
//                         <>
//                             <Button onClick={() => navigate('/enrolled-courses')}>
//                                 View My Enrollments
//                             </Button>
//                             {isEnrolledAndApproved && (
//                                 <Button
//                                     onClick={handleUnenroll}
//                                     disabled={actionLoading}
//                                     className="secondary-button"
//                                 >
//                                     {actionLoading ? 'Unenrolling...' : 'Unenroll'}
//                                 </Button>
//                             )}
//                         </>
//                     ) : (
//                         <Button onClick={handleEnroll} disabled={actionLoading || sdkLoading || !user}>
//                             {actionLoading ? 'Processing...' : (course.effectivePrice ?? course.price ?? 0) > 0 ? 'Buy Now' : 'Enroll Now'}
//                         </Button>
//                     )
//                 )}
//                 {user?.role === UserRole.Teacher && user?._id === course.creatorId._id && (
//                     <>
//                         <Button onClick={() => navigate(`/teacher/courses/edit/${course._id}`)}>Edit Course</Button>
//                         <Button onClick={() => navigate(`/teacher/lessons/${course._id}`)}>Manage Lessons</Button>
//                         <Button onClick={() => navigate(`/teacher/assessments/${course._id}`)}>Manage Assessments</Button>
//                     </>
//                 )}
//                 <Button onClick={() => navigate('/courses')} className="back-button">
//                     Back to All Courses
//                 </Button>
//             </div>

//             {invoice && (
//                 <Modal
//                     open={openInvoiceModal}
//                     onClose={handleCloseInvoiceModal}
//                     aria-labelledby="invoice-modal"
//                     aria-describedby="invoice-description"
//                 >
//                     <Box sx={modalStyle}>
//                         <Typography id="invoice-modal" variant="h6" component="h2">
//                             Invoice Details
//                         </Typography>
//                         <Typography sx={{ mt: 2 }}>
//                             Invoice ID: {invoice.invoiceId}
//                         </Typography>
//                         <Typography>Order ID: {invoice.orderId}</Typography>
//                         <Typography>Payment ID: {invoice.paymentId}</Typography>
//                         <Typography>Amount: {invoice.amount} {invoice.currency}</Typography>
//                         <Typography>Tax: {invoice.details.tax} {invoice.currency}</Typography>
//                         <Typography>Total Amount: {invoice.details.totalAmount} {invoice.currency}</Typography>
//                         <Typography>Description: {invoice.details.description}</Typography>
//                         <Typography>Generated At: {new Date(invoice.generatedAt).toLocaleString()}</Typography>
//                         <MuiButton onClick={handleCloseInvoiceModal} sx={{ mt: 2 }}>
//                             Close
//                         </MuiButton>
//                     </Box>
//                 </Modal>
//             )}
//         </div>
//     );
// };

// export default CourseDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, getLessonsByCourse } from '../services/CourseServices';
import { getProfile } from '../services/authServices';
import { initiateEnrollment, handlePaymentSuccess, getUserEnrollments, unenrollUserFromCourse } from '../services/enrollmentServices';
import { getMaterialsByLesson } from '../services/materialServices';
import { getAssessmentsByCourse } from '../services/assessmentServices';
import { Course } from '../interfaces/courseInterface';
import { User, UserRole } from '../interfaces/userInterface';
import { IEnrollmentPopulated, AdminApprovalStatus, EnrollmentResponse, PaymentSuccessResponse } from '../interfaces/enrollmentInterface';
import { IAssessmentBase } from '../interfaces/assessmentInterface';
import Button from '../components/common/button';
import { Button as MuiButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../styles/Dashboard.css';
import '../styles/CourseDetail.css';

interface ILessonPopulated {
    _id: string;
    title: string;
    description: string;
    materialUrl?: string;
}

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [enrollment, setEnrollment] = useState<IEnrollmentPopulated | null>(null);
    const [lessons, setLessons] = useState<ILessonPopulated[]>([]);
    const [materials, setMaterials] = useState<{ [lessonId: string]: any[] }>({});
    const [assessments, setAssessments] = useState<IAssessmentBase[]>([]);
    const [loading, setLoading] = useState(true);
    const [sdkLoading, setSdkLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [invoice, setInvoice] = useState<PaymentSuccessResponse['invoice'] | null>(null);
    const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        const loadRazorpayScript = () => {
            try {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => setSdkLoading(false);
                script.onerror = () => {
                    setError('Failed to load payment gateway. Please try again.');
                    setSdkLoading(false);
                };
                document.body.appendChild(script);
                return () => document.body.removeChild(script);
            } catch {
                setError('Failed to load payment gateway script.');
                setSdkLoading(false);
            }
        };
        loadRazorpayScript();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Course ID not provided.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const [courseData, userData, userEnrollments, courseLessons, courseAssessments] = await Promise.all([
                    getCourseById(id),
                    getProfile().catch(() => null),
                    getUserEnrollments().catch(() => []),
                    getLessonsByCourse(id),
                    getAssessmentsByCourse(id),
                ]);

                setCourse(courseData);
                setUser(userData);
                setLessons(courseLessons);
                setAssessments(courseAssessments);

                const enrollment = userEnrollments.find((e: IEnrollmentPopulated) => e.courseId._id.toString() === id);
                setEnrollment(enrollment || null);

                const materialsData: { [lessonId: string]: any[] } = {};
                for (const lesson of courseLessons) {
                    materialsData[lesson._id] = await getMaterialsByLesson(lesson._id);
                }
                setMaterials(materialsData);
            } catch (err: unknown) {
                const error = err as Error;
                console.error('Fetch error:', error.message);
                setError(error.message || 'Failed to load course details or user data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleEnroll = async () => {
        if (!user || !course || !id || sdkLoading) {
            setError(sdkLoading ? 'Payment gateway is still loading.' : 'Please log in to enroll.');
            return;
        }
        setActionLoading(true);
        setError(null);
        try {
            const effectivePrice = course.effectivePrice ?? course.price ?? 0;
            if (effectivePrice < 0) {
                throw new Error('Invalid course price.');
            }

            const paymentResponse = await initiateEnrollment(id);
            if (paymentResponse.isFreeCourse) {
                setEnrollment(await getUserEnrollments().then((enrollments: IEnrollmentPopulated[]) => enrollments.find((e) => e.courseId._id.toString() === id) || null));
                setError('Enrolled in free course successfully. Awaiting admin approval.');
                setActionLoading(false);
                return;
            }

            if (!paymentResponse.amount || !paymentResponse.currency || !paymentResponse.orderId) {
                throw new Error('Invalid order data: amount, currency, or orderId missing.');
            }

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
                amount: paymentResponse.amount * 100,
                currency: paymentResponse.currency,
                name: 'Course Platform',
                description: `Payment for ${course.title}`,
                order_id: paymentResponse.orderId,
                handler: async (response: any) => {
                    try {
                        const successResponse = await handlePaymentSuccess({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: id,
                            userId: user._id,
                        });
                        setEnrollment(
                            await getUserEnrollments().then((enrollments: IEnrollmentPopulated[]) => enrollments.find((e) => e.courseId._id.toString() === id) || null)
                        );
                        setInvoice(successResponse.invoice);
                        setOpenInvoiceModal(true);
                        setError('Payment successful! Awaiting admin approval.');
                    } catch (err: unknown) {
                        const error = err as Error;
                        setError(error.message || 'Payment verification failed.');
                    }
                },
                prefill: {
                    name: user.profile?.firstName || user.name || '',
                    email: user.email || '',
                    contact: user.profile?.phone || '',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', () => {
                setError('Payment failed. Please try again.');
            });
            rzp.open();
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to initiate payment.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnenroll = async () => {
        if (!enrollment || !course) return;
        if (window.confirm('Are you sure you want to unenroll from this course?')) {
            setActionLoading(true);
            setError(null);
            try {
                await unenrollUserFromCourse(course._id);
                setEnrollment(null);
                setError('Successfully unenrolled from course.');
            } catch (err: unknown) {
                const error = err as Error;
                setError(error.message || 'Failed to unenroll from course.');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleTakeAssessment = (assessmentId: string) => {
        if (!enrollment || enrollment.adminApprovalStatus !== AdminApprovalStatus.Approved) {
            setError('Enrollment not approved yet.');
            return;
        }
        navigate(`/assessments/${assessmentId}/take`);
    };

    const handleCloseInvoiceModal = () => {
        setOpenInvoiceModal(false);
    };

    if (loading) return <div className="loading-message">Loading Course Details...</div>;
    if (error && !course) return <div className="error-message">{error}</div>;
    if (!course) return <div className="not-found-message">Course not found.</div>;

    const isEnrolledAndApproved = enrollment && enrollment.adminApprovalStatus === AdminApprovalStatus.Approved;
    const isTeacherOrAdmin = user && (user.role === UserRole.Teacher || user.role === UserRole.Admin);
    const isCourseCreator = user && user._id === course.creatorId._id;

    return (
        <div className="course-detail-container">
            {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="course-detail-image" />}
            <h2>{course.title}</h2>
            <p className="course-description">{course.description}</p>
            <p className="course-meta">Category: {course.categoryId.name}</p>
            <p className="course-meta">Level: {course.level}</p>
            <p className="course-meta">Price: ₹{(course.effectivePrice ?? course.price ?? 0).toFixed(2)}</p>
            {/* <p className="course-meta">Created By: {course.creatorId.name}</p>
            <p className="course-meta">Created On: {new Date(course.createdAt).toLocaleDateString()}</p> */}

            {enrollment && enrollment.adminApprovalStatus === AdminApprovalStatus.Pending && (
                <Typography color="warning.main" className="pending-message">
                    Your enrollment is pending admin approval. You can only view lesson and assessment titles until approved.
                </Typography>
            )}

            <h3>Lessons</h3>
            {lessons.length === 0 ? (
                <p>No lessons available.</p>
            ) : (
                lessons.map((lesson) => (
                    <div key={lesson._id} className="lesson-item">
                        <h4>{lesson.title}</h4>
                        {isEnrolledAndApproved || isTeacherOrAdmin ? (
                            <>
                                <p>{lesson.description}</p>
                                <h5>Materials</h5>
                                {materials[lesson._id]?.length ? (
                                    materials[lesson._id].map((material) => (
                                        <div key={material._id}>
                                            <a href={material.materialUrl} target="_blank" rel="noopener noreferrer">
                                                {material.title}
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p>No materials available.</p>
                                )}
                            </>
                        ) : (
                            <p>Content locked until enrollment is approved.</p>
                        )}
                    </div>
                ))
            )}

            <h3>Assessments</h3>
            {assessments.length === 0 ? (
                <p>No assessments available.</p>
            ) : (
                assessments.map((assessment) => (
                    <div key={assessment._id} className="assessment-item">
                        <h4>{assessment.title}</h4>
                        {isEnrolledAndApproved || isTeacherOrAdmin ? (
                            <>
                                <p>Type: {assessment.type}</p>
                                <p>Max Score: {assessment.maxScore}</p>
                                <p>Duration: {assessment.durationMinutes} minutes</p>
                                {assessment.isPublished && (
                                    <Button
                                        onClick={() => handleTakeAssessment(assessment._id)}
                                        disabled={actionLoading}
                                    >
                                        Take Assessment
                                    </Button>
                                )}
                            </>
                        ) : (
                            <p>Content locked until enrollment is approved.</p>
                        )}
                    </div>
                ))
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="course-actions">
                {user?.role === UserRole.Learner && (
                    enrollment ? (
                        <>
                            <Button onClick={() => navigate('/enrolled-courses')}>
                                View My Enrollments
                            </Button>
                            {isEnrolledAndApproved && (
                                <Button
                                    onClick={handleUnenroll}
                                    disabled={actionLoading}
                                    className="secondary-button"
                                >
                                    {actionLoading ? 'Unenrolling...' : 'Unenroll'}
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button onClick={handleEnroll} disabled={actionLoading || sdkLoading || !user}>
                            {actionLoading ? 'Processing...' : (course.effectivePrice ?? course.price ?? 0) > 0 ? 'Buy Now' : 'Enroll Now'}
                        </Button>
                    )
                )}
                {(user?.role === UserRole.Teacher || user?.role === UserRole.Admin) && isCourseCreator && (
                    <>
                        <Button onClick={() => navigate(`/teacher/courses/edit/${course._id}`)}>Edit Course</Button>
                        <Button onClick={() => navigate(`/teacher/lessons/${course._id}`)}>Manage Lessons</Button>
                        <Button onClick={() => navigate(`/teacher/assessments/${course._id}`)}>Manage Assessments</Button>
                    </>
                )}
                <Button onClick={() => navigate('/courses')} className="back-button">
                    Back to All Courses
                </Button>
            </div>

            {invoice && (
                <Modal
                    open={openInvoiceModal}
                    onClose={handleCloseInvoiceModal}
                    aria-labelledby="invoice-modal"
                    aria-describedby="invoice-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="invoice-modal" variant="h6" component="h2">
                            Invoice Details
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            Invoice ID: {invoice.invoiceId}
                        </Typography>
                        <Typography>Order ID: {invoice.orderId}</Typography>
                        <Typography>Payment ID: {invoice.paymentId}</Typography>
                        <Typography>Amount: {invoice.amount} {invoice.currency}</Typography>
                        <Typography>Tax: {invoice.details.tax} {invoice.currency}</Typography>
                        <Typography>Total Amount: {invoice.details.totalAmount} {invoice.currency}</Typography>
                        <Typography>Description: {invoice.details.description}</Typography>
                        <Typography>Generated At: {new Date(invoice.generatedAt).toLocaleString()}</Typography>
                        <MuiButton onClick={handleCloseInvoiceModal} sx={{ mt: 2 }}>
                            Close
                        </MuiButton>
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default CourseDetail;