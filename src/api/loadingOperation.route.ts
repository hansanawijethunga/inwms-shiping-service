import { Router } from 'express';
import { createLoadingOperation, getLoadingOperationById, getLoadingOperations, patchLoadingOperationStatus,patchLoadingOperationReset } from '../controllers/loadingOperation.controller.js';

const router = Router();
router.post('/', createLoadingOperation);
router.get('/:id', getLoadingOperationById);
router.get('/', getLoadingOperations);
router.patch('/:id/status', patchLoadingOperationStatus);
router.patch('/:id/reset', patchLoadingOperationReset);

export default router;