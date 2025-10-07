import type { Request, Response } from 'express';
import { UnloadingOperationService } from '../services/unloadingOperation.service.js';
import { UnloadingOperationStateContext } from '../services/unloadingOperation.state.js';

const service = new UnloadingOperationService();

/**
 * Create new Unloading Operation
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
 * Get Unloading Operation by ID
 */
export async function getUnloadingOperationById(req: Request, res: Response) {
  try {
    const doc = await service.getById(String(req.params.id));
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

/**
 * Get all Unloading Operations
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
 * Patch Unloading Operation Status (State Pattern)
 */
export async function patchUnloadingOperationStatus(req: Request, res: Response) {
  try {
    const doc = await service.getById(String(req.params.id));
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const stateContext = new UnloadingOperationStateContext(doc.status);
    const result = await stateContext.request(doc);

    if (!result.updated) {
      return res.status(400).json({ error: result.message });
    }

    res.json({ message: result.message, operation: doc });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

/**
 * Reset Unloading Operation
 */
export async function patchUnloadingOperationReset(req: Request, res: Response) {
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
