import type { OutboundRequest } from '../repositories/outboundRequest.model.js';
import { OutboundRequestModel } from '../repositories/outboundRequest.model.js';
import { OutboundRequestBuilder } from '../domain/request/OutboundRequestBuilder.js';
import { Company } from '../domain/request/Company.js';
import { Product } from '../domain/request/Product.js';
import { ProductItem } from '../domain/request/ProductItem.js';

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
    const domainCompany = data.company ? new Company(data.company.companyId, data.company.name) : undefined;
    const domainProducts = (data.products ?? []).map(p => new Product(
      p.productId,
      p.productName,
      p.productCode,
      p.productAreaM2,
      p.requiresExpiry,
      p.requiresSerial,
      p.handlingNotes,
      p.quantity,
      p.productItems.map(item => new ProductItem(item.productItemId, item.name))
    ));
    const requestDetails: any = {
      requestDate: data.requestDate!,
      releaseDate: data.releaseDate!
    };
    if (domainCompany) requestDetails.company = domainCompany;
    const builder = new OutboundRequestBuilder()
      .setRequestDetails(requestDetails)
      .setProduct(domainProducts)
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
    if (data.company !== undefined) {
      details.company = new Company(data.company.companyId, data.company.name);
    }
    if (data.products !== undefined) {
      details.products = data.products.map(p => new Product(
        p.productId,
        p.productName,
        p.productCode,
        p.productAreaM2,
        p.requiresExpiry,
        p.requiresSerial,
        p.handlingNotes,
        p.quantity,
        p.productItems.map(item => new ProductItem(item.productItemId, item.name))
      ));
    }
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
    const domainProducts = products.map(p => new Product(
      p.productId,
      p.productName,
      p.productCode,
      p.productAreaM2,
      p.requiresExpiry,
      p.requiresSerial,
      p.handlingNotes,
      p.quantity,
      p.productItems.map(item => new ProductItem(item.productItemId, item.name))
    ));
    // Only update products, do not build full domain object (avoid companyId issue)
    return await OutboundRequestModel.findByIdAndUpdate(id, { products: domainProducts }, { new: true });
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
