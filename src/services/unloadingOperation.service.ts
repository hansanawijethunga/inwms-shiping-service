import { UnloadingOperationModel } from '../repositories/unloadingOperation.model.js';
import type { UnloadingOperationDoc } from '../repositories/unloadingOperation.model.js';
import { UnloadingOperation } from '../domain/operation/UnloadingOperation.js';

export class UnloadingOperationService {
  async create(data: Partial<UnloadingOperation>): Promise<UnloadingOperationDoc> {
    // Generate operationId
    const last = await UnloadingOperationModel.findOne({}, {}, { sort: { operationId: -1 } });
    let nextId = 1;
    if (last && typeof last.operationId === 'string') {
      const match = last.operationId.match(/OPU(\d+)/);
      if (match) {
        nextId = parseInt(match[1] || '0', 10) + 1;
      }
    }
    const operationId = `OPU${nextId.toString().padStart(3, '0')}`;
    const doc = await UnloadingOperationModel.create({
      operationId,
      date: data.date ?? new Date(),
      status: 'Initialized',
    });
    return doc;
  }

  async getById(id: string): Promise<UnloadingOperationDoc | null> {
    return await UnloadingOperationModel.findOne({ operationId: id });
  }

  async getAll(filter: Record<string, any> = {}): Promise<UnloadingOperationDoc[]> {
    return await UnloadingOperationModel.find(filter);
  }
}