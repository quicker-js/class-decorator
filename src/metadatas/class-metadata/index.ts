import { DeclarationMetadata } from '../declaration-metadata';
import { ClassMirror } from '../../mirrors';

/**
 * class元数据
 * @class ClassMetadata
 */
export abstract class ClassMetadata<
  T = unknown
> extends DeclarationMetadata<T> {
  public classMirror: ClassMirror;
}
