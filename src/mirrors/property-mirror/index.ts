import { DeclarationMirror } from '../declaration-mirror';
import { ClassMirror } from '../class-mirror';
import { PropertyMetadata } from '../../metadatas';
import { ClassConstructor } from '../../interfaces';

/**
 * 成员映射
 */
export class PropertyMirror<
  T extends PropertyMetadata = any
> extends DeclarationMirror<T> {
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
        classMirror.getMirror<PropertyMirror>(propertyKey, isStatic) ||
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

  /**
   * classMirror
   * 所属的ClassMirror
   */
  public classMirror: ClassMirror;

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
   * 获取所有元数据 包含父类
   * @param type 类型, 参数继承至 `MethodMetadata`。
   */
  public getAllMetadata<M extends T = T>(type?: ClassConstructor<M>): M[] {
    if (this.isStatic) {
      return this.getMetadata(type);
    }
    const list: M[] = [];
    this.classMirror
      .getAllMirrors<PropertyMirror<M>>(PropertyMirror)
      .forEach((o) => {
        if (o.propertyKey === this.propertyKey) {
          const metadata = o.getMetadata(type);
          list.push(...metadata);
        }
      });
    return list;
  }

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
}
