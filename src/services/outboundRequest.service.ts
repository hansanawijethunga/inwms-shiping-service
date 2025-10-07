import type { OutboundRequest } from '../repositories/outboundRequest.model.js';
import { OutboundRequestModel } from '../repositories/outboundRequest.model.js';
import { OutboundRequestBuilder } from '../factories/outboundRequest.builder.js';

export class OutboundRequestService {
  async create(data: Partial<OutboundRequest>): Promise<OutboundRequest> {
    // Generate next order number
    const last = await OutboundRequestModel.findOne({}, {}, { sort: { orderNumber: -1 } });
    let nextNumber = 1;
    if (last && typeof last.orderNumber === 'string') {
      const match = last.orderNumber.match(/ORD(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1] || '0', 10) + 1;
      }
    }
    const orderNumber = `ORD${nextNumber.toString().padStart(3, '0')}`;
    const builder = new OutboundRequestBuilder()
      .setRequestDetails({
        requestDate: data.requestDate!,
        releaseDate: data.releaseDate!,
        company: data.company!
      })
      .setProduct(data.products!)
      .setStatus(data.status!)
      .setNotes(data.notes ?? '');
    (builder as any).request.orderNumber = orderNumber;
    return await builder.save();
  }

  async updateRequestDetails(id: string, data: Partial<OutboundRequest>): Promise<OutboundRequest | null> {
    const existing = await OutboundRequestModel.findById(id);
    if (!existing) return null;
    const builder = new OutboundRequestBuilder();
    const details: any = {};
    if (data.requestDate !== undefined) details.requestDate = data.requestDate;
    if (data.releaseDate !== undefined) details.releaseDate = data.releaseDate;
    if (data.company !== undefined) details.company = data.company;
    builder.setRequestDetails(details);
    if (data.notes !== undefined) {
      builder.setNotes(data.notes);
    }
    const updateData = builder.build();
    const updateFields: any = {};
    if (data.requestDate !== undefined) updateFields.requestDate = updateData.requestDate;
    if (data.releaseDate !== undefined) updateFields.releaseDate = updateData.releaseDate;
    if (data.company !== undefined) updateFields.company = updateData.company;
    if (data.notes !== undefined) updateFields.notes = updateData.notes;
    updateFields.orderNumber = existing.orderNumber;
    return await OutboundRequestModel.findByIdAndUpdate(id, updateFields, { new: true });
  }

  async updateProduct(id: string, products: OutboundRequest['products']): Promise<OutboundRequest | null> {
    const builder = new OutboundRequestBuilder().setProduct(products);
    const updateData = builder.build();
    return await OutboundRequestModel.findByIdAndUpdate(id, { products: updateData.products }, { new: true });
  }

  async changeStatus(id: string, status: OutboundRequest['status']): Promise<OutboundRequest | null> {
    const builder = new OutboundRequestBuilder().setStatus(status);
    const updateData = builder.build();
    return await OutboundRequestModel.findByIdAndUpdate(id, { status: updateData.status }, { new: true });
  }

  async getById(id: string): Promise<OutboundRequest | null> {
    return await OutboundRequestModel.findById(id);
  }

  async getAll(filter: Record<string, any> = {}): Promise<OutboundRequest[]> {
    return await OutboundRequestModel.find(filter);
  }
}
