import { UnloadingOperationModel } from '../repositories/unloadingOperation.model.js';
import type { UnloadingOperationDoc } from '../repositories/unloadingOperation.model.js';
import { UnloadingOperation } from '../domain/operation/UnloadingOperation.js';

export class UnloadingOperationService {
  async create(data: Partial<UnloadingOperation> & { inboundRequest: string | import('mongoose').Types.ObjectId }): Promise<UnloadingOperationDoc> {
    // Validate inboundRequest presence
    if (!data.inboundRequest) {
      throw new Error('inboundRequest is required');
    }

    // Check if inboundRequest exists
    const InboundRequestModel = await import('../repositories/inboundRequest.model.js').then(m => m.InboundRequestModel);
    const inboundExists = await InboundRequestModel.exists({ _id: data.inboundRequest });
    if (!inboundExists) {
      throw new Error('InboundRequest with the given id does not exist');
    }

    // Ensure only one UnloadingOperation per inboundRequest
    const existing = await UnloadingOperationModel.findOne({ inboundRequest: data.inboundRequest });
    if (existing) {
      throw new Error('An UnloadingOperation for this inboundRequest already exists');
    }

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
      date: new Date(),
      status: 'Initialized',
      inboundRequest: data.inboundRequest,
      notes: data.notes,
      resources: data.resources || [],
    });
    return doc;
  }

  async getById(id: string): Promise<UnloadingOperationDoc | null> {
    return await UnloadingOperationModel.findById(id);
  }

  async getAll(filter: Record<string, any> = {}): Promise<UnloadingOperationDoc[]> {
    return await UnloadingOperationModel.find(filter);
  }
}