// frontend/src/components/Teacher/QuestionManager.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionsByAssessment, createQuestion, updateQuestion, deleteQuestion } from '../services/assessmentServices';
import { IQuestion } from '../interfaces/questionInterface';
import Button from '../components/common/button';
import Modal from '../components/common/Modal';
import '../styles/TeacherDashboard.css';

const QuestionManager: React.FC = () => {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Partial<IQuestion> | null>(null);
    const [formState, setFormState] = useState({
        questionText: '',
        type: 'MultipleChoice',
        points: 1,
        options: ['', '', '', ''],
        correctAnswer: '',
        image: null as File | null,
    });

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!assessmentId) return;
            setLoading(true);
            try {
                const fetchedQuestions = await getQuestionsByAssessment(assessmentId);
                setQuestions(fetchedQuestions);
            } catch (err: any) {
                setError('Failed to fetch questions.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [assessmentId]);

    const openCreateModal = () => {
        setCurrentQuestion(null);
        setFormState({
            questionText: '',
            type: 'MultipleChoice',
            points: 1,
            options: ['', '', '', ''],
            correctAnswer: '',
            image: null,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (question: IQuestion) => {
        setCurrentQuestion(question);
        setFormState({
            questionText: question.questionText,
            type: question.type,
            points: question.points,
            options: question.options || ['', '', '', ''],
        correctAnswer: String(question.correctAnswer),
            image: null,
        });
        setIsModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('option')) {
            const index = parseInt(name.replace('option', ''), 10);
            const newOptions = [...formState.options];
            newOptions[index] = value;
            setFormState({ ...formState, options: newOptions });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormState(prev => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('questionText', formState.questionText);
            formData.append('type', formState.type);
            formData.append('points', String(formState.points));

            if (formState.type === 'MultipleChoice' || formState.type === 'TrueFalse') {
                formData.append('options', JSON.stringify(formState.options));
                formData.append('correctAnswer', String(formState.correctAnswer));
            }
            if (formState.image) {
                formData.append('image', formState.image);
            }

            if (currentQuestion?._id) {
                await updateQuestion(currentQuestion._id, formData);
            } else if (assessmentId) {
                await createQuestion(assessmentId, formData);
            }
            setIsModalOpen(false);
            const updatedQuestions = await getQuestionsByAssessment(assessmentId!);
            setQuestions(updatedQuestions);
        } catch (err: any) {
            setError('Failed to save question.');
        }
    };

    const handleDelete = async (questionId: string) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteQuestion(questionId);
                setQuestions(questions.filter(q => q._id !== questionId));
            } catch (err: any) {
                setError('Failed to delete question.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="manager-container">
            <h2>Manage Questions for Assessment {assessmentId}</h2>
            <Button onClick={openCreateModal}>Add New Question</Button>
            <div className="items-list">
                {questions.length === 0 ? (
                    <p>No questions found.</p>
                ) : (
                    questions.map(question => (
                        <div key={question._id} className="item-card">
                            <p className="question-text">{question.questionText}</p>
                            <p>Type: {question.type}</p>
                            <p>Points: {question.points}</p>
                            <div className="item-actions">
                                <Button onClick={() => openEditModal(question)}>Edit</Button>
                                <Button onClick={() => handleDelete(question._id)} className="secondary-button">Delete</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h3>{currentQuestion ? 'Edit Question' : 'Add New Question'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label>Question Text</label>
                            <textarea name="questionText" value={formState.questionText} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select name="type" value={formState.type} onChange={handleFormChange}>
                                <option value="MultipleChoice">Multiple Choice</option>
                                <option value="TrueFalse">True/False</option>
                                <option value="FileUpload">File Upload</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Points</label>
                            <input type="number" name="points" value={formState.points} onChange={handleFormChange} required />
                        </div>
                        {formState.type === 'MultipleChoice' && (
                            <div className="form-group">
                                <label>Options (4)</label>
                                {formState.options.map((option, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        name={`option${index}`}
                                        value={option}
                                        onChange={handleFormChange}
                                        placeholder={`Option ${index + 1}`}
                                        required
                                    />
                                ))}
                                <label>Correct Answer (0-3)</label>
                                <input type="number" name="correctAnswer" value={formState.correctAnswer} onChange={handleFormChange} min="0" max="3" required />
                            </div>
                        )}
                        {formState.type === 'TrueFalse' && (
                            <div className="form-group">
                                <label>Correct Answer</label>
                                <select name="correctAnswer" value={formState.correctAnswer} onChange={handleFormChange} required>
                                    <option value="">Select</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Image (Optional)</label>
                            <input type="file" name="image" onChange={handleFileChange} />
                        </div>
                        <Button type="submit">Save</Button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default QuestionManager;