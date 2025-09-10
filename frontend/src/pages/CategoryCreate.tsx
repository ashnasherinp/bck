

// frontend/src/pages/CategoryCreate.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/button';
import { createCategory, getCategories } from '../services/CourseServices';
import { Category } from '../interfaces/courseInterface'; 
import '../styles/Login.css';

const CategoryCreate: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '' });
    const [categories, setCategories] = useState<Category[]>([]); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryList = await getCategories(); 
                console.log('[CategoryCreate] Fetched categories:', categoryList);
                setCategories(categoryList); 
            } catch (err: any) {
                console.error('[CategoryCreate] Error fetching categories:', err);
                setError('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ name: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('[CategoryCreate] Submitting category data:', formData);
        try {
            if (categories.some((category) => category.name.toLowerCase() === formData.name.toLowerCase())) {
                setError('Category name already exists');
                return;
            }
            await createCategory(formData);
            alert('Category created successfully!');
            navigate('/admin/dashboard'); 
        } catch (err: any) {
            console.error('[CategoryCreate] Error:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Failed to create category';
            setError(
                errorMessage.includes('duplicate key error')
                    ? 'Category name already exists'
                    : errorMessage
            );
        }
    };

    return (
        <div className="login-container">
            <h2>Create Category</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Category Name"
                    label="Category Name"
                    required
                />
                {error && <div className="error">{error}</div>}
                <Button type="submit">Create Category</Button>
            </form>
            <div className="existing-categories">
                <h3>Existing Categories</h3>
                {categories.length === 0 ? (
                    <p>No categories yet.</p>
                ) : (
                    <ul>
                        {categories.map(category => (
                            <li key={category._id}>{category.name}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CategoryCreate;