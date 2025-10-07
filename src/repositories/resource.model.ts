import mongoose, { Schema, Document } from 'mongoose';

export interface IForklift {
  name: string;
  code: string;
  model: string;
}

const ForkliftSchema = new Schema<IForklift>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  model: { type: String, required: true },
}, { timestamps: true });

export const ForkliftModel = mongoose.model<IForklift>('Forklift', ForkliftSchema);

export interface IWorker {
  name: string;
  code: string;
}

const WorkerSchema = new Schema<IWorker>({
  name: { type: String, required: true },
  code: { type: String, required: true },
}, { timestamps: true });

export const WorkerModel = mongoose.model<IWorker>('Worker', WorkerSchema);
