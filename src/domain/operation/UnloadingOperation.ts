import { Operation } from './Operation.js';
import type { InboundRequest } from '../request/InboundRequest.js';
import type { Resource } from '../resource/Resource.js';
export type OperationStatus = 'Initialized' | 'Started' | 'Completed';


 export interface UnloadingOperationParams {
  operationId: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  resources?: Resource[];
  vehicles?: string[];
  status?: OperationStatus;
  inboundRequest?: InboundRequest;
  operatorId?: string;
  notes?: string;
}

export class UnloadingOperation extends Operation {

  inboundRequest?: InboundRequest | undefined;
 

  constructor(params: UnloadingOperationParams) {
    super({
      date: params.date,
      startTime: params.startTime ?? '',
      endTime: params.endTime ?? '',
      resources: params.resources ?? [],
      vehicles: params.vehicles ?? [],
      status: params.status ?? 'Initialized',
      operationId: params.operationId,
      notes: params.notes ?? '',
    });
    this.inboundRequest = params.inboundRequest;
  
   
  }
  }
