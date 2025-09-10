// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { createQuestion, getQuestionsByAssessment, updateQuestion, deleteQuestion } from '../services/assessmentServices';
// import Input from '../components/common/Input';
// import Button from '../components/common/button';
// import '../styles/Dashboard.css';

// const QuestionManagement: React.FC = () => {
//     const { assessmentId } = useParams<{ assessmentId: string }>();
//     const navigate = useNavigate();
//     const [questions, setQuestions] = useState<any[]>([]);
//     const [newQuestion, setNewQuestion] = useState<{ content: string; options: string[]; correctOption: number; file?: File }>({
//         content: '',
//         options: ['', '', '', ''],
//         correctOption: 0,
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             if (!assessmentId) return;
//             try {
//                 const data = await getQuestionsByAssessment(assessmentId);
//                 setQuestions(data);
//             } catch (err: any) {
//                 setError(err.message || 'Failed to fetch questions.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchQuestions();
//     }, [assessmentId]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         if (name.startsWith('option-')) {
//             const index = parseInt(name.split('-')[1]);
//             const newOptions = [...newQuestion.options];
//             newOptions[index] = value;
//             setNewQuestion({ ...newQuestion, options: newOptions });
//         } else {
//             setNewQuestion({ ...newQuestion, [name]: value });
//         }
//         setError(null);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setNewQuestion({ ...newQuestion, file: e.target.files[0] });
//             setError(null);
//         }
//     };

//     const handleCreateQuestion = async () => {
//         if (!assessmentId || !newQuestion.content || newQuestion.options.some(opt => !opt)) {
//             setError('Please provide question content and four options.');
//             return;
//         }
//         try {
//             const questionData = new FormData();
//             questionData.append('content', newQuestion.content);
//             questionData.append('options', JSON.stringify(newQuestion.options));
//             questionData.append('correctOption', newQuestion.correctOption.toString());
//             if (newQuestion.file) {
//                 questionData.append('questionImage', newQuestion.file);
//             }
//             questionData.append('assessmentId', assessmentId);
//             const createdQuestion = await createQuestion(assessmentId, questionData);
//             setQuestions([...questions, createdQuestion]);
//             setNewQuestion({ content: '', options: ['', '', '', ''], correctOption: 0 });
//             alert('Question created successfully!');
//         } catch (err: any) {
//             setError(err.message || 'Failed to create question.');
//         }
//     };

//     const handleUpdateQuestion = async (questionId: string, questionData: any) => {
//         try {
//             const questionFormData = new FormData();
//             questionFormData.append('content', questionData.content);
//             questionFormData.append('options', JSON.stringify(questionData.options));
//             questionFormData.append('correctOption', questionData.correctOption.toString());
//             if (questionData.file) {
//                 questionFormData.append('questionImage', questionData.file);
//             }
//             const updatedQuestion = await updateQuestion(questionId, questionFormData);
//             setQuestions(questions.map(q => q._id === questionId ? updatedQuestion : q));
//             alert('Question updated successfully!');
//         } catch (err: any) {
//             setError(err.message || 'Failed to update question.');
//         }
//     };

//     const handleDeleteQuestion = async (questionId: string) => {
//         if (window.confirm('Are you sure you want to delete this question?')) {
//             try {
//                 await deleteQuestion(questionId);
//                 setQuestions(questions.filter(q => q._id !== questionId));
//                 alert('Question deleted successfully!');
//             } catch (err: any) {
//                 setError(err.message || 'Failed to delete question.');
//             }
//         }
//     };

//     if (loading) return <div className="loading-message">Loading Questions...</div>;
//     if (error) return <div className="error-message">{error}</div>;

//     return (
//         <div className="dashboard-layout">
//             <div className="dashboard-content">
//                 <h2>Manage Questions</h2>
//                 <div>
//                     <h3>Create New Question</h3>
//                     <Input
//                         type="text"
//                         name="content"
//                         value={newQuestion.content}
//                         onChange={handleInputChange}
//                         placeholder="Question Content"
//                         label="Question"
//                         required
//                     />
//                     {newQuestion.options.map((option, index) => (
//                         <Input
//                             key={index}
//                             type="text"
//                             name={`option-${index}`}
//                             value={option}
//                             onChange={handleInputChange}
//                             placeholder={`Option ${index + 1}`}
//                             label={`Option ${index + 1}`}
//                             required
//                         />
//                     ))}
//                     <div>
//                         <label htmlFor="correctOption">Correct Option</label>
//                         <select
//                             name="correctOption"
//                             id="correctOption"
//                             value={newQuestion.correctOption}
//                             onChange={(e) => setNewQuestion({ ...newQuestion, correctOption: parseInt(e.target.value) })}
//                             required
//                         >
//                             <option value="0">Option 1</option>
//                             <option value="1">Option 2</option>
//                             <option value="2">Option 3</option>
//                             <option value="3">Option 4</option>
//                         </select>
//                     </div>
//                     <Input
//                         type="file"
//                         name="questionImage"
//                         onChange={handleFileChange}
//                         label="Question Image (Optional)"
//                         accept="image/*"
//                     />
//                     <Button onClick={handleCreateQuestion} disabled={!newQuestion.content || newQuestion.options.some(opt => !opt)}>
//                         Create Question
//                     </Button>
//                 </div>
//                 <h3>Existing Questions</h3>
//                 {questions.length === 0 ? (
//                     <p>No questions found.</p>
//                 ) : (
//                     <table className="admin-table">
//                         <thead>
//                             <tr>
//                                 <th>Question</th>
//                                 <th>Options</th>
//                                 <th>Correct Option</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {questions.map(question => (
//                                 <tr key={question._id}>
//                                     <td>{question.content}</td>
//                                     <td>{question.options.join(', ')}</td>
//                                     <td>{question.correctOption + 1}</td>
//                                     <td>
//                                         <Button onClick={() => handleUpdateQuestion(question._id, {
//                                             content: question.content,
//                                             options: question.options,
//                                             correctOption: question.correctOption,
//                                         })}>
//                                             Update
//                                         </Button>
//                                         <Button onClick={() => handleDeleteQuestion(question._id)} className="btn-delete">
//                                             Delete
//                                         </Button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default QuestionManagement;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createQuestion, getQuestionsByAssessment, updateQuestion, deleteQuestion } from '../services/assessmentServices';
import Input from '../components/common/Input';
import Button from '../components/common/button';
import { IQuestion, QuestionType } from '../interfaces/questionInterface';
import '../styles/Dashboard.css';

const QuestionManagement: React.FC = () => {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [newQuestion, setNewQuestion] = useState<{
        questionText: string;
        type: QuestionType;
        options: string[];
        correctAnswer: number | boolean;
        points: number;
        file?: File;
    }>({
        questionText: '',
        type: QuestionType.MultipleChoice,
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!assessmentId) {
                setError('Assessment ID not provided.');
                setLoading(false);
                return;
            }
            try {
                const data = await getQuestionsByAssessment(assessmentId);
                setQuestions(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch questions.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [assessmentId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('option-')) {
            const index = parseInt(name.split('-')[1]);
            const newOptions = [...newQuestion.options];
            newOptions[index] = value;
            setNewQuestion({ ...newQuestion, options: newOptions });
        } else if (name === 'correctAnswer' && newQuestion.type === QuestionType.TrueFalse) {
            setNewQuestion({ ...newQuestion, correctAnswer: value === 'true' });
        } else if (name === 'correctAnswer') {
            setNewQuestion({ ...newQuestion, correctAnswer: parseInt(value) });
        } else if (name === 'points') {
            const points = value === '' ? 1 : parseInt(value);
            if (!isNaN(points) && points > 0) {
                setNewQuestion({ ...newQuestion, points });
            }
        } else if (name === 'type') {
            const type = value as QuestionType;
            setNewQuestion({
                ...newQuestion,
                type,
                options: type === QuestionType.MultipleChoice ? ['', '', '', ''] : [],
                correctAnswer: type === QuestionType.TrueFalse ? false : 0,
            });
        } else {
            setNewQuestion({ ...newQuestion, [name]: value });
        }
        setError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size must be less than 5MB.');
                return;
            }
            setNewQuestion({ ...newQuestion, file });
            setError(null);
        }
    };

    const handleCreateQuestion = async () => {
        if (!assessmentId || !newQuestion.questionText || (newQuestion.type === QuestionType.MultipleChoice && newQuestion.options.some(opt => !opt))) {
            setError('Please provide question text and, for multiple choice, four options.');
            return;
        }
        if (newQuestion.points < 1) {
            setError('Points must be at least 1.');
            return;
        }
        try {
            const questionData = new FormData();
            questionData.append('questionText', newQuestion.questionText);
            questionData.append('type', newQuestion.type);
            if (newQuestion.type === QuestionType.MultipleChoice) {
                questionData.append('options', JSON.stringify(newQuestion.options));
                questionData.append('correctAnswer', newQuestion.correctAnswer.toString());
            } else if (newQuestion.type === QuestionType.TrueFalse) {
                questionData.append('correctAnswer', newQuestion.correctAnswer.toString());
            }
            questionData.append('points', newQuestion.points.toString());
            if (newQuestion.file) {
                questionData.append('questionImage', newQuestion.file);
            }
            const createdQuestion = await createQuestion(assessmentId, questionData);
            setQuestions([...questions, createdQuestion]);
            setNewQuestion({
                questionText: '',
                type: QuestionType.MultipleChoice,
                options: ['', '', '', ''],
                correctAnswer: 0,
                points: 1,
            });
            alert('Question created successfully!');
        } catch (err: any) {
            setError(err.message || 'Failed to create question.');
        }
    };

    const handleUpdateQuestion = async (questionId: string, questionData: { questionText: string; type: QuestionType; options: string[]; correctAnswer: number | boolean; points: number; file?: File }) => {
        try {
            const questionFormData = new FormData();
            questionFormData.append('questionText', questionData.questionText);
            questionFormData.append('type', questionData.type);
            if (questionData.type === QuestionType.MultipleChoice) {
                questionFormData.append('options', JSON.stringify(questionData.options));
                questionFormData.append('correctAnswer', questionData.correctAnswer.toString());
            } else if (questionData.type === QuestionType.TrueFalse) {
                questionFormData.append('correctAnswer', questionData.correctAnswer.toString());
            }
            questionFormData.append('points', questionData.points.toString());
            if (questionData.file) {
                questionFormData.append('questionImage', questionData.file);
            }
            const updatedQuestion = await updateQuestion(questionId, questionFormData);
            setQuestions(questions.map(q => q._id === questionId ? updatedQuestion : q));
            alert('Question updated successfully!');
        } catch (err: any) {
            setError(err.message || 'Failed to update question.');
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteQuestion(questionId);
                setQuestions(questions.filter(q => q._id !== questionId));
                alert('Question deleted successfully!');
            } catch (err: any) {
                setError(err.message || 'Failed to delete question.');
            }
        }
    };

    if (loading) return <div className="loading-message">Loading Questions...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-layout">
            <div className="dashboard-content">
                <h2>Manage Questions</h2>
                <div>
                    <h3>Create New Question</h3>
                    <Input
                        type="text"
                        name="questionText"
                        value={newQuestion.questionText}
                        onChange={handleInputChange}
                        placeholder="Question Text"
                        label="Question"
                        required
                    />
                    <div>
                        <label htmlFor="type">Question Type</label>
                        <select
                            name="type"
                            id="type"
                            value={newQuestion.type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value={QuestionType.MultipleChoice}>Multiple Choice</option>
                            <option value={QuestionType.TrueFalse}>True/False</option>
                            <option value={QuestionType.FileUpload}>File Upload</option>
                        </select>
                    </div>
                    {newQuestion.type === QuestionType.MultipleChoice && newQuestion.options.map((option, index) => (
                        <Input
                            key={index}
                            type="text"
                            name={`option-${index}`}
                            value={option}
                            onChange={handleInputChange}
                            placeholder={`Option ${index + 1}`}
                            label={`Option ${index + 1}`}
                            required
                        />
                    ))}
                    {newQuestion.type === QuestionType.MultipleChoice && (
                        <div>
                            <label htmlFor="correctAnswer">Correct Option</label>
                            <select
                                name="correctAnswer"
                                id="correctAnswer"
                                value={typeof newQuestion.correctAnswer === 'number' ? newQuestion.correctAnswer : 0}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="0">Option 1</option>
                                <option value="1">Option 2</option>
                                <option value="2">Option 3</option>
                                <option value="3">Option 4</option>
                            </select>
                        </div>
                    )}
                    {newQuestion.type === QuestionType.TrueFalse && (
                        <div>
                            <label htmlFor="correctAnswer">Correct Answer</label>
                            <select
                                name="correctAnswer"
                                id="correctAnswer"
                                value={newQuestion.correctAnswer.toString()}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>
                    )}
                    <Input
                        type="number"
                        name="points"
                        value={newQuestion.points.toString()}
                        onChange={handleInputChange}
                        placeholder="Points"
                        label="Points"
                        required
                        min="1"
                    />
                    <Input
                        type="file"
                        name="questionImage"
                        onChange={handleFileChange}
                        label="Question Image (Optional, max 5MB)"
                        accept="image/*"
                    />
                    <Button
                        onClick={handleCreateQuestion}
                        disabled={!newQuestion.questionText || (newQuestion.type === QuestionType.MultipleChoice && newQuestion.options.some(opt => !opt)) || newQuestion.points < 1}
                    >
                        Create Question
                    </Button>
                </div>
                <h3>Existing Questions</h3>
                {questions.length === 0 ? (
                    <p>No questions found.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Type</th>
                                <th>Options</th>
                                <th>Correct Answer</th>
                                <th>Points</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map(question => (
                                <tr key={question._id}>
                                    <td>{question.questionText}</td>
                                    <td>{question.type}</td>
                                    <td>{question.options.length ? question.options.join(', ') : 'None'}</td>
                                    <td>
                                        {question.type === QuestionType.MultipleChoice && typeof question.correctAnswer === 'number'
                                            ? question.correctAnswer + 1
                                            : question.correctAnswer.toString()}
                                    </td>
                                    <td>{question.points}</td>
                                    <td>{question.imageUrl ? <a href={question.imageUrl} target="_blank" rel="noopener noreferrer">View</a> : 'None'}</td>
                                    <td>
                                        <Button onClick={() => handleUpdateQuestion(question._id, {
                                            questionText: question.questionText,
                                            type: question.type,
                                            options: question.options,
                                            correctAnswer: question.correctAnswer,
                                            points: question.points,
                                            file: undefined, // File updates require separate handling
                                        })}>
                                            Update
                                        </Button>
                                        <Button onClick={() => handleDeleteQuestion(question._id)} className="btn-delete">
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default QuestionManagement;