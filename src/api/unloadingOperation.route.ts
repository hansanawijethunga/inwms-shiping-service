import { Router } from 'express';
import { createUnloadingOperation, getUnloadingOperationById, getUnloadingOperations, 
    patchUnloadingOperationStatus,    patchUnloadingOperationReset,
    patchUnloadingOperationVehicles, 
    patchUnloadingOperationResources,deleteUnloadingOperationResource} from '../controllers/unloadingOperation.controller.js';
import { jwtAuth, roleAuth } from '../middleware/jwtAuth.js';

const router = Router();
router.post('/', jwtAuth(), roleAuth(), createUnloadingOperation);
router.get('/:id', getUnloadingOperationById);
router.get('/', getUnloadingOperations);
router.patch('/:id/status', jwtAuth(), roleAuth(), patchUnloadingOperationStatus);
router.patch('/:id/reset', jwtAuth(), roleAuth(), patchUnloadingOperationReset);
router.patch('/:id/vehicles', jwtAuth(), roleAuth(), patchUnloadingOperationVehicles);
router.patch('/:id/resources', jwtAuth(), roleAuth(), patchUnloadingOperationResources);
router.delete('/:id/resources/:resourceId', jwtAuth(), roleAuth(), deleteUnloadingOperationResource);

export default router;