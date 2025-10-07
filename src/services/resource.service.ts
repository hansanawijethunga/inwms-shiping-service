import { ForkliftFactory as DomainForkliftFactory } from '../domain/resource/ForkliftFactory.js';
import { WorkerFactory as DomainWorkerFactory } from '../domain/resource/WorkerFactory.js';
import { ForkliftModel } from '../repositories/forklift.model.js';
import { WorkerModel } from '../repositories/worker.model.js';
import type { Resource } from '../domain/resource/Resource.js';


export type ResourceType = 'forklift' | 'worker';

export interface IResourceService {
  create(type: ResourceType, data: any): Promise<any>;
  update(type: ResourceType, id: string, data: any): Promise<any>;
  delete(type: ResourceType, id: string): Promise<boolean>;
  getById(type: ResourceType, id: string): Promise<any>;
  getAll(type: ResourceType, filter?: any): Promise<any[]>;
}

export class ResourceService implements IResourceService {
  private domainForkliftFactory = new DomainForkliftFactory();
  private domainWorkerFactory = new DomainWorkerFactory();

  async create(type: ResourceType, data: any): Promise<any> {
  let resource: Resource;

    if (type === 'forklift') {
      resource = this.domainForkliftFactory.create(data);
    } else if (type === 'worker') {
      resource = this.domainWorkerFactory.create(data);
    } else {
      throw new Error('Unknown resource type');
    }
    return await resource.save();
  }

  async update(type: ResourceType, id: string, data: any): Promise<any> {
    let resource: Resource;
    if (type === 'forklift') {
      resource = this.domainForkliftFactory.create(data);
      (resource as any)._id = id;
      return await resource.update();
    } else if (type === 'worker') {
      resource = this.domainWorkerFactory.create(data);
      (resource as any)._id = id;
      return await resource.update();
    }
    throw new Error('Unknown resource type');
  }

  async delete(type: ResourceType, id: string): Promise<boolean> {
    let resource: Resource;
    if (type === 'forklift') {
      resource = this.domainForkliftFactory.create({ code: '', model: '' });
      (resource as any)._id = id;
      return await resource.delete();
    } else if (type === 'worker') {
      resource = this.domainWorkerFactory.create({ name: '', code: '' });
      (resource as any)._id = id;
      return await resource.delete();
    }
    throw new Error('Unknown resource type');
  }

  async getById(type: ResourceType, id: string): Promise<any> {
    if (type === 'forklift') {
      return await ForkliftModel.findById(id);
    } else if (type === 'worker') {
      return await WorkerModel.findById(id);
    }
    throw new Error('Unknown resource type');
  }

  async getAll(type: ResourceType, filter: any = {}): Promise<any[]> {
    if (type === 'forklift') {
      return await ForkliftModel.find(filter || {});
    } else if (type === 'worker') {
      return await WorkerModel.find(filter || {});
    }
    throw new Error('Unknown resource type');
  }
}
