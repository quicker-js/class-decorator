import { DeclarationMetadata } from '../declaration-metadata';

/**
 * @class MethodMetadata
 * 方法元数据
 */
export class MethodMetadata<
  T = unknown,
  D = unknown
> extends DeclarationMetadata<T> {
  /**
   * propertyKey
   */
  public propertyKey: string | symbol;

  /**
   * descriptor
   */
  public descriptor: D;
}
