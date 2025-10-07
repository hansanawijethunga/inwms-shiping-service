import { ForkliftFactory } from '../factories/forklift.factory.js';
import { WorkerFactory } from '../factories/worker.factory.js';
import type { IForklift, IWorker } from '../repositories/resource.model.js';


export type ResourceType = 'forklift' | 'worker';

export interface IResourceService {
  create(type: ResourceType, data: any): Promise<any>;
  update(type: ResourceType, id: string, data: any): Promise<any>;
  delete(type: ResourceType, id: string): Promise<boolean>;
  getById(type: ResourceType, id: string): Promise<any>;
  getAll(type: ResourceType, filter?: any): Promise<any[]>;
}

export class ResourceService implements IResourceService {
  private forkliftFactory = new ForkliftFactory();
  private workerFactory = new WorkerFactory();

  async create(type: ResourceType, data: any): Promise<any> {
    if (type === 'forklift') {
      return await this.forkliftFactory.create(data as IForklift);
    } else if (type === 'worker') {
      return await this.workerFactory.create(data as IWorker);
    }
    throw new Error('Unknown resource type');
  }

  async update(type: ResourceType, id: string, data: any): Promise<any> {
    if (type === 'forklift') {
      return await this.forkliftFactory.update(id, data as Partial<IForklift>);
    } else if (type === 'worker') {
      return await this.workerFactory.update(id, data as Partial<IWorker>);
    }
    throw new Error('Unknown resource type');
  }

  async delete(type: ResourceType, id: string): Promise<boolean> {
    if (type === 'forklift') {
      return await this.forkliftFactory.delete(id);
    } else if (type === 'worker') {
      return await this.workerFactory.delete(id);
    }
    throw new Error('Unknown resource type');
  }

  async getById(type: ResourceType, id: string): Promise<any> {
    if (type === 'forklift') {
      return await this.forkliftFactory.getById(id);
    } else if (type === 'worker') {
      return await this.workerFactory.getById(id);
    }
    throw new Error('Unknown resource type');
  }

  async getAll(type: ResourceType, filter: any = {}): Promise<any[]> {
    if (type === 'forklift') {
      return await this.forkliftFactory.getAll(filter);
    } else if (type === 'worker') {
      return await this.workerFactory.getAll(filter);
    }
    throw new Error('Unknown resource type');
  }
}
