import type { ResourceFactory } from './ResourceFactory.js';
import { Worker } from './Worker.js';

export class WorkerFactory implements ResourceFactory<Worker> {
  create(data: { name: string; code: string }): Worker {
    return new Worker(data.name, data.code);
  }
}
