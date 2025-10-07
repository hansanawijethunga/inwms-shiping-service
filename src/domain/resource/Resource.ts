export interface Resource {
  save(): Promise<any>;
  update(): Promise<any>;
  delete(): Promise<boolean>;
  toJson(): Record<string, any>;
}
