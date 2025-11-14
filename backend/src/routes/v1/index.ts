import { Router } from 'express';
import internalRoutes from './internalRoutes';

const router = Router();

// Internal (authenticated) routes
router.use('/internal', internalRoutes);

export default router;
