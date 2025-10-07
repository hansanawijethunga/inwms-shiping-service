import { OutboundRequest } from './OutboundRequest.js';
import { OutboundRequestModel } from '../../repositories/outboundRequest.model.js';

export class OutboundRequestBuilder {
  private request: Partial<OutboundRequest> = {};

  setRequestDetails(details: {
    requestDate?: Date;
    releaseDate?: Date;
    company?: OutboundRequest['company'];
  }): this {
    if (details.requestDate !== undefined) {
      this.request.requestDate = details.requestDate;
    }
    if (details.releaseDate !== undefined) {
      this.request.releaseDate = details.releaseDate;
    }
    if (details.company !== undefined) {
      this.request.company = details.company;
    }
    return this;
  }

  setProduct(products: OutboundRequest['products']): this {
    this.request.products = products;
    return this;
  }

  setStatus(status: OutboundRequest['status']): this {
    this.request.status = status;
    return this;
  }

  setNotes(notes: string): this {
    this.request.notes = notes;
    return this;
  }

  build(): OutboundRequest {
    // Map builder fields to domain class constructor
    return new OutboundRequest({
      orderNumber: (this.request as any).orderNumber,
      requestDate: (this.request as any).requestDate || new Date(),
      releaseDate: (this.request as any).releaseDate || new Date(),
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
