

// frontend/src/components/MaterialManager.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMaterialsByLesson, createMaterial, updateMaterial, deleteMaterial } from '../services/materialServices';
import { Material, MaterialUpdateData } from '../interfaces/materialInterface';
import Button from '../components/common/button';
import Modal from '../components/common/Modal';
import '../styles/CourseList.css';


const getTypeFromUrlOrFile = (file: File | null, url: string): string => {
    if (file) {
        const type = file.type;
        if (type.startsWith('image/')) return 'image';
        if (type.startsWith('video/')) return 'video';
        if (type.startsWith('audio/')) return 'audio';
        if (type === 'application/pdf') return 'pdf';
        if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return 'ppt';
    } else if (url) {
        if (/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) return 'image';
        if (/\.(mp4|mov|avi|webm)$/i.test(url)) return 'video';
        if (/\.(mp3|wav|ogg)$/i.test(url)) return 'audio';
        if (/\.(pdf)$/i.test(url)) return 'pdf';
        if (/\.(ppt|pptx)$/i.test(url)) return 'ppt';
        if (/^(ftp|http|https):\/\/[^ "]+$/.test(url)) return 'url';
    }
    return 'text';
};

const MaterialManager: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState<Partial<Material> | null>(null);
    const [formState, setFormState] = useState<{
        title: string;
        content: string;
        file: File | null;
        type: string;
    }>({
        title: '',
        content: '',
        file: null,
        type: '',
    });

    useEffect(() => {
        const fetchMaterials = async () => {
            if (!lessonId) return;
            setLoading(true);
            try {
                const fetchedMaterials = await getMaterialsByLesson(lessonId);
                setMaterials(fetchedMaterials);
            } catch (err: any) {
                setError('Failed to fetch materials.');
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, [lessonId]);

    const openCreateModal = () => {
        setCurrentMaterial(null);
        setFormState({ title: '', content: '', file: null, type: '' });
        setIsModalOpen(true);
    };

   const openEditModal = (material: Material) => {
    setCurrentMaterial(material);
    setFormState({
        title: material.title,
        content: '', 
        file: null,
        type: material.type || '',
    });
    setIsModalOpen(true);
};
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'content') {
            setFormState({ 
                ...formState, 
                content: value, 
                file: null,
                type: getTypeFromUrlOrFile(null, value)
            });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFormState({
                ...formState,
                file: selectedFile,
                content: '',
                type: getTypeFromUrlOrFile(selectedFile, '')
            });
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!lessonId) {
                setError('Lesson ID is missing.');
                return;
            }

            let dataToSend: MaterialUpdateData;


            if (formState.file) {
                const formData = new FormData();
                formData.append('title', formState.title);
                formData.append('type', formState.type);
                formData.append('material', formState.file);
                dataToSend = formData;
            }
    
            else if (formState.content) {
                dataToSend = {
                    title: formState.title,
                    materialUrl: formState.content,
                    type: formState.type,
                };
            }
        
            else if (currentMaterial) {
                dataToSend = {
                    title: formState.title,
                    materialUrl: currentMaterial.content || '',
                    type: currentMaterial.type || '',
                };
            }
            else {
                setError('Please provide a file or a URL.');
                return;
            }

            if (currentMaterial?._id) {
                await updateMaterial(currentMaterial._id, dataToSend);
            } else {
                await createMaterial(lessonId, dataToSend as FormData);
            }

            setIsModalOpen(false);
            const updatedMaterials = await getMaterialsByLesson(lessonId);
            setMaterials(updatedMaterials);
        } catch (err: any) {
            setError('Failed to save material.');
            console.error('Submission Error:', err);
        }
    };

    const handleDelete = async (materialId: string) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await deleteMaterial(materialId);
                setMaterials(materials.filter(m => m._id !== materialId));
            } catch (err: any) {
                setError('Failed to delete material.');
            }
        }
    };

    const isImage = (url: string) => {
        return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="manager-container">
            <h2>Manage Materials for Lesson {lessonId}</h2>
            <Button onClick={openCreateModal}>Add New Material</Button>
            <div className="items-list">
                {materials.length === 0 ? (
                    <p>No materials found.</p>
                ) : (
                    materials.map(material => (
                        <div key={material._id} className="item-card">
                            <h3>{material.title}</h3>
                            {isImage(material.content) ? (
                                <img src={material.content} alt={material.title} style={{ maxWidth: '100%', height: 'auto' }} />
                            ) : (
                                <p><a href={material.content} target="_blank" rel="noopener noreferrer">View Material</a></p>
                            )}
                            <div className="item-actions">
                                <Button onClick={() => openEditModal(material)}>Edit</Button>
                                <Button onClick={() => handleDelete(material._id)} className="secondary-button">Delete</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h3>{currentMaterial ? 'Edit Material' : 'Add New Material'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title" value={formState.title} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                            <label>Material URL</label>
                            <input
                                type="text"
                                name="content"
                                value={formState.content}
                                onChange={handleFormChange}
                                disabled={!!formState.file}
                            />
                        </div>
                        <div className="form-group">
                            <label>Or choose a file:</label>
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                disabled={!!formState.content}
                            />
                        </div>
                        <Button type="submit">Save</Button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default MaterialManager;