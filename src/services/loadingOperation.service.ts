import { LoadingOperationModel } from '../repositories/loadingOperation.model.js';
import type { LoadingOperationDoc } from '../repositories/loadingOperation.model.js';
import { LoadingOperation } from '../domain/operation/LoadingOperation.js';

export class LoadingOperationService {
  async create(data: Partial<LoadingOperation> & { outboundRequest: string | import('mongoose').Types.ObjectId }): Promise<LoadingOperationDoc> {
    // Validate outboundRequest presence
    if (!data.outboundRequest) {
      throw new Error('outboundRequest is required');
    }

    // Check if outboundRequest exists
    const OutboundRequestModel = await import('../repositories/outboundRequest.model.js').then(m => m.OutboundRequestModel);
    const outboundExists = await OutboundRequestModel.exists({ _id: data.outboundRequest });
    if (!outboundExists) {
      throw new Error('OutboundRequest with the given id does not exist');
    }

    // Ensure only one LoadingOperation per outboundRequest
    const existing = await LoadingOperationModel.findOne({ outboundRequest: data.outboundRequest });
    if (existing) {
      throw new Error('A LoadingOperation for this outboundRequest already exists');
    }

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
      date: new Date(),
      status: 'Initialized',
      outboundRequest: data.outboundRequest,
      notes: data.notes,
      resources: data.resources || [],
    });
    return doc;
  }

  async getById(id: string): Promise<LoadingOperationDoc | null> {
    return await LoadingOperationModel.findById(id);
  }

  async getAll(filter: Record<string, any> = {}): Promise<LoadingOperationDoc[]> {
    return await LoadingOperationModel.find(filter);
  }
}