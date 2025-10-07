
import { Types, Schema, model, Document } from 'mongoose';

export interface LoadingOperationDoc extends Document {
  operationId: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  status: 'Initialized' | 'Started' | 'Completed';
  resources: Array<{ _id: Types.ObjectId; type: 'forklift' | 'worker' }>;
  vehicles?: string[];
  outboundRequest: Types.ObjectId;
  notes?: string;
}

const LoadingOperationSchema = new Schema<LoadingOperationDoc>({
  operationId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  status: { type: String, enum: ['Initialized', 'Started', 'Completed'], default: 'Initialized' },
  resources: [
    {
      _id: { type: Schema.Types.ObjectId },
      type: { type: String, enum: ['forklift', 'worker'] },
    }
  ],
  vehicles: [{ type: String }],
  outboundRequest: { type: Schema.Types.ObjectId, ref: 'OutboundRequest', required: true },
  notes: String,
});

export const LoadingOperationModel = model<LoadingOperationDoc>('LoadingOperation', LoadingOperationSchema);