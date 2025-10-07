import type { ResourceFactory } from './ResourceFactory.js';
import { Forklift } from './Forklift.js';

export class ForkliftFactory implements ResourceFactory<Forklift> {
  create(data: { code: string; model: string }): Forklift {
    return new Forklift(data.code, data.model);
  }
}
