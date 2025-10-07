import { Schema, model, Document } from 'mongoose';

export interface LoadingOperationDoc extends Document {
  operationId: string;
  date: Date;
  status: 'Initialized' | 'Started' | 'Completed';
  details?: string;
  operatorId?: string;
  resourceId?: string;
  notes?: string;
}

const LoadingOperationSchema = new Schema<LoadingOperationDoc>({
  operationId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Initialized', 'Started', 'Completed'], default: 'Initialized' },
  details: String,
  operatorId: String,
  resourceId: String,
  notes: String,
});

export const LoadingOperationModel = model<LoadingOperationDoc>('LoadingOperation', LoadingOperationSchema);