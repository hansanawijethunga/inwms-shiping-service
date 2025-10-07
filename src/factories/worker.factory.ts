import type { IWorker } from '../repositories/resource.model.js';
import { WorkerModel } from '../repositories/resource.model.js';
import { ResourceFactory } from './resource.factory.js';

export class WorkerFactory extends ResourceFactory<IWorker> {
  async create(data: IWorker): Promise<IWorker> {
    const worker = new WorkerModel(data);
    return await worker.save();
  }
  async update(id: string, data: Partial<IWorker>): Promise<IWorker | null> {
    return await WorkerModel.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id: string): Promise<boolean> {
    const result = await WorkerModel.findByIdAndDelete(id);
    return !!result;
  }
  async getById(id: string): Promise<IWorker | null> {
    return await WorkerModel.findById(id);
  }
  async getAll(filter: Record<string, any> = {}): Promise<IWorker[]> {
    return await WorkerModel.find(filter as any);
  }
}
