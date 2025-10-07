import type { Request, Response } from 'express';
import { UnloadingOperationService } from '../services/unloadingOperation.service.js';

const service = new UnloadingOperationService();

export async function createUnloadingOperation(req: Request, res: Response) {
  try {
    const doc = await service.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function getUnloadingOperationById(req: Request, res: Response) {
  try {
    const doc = await service.getById(String(req.params.id));
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function getUnloadingOperations(req: Request, res: Response) {
  try {
    const docs = await service.getAll(req.query);
    res.json(docs);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}