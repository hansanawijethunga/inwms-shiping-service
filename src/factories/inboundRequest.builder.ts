import type { InboundRequest } from '../repositories/inboundRequest.model.js';
import { InboundRequestModel } from '../repositories/inboundRequest.model.js';

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
    return this.request as InboundRequest;
  }

  async save(): Promise<InboundRequest> {
    const inboundRequest = new InboundRequestModel(this.build());
    return await inboundRequest.save();
  }
}
