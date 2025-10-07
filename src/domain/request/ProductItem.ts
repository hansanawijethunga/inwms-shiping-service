export class ProductItem {
  constructor(
    public productItemId: string,
    public name: string
  ) {}

  toJson(): Record<string, any> {
    return {
      productItemId: this.productItemId,
      name: this.name
    };
  }
}
