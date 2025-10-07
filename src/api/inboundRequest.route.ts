import express from 'express';
import type { Request, Response } from 'express';
import { InboundRequestController } from '../controllers/inboundRequest.controller.js';

const router = express.Router();

router.post('/', InboundRequestController.create);
// Update request details
router.patch('/:id/details', InboundRequestController.updateRequestDetails);
// Update products
router.patch('/:id/products', InboundRequestController.updateProduct);
router.patch('/:id/status', InboundRequestController.changeStatus);
router.get('/', InboundRequestController.getAll);
router.get('/:id', InboundRequestController.getById);

export default router;
