import { Router } from 'express';
import * as noteController from '@/api/v1/internal/note/controller';
import * as colorController from '@/api/v1/internal/color/controller';

const router = Router();

// Note routes
router.get('/note', noteController.listHandler);
router.post('/note', noteController.createHandler);
router.get('/note/stats/by-color', colorController.statsHandler);
router.get('/note/:id', noteController.getHandler);
router.put('/note/:id', noteController.updateHandler);
router.delete('/note/:id', noteController.deleteHandler);

// Color routes
router.get('/color', colorController.listHandler);

export default router;
