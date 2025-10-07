import type { Request, Response } from 'express';
import { OutboundRequestService } from '../services/outboundRequest.service.js';

const outboundRequestService = new OutboundRequestService();

export class OutboundRequestController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const outboundRequest = await outboundRequestService.create(req.body);
      res.status(201).json(outboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async updateRequestDetails(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      // Defensive: If company is present, ensure it has companyId and name, but allow missing company
      if (
        req.body.company !== undefined &&
        (req.body.company === null || typeof req.body.company !== 'object' ||
          typeof req.body.company.companyId !== 'string' || typeof req.body.company.name !== 'string')
      ) {
        res.status(400).json({ error: 'Malformed company object: companyId and name required' });
        return;
      }
      const outboundRequest = await outboundRequestService.updateRequestDetails(id, req.body);
      if (!outboundRequest) {
        res.status(404).json({ error: 'OutboundRequest not found' });
        return;
      }
      res.json(outboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const products = Array.isArray(req.body) ? req.body : req.body.products;
      const outboundRequest = await outboundRequestService.updateProduct(id, products);
      if (!outboundRequest) {
        res.status(404).json({ error: 'OutboundRequest not found' });
        return;
      }
      res.json(outboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const { status } = req.body;
      const outboundRequest = await outboundRequestService.changeStatus(id, status);
      if (!outboundRequest) {
        res.status(404).json({ error: 'OutboundRequest not found' });
        return;
      }
      res.json(outboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const outboundRequests = await outboundRequestService.getAll(req.query);
      res.json(outboundRequests);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id ?? '';
      const outboundRequest = await outboundRequestService.getById(id);
      if (!outboundRequest) {
        res.status(404).json({ error: 'OutboundRequest not found' });
        return;
      }
      res.json(outboundRequest);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
