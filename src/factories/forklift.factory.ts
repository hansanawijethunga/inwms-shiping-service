import type { IForklift } from '../repositories/resource.model.js';
import { ForkliftModel } from '../repositories/resource.model.js';
import { ResourceFactory } from './resource.factory.js';

export class ForkliftFactory extends ResourceFactory<IForklift> {
  async create(data: IForklift): Promise<IForklift> {
    const forklift = new ForkliftModel(data);
    return await forklift.save();
  }
  async update(id: string, data: Partial<IForklift>): Promise<IForklift | null> {
    return await ForkliftModel.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id: string): Promise<boolean> {
    const result = await ForkliftModel.findByIdAndDelete(id);
    return !!result;
  }
  async getById(id: string): Promise<IForklift | null> {
    return await ForkliftModel.findById(id);
  }
  async getAll(filter: Record<string, any> = {}): Promise<IForklift[]> {
    return await ForkliftModel.find(filter as any);
  }
}
