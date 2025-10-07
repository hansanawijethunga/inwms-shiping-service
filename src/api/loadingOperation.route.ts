import { Router } from 'express';
import { createLoadingOperation, getLoadingOperationById, getLoadingOperations,
    patchLoadingOperationStatus,patchLoadingOperationReset,patchLoadingOperationVehicles, 
    patchLoadingOperationResources,deleteLoadingOperationResource } from '../controllers/loadingOperation.controller.js';
import { jwtAuth, roleAuth } from '../middleware/jwtAuth.js';

const router = Router();
router.post('/', jwtAuth(), roleAuth(), createLoadingOperation);
router.get('/:id', getLoadingOperationById);
router.get('/', getLoadingOperations);
router.patch('/:id/status', jwtAuth(), roleAuth(), patchLoadingOperationStatus);
router.patch('/:id/reset', jwtAuth(), roleAuth(), patchLoadingOperationReset);
router.patch('/:id/vehicles', jwtAuth(), roleAuth(), patchLoadingOperationVehicles);
router.patch('/:id/resources', jwtAuth(), roleAuth(), patchLoadingOperationResources);
router.delete('/:id/resources/:resourceId', jwtAuth(), roleAuth(), deleteLoadingOperationResource);

export default router;