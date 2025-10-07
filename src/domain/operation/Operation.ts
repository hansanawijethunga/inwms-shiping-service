import type { Resource } from '../resource/Resource.js';

export type LoadingOperationStatus = 'Initialized' | 'Started' | 'Completed';


export abstract class Operation {
  date: Date;
  startTime: string;
  endTime: string;
  resources:Resource[];
  vehicles: string[];
  operationId: string;
  status: LoadingOperationStatus;
  notes: string;

  constructor(params: {
    date: Date;
    startTime: string;
    endTime: string;
    resources: Resource[];
    vehicles: string[];
    operationId: string;
    status: LoadingOperationStatus;
    notes: string;
  }) {
    this.date = params.date;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.resources = params.resources;
    this.vehicles = params.vehicles;
    this.operationId = params.operationId;
    this.status = params.status;
    this.notes = params.notes;
  }
}