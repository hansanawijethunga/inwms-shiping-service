
import express from 'express';
import type { Request, Response } from 'express';
import { OutboundRequestController } from '../controllers/outboundRequest.controller.js';
import { jwtAuth, roleAuth } from '../middleware/jwtAuth.js';


const router = express.Router();

router.post('/', jwtAuth(), roleAuth(), OutboundRequestController.create);
// Update request details
router.patch('/:id/details', jwtAuth(), roleAuth(), OutboundRequestController.updateRequestDetails);
// Update products
router.patch('/:id/products', jwtAuth(), roleAuth(), OutboundRequestController.updateProduct);
router.patch('/:id/status', jwtAuth(), roleAuth(), OutboundRequestController.changeStatus);
router.get('/', OutboundRequestController.getAll);
router.get('/:id', OutboundRequestController.getById);

export default router;
