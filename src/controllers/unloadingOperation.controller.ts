import { ForkliftModel } from '../repositories/forklift.model.js';
import { WorkerModel } from '../repositories/worker.model.js';
/**
 * PATCH /unloading-operations/:id/resources
 * Append a resource to the resources array after validation
 */
export async function patchUnloadingOperationResources(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const doc = await service.getById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const { type, resourceId } = req.body;
    if (!['forklift', 'worker'].includes(type) || typeof resourceId !== 'string') {
      return res.status(400).json({ error: 'type must be "forklift" or "worker" and resourceId must be a string.' });
    }

    let exists = false;
    if (type === 'forklift') {
      exists = !!(await ForkliftModel.findById(resourceId));
    } else if (type === 'worker') {
      exists = !!(await WorkerModel.findById(resourceId));
    }
    if (!exists) {
      return res.status(400).json({ error: `Resource of type ${type} with id ${resourceId} does not exist.` });
    }

  // Prevent duplicate resource
  const alreadyExists = doc.resources.some(r => r.type === type && r._id.toString() === resourceId);
  if (alreadyExists) {
    return res.status(400).json({ error: 'Resource already exists in operation.' });
  }

  // Cast resourceId to ObjectId for type safety
  const mongoose = await import('mongoose');
  doc.resources.push({ _id: new mongoose.Types.ObjectId(resourceId), type });
  await doc.save();
  res.json({ message: 'Resource appended.', resources: doc.resources });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
// controllers/unloadingOperation.controller.ts
import type { Request, Response } from 'express';
import { UnloadingOperationService } from '../services/unloadingOperation.service.js';
import { UnloadingOperationStateContext } from '../services/unloadingOperation.state.js';

const service = new UnloadingOperationService();

/**
 * PATCH /unloading-operations/:id/vehicles
 * Replace vehicles with an array of registration numbers (strings)
 */
export async function patchUnloadingOperationVehicles(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const doc = await service.getById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const vehicles = req.body;
    if (
      !Array.isArray(vehicles) ||
      !vehicles.every(v => typeof v === 'string' && v.trim().length > 0)
    ) {
      return res.status(400).json({
        error: 'Payload must be an array of non-empty registration numbers (strings).',
      });
    }

    // normalise a bit: trim + dedupe while preserving order
    const seen = new Set<string>();
    doc.vehicles = vehicles
      .map(v => v.trim())
      .filter(v => (seen.has(v) ? false : (seen.add(v), true)));

    await doc.save();
    res.json({ message: 'Vehicles updated.', vehicles: doc.vehicles });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

/**
 * POST /unloading-operations
 */
export async function createUnloadingOperation(req: Request, res: Response) {
  try {
    const doc = await service.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

/**
 * GET /unloading-operations/:id
 */
export async function getUnloadingOperationById(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const doc = await service.getById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

/**
 * GET /unloading-operations
 */
export async function getUnloadingOperations(req: Request, res: Response) {
  try {
    const docs = await service.getAll(req.query);
    res.json(docs);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

/**
 * PATCH /unloading-operations/:id/status
 * Advance status using the State pattern
 */
export async function patchUnloadingOperationStatus(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const doc = await service.getById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const stateContext = new UnloadingOperationStateContext(doc.status);
    const result = await stateContext.request(doc);

    if (!result.updated) {
      return res.status(400).json({ error: result.message });
    }

    // persist any status/time changes performed by state handler
    await doc.save();
    res.json({ message: result.message, operation: doc });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

/**
 * PATCH /unloading-operations/:id/reset
 */
export async function patchUnloadingOperationReset(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const doc = await service.getById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    doc.startTime = '';
    doc.endTime = '';
    doc.status = 'Initialized';
    await doc.save();

    res.json({ message: 'Operation reset to Initialized.', operation: doc });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
