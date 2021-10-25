/**
 * @class DeclarationMirror
 */
export abstract class DeclarationMirror<T = unknown> {
  /**
   * metadata collection
   * 元数据集合
   */
  public metadata: Set<T> = new Set();
}
