import express from 'express';
import type { Request, Response } from 'express';
import { ResourceService } from '../services/resource.service.js';

const resourceService = new ResourceService();

export class ResourceController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type as string;
      const data = req.body;
      if (!type) {
        res.status(400).json({ error: 'Resource type is required' });
        return;
      }
  const resource = await resourceService.create(type as 'forklift' | 'worker', data);
      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const type = req.params.type as string;
      const data = req.body;
      if (!type) {
        res.status(400).json({ error: 'Resource type is required' });
        return;
      }
  const resource = await resourceService.update(type as 'forklift' | 'worker', id, data);
      if (!resource) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }
      res.json(resource);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const type = req.params.type as string;
      if (!type) {
        res.status(400).json({ error: 'Resource type is required' });
        return;
      }
      const success = await resourceService.delete(type as 'forklift' | 'worker', id);
      if (!success) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type as string;
      const filter = { ...req.query };
      if (!type) {
        res.status(400).json({ error: 'Resource type is required' });
        return;
      }
      const resources = await resourceService.getAll(type as 'forklift' | 'worker', filter);
      res.json(resources);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const type = req.params.type as string;
      if (!type) {
        res.status(400).json({ error: 'Resource type is required' });
        return;
      }
      const resource = await resourceService.getById(type as 'forklift' | 'worker', id);
      if (!resource) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }
      res.json(resource);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
