
import type { Request, Response } from 'express';
import { InboundRequestService } from '../services/inboundRequest.service.js';

const inboundRequestService = new InboundRequestService();

export class InboundRequestController {
  static async updateRequestDetails(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const inboundRequest = await inboundRequestService.updateRequestDetails(id, req.body);
      if (!inboundRequest) {
        res.status(404).json({ error: 'InboundRequest not found' });
        return;
      }
      res.json(inboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const inboundRequest = await inboundRequestService.updateProduct(id, req.body.products);
      if (!inboundRequest) {
        res.status(404).json({ error: 'InboundRequest not found' });
        return;
      }
      res.json(inboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const inboundRequest = await inboundRequestService.create(req.body);
      res.status(201).json(inboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }


  static async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const { status } = req.body;
      const inboundRequest = await inboundRequestService.changeStatus(id, status);
      if (!inboundRequest) {
        res.status(404).json({ error: 'InboundRequest not found' });
        return;
      }
      res.json(inboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const inboundRequests = await inboundRequestService.getAll(req.query);
      res.json(inboundRequests);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const inboundRequest = await inboundRequestService.getById(id);
      if (!inboundRequest) {
        res.status(404).json({ error: 'InboundRequest not found' });
        return;
      }
      res.json(inboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
