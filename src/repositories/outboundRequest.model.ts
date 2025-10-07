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

export type OutboundStatus = 'Requested' | 'Released' | 'Cancelled';

export interface OutboundRequest {
  orderNumber: string;
  requestDate: Date;
  releaseDate: Date;
  company: Company;
  products: Product[];
  status: OutboundStatus;
  notes: string;
}

const ProductItemSchema = new Schema<ProductItem>({
  productItemId: { type: String, required: true },
  name: { type: String, required: true },
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

const OutboundRequestSchema = new Schema<OutboundRequest>({
  orderNumber: { type: String, required: true, unique: true },
  requestDate: { type: Date, required: true },
  releaseDate: { type: Date, required: true },
  company: { type: CompanySchema, required: true },
  products: { type: [ProductSchema], required: true },
  status: { type: String, enum: ['Requested', 'Released', 'Cancelled'], required: true },
  notes: { type: String },
}, { timestamps: true });

export const OutboundRequestModel = mongoose.model<OutboundRequest>('OutboundRequest', OutboundRequestSchema);
