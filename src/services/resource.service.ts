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
    } else if (type === 'worker') {
      resource = this.domainWorkerFactory.create(data);
    } else {
      throw new Error('Unknown resource type');
    }
    (resource as any)._id = id;
    return await resource.update();
  }

  async delete(type: ResourceType, id: string): Promise<boolean> {
    let resource: Resource;
    if (type === 'forklift') {
      resource = this.domainForkliftFactory.create({ code: '', model: '' });
    } else if (type === 'worker') {
      resource = this.domainWorkerFactory.create({ name: '', code: '' });
    } else {
      throw new Error('Unknown resource type');
    }
    (resource as any)._id = id;
    return await resource.delete();
  }

  async getById(type: ResourceType, id: string): Promise<any> {
    let doc;
    if (type === 'forklift') {
      doc = await ForkliftModel.findById(id);
      if (!doc) return null;
      const forklift = this.domainForkliftFactory.create({
        code: doc.code,
        model: doc.model
      });
      (forklift as any)._id = doc._id?.toString();
      return forklift.toJson();
    } else if (type === 'worker') {
      doc = await WorkerModel.findById(id);
      if (!doc) return null;
      const worker = this.domainWorkerFactory.create({
        name: doc.name,
        code: doc.code
      });
      (worker as any)._id = doc._id?.toString();
      return worker.toJson();
    }
    throw new Error('Unknown resource type');
  }

  async getAll(type: ResourceType, filter: any = {}): Promise<any[]> {
    if (type === 'forklift') {
      const docs = await ForkliftModel.find(filter || {});
      return docs.map(doc => {
        const forklift = this.domainForkliftFactory.create({
          code: doc.code,
          model: doc.model
        });
        (forklift as any)._id = doc._id?.toString();
        return forklift.toJson();
      });
    } else if (type === 'worker') {
      const docs = await WorkerModel.find(filter || {});
      return docs.map(doc => {
        const worker = this.domainWorkerFactory.create({
          name: doc.name,
          code: doc.code
        });
        (worker as any)._id = doc._id?.toString();
        return worker.toJson();
      });
    }
    throw new Error('Unknown resource type');
  }
}
