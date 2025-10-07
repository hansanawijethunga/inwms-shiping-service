import mongoose, { Schema } from 'mongoose';
export interface Worker {
  name: string;
  code: string;
}

const WorkerSchema = new Schema<Worker>({
  name: { type: String, required: true },
  code: { type: String, required: true }
});

export const WorkerModel = mongoose.model<Worker>('Worker', WorkerSchema);
