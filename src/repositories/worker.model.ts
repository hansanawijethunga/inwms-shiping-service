import mongoose, { Schema } from 'mongoose';

export interface Worker {
  name: string;
  role: string;
  shift: string;
}

const WorkerSchema = new Schema<Worker>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  shift: { type: String, required: true }
});

export const WorkerModel = mongoose.model<Worker>('Worker', WorkerSchema);
