import { Router } from 'express';
import { createUnloadingOperation, getUnloadingOperationById, getUnloadingOperations, patchUnloadingOperationStatus,patchUnloadingOperationReset } from '../controllers/unloadingOperation.controller.js';

const router = Router();
router.post('/', createUnloadingOperation);
router.get('/:id', getUnloadingOperationById);
router.get('/', getUnloadingOperations);
router.patch('/:id/status', patchUnloadingOperationStatus);
router.patch('/:id/reset', patchUnloadingOperationReset);

export default router;