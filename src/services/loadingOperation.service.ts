import { LoadingOperationModel } from '../repositories/loadingOperation.model.js';
import type { LoadingOperationDoc } from '../repositories/loadingOperation.model.js';
import { LoadingOperation } from '../domain/operation/LoadingOperation.js';

export class LoadingOperationService {
  async create(data: Partial<LoadingOperation>): Promise<LoadingOperationDoc> {
    // Generate operationId
    const last = await LoadingOperationModel.findOne({}, {}, { sort: { operationId: -1 } });
    let nextId = 1;
    if (last && typeof last.operationId === 'string') {
      const match = last.operationId.match(/OPL(\d+)/);
      if (match) {
        nextId = parseInt(match[1] || '0', 10) + 1;
      }
    }
    const operationId = `OPL${nextId.toString().padStart(3, '0')}`;
    const doc = await LoadingOperationModel.create({
      operationId,
      date: data.date ?? new Date(),
      status: 'Initialized',
    });
    return doc;
  }

  async getById(id: string): Promise<LoadingOperationDoc | null> {
    return await LoadingOperationModel.findOne({ operationId: id });
  }

  async getAll(filter: Record<string, any> = {}): Promise<LoadingOperationDoc[]> {
    return await LoadingOperationModel.find(filter);
  }
}