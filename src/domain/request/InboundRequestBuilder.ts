import { InboundRequest } from './InboundRequest.js';
import { InboundRequestModel } from '../../repositories/inboundRequest.model.js';

export class InboundRequestBuilder {
  private request: Partial<InboundRequest> = {};

  setRequestDetails(details: {
    arrivalDate?: Date;
    externalTrackingNumber?: string;
    company?: InboundRequest['company'];
  }): this {
    if (details.arrivalDate !== undefined) {
      this.request.arrivalDate = details.arrivalDate;
    }
    if (details.externalTrackingNumber !== undefined) {
      this.request.externalTrackingNumber = details.externalTrackingNumber;
    }
    if (details.company !== undefined) {
      this.request.company = details.company;
    }
    return this;
  }

  setProduct(products: InboundRequest['products']): this {
    this.request.products = products;
    return this;
  }

  setStatus(status: InboundRequest['status']): this {
    this.request.status = status;
    return this;
  }

  setNotes(notes: string): this {
    this.request.notes = notes;
    return this;
  }

  build(): InboundRequest {
    // Map builder fields to domain class constructor
    return new InboundRequest({
      shipmentNumber: (this.request as any).shipmentNumber,
      arrivalDate: (this.request as any).arrivalDate || new Date(),
      externalTrackingNumber: (this.request as any).externalTrackingNumber || '',
      company: (this.request as any).company,
      products: (this.request as any).products || [],
      status: (this.request as any).status,
      notes: (this.request as any).notes || '',
      _id: (this.request as any)._id
    });
  }

  async save(): Promise<any> {
    const domainObj = this.build();
    return await domainObj.save();
  }
}
