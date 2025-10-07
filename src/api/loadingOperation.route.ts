import { Router } from 'express';
import { createLoadingOperation, getLoadingOperationById, getLoadingOperations,
    patchLoadingOperationStatus,patchLoadingOperationReset,patchLoadingOperationVehicles, 
    patchLoadingOperationResources } from '../controllers/loadingOperation.controller.js';

const router = Router();
router.post('/', createLoadingOperation);
router.get('/:id', getLoadingOperationById);
router.get('/', getLoadingOperations);
router.patch('/:id/status', patchLoadingOperationStatus);
router.patch('/:id/reset', patchLoadingOperationReset);
router.patch('/:id/vehicles', patchLoadingOperationVehicles);
router.patch('/:id/resources', patchLoadingOperationResources);

export default router;