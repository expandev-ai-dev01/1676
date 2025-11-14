import { Router } from 'express';
import * as noteController from '@/api/v1/internal/note/controller';

const router = Router();

// Note routes
router.get('/note', noteController.listHandler);
router.post('/note', noteController.createHandler);
router.get('/note/:id', noteController.getHandler);
router.put('/note/:id', noteController.updateHandler);
router.delete('/note/:id', noteController.deleteHandler);

export default router;
