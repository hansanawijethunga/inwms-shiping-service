import { CompanyRequest } from './CompanyRequest.js';
import { InboundRequestModel } from '../../repositories/inboundRequest.model.js';
import { Company } from './Company.js';
import { Product } from './Product.js';

export class InboundRequest extends CompanyRequest {
  shipmentNumber: string;
  arrivalDate: Date;
  externalTrackingNumber: string;
  company: Company;
  products: Product[];
  notes: string;
  status: 'Requested' | 'Arrived' | 'Cancelled';

  constructor(params: {
    shipmentNumber: string;
    arrivalDate: Date;
    externalTrackingNumber: string;
    company: Company;
    products: Product[];
    status: 'Requested' | 'Arrived' | 'Cancelled';
    notes: string;
    _id?: string;
  }) {
    super({
      productItemId: '', // Not used in new model
      companyId: params.company.companyId,
      requestDate: params.arrivalDate,
      status: params.status,
      _id: params._id
    });
    this.shipmentNumber = params.shipmentNumber;
    this.arrivalDate = params.arrivalDate;
    this.externalTrackingNumber = params.externalTrackingNumber;
    this.company = params.company;
    this.products = params.products;
    this.status = params.status;
    this.notes = params.notes;
  }

  async save(): Promise<any> {
    const doc = new InboundRequestModel({
      shipmentNumber: this.shipmentNumber,
      arrivalDate: this.arrivalDate,
      externalTrackingNumber: this.externalTrackingNumber,
      company: this.company,
      products: this.products,
      status: this.status,
      notes: this.notes
    });
    return await doc.save();
  }

  async update(): Promise<any> {
    if (!this._id) throw new Error('Missing _id for update');
    return await InboundRequestModel.findByIdAndUpdate(this._id, {
      shipmentNumber: this.shipmentNumber,
      arrivalDate: this.arrivalDate,
      externalTrackingNumber: this.externalTrackingNumber,
      company: this.company,
      products: this.products,
      status: this.status,
      notes: this.notes
    }, { new: true });
  }

  async delete(): Promise<boolean> {
    if (!this._id) throw new Error('Missing _id for delete');
    const result = await InboundRequestModel.findByIdAndDelete(this._id);
    return !!result;
  }

  toJson(): Record<string, any> {
    return {
      _id: this._id,
      shipmentNumber: this.shipmentNumber,
      arrivalDate: this.arrivalDate,
      externalTrackingNumber: this.externalTrackingNumber,
      company: this.company.toJson(),
      products: this.products.map(p => p.toJson()),
      status: this.status,
      notes: this.notes
    };
  }
}
