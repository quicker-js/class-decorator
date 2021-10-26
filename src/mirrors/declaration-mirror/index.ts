import { DeclarationMetadata } from '../../metadatas';

/**
 * @class DeclarationMirror
 */
export abstract class DeclarationMirror<
  T extends DeclarationMetadata = DeclarationMetadata
> {
  /**
   * metadata collection
   * 元数据集合
   */
  public metadata: Set<T> = new Set();
}
