import { Operation } from './Operation.js';
import type { OutboundRequest } from '../request/OutboundRequest.js';
import type { Resource } from '../resource/Resource.js';

export type OperationStatus = 'Initialized' | 'Started' | 'Completed';

export interface LoadingOperationParams {
  operationId: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  resources?: Resource[];
  vehicles?: string[];
  status?: OperationStatus;
  outboundRequest: OutboundRequest;  
  resourceId?: string;
  notes?: string;
}

export class LoadingOperation extends Operation {
 
   outboundRequest: OutboundRequest;



  constructor(params: LoadingOperationParams) {
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
    this.outboundRequest = params.outboundRequest;
   
  }
}
