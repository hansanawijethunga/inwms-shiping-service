import { Router } from 'express';
import { createUnloadingOperation, getUnloadingOperationById, getUnloadingOperations } from '../controllers/unloadingOperation.controller.js';

const router = Router();
router.post('/', createUnloadingOperation);
router.get('/:id', getUnloadingOperationById);
router.get('/', getUnloadingOperations);

export default router;