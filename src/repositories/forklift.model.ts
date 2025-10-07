import mongoose, { Schema } from 'mongoose';
export interface Forklift {
  code: string;
  model: string;
}

const ForkliftSchema = new Schema<Forklift>({
  code: { type: String, required: true },
  model: { type: String, required: true }
});

export const ForkliftModel = mongoose.model<Forklift>('Forklift', ForkliftSchema);
