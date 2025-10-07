import { ProductItem } from './ProductItem.js';

export class Product {
  constructor(
    public productId: string,
    public productName: string,
    public productCode: string,
    public productAreaM2: number,
    public requiresExpiry: boolean,
    public requiresSerial: boolean,
    public handlingNotes: string,
    public quantity: number,
    public productItems: ProductItem[]
  ) {}

  toJson(): Record<string, any> {
    return {
      productId: this.productId,
      productName: this.productName,
      productCode: this.productCode,
      productAreaM2: this.productAreaM2,
      requiresExpiry: this.requiresExpiry,
      requiresSerial: this.requiresSerial,
      handlingNotes: this.handlingNotes,
      quantity: this.quantity,
      productItems: this.productItems.map(item => item.toJson())
    };
  }
}
