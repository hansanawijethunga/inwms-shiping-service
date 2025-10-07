export interface ResourceFactory<T> {
  create(data: any): T;
}
