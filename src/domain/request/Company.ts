export class Company {
  constructor(
    public companyId: string,
    public name: string
  ) {}

  toJson(): Record<string, any> {
    return {
      companyId: this.companyId,
      name: this.name
    };
  }
}
