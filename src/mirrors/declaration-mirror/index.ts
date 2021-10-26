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

  /**
   * target
   * Mirror映射的目标
   */
  public target: Object;

  /**
   * 获取当前目标除了超类的元数据，如果继承了超类并且覆盖了超类的同名属性
   * 返回当前目录的元数据集合
   */
  public getSelfMetadata(): T[] {
    const list: T[] = [];
    this.metadata.forEach((o) => {
      if (o.target === this.target) {
        list.push(o);
      }
    });
    return list;
  }
}
