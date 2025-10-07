import express from 'express';
import type { Request, Response } from 'express';
import { ResourceController } from '../controllers/resource.controller.js';
import { jwtAuth, roleAuth } from '../middleware/jwtAuth.js';

const router = express.Router();


// Forklift endpoints


// Unified resource endpoints, type passed as query param
router.post('/:type', jwtAuth(), roleAuth(), ResourceController.create);
router.put('/:type/:id', jwtAuth(), roleAuth(), ResourceController.update);
router.delete('/:type/:id', jwtAuth(), roleAuth(), ResourceController.delete);
router.get('/:type', jwtAuth(), ResourceController.getAll);
router.get('/:type/:id', jwtAuth(), ResourceController.getById);

export default router;
