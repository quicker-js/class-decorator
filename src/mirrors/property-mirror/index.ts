import { DeclarationMirror } from '../declaration-mirror';
import { ClassMirror } from '../class-mirror';
import { MethodMetadata, PropertyMetadata } from '../../metadatas';
import { ClassConstructor } from '../../interfaces';

/**
 * 成员映射
 */
export class PropertyMirror<
  T extends PropertyMetadata = any
> extends DeclarationMirror<T> {
  /**
   * classMirror
   * 所属的ClassMirror
   */
  public classMirror: ClassMirror;

  /**
   * 获取所有的元数据，包含父类/基类
   */
  public get allMetadata(): Set<T> {
    // 静态成员不向上查找 无继承关系
    if (this.classMirror.parentClassMirror && !this.isStatic) {
      const mirror = this.classMirror.parentClassMirror.getMirror<
        PropertyMetadata<T>
      >(this.propertyKey, this.isStatic);
      if (mirror) {
        const all = new Set(mirror.allMetadata);
        this.metadata.forEach((o) => {
          all.add(o);
        });
        return all as Set<T>;
      }
    }
    return new Set(this.metadata);
  }

  /**
   * 根据类型获取元数据列表
   * @param type
   */
  public getMetadataList<C extends PropertyMetadata>(
    type: ClassConstructor<C>
  ): T[] {
    return Array.from(this.allMetadata).filter((o) => o instanceof type);
  }

  /**
   * propertyKey
   * Mirror映射的目标上的key名称
   */
  public propertyKey: string | symbol;

  /**
   * 是否为静态成员
   * @private
   */
  private isStatic: boolean;

  /**
   * 获取参数的默认类型
   */
  public getDesignType<T extends Function>(): T {
    return Reflect.getMetadata(
      'design:type',
      this.target,
      this.propertyKey
    ) as T;
  }

  /**
   * 创建成员装饰器
   * @param metadata
   */
  public static createDecorator(metadata: PropertyMetadata): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
      const isStatic: boolean = ClassMirror.isStaticMember(target, propertyKey);
      // 获取已有的类映射管理器 如果没有则创建一个新的
      const classMirror = ClassMirror.reflect(
        isStatic ? (target as Function) : target.constructor
      );

      classMirror.target = isStatic ? target : target.constructor;

      const propertyMirror =
        classMirror.getMirror<PropertyMetadata>(propertyKey, isStatic) ||
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
        target,
        propertyKey
      );
    };
  }

  /**
   * 映射元数据
   * @param target
   * @param propertyKey
   * @param isStatic
   *
   * 该方法根据映射的目标和目标上的key名称 返回映射的PropertyMirror实例
   */
  public static reflect(
    target: Function,
    propertyKey: string | symbol,
    isStatic = false
  ): PropertyMirror | undefined {
    return Reflect.getMetadata(
      PropertyMirror,
      isStatic ? target : target.prototype,
      propertyKey
    ) as PropertyMirror;
  }
}
