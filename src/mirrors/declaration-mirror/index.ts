import { DeclarationMetadata } from '../../metadatas';

/**
 * @class DeclarationMirror
 */
export abstract class DeclarationMirror<T extends DeclarationMetadata = any> {
  /**
   * metadata collection
   * 元数据集合
   */
  public readonly metadata: Set<T> = new Set();

  /**
   * target
   * Mirror映射的目标
   */
  public target: Object;
}
