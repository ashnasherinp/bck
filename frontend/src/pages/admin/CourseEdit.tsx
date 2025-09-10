

// frontend/src/pages/admin/CourseEdit.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateCourse, getCategories } from '../../services/CourseServices';
import { Course, Category } from '../../interfaces/courseInterface';
import './CourseForm.css';

const CourseEdit: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        level: '',
        price: '',
        discountPrice: '',
        image: null as File | null,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) {
                setError('Course ID not provided.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const [courseData, categoryData] = await Promise.all([
                    getCourseById(courseId),
                    getCategories(),
                ]);
                setCourse(courseData);
                setCategories(categoryData);
                setFormData({
                    title: courseData.title || '',
                    description: courseData.description || '',
                    categoryId: courseData.categoryId?._id || '',
                    level: courseData.level || '',
                    price: courseData.price ? courseData.price.toString() : '',
                    discountPrice: courseData.discountPrice ? courseData.discountPrice.toString() : '',
                    image: null,
                });
            } catch (err: any) {
                setError(err.message || 'Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('categoryId', formData.categoryId);
            data.append('level', formData.level);
            data.append('price', formData.price);
            if (formData.discountPrice) {
                data.append('discountPrice', formData.discountPrice);
            }
            if (formData.image) {
                data.append('image', formData.image);
            }

            if (courseId) {
                await updateCourse(courseId, data);
                alert('Course updated successfully!');
                navigate('/admin/courses');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update course.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="course-form-container">
            <h2>Edit Course</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categoryId">Category</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="level">Level</label>
                    <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="discountPrice">Discount Price (Optional)</label>
                    <input
                        type="number"
                        id="discountPrice"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Course Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => navigate('/admin/courses')}>
                    Cancel
                </button>
            </form>

   
            <div className="management-actions">
                <h3>Manage Course Content</h3>
                <button onClick={() => navigate(`/teacher/lessons/${courseId}`)}>
                    Manage Lessons
                </button>
                <button onClick={() => navigate(`/teacher/assessments/${courseId}`)}>
                    Manage Assessments
                </button>
            </div>
     
        </div>
    );
};

export default CourseEdit;