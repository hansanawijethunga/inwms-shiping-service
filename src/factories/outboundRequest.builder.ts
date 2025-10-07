import { OutboundRequestModel } from '../repositories/outboundRequest.model.js';
import type { OutboundRequest } from '../repositories/outboundRequest.model.js';

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
    return this.request as OutboundRequest;
  }

  async save(): Promise<OutboundRequest> {
    const outboundRequest = new OutboundRequestModel(this.build());
    return await outboundRequest.save();
  }
}
