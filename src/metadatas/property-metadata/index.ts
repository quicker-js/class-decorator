import { DeclarationMetadata } from '../declaration-metadata';
import { ClassMirror } from '../../mirrors';

/**
 * @class PropertyMetadata
 */
export class PropertyMetadata<T = unknown> extends DeclarationMetadata<T> {
  /**
   * classMirror
   */
  public classMirror: ClassMirror;

  /**
   * propertyKey
   */
  public propertyKey: string | symbol;
}
