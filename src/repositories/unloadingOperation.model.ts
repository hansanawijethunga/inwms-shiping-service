import { Types, Schema, model, Document } from 'mongoose';

export interface UnloadingOperationDoc extends Document {
  operationId: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  status: 'Initialized' | 'Started' | 'Completed';
  resources: Array<{ _id: Types.ObjectId; type: 'forklift' | 'worker' }>;
  vehicles?: string[];
  inboundRequest: Types.ObjectId;
  notes?: string;
}

const UnloadingOperationSchema = new Schema<UnloadingOperationDoc>({
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
  inboundRequest: { type: Schema.Types.ObjectId, ref: 'InboundRequest', required: true },
  notes: String,
});

export const UnloadingOperationModel = model<UnloadingOperationDoc>('UnloadingOperation', UnloadingOperationSchema);