import { ForkliftModel } from '../../repositories/forklift.model.js';
import type { Resource } from './Resource.js';

export class Forklift implements Resource {
  _id?: string;
  constructor(
    public code: string,
    public model: string
  ) {}

  async save(): Promise<any> {
    const dbForklift = new ForkliftModel({ code: this.code, model: this.model });
    return await dbForklift.save();
  }

  async update(): Promise<any> {
    if (!this._id) throw new Error('Missing _id for update');
    return await ForkliftModel.findByIdAndUpdate(this._id, { code: this.code, model: this.model }, { new: true });
  }

  async delete(): Promise<boolean> {
    if (!this._id) throw new Error('Missing _id for delete');
    const result = await ForkliftModel.findByIdAndDelete(this._id);
    return !!result;
  }

  toJson(): Record<string, any> {
    return {
      _id: this._id,
      code: this.code,
      model: this.model
    };
  }
}
