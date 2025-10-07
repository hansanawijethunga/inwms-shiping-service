import express from 'express';
import type { Request, Response } from 'express';
import { OutboundRequestController } from '../controllers/outboundRequest.controller.js';

const router = express.Router();

router.post('/', OutboundRequestController.create);
// Update request details
router.patch('/:id/details', OutboundRequestController.updateRequestDetails);
// Update products
router.patch('/:id/products', OutboundRequestController.updateProduct);
router.patch('/:id/status', OutboundRequestController.changeStatus);
router.get('/', OutboundRequestController.getAll);
router.get('/:id', OutboundRequestController.getById);

export default router;
