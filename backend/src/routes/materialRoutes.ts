// backend/src/routes/materialRoutes.ts
import express from 'express';
import { asyncMiddleware } from '../utils/middleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import {
    createMaterial,
    getMaterialsByLesson,
    updateMaterial,
    deleteMaterial,
} from '../controllers/materialController';
import { uploadMemory } from '../middleware/multterMIddleware'; 

const router = express.Router();

router.get('/lesson/:lessonId', asyncMiddleware(authMiddleware), asyncMiddleware(getMaterialsByLesson));
router.post('/', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), uploadMemory.single('material'), asyncMiddleware(createMaterial));
router.patch('/:materialId', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), uploadMemory.single('material'), asyncMiddleware(updateMaterial));
router.delete('/:materialId', asyncMiddleware(authMiddleware), asyncMiddleware(adminMiddleware), asyncMiddleware(deleteMaterial));

export default router;