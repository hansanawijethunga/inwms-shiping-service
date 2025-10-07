import { Router } from 'express';
import { createUnloadingOperation, getUnloadingOperationById, getUnloadingOperations, 
    patchUnloadingOperationStatus,    patchUnloadingOperationReset,
    patchUnloadingOperationVehicles, 
    patchUnloadingOperationResources,deleteUnloadingOperationResource} from '../controllers/unloadingOperation.controller.js';

const router = Router();
router.post('/', createUnloadingOperation);
router.get('/:id', getUnloadingOperationById);
router.get('/', getUnloadingOperations);
router.patch('/:id/status', patchUnloadingOperationStatus);
router.patch('/:id/reset', patchUnloadingOperationReset);
router.patch('/:id/vehicles', patchUnloadingOperationVehicles);
router.patch('/:id/resources', patchUnloadingOperationResources);
router.delete('/:id/resources/:resourceId', deleteUnloadingOperationResource);

export default router;