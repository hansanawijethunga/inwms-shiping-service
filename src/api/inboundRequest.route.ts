import express from 'express';
import type { Request, Response } from 'express';
import { InboundRequestController } from '../controllers/inboundRequest.controller.js';
import { jwtAuth, roleAuth } from '../middleware/jwtAuth.js';

const router = express.Router();

router.post('/', jwtAuth(), roleAuth(), InboundRequestController.create);
// Update request details
router.patch('/:id/details', jwtAuth(), roleAuth(), InboundRequestController.updateRequestDetails);
// Update products
router.patch('/:id/products', jwtAuth(), roleAuth(), InboundRequestController.updateProduct);
router.patch('/:id/status', jwtAuth(), roleAuth(), InboundRequestController.changeStatus);
router.get('/', jwtAuth(), InboundRequestController.getAll);
router.get('/:id', jwtAuth(), InboundRequestController.getById);

export default router;
