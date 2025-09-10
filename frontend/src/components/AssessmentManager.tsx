// frontend/src/components/Teacher/AssessmentManager.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessmentsByCourse, createAssessment, updateAssessment, deleteAssessment, publishAssessment, unpublishAssessment } from '../services/assessmentServices';
import { IAssessmentBase, AssessmentType } from '../interfaces/assessmentInterface'; 
import Button from '../components/common/button';
import Modal from '../components/common/Modal'; 
import '../styles/CourseList.css';

const AssessmentManager: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState<IAssessmentBase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAssessment, setCurrentAssessment] = useState<Partial<IAssessmentBase> | null>(null);


    interface IAssessmentFormState {
        title: string;
        description: string;
        type: AssessmentType;
        maxScore: string;
        durationMinutes: string;
        passPercentage: string;
    }

    const [formState, setFormState] = useState<IAssessmentFormState>({
        title: '',
        description: '',
        type:  AssessmentType.Quiz,
        maxScore: '',
        durationMinutes: '',
        passPercentage: '',
    });

    useEffect(() => {
        const fetchAssessments = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                const fetchedAssessments = await getAssessmentsByCourse(courseId);
                setAssessments(fetchedAssessments);
            } catch (err: any) {
                setError('Failed to fetch assessments.');
            } finally {
                setLoading(false);
            }
        };
        fetchAssessments();
    }, [courseId]);

    const openCreateModal = () => {
        setCurrentAssessment(null);
        setFormState({ title: '', description: '', type:  AssessmentType.Quiz, maxScore: '', durationMinutes: '', passPercentage: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (assessment: IAssessmentBase) => {
        setCurrentAssessment(assessment);
        setFormState({
            title: assessment.title || '',
            description: assessment.description || '', 
            type: assessment.type,
            maxScore: assessment.maxScore ? String(assessment.maxScore) : '',
            durationMinutes: assessment.durationMinutes ? String(assessment.durationMinutes) : '',
            passPercentage: assessment.passPercentage ? String(assessment.passPercentage) : '',
        });
        setIsModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const assessmentData = {
                ...formState,
                maxScore: Number(formState.maxScore),
                durationMinutes: Number(formState.durationMinutes),
                passPercentage: Number(formState.passPercentage),
            };

            if (currentAssessment?._id) {
                await updateAssessment(currentAssessment._id, assessmentData); 
            } else if (courseId) {
                await createAssessment(courseId, assessmentData); 
            }
            setIsModalOpen(false);
            const updatedAssessments = await getAssessmentsByCourse(courseId!);
            setAssessments(updatedAssessments);
        } catch (err: any) {
            setError('Failed to save assessment.');
        }
    };

    const handleDelete = async (assessmentId: string) => {
        if (window.confirm('Are you sure you want to delete this assessment?')) {
            try {
                await deleteAssessment(assessmentId);
                setAssessments(assessments.filter(a => a._id !== assessmentId));
            } catch (err: any) {
                setError('Failed to delete assessment.');
            }
        }
    };

    const handlePublish = async (assessmentId: string) => {
        try {
            await publishAssessment(assessmentId);
            const updatedAssessments = await getAssessmentsByCourse(courseId!);
            setAssessments(updatedAssessments);
        } catch (err: any) {
            setError('Failed to publish assessment.');
        }
    };

    const handleUnpublish = async (assessmentId: string) => {
        try {
            await unpublishAssessment(assessmentId);
            const updatedAssessments = await getAssessmentsByCourse(courseId!);
            setAssessments(updatedAssessments);
        } catch (err: any) {
            setError('Failed to unpublish assessment.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="manager-container">
            <h2>Manage Assessments for Course {courseId}</h2>
            <Button onClick={openCreateModal}>Create New Assessment</Button>
            <div className="items-list">
                {assessments.length === 0 ? (
                    <p>No assessments found.</p>
                ) : (
                    assessments.map(assessment => (
                        <div key={assessment._id} className="item-card">
                            <h3>{assessment.title}</h3>
                            <p>{assessment.description}</p>
                            <p>Type: {assessment.type}</p>
                            <p>Status: {assessment.isPublished ? 'Published' : 'Draft'}</p>
                            <div className="item-actions">
                                <Button onClick={() => navigate(`/teacher/assessments/${assessment._id}/questions`)}>Manage Questions</Button>
                                <Button onClick={() => openEditModal(assessment)}>Edit</Button>
                                <Button onClick={() => handleDelete(assessment._id)} className="secondary-button">Delete</Button>
                                {assessment.isPublished ? (
                                    <Button onClick={() => handleUnpublish(assessment._id)} className="secondary-button">Unpublish</Button>
                                ) : (
                                    <Button onClick={() => handlePublish(assessment._id)}>Publish</Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h3>{currentAssessment ? 'Edit Assessment' : 'Create New Assessment'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title" value={formState.title} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" value={formState.description} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select name="type" value={formState.type} onChange={handleFormChange} required>
                                <option value="Quiz">Quiz</option>
                                <option value="Exam">Exam</option>
                                <option value="PracticeTest">Practice Test</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Max Score</label>
                            <input type="number" name="maxScore" value={formState.maxScore} onChange={handleFormChange} />
                        </div>
                        <div className="form-group">
                            <label>Duration (minutes)</label>
                            <input type="number" name="durationMinutes" value={formState.durationMinutes} onChange={handleFormChange} />
                        </div>
                        <div className="form-group">
                            <label>Pass Percentage</label>
                            <input type="number" name="passPercentage" value={formState.passPercentage} onChange={handleFormChange} />
                        </div>
                        <Button type="submit">Save</Button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default AssessmentManager;