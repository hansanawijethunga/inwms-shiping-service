import mongoose, { Schema } from 'mongoose';

export interface ProductItem {
  productItemId: string;
  name: string;
}

export interface Product {
  productId: string;
  productName: string;
  productCode: string;
  productAreaM2: number;
  requiresExpiry: boolean;
  requiresSerial: boolean;
  handlingNotes: string;
  quantity: number;
  productItems: ProductItem[];
}

export interface Company {
  companyId: string;
  name: string;
}

export type InboundStatus = 'Requested' | 'Arrived' | 'Cancelled';

export interface InboundRequest {
  shipmentNumber: string;
  arrivalDate: Date;
  externalTrackingNumber: string;
  company: Company;
  products: Product[];
  status: InboundStatus;
  notes: string;
}

const ProductItemSchema = new Schema<ProductItem>({
  productItemId: { type: String, required: true },
  name: { type: String, required: true },
  // _id will be automatically added by Mongoose
});

const ProductSchema = new Schema<Product>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productCode: { type: String, required: true },
  productAreaM2: { type: Number, required: true },
  requiresExpiry: { type: Boolean, required: true },
  requiresSerial: { type: Boolean, required: true },
  handlingNotes: { type: String, required: true },
  quantity: { type: Number, required: true },
  productItems: { type: [ProductItemSchema], required: true },
});

const CompanySchema = new Schema<Company>({
  companyId: { type: String, required: true },
  name: { type: String, required: true },
});

const InboundRequestSchema = new Schema<InboundRequest>({
  shipmentNumber: { type: String, required: true, unique: true },
  arrivalDate: { type: Date, required: true },
  externalTrackingNumber: { type: String, required: false },
  company: { type: CompanySchema, required: true },
  products: { type: [ProductSchema], required: true },
  status: { type: String, enum: ['Requested', 'Arrived', 'Cancelled'], required: true },
  notes: { type: String },
}, { timestamps: true });

export const InboundRequestModel = mongoose.model<InboundRequest>('InboundRequest', InboundRequestSchema);
