import { DeclarationMetadata } from '../../metadatas';
import { ClassConstructor } from '../../interfaces';

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

  /**
   * 获取元数据集合 不包含父类
   * @param type 类型, 参数继承至 `MethodMetadata`。
   */
  public getMetadata<M extends T = T>(type?: ClassConstructor<M>): M[] {
    const metadataList = Array.from<any>(this.metadata.values());
    if (type) {
      return metadataList.filter((o) => o instanceof type) as M[];
    }
    return metadataList as M[];
  }
}
