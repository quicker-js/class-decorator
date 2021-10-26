export interface ClassConstructor<T = unknown> {
  new (...args: any[]): T;
}
