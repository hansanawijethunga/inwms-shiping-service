import type { InboundRequest } from '../repositories/inboundRequest.model.js';
import { InboundRequestModel } from '../repositories/inboundRequest.model.js';
import { InboundRequestBuilder } from '../domain/request/InboundRequestBuilder.js';
import { Company } from '../domain/request/Company.js';
import { Product } from '../domain/request/Product.js';
import { ProductItem } from '../domain/request/ProductItem.js';

export class InboundRequestService {
  async create(data: Partial<InboundRequest>): Promise<InboundRequest> {
    // Generate next shipment number
    const last = await InboundRequestModel.findOne({}, {}, { sort: { shipmentNumber: -1 } });
    let nextNumber = 1;
    if (last && typeof last.shipmentNumber === 'string') {
      const match = last.shipmentNumber.match(/SHP(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1] || '0', 10) + 1;
      }
    }
    const shipmentNumber = `SHP${nextNumber.toString().padStart(3, '0')}`;
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
      arrivalDate: data.arrivalDate!,
      externalTrackingNumber: data.externalTrackingNumber!
    };
    if (domainCompany) requestDetails.company = domainCompany;
    const builder = new InboundRequestBuilder()
      .setRequestDetails(requestDetails)
      .setProduct(domainProducts)
      .setStatus(data.status!)
      .setNotes(data.notes ?? '');
    // Set shipmentNumber directly on builder.request
    (builder as any).request.shipmentNumber = shipmentNumber;
    return await builder.save();
  }

  async updateRequestDetails(id: string, data: Partial<InboundRequest>): Promise<InboundRequest | null> {
    const existing = await InboundRequestModel.findById(id);
    if (!existing) return null;
    const builder = new InboundRequestBuilder();
    const details: any = {};
    if (data.arrivalDate !== undefined) details.arrivalDate = data.arrivalDate;
    if (data.externalTrackingNumber !== undefined) details.externalTrackingNumber = data.externalTrackingNumber;
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
    // Only update fields present in payload
    const updateFields: any = {};
    if (data.arrivalDate !== undefined) updateFields.arrivalDate = updateData.arrivalDate;
    if (data.externalTrackingNumber !== undefined) updateFields.externalTrackingNumber = updateData.externalTrackingNumber;
    if (data.company !== undefined) updateFields.company = updateData.company;
    if (data.notes !== undefined) updateFields.notes = updateData.notes;
  // Always preserve shipmentNumber, but do not pass it to builder
  updateFields.shipmentNumber = existing.shipmentNumber;
    return await InboundRequestModel.findByIdAndUpdate(id, updateFields, { new: true });
  }

  async updateProduct(id: string, products: InboundRequest['products']): Promise<InboundRequest | null> {
    // Convert repository products to domain Product instances
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
    return await InboundRequestModel.findByIdAndUpdate(id, { products: domainProducts }, { new: true });
  }

  async changeStatus(id: string, status: InboundRequest['status']): Promise<InboundRequest | null> {
    const builder = new InboundRequestBuilder().setStatus(status);
    const updateData = builder.build();
    return await InboundRequestModel.findByIdAndUpdate(id, { status: updateData.status }, { new: true });
  }

  async getById(id: string): Promise<InboundRequest | null> {
    return await InboundRequestModel.findById(id);
  }

  async getAll(filter: Record<string, any> = {}): Promise<InboundRequest[]> {
    return await InboundRequestModel.find(filter);
  }
}
