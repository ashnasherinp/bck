import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMaterialsByLesson, createMaterial, updateMaterial, deleteMaterial } from '../services/materialServices';
import Input from '../components/common/Input';
import Button from '../components/common/button';
import '../styles/Dashboard.css';

const MaterialManagement: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const [materials, setMaterials] = useState<any[]>([]);
    const [newMaterial, setNewMaterial] = useState<{ title: string; file: File | null; type: string }>({ title: '', file: null, type: 'pdf' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            if (!lessonId) return;
            try {
                const data = await getMaterialsByLesson(lessonId);
                setMaterials(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch materials.');
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, [lessonId]);

    const handleCreateMaterial = async () => {
        if (!lessonId || !newMaterial.file || !newMaterial.title) {
            setError('Please provide a title and file for the material.');
            return;
        }
        try {
            const materialData = new FormData();
            materialData.append('title', newMaterial.title);
            materialData.append('material', newMaterial.file);
            materialData.append('type', newMaterial.type);
            materialData.append('lessonId', lessonId);
            const createdMaterial = await createMaterial(lessonId, materialData);
            setMaterials([...materials, createdMaterial]);
            setNewMaterial({ title: '', file: null, type: 'pdf' });
            alert('Material created successfully!');
        } catch (err: any) {
            setError(err.message || 'Failed to create material.');
        }
    };

    const handleDeleteMaterial = async (materialId: string) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await deleteMaterial(materialId);
                setMaterials(materials.filter(m => m._id !== materialId));
                alert('Material deleted successfully!');
            } catch (err: any) {
                setError(err.message || 'Failed to delete material.');
            }
        }
    };

    if (loading) return <div className="loading-message">Loading Materials...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-layout">
            <div className="dashboard-content">
                <h2>Manage Materials</h2>
                <div>
                    <h3>Create New Material</h3>
                    <Input
                        type="text"
                        name="title"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                        placeholder="Material Title"
                        label="Title"
                        required
                    />
                    <Input
                        type="file"
                        name="material"
                        onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files![0] })}
                        label="Material File"
                        accept="image/*,application/pdf,video/*"
                        required
                    />
                    <select
                        value={newMaterial.type}
                        onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                    >
                        <option value="pdf">PDF</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                    <Button onClick={handleCreateMaterial} disabled={!newMaterial.title || !newMaterial.file}>Create Material</Button>
                </div>
                <h3>Existing Materials</h3>
                {materials.length === 0 ? (
                    <p>No materials found.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map(material => (
                                <tr key={material._id}>
                                    <td>{material.title}</td>
                                    <td>{material.type}</td>
                                    <td>
                                        <a href={material.materialUrl} target="_blank" rel="noopener noreferrer">View</a>
                                        <Button onClick={() => handleDeleteMaterial(material._id)} className="btn-delete">Delete</Button>
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

export default MaterialManagement;