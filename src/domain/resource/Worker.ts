import { WorkerModel } from '../../repositories/worker.model.js';
import type { Resource } from './Resource.js';

export class Worker implements Resource {
  constructor(
    public name: string,
    public code: string
  ) {}

  async save(): Promise<any> {
    const dbWorker = new WorkerModel({ name: this.name, code: this.code });
    return await dbWorker.save();
  }
  _id?: string;
  async update(): Promise<any> {
    if (!this._id) throw new Error('Missing _id for update');
    return await WorkerModel.findByIdAndUpdate(this._id, { name: this.name, code: this.code }, { new: true });
  }

  async delete(): Promise<boolean> {
    if (!this._id) throw new Error('Missing _id for delete');
    const result = await WorkerModel.findByIdAndDelete(this._id);
    return !!result;
  }

}
