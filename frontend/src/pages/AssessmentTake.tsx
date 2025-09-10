


// frontend/src/AssessmentTake.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessmentById, submitAssessment } from '../services/assessmentServices';
import { getUserEnrollments } from '../services/enrollmentServices';
import Button from '../components/common/button';
import { IAssessmentPopulated } from '../interfaces/assessmentInterface';
import '../styles/Dashboard.css';
import '../styles/AssessmentTake.css'; 

const AssessmentTake: React.FC = () => {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState<IAssessmentPopulated | null>(null);
    const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const fetchAssessment = async () => {
            if (!assessmentId) {
                setError('Assessment ID not provided.');
                setLoading(false);
                return;
            }
            try {
                const [assessmentData, enrollments] = await Promise.all([
                    getAssessmentById(assessmentId),
                    getUserEnrollments(),
                ]);
                const enrollment = enrollments.find(e => e.courseId._id === assessmentData.courseId);
                if (!enrollment) {
                    setError('You are not enrolled in this course.');
                    navigate('/courses');
                    return;
                }
                setAssessment(assessmentData);
                setTimeLeft(assessmentData.durationMinutes * 60);
            } catch (err: any) {
                setError(err.message || 'Failed to load assessment.');
            } finally {
                setLoading(false);
            }
        };
        fetchAssessment();
    }, [assessmentId, navigate]);

    useEffect(() => {
        if (timeLeft <= 0 || !assessment) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, assessment]);

    const handleAnswerChange = (questionId: string, selectedOption: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    };

    const handleSubmit = async () => {
        if (!assessmentId || !assessment) return;
        try {
            const submission = Object.entries(answers).map(([questionId, selectedOption]) => ({
                questionId,
                selectedOption,
            }));
            const result = await submitAssessment(assessmentId, submission);
            alert(`Assessment submitted! Your score: ${result.score}/${assessment.maxScore}`);
            navigate(`/courses/${assessment.courseId}`);
        } catch (err: any) {
            setError(err.message || 'Failed to submit assessment.');
        }
    };

    if (loading) return <div className="loading-message">Loading Assessment...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!assessment) return <div className="not-found-message">Assessment not found.</div>;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

return (
    <div className="dashboard-layout">
        <div className="dashboard-content">
            <div className="assessment-header">
                <h2>{assessment.title}</h2>
                <div className="timer">Time Left: <span>{formatTime(timeLeft)}</span></div>
            </div>
            <p className="assessment-meta">Max Score: {assessment.maxScore}</p>
            {assessment.questions.map((question, index) => (
                <div key={question._id} className="question-card">
                    <h4 className="question-text">Question {index + 1}: {question.questionText}</h4>
                    {question.imageUrl && (
                        <div className="question-image-container">
                            <img src={question.imageUrl} alt="Question" className="question-image" />
                        </div>
                    )}
                    <div className="options-container">
                        {question.options.map((option: string, optIndex: number) => (
                            <div key={optIndex} className="option-item">
                                <input
                                    type="radio"
                                    id={`question-${question._id}-option-${optIndex}`}
                                    name={`question-${question._id}`}
                                    value={optIndex}
                                    checked={answers[question._id] === optIndex}
                                    onChange={() => handleAnswerChange(question._id, optIndex)}
                                />
                                <label
                                    htmlFor={`question-${question._id}-option-${optIndex}`}
                                    className="option-label"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {error && <div className="error-message">{error}</div>}
            <div className="submit-button-container">
                <Button onClick={handleSubmit} disabled={timeLeft === 0}>Submit Assessment</Button>
            </div>
        </div>
    </div>
);
};

export default AssessmentTake;