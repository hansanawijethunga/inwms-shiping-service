import { CompanyRequest } from './CompanyRequest.js';
import { OutboundRequestModel } from '../../repositories/outboundRequest.model.js';
import { Company } from './Company.js';
import { Product } from './Product.js';

export class OutboundRequest extends CompanyRequest {
  orderNumber: string;
  requestDate: Date;
  releaseDate: Date;
  company: Company;
  products: Product[];
  status: 'Requested' | 'Released' | 'Cancelled';
  notes: string;

  constructor(params: {
    orderNumber: string;
    requestDate: Date;
    releaseDate: Date;
    company: Company;
    products: Product[];
    status: 'Requested' | 'Released' | 'Cancelled';
    notes: string;
    _id?: string;
  }) {
    super({
      productItemId: '', // Not used in new model
      companyId: params.company.companyId,
      requestDate: params.requestDate,
      status: params.status,
      _id: params._id
    });
    this.orderNumber = params.orderNumber;
    this.requestDate = params.requestDate;
    this.releaseDate = params.releaseDate;
    this.company = params.company;
    this.products = params.products;
    this.status = params.status;
    this.notes = params.notes;
  }

  async save(): Promise<any> {
    const doc = new OutboundRequestModel({
      orderNumber: this.orderNumber,
      requestDate: this.requestDate,
      releaseDate: this.releaseDate,
      company: this.company,
      products: this.products,
      status: this.status,
      notes: this.notes
    });
    return await doc.save();
  }

  async update(): Promise<any> {
    if (!this._id) throw new Error('Missing _id for update');
    return await OutboundRequestModel.findByIdAndUpdate(this._id, {
      orderNumber: this.orderNumber,
      requestDate: this.requestDate,
      releaseDate: this.releaseDate,
      company: this.company,
      products: this.products,
      status: this.status,
      notes: this.notes
    }, { new: true });
  }

  async delete(): Promise<boolean> {
    if (!this._id) throw new Error('Missing _id for delete');
    const result = await OutboundRequestModel.findByIdAndDelete(this._id);
    return !!result;
  }

  toJson(): Record<string, any> {
    return {
      _id: this._id,
      orderNumber: this.orderNumber,
      requestDate: this.requestDate,
      releaseDate: this.releaseDate,
      company: this.company.toJson(),
      products: this.products.map(p => p.toJson()),
      status: this.status,
      notes: this.notes
    };
  }
}
