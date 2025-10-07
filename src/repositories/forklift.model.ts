import mongoose, { Schema } from 'mongoose';

export interface Forklift {
  model: string;
  capacity: number;
  serialNumber: string;
}

const ForkliftSchema = new Schema<Forklift>({
  model: { type: String, required: true },
  capacity: { type: Number, required: true },
  serialNumber: { type: String, required: true }
});

export const ForkliftModel = mongoose.model<Forklift>('Forklift', ForkliftSchema);
