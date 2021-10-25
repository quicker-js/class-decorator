/**
 * 声明元数据
 */
export abstract class DeclarationMetadata<T = unknown> {
  /**
   * 元数据目标
   */
  public target: Object;

  /**
   * 构造函数
   * @param metadata
   */
  public constructor(public metadata: T) {}
}
