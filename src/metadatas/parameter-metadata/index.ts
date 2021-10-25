import { DeclarationMetadata } from '../declaration-metadata';
import { MethodMirror } from '../../mirrors';

/**
 * @class ParameterMetadata
 */
export class ParameterMetadata<T = unknown> extends DeclarationMetadata<T> {
  /**
   * methodMirror
   */
  public methodMirror: MethodMirror;

  /**
   * propertyKey
   */
  public propertyKey: string | symbol;

  /**
   * index
   */
  public index: number;
}
