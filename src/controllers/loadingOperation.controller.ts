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