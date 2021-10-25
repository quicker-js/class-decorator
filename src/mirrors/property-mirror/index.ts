import { DeclarationMirror } from '../declaration-mirror';
import { ClassMirror } from '../class-mirror';
import { PropertyMetadata } from '../../metadatas';

/**
 * 成员映射
 */
export class PropertyMirror<T = unknown> extends DeclarationMirror<T> {
  public classMirror: ClassMirror;

  public target: Object;

  public propertyKey: string | symbol;

  private isStatic?: boolean;

  /**
   * 获取参数的默认类型
   */
  public getDesignType(): Function {
    return Reflect.getMetadata(
      'design:type',
      this.target,
      this.propertyKey
    ) as Function;
  }

  /**
   * 创建成员装饰器
   * @param metadata
   */
  public static createDecorator(metadata: PropertyMetadata): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
      const isStatic: boolean = target.constructor === Function;
      // 获取已有的类映射管理器 如果没有则创建一个新的
      const classMirror = ClassMirror.reflect(
        isStatic ? (target as Function) : target.constructor
      );

      const propertyMirror =
        (classMirror.getMirror(propertyKey, isStatic) as PropertyMirror) ||
        new PropertyMirror();

      // 映射关联
      propertyMirror.propertyKey = propertyKey;
      propertyMirror.isStatic = isStatic;
      propertyMirror.classMirror = classMirror;
      propertyMirror.target = target;

      // 元数据关联
      metadata.propertyKey = propertyKey;
      metadata.target = target;
      metadata.classMirror = classMirror;

      propertyMirror.metadata.add(metadata);

      // 设置元数据
      classMirror.setMirror(propertyKey, propertyMirror, isStatic);

      // 定义元数据
      Reflect.defineMetadata(
        ClassMirror,
        classMirror,
        isStatic ? target : target.constructor
      );

      // 定义成员元数据
      Reflect.defineMetadata(
        PropertyMirror,
        propertyMirror,
        isStatic ? target : target.constructor,
        propertyKey
      );
    };
  }
}
