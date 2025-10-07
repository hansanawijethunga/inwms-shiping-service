import express from 'express';
import type { Request, Response } from 'express';
import { ResourceController } from '../controllers/resource.controller.js';

const router = express.Router();


// Forklift endpoints


// Unified resource endpoints, type passed as query param
router.post('/:type', ResourceController.create);
router.put('/:type/:id', ResourceController.update);
router.delete('/:type/:id', ResourceController.delete);
router.get('/:type', ResourceController.getAll);
router.get('/:type/:id', ResourceController.getById);

export default router;
