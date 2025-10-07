export abstract class ResourceFactory<T> {
  abstract create(data: T): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract getById(id: string): Promise<T | null>;
  abstract getAll(filter?: any): Promise<T[]>;
}
