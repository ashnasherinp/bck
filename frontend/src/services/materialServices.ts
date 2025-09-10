
// // frontend/src/services/materialServices.ts
// import api from './api';

// export const createMaterial = async (lessonId: string, materialData: FormData): Promise<any> => {
//     try {
//         console.log('[materialServices] FormData for createMaterial:', Array.from(materialData.entries()));
//         // Note: 'materialRoutes.ts' uses a different base URL
//         const response = await api.post('/materials', materialData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         console.log('[materialServices] Material created:', response.data);
//         return response.data;
//     } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Failed to create material';
//         console.error('[materialServices] Error creating material:', error.response?.data || error.message);
//         throw new Error(errorMessage);
//     }
// };

// export const getMaterialsByLesson = async (lessonId: string): Promise<any[]> => {
//     try {
//         const response = await api.get(`/materials/lesson/${lessonId}`);
//         console.log('[materialServices] Materials fetched:', response.data);
//         return response.data;
//     } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Failed to fetch materials';
//         console.error('[materialServices] Error fetching materials:', error.response?.data || error.message);
//         throw new Error(errorMessage);
//     }
// };

// export const updateMaterial = async (materialId: string, materialData: FormData): Promise<any> => {
//     try {
//         console.log('[materialServices] FormData for updateMaterial:', Array.from(materialData.entries()));
//         const response = await api.patch(`/materials/${materialId}`, materialData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         console.log('[materialServices] Material updated:', response.data);
//         return response.data;
//     } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Failed to update material';
//         console.error('[materialServices] Error updating material:', error.response?.data || error.message);
//         throw new Error(errorMessage);
//     }
// };

// export const deleteMaterial = async (materialId: string): Promise<void> => {
//     try {
//         await api.delete(`/materials/${materialId}`);
//         console.log('[materialServices] Material deleted:', materialId);
//     } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Failed to delete material';
//         console.error('[materialServices] Error deleting material:', error.response?.data || error.message);
//         throw new Error(errorMessage);
//     }
// };


// frontend/src/services/materialServices.ts
import api from './api';
type MaterialUpdateData = FormData | {
    title: string;
    materialUrl?: string;
};
export const createMaterial = async (lessonId: string, materialData: FormData): Promise<any> => {
    try {
        console.log('[materialServices] FormData for createMaterial:', Array.from(materialData.entries()));

        const response = await api.post('/materials', materialData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('[materialServices] Material created:', response.data);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to create material';
        console.error('[materialServices] Error creating material:', error.response?.data || error.message);
        throw new Error(errorMessage);
    }
};

export const getMaterialsByLesson = async (lessonId: string): Promise<any[]> => {
    try {
        const response = await api.get(`/materials/lesson/${lessonId}`);
        console.log('[materialServices] Materials fetched:', response.data);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch materials';
        console.error('[materialServices] Error fetching materials:', error.response?.data || error.message);
        throw new Error(errorMessage);
    }
};

export const updateMaterial = async (materialId: string, materialData: MaterialUpdateData): Promise<any> => {
    try {
        if (materialData instanceof FormData) {
            const response = await api.patch(`/materials/${materialId}`, materialData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            const response = await api.patch(`/materials/${materialId}`, materialData);
            return response.data;
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to update material';
        console.error('[materialServices] Error updating material:', error.response?.data || error.message);
        throw new Error(errorMessage);
    }
};

export const deleteMaterial = async (materialId: string): Promise<void> => {
    try {
        await api.delete(`/materials/${materialId}`);
        console.log('[materialServices] Material deleted:', materialId);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to delete material';
        console.error('[materialServices] Error deleting material:', error.response?.data || error.message);
        throw new Error(errorMessage);
    }
};