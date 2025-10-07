import { ForkliftModel } from '../repositories/forklift.model.js';
import { WorkerModel } from '../repositories/worker.model.js';
/**
 * PATCH /loading-operations/:id/resources
 * Append a resource to the resources array after validation
 */
export async function patchLoadingOperationResources(req: Request, res: Response) {
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

    const mongoose = await import('mongoose');
    doc.resources.push({ _id: new mongoose.Types.ObjectId(resourceId), type });
    await doc.save();
    res.json({ message: 'Resource appended.', resources: doc.resources });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
export async function patchLoadingOperationVehicles(req: Request, res: Response) {
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
export async function patchLoadingOperationReset(req: Request, res: Response) {
  try {
    const doc = await service.getById(String(req.params.id));
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
import type { Request, Response } from 'express';
import { LoadingOperationService } from '../services/loadingOperation.service.js';

const service = new LoadingOperationService();

export async function createLoadingOperation(req: Request, res: Response) {
  try {
    const doc = await service.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function getLoadingOperationById(req: Request, res: Response) {
  try {
    const doc = await service.getById(String(req.params.id));
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function getLoadingOperations(req: Request, res: Response) {
  try {
    const docs = await service.getAll(req.query);
    res.json(docs);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

import { LoadingOperationStateContext } from '../services/loadingOperation.state.js';

export async function patchLoadingOperationStatus(req: Request, res: Response) {
  try {
    const doc = await service.getById(String(req.params.id));
    if (!doc) return res.status(404).json({ error: 'Not found' });
    const stateContext = new LoadingOperationStateContext(doc.status);
    const result = await stateContext.request(doc);
    if (!result.updated) {
      return res.status(400).json({ error: result.message });
    }
    res.json({ message: result.message, operation: doc });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}