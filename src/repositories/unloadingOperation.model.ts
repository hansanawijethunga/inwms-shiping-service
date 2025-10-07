import { Schema, model, Document } from 'mongoose';

export interface UnloadingOperationDoc extends Document {
  operationId: string;
  date: Date;
  status: 'Initialized' | 'Started' | 'Completed';
  details?: string;
  operatorId?: string;
  inboundRequest: { type: Schema.Types.ObjectId, ref: 'InboundRequest', required: true };
  notes?: string;
}

const UnloadingOperationSchema = new Schema<UnloadingOperationDoc>({
  operationId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Initialized', 'Started', 'Completed'], default: 'Initialized' },
  details: String,
  operatorId: String,
  inboundRequest: { type: Schema.Types.ObjectId, ref: 'InboundRequest', required: true },
  notes: String,
});

export const UnloadingOperationModel = model<UnloadingOperationDoc>('UnloadingOperation', UnloadingOperationSchema);