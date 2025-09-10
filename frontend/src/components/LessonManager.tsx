// frontend/src/components/Teacher/LessonManager.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonsByCourse, createLesson, updateLesson, deleteLesson, publishLesson, unpublishLesson } from '../services/lessonServices';
import { Lesson } from '../interfaces/lessonInterface'; 
import Button from '../components/common/button';
import Modal from '../components/common/Modal';
import '../styles/TeacherDashboard.css';

const LessonManager: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLesson, setCurrentLesson] = useState<Partial<Lesson> | null>(null);
    const [formState, setFormState] = useState({ 
        title: '', 
        description: '',
        orderIndex: 0,
        isPublished: false,
    });

    useEffect(() => {
        const fetchLessons = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                const fetchedLessons = await getLessonsByCourse(courseId);
                setLessons(fetchedLessons);
            } catch (err: any) {
                setError('Failed to fetch lessons.');
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, [courseId]);

    const openCreateModal = () => {
        setCurrentLesson(null);
        setFormState({ title: '', description: '', orderIndex: 0, isPublished: false });
        setIsModalOpen(true);
    };

    const openEditModal = (lesson: Lesson) => {
        setCurrentLesson(lesson);
        setFormState({ 
            title: lesson.title, 
            description: lesson.description || '',
            orderIndex: lesson.orderIndex,
            isPublished: lesson.isPublished,
        });
        setIsModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentLesson?._id) {
                await updateLesson(currentLesson._id, formState);
            } else if (courseId) {
                await createLesson(courseId, formState);
            }
            setIsModalOpen(false);
            const updatedLessons = await getLessonsByCourse(courseId!);
            setLessons(updatedLessons);
        } catch (err: any) {
            setError('Failed to save lesson.');
        }
    };

    const handleDelete = async (lessonId: string) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            try {
                await deleteLesson(lessonId);
                setLessons(lessons.filter(l => l._id !== lessonId));
            } catch (err: any) {
                setError('Failed to delete lesson.');
            }
        }
    };

    const handlePublish = async (lessonId: string) => {
        try {
            await publishLesson(lessonId);
            const updatedLessons = await getLessonsByCourse(courseId!);
            setLessons(updatedLessons);
        } catch (err: any) {
            setError('Failed to publish lesson.');
        }
    };
    
    const handleUnpublish = async (lessonId: string) => {
        try {
            await unpublishLesson(lessonId);
            const updatedLessons = await getLessonsByCourse(courseId!);
            setLessons(updatedLessons);
        } catch (err: any) {
            setError('Failed to unpublish lesson.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="manager-container">
            <h2>Manage Lessons for Course {courseId}</h2>
            <Button onClick={openCreateModal}>Create New Lesson</Button>
            <div className="items-list">
                {lessons.length === 0 ? (
                    <p>No lessons found.</p>
                ) : (
                    lessons.map(lesson => (
                        <div key={lesson._id} className="item-card">
                            <h3>{lesson.title}</h3>
                            <p>{lesson.description}</p>
                            <p>Status: {lesson.isPublished ? 'Published' : 'Draft'}</p>
                            <div className="item-actions">
                                <Button onClick={() => navigate(`/teacher/lessons/${lesson._id}/materials`)}>Manage Materials</Button>
                                <Button onClick={() => openEditModal(lesson)}>Edit</Button>
                                <Button onClick={() => handleDelete(lesson._id)} className="secondary-button">Delete</Button>
                                {lesson.isPublished ? (
                                    <Button onClick={() => handleUnpublish(lesson._id)} className="secondary-button">Unpublish</Button>
                                ) : (
                                    <Button onClick={() => handlePublish(lesson._id)}>Publish</Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h3>{currentLesson ? 'Edit Lesson' : 'Create New Lesson'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title" value={formState.title} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" value={formState.description} onChange={handleFormChange} required />
                        </div>
                        <Button type="submit">Save</Button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default LessonManager;