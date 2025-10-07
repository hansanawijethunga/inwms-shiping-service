import { Router } from 'express';
import { createLoadingOperation, getLoadingOperationById, getLoadingOperations } from '../controllers/loadingOperation.controller.js';

const router = Router();
router.post('/', createLoadingOperation);
router.get('/:id', getLoadingOperationById);
router.get('/', getLoadingOperations);

export default router;