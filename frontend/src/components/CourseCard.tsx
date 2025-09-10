


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Course } from '../interfaces/courseInterface';
// import { initiateEnrollment, handlePaymentSuccess, unenrollUserFromCourse } from '../services/enrollmentServices';
// import Button from './common/button';
// import '../styles/CourseList.css';

// interface CourseCardProps {
//     course: Course;
//     isEnrolledInitially: boolean;
//     onEnrollSuccess: (courseId: string) => void;
//     onUnenrollSuccess: (courseId: string) => void;
// }

// const CourseCard: React.FC<CourseCardProps> = ({
//     course,
//     isEnrolledInitially,
//     onEnrollSuccess,
//     onUnenrollSuccess,
// }) => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [currentIsEnrolled, setCurrentIsEnrolled] = useState(isEnrolledInitially);

//     // This useEffect hook dynamically loads the Razorpay script
//     // It runs once when the component mounts and cleans up when it unmounts.
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []); // Empty dependency array ensures it runs only once

//     const handleEnroll = async (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setLoading(true);
//         setError(null);
//         try {
//             // Initiate enrollment by calling the backend service
//             const enrollmentResponse = await initiateEnrollment(course._id);

//             // Check if the course is free based on the backend response
//             if (enrollmentResponse.isFreeCourse) {
//                 setCurrentIsEnrolled(true);
//                 onEnrollSuccess(course._id);
//                 alert('You have successfully enrolled in this free course!');
//                 return;
//             }

//             // For paid courses, proceed with Razorpay payment
//             const options = {
//                 key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//                 amount: enrollmentResponse.amount,
//                 currency: enrollmentResponse.currency,
//                 name: 'Course Platform',
//                 description: `Payment for ${course.title}`,
//                 order_id: enrollmentResponse.orderId,
//                 handler: async (response: any) => {
//                     try {
//                         // After successful payment, call the backend to verify and finalize enrollment
//                         await handlePaymentSuccess({
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature,
//                             courseId: course._id,
//                         });
//                         setCurrentIsEnrolled(true);
//                         onEnrollSuccess(course._id);
//                         alert('Payment successful and enrollment confirmed!');
//                     } catch (err: any) {
//                         setError(err.message || 'Payment verification failed.');
//                     }
//                 },
//                 prefill: {
//                     name: 'User Name',
//                     email: 'user@example.com',
//                 },
//                 theme: {
//                     color: '#3399cc',
//                 },
//             };

//             const rzp = new (window as any).Razorpay(options);
//             rzp.on('payment.failed', (response: any) => {
//                 setError('Payment failed. Please try again.');
//             });
//             rzp.open();

//         } catch (err: any) {
//             console.error('[CourseCard] Enrollment failed:', err);
//             // The backend sends a detailed error, so we display it
//             setError(err.message || 'Failed to enroll in course.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUnenroll = async (e: React.MouseEvent) => {
//         e.stopPropagation();
//         if (window.confirm('Are you sure you want to unenroll from this course?')) {
//             setLoading(true);
//             setError(null);
//             try {
//                 await unenrollUserFromCourse(course._id);
//                 setCurrentIsEnrolled(false);
//                 onUnenrollSuccess(course._id);
//                 alert('You have successfully unenrolled from this course.');
//             } catch (err: any) {
//                 console.error('[CourseCard] Unenrollment failed:', err);
//                 setError(err.message || 'Failed to unenroll from course.');
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const handleCardClick = () => {
//         navigate(`/courses/${course._id}`);
//     };

//     return (
//         <div className="course-card" onClick={handleCardClick}>
//             {course.imageUrl && (
//                 <img src={course.imageUrl} alt={course.title} className="course-card-image" />
//             )}
//             <div className="course-card-content">
//                 <h3>{course.title}</h3>
//                 <p>{course.description}</p>
//                 {course.categoryId && <p>Category: {course.categoryId.name}</p>}
//                 <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>

//                 {error && <div className="error-message">{error}</div>}

//                 <div className="course-actions">
//                     {currentIsEnrolled ? (
//                         <>
//                             <Button onClick={(e) => { e.stopPropagation(); navigate(`/my-enrollments`); }}>
//                                 View Enrollment
//                             </Button>
//                             <Button onClick={handleUnenroll} disabled={loading} className="secondary-button">
//                                 {loading ? 'Unenrolling...' : 'Unenroll'}
//                             </Button>
//                         </>
//                     ) : (
//                         <Button onClick={handleEnroll} disabled={loading}>
//                             {loading ? 'Enrolling...' : 'Enroll Now'}
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CourseCard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Course } from '../interfaces/courseInterface';
// import { EnrollmentResponse, PaymentSuccessResponse } from '../interfaces/enrollmentInterface';
// import { initiateEnrollment, handlePaymentSuccess, unenrollUserFromCourse } from '../services/enrollmentServices';
// import Button from '../components/common/button';
// import { Button as MuiButton, Modal, Box, Typography } from '@mui/material';
// import '../styles/CourseList.css';

// interface CourseCardProps {
//     course: Course;
//     isEnrolledInitially: boolean;
//     onEnrollSuccess: (courseId: string) => void;
//     onUnenrollSuccess: (courseId: string) => void;
// }

// const CourseCard: React.FC<CourseCardProps> = ({
//     course,
//     isEnrolledInitially,
//     onEnrollSuccess,
//     onUnenrollSuccess,
// }) => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [currentIsEnrolled, setCurrentIsEnrolled] = useState(isEnrolledInitially);
//     const [isPendingApproval, setIsPendingApproval] = useState(false);
//     const [invoice, setInvoice] = useState<PaymentSuccessResponse['invoice'] | null>(null);
//     const [openFailureModal, setOpenFailureModal] = useState(false);
//     const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

//     // Replace with actual auth context
//     const user = {
//         _id: 'user_id_here',
//         name: 'User Name',
//         email: 'user@example.com',
//     };

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []);

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

//     const handleEnroll = async (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setLoading(true);
//         setError(null);
//         try {
//             const enrollmentResponse = await initiateEnrollment(course._id);

//             if (enrollmentResponse.isFreeCourse) {
//                 setCurrentIsEnrolled(true);
//                 setIsPendingApproval(true);
//                 onEnrollSuccess(course._id);
//                 alert('You have successfully enrolled in this free course!');
//                 return;
//             }

//             if (!enrollmentResponse.amount || !enrollmentResponse.currency || !enrollmentResponse.orderId) {
//                 throw new Error('Invalid order data: amount, currency, or orderId missing.');
//             }

//             const options = {
//                 key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
//                 amount: enrollmentResponse.amount * 100,
//                 currency: enrollmentResponse.currency,
//                 name: 'Course Platform',
//                 description: `Payment for ${course.title}`,
//                 order_id: enrollmentResponse.orderId,
//                 handler: async (response: any) => {
//                     try {
//                         const paymentResponse = await handlePaymentSuccess({
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature,
//                             courseId: course._id,
//                             userId: user._id,
//                         });
//                         setCurrentIsEnrolled(true);
//                         setIsPendingApproval(true);
//                         setInvoice(paymentResponse.invoice);
//                         setOpenInvoiceModal(true);
//                         onEnrollSuccess(course._id);
//                     } catch (err: unknown) {
//                         const error = err as Error;
//                         setError(error.message || 'Payment verification failed.');
//                         setOpenFailureModal(true);
//                     }
//                 },
//                 prefill: {
//                     name: user.name,
//                     email: user.email,
//                 },
//                 theme: {
//                     color: '#3399cc',
//                 },
//             };

//             const rzp = new (window as any).Razorpay(options);
//             rzp.on('payment.failed', () => {
//                 setError('Payment failed. Please try again.');
//                 setOpenFailureModal(true);
//             });
//             rzp.open();
//         } catch (err: unknown) {
//             const error = err as Error;
//             console.error('[CourseCard] Enrollment failed:', error);
//             setError(error.message || 'Failed to enroll in course.');
//             setOpenFailureModal(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUnenroll = async (e: React.MouseEvent) => {
//         e.stopPropagation();
//         if (window.confirm('Are you sure you want to unenroll from this course?')) {
//             setLoading(true);
//             setError(null);
//             try {
//                 await unenrollUserFromCourse(course._id);
//                 setCurrentIsEnrolled(false);
//                 setIsPendingApproval(false);
//                 onUnenrollSuccess(course._id);
//                 alert('You have successfully unenrolled from this course.');
//             } catch (err: unknown) {
//                 const error = err as Error;
//                 console.error('[CourseCard] Unenrollment failed:', error);
//                 setError(error.message || 'Failed to unenroll from course.');
//                 setOpenFailureModal(true);
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const handleCardClick = () => {
//         navigate(`/courses/${course._id}`);
//     };

//     const handleCloseFailureModal = () => {
//         setOpenFailureModal(false);
//         setError(null);
//     };

//     const handleCloseInvoiceModal = () => {
//         setOpenInvoiceModal(false);
//     };

//     return (
//         <div className="course-card" onClick={handleCardClick}>
//             {course.imageUrl && (
//                 <img src={course.imageUrl} alt={course.title} className="course-card-image" />
//             )}
//             <div className="course-card-content">
//                 <h3>{course.title}</h3>
//                 <p>{course.description}</p>
//                 <p>Category: {course.categoryId.name}</p>
//                 <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>

//                 {isPendingApproval && (
//                     <div className="pending-message">
//                         <Typography color="warning.main">
//                             Enrollment pending admin approval. You will gain access once approved.
//                         </Typography>
//                     </div>
//                 )}

//                 {error && !openFailureModal && (
//                     <div className="error-message">{error}</div>
//                 )}

//                 <div className="course-actions">
//                     {currentIsEnrolled ? (
//                         <>
//                             <Button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     navigate('/enrolled-courses');
//                                 }}
//                             >
//                                 View Enrollment
//                             </Button>
//                             <Button
//                                 onClick={handleUnenroll}
//                                 disabled={loading}
//                                 className="secondary-button"
//                             >
//                                 {loading ? 'Unenrolling...' : 'Unenroll'}
//                             </Button>
//                         </>
//                     ) : (
//                         <Button onClick={handleEnroll} disabled={loading}>
//                             {loading ? 'Enrolling...' : 'Enroll Now'}
//                         </Button>
//                     )}
//                 </div>
//             </div>

//             <Modal
//                 open={openFailureModal}
//                 onClose={handleCloseFailureModal}
//                 aria-labelledby="payment-failure-modal"
//                 aria-describedby="payment-failure-description"
//             >
//                 <Box sx={modalStyle}>
//                     <Typography id="payment-failure-modal" variant="h6" component="h2">
//                         Payment Failed
//                     </Typography>
//                     <Typography id="payment-failure-description" sx={{ mt: 2 }}>
//                         {error || 'An error occurred during payment. Please try again.'}
//                     </Typography>
//                     <MuiButton onClick={handleCloseFailureModal} sx={{ mt: 2 }}>
//                         Close
//                     </MuiButton>
//                 </Box>
//             </Modal>

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

// export default CourseCard;





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../interfaces/courseInterface';
import { EnrollmentResponse, PaymentSuccessResponse } from '../interfaces/enrollmentInterface';
import { initiateEnrollment, handlePaymentSuccess, unenrollUserFromCourse } from '../services/enrollmentServices';
import Button from '../components/common/button';
import { Button as MuiButton, Modal, Box, Typography } from '@mui/material';
import '../styles/CourseList.css';

interface CourseCardProps {
    course: Course;
    isEnrolledInitially: boolean;
    onEnrollSuccess: (courseId: string) => void;
    onUnenrollSuccess: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
    course,
    isEnrolledInitially,
    onEnrollSuccess,
    onUnenrollSuccess,
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentIsEnrolled, setCurrentIsEnrolled] = useState(isEnrolledInitially);
    const [isPendingApproval, setIsPendingApproval] = useState(false);
    const [invoice, setInvoice] = useState<PaymentSuccessResponse['invoice'] | null>(null);
    const [openFailureModal, setOpenFailureModal] = useState(false);
    const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

    // Replace with actual auth context
    const user = {
        _id: 'user_id_here',
        name: 'User Name',
        email: 'user@example.com',
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

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

    const handleEnroll = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);
        setError(null);
        try {
            const enrollmentResponse = await initiateEnrollment(course._id);

            if (enrollmentResponse.isFreeCourse) {
                setCurrentIsEnrolled(true);
                setIsPendingApproval(true);
                onEnrollSuccess(course._id);
                alert('You have successfully enrolled in this free course!');
                return;
            }

            if (!enrollmentResponse.amount || !enrollmentResponse.currency || !enrollmentResponse.orderId) {
                throw new Error('Invalid order data: amount, currency, or orderId missing.');
            }

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
                amount: enrollmentResponse.amount * 100,
                currency: enrollmentResponse.currency,
                name: 'Course Platform',
                description: `Payment for ${course.title}`,
                order_id: enrollmentResponse.orderId,
                handler: async (response: any) => {
                    try {
                        const paymentResponse = await handlePaymentSuccess({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: course._id,
                            userId: user._id,
                        });
                        setCurrentIsEnrolled(true);
                        setIsPendingApproval(true);
                        setInvoice(paymentResponse.invoice);
                        setOpenInvoiceModal(true);
                        onEnrollSuccess(course._id);
                    } catch (err: unknown) {
                        const error = err as Error;
                        setError(error.message || 'Payment verification failed.');
                        setOpenFailureModal(true);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', () => {
                setError('Payment failed. Please try again.');
                setOpenFailureModal(true);
            });
            rzp.open();
        } catch (err: unknown) {
            const error = err as Error;
            console.error('[CourseCard] Enrollment failed:', error);
            setError(error.message || 'Failed to enroll in course.');
            setOpenFailureModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUnenroll = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to unenroll from this course?')) {
            setLoading(true);
            setError(null);
            try {
                await unenrollUserFromCourse(course._id);
                setCurrentIsEnrolled(false);
                setIsPendingApproval(false);
                onUnenrollSuccess(course._id);
                alert('You have successfully unenrolled from this course.');
            } catch (err: unknown) {
                const error = err as Error;
                console.error('[CourseCard] Unenrollment failed:', error);
                setError(error.message || 'Failed to unenroll from course.');
                setOpenFailureModal(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCardClick = () => {
        navigate(`/courses/${course._id}`);
    };

    const handleCloseFailureModal = () => {
        setOpenFailureModal(false);
        setError(null);
    };

    const handleCloseInvoiceModal = () => {
        setOpenInvoiceModal(false);
    };

    return (
        <div className="course-card" onClick={handleCardClick}>
            {course.imageUrl && (
                <img src={course.imageUrl} alt={course.title} className="course-card-image" />
            )}
            <div className="course-card-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>Category: {course.categoryId.name}</p>
                <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>

                {isPendingApproval && (
                    <div className="pending-message">
                        <Typography color="warning.main">
                            Enrollment pending admin approval. You will gain access once approved.
                        </Typography>
                    </div>
                )}

                {error && !openFailureModal && (
                    <div className="error-message">{error}</div>
                )}

                <div className="course-actions">
                    {currentIsEnrolled ? (
                        <>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/enrolled-courses');
                                }}
                            >
                                View Enrollment
                            </Button>
                            <Button
                                onClick={handleUnenroll}
                                disabled={loading}
                                className="secondary-button"
                            >
                                {loading ? 'Unenrolling...' : 'Unenroll'}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleEnroll} disabled={loading}>
                            {loading ? 'Enrolling...' : 'Enroll Now'}
                        </Button>
                    )}
                </div>
            </div>

            <Modal
                open={openFailureModal}
                onClose={handleCloseFailureModal}
                aria-labelledby="payment-failure-modal"
                aria-describedby="payment-failure-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="payment-failure-modal" variant="h6" component="h2">
                        Payment Failed
                    </Typography>
                    <Typography id="payment-failure-description" sx={{ mt: 2 }}>
                        {error || 'An error occurred during payment. Please try again.'}
                    </Typography>
                    <MuiButton onClick={handleCloseFailureModal} sx={{ mt: 2 }}>
                        Close
                    </MuiButton>
                </Box>
            </Modal>

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

export default CourseCard;