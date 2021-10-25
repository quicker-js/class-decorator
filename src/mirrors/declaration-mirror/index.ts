/**
 * @class DeclarationMirror
 */
export abstract class DeclarationMirror<T = unknown> {
  /**
   * metadata collection
   */
  public metadata: Set<T> = new Set();
}
