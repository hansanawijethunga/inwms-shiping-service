import express from 'express';
import type { Request, Response } from 'express';
import { Database } from '../config/database.js';

export class HealthController {
  public static async healthCheck(req: Request, res: Response): Promise<void> {
    try {
  // Check DB connection state using Singleton
  await Database.getInstance().connect();
  res.status(200).json({ status: 'ok', db: 'connected' });
    } catch (error) {
      res.status(500).json({ status: 'error', db: 'disconnected', error: (error as Error).message });
    }
  }
}
