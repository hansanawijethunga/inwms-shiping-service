export abstract class CompanyRequest {
  _id: string | undefined;
  productItemId: string;
  companyId: string;
  requestDate: Date;
  status: string;

  constructor(params: {
    productItemId: string;
    companyId: string;
    requestDate: Date;
    status: string;
    _id: string | undefined;
  }) {
    this._id = params._id;
    this.productItemId = params.productItemId;
    this.companyId = params.companyId;
    this.requestDate = params.requestDate;
    this.status = params.status;
  }

  abstract save(): Promise<any>;
  abstract update(): Promise<any>;
  abstract delete(): Promise<boolean>;
  abstract toJson(): Record<string, any>;
}
