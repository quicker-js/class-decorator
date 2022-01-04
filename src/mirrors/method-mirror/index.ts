import { DeclarationMirror } from '../declaration-mirror';
import { ClassMirror } from '../class-mirror';
import { MethodMetadata } from '../../metadatas';
import { ParameterMirror } from '../parameter-mirror';
import { ClassConstructor } from '../../interfaces';

/**
 * @class MethodMirror
 * 方法反射
 */
export class MethodMirror<
  T extends MethodMetadata = any,
  D = any
> extends DeclarationMirror<T> {
  /**
   * classMirror
   * 当前Mirror所属的ClassMirror
   */
  public classMirror: ClassMirror;

  /**
   * propertyKey
   * 当前Mirror所属target成员上的key名称
   */
  public propertyKey: string | symbol;

  /**
   * 获取所有的元数据，包含父类/基类
   */
  public get allMetadata(): Set<T> {
    // 静态成员不向上查找 无继承关系
    if (this.classMirror.parentClassMirror && !this.isStatic) {
      const mirror = this.classMirror.parentClassMirror.getMirror<
        MethodMetadata<T>
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
  public getMetadata<C extends MethodMetadata>(
    type: ClassConstructor<C>
  ): Set<C> {
    const metadata = new Set<C>();
    this.allMetadata.forEach((o) => {
      if (o instanceof type) {
        metadata.add(o);
      }
    });
    return metadata;
  }

  /**
   * parameters
   * 当前Mirror的所有参数ParameterMirror集合
   */
  public parameters: Map<number, ParameterMirror> = new Map();

  /**
   * descriptor
   * 当前参数的 descriptor
   */
  public descriptor: D;

  /**
   * isStatic
   * 是否为静态成员
   */
  public isStatic: boolean;

  /**
   * 获取参数的类型映射列表
   * 包含该函数上的所有参数
   * 返回数组的下标 对应ParameterMirror的index属性
   */
  public getDesignParamTypes(): Function[] {
    return Reflect.getMetadata(
      'design:paramtypes',
      this.target,
      this.propertyKey
    ) as Function[];
  }

  /**
   * 获取返回类型
   */
  public getReturnType(): Function | undefined {
    return Reflect.getMetadata(
      'design:returntype',
      this.target,
      this.propertyKey
    ) as Function;
  }

  /**
   * 创建方法装饰器
   * @param metadata
   * 使用此方法可以创建一个成员方法装饰器, metadata 必须继承至MethodMetadata对象
   */
  public static createDecorator(metadata: MethodMetadata): MethodDecorator {
    return <T>(
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> => {
      // 是类
      const isStatic: boolean = ClassMirror.isStaticMember(target, propertyKey);

      const classMirror = ClassMirror.reflect(
        isStatic ? (target as Function) : target.constructor
      );

      classMirror.target = isStatic ? target : target.constructor;

      // 获取 MethodMirror
      const methodMirror =
        classMirror.getMirror<MethodMetadata>(propertyKey, isStatic) ||
        new MethodMirror();

      // 设置基本属性
      methodMirror.isStatic = isStatic;
      methodMirror.classMirror = classMirror;
      methodMirror.propertyKey = propertyKey;
      methodMirror.descriptor = descriptor;
      methodMirror.target = target;

      // metadata信息设置
      metadata.classMirror = classMirror;
      metadata.propertyKey = propertyKey;
      metadata.descriptor = descriptor;
      metadata.target = target;

      // 反向映射元数据至 MethodMirror
      Reflect.defineMetadata(
        metadata,
        methodMirror,
        isStatic ? target : target.constructor
      );

      // 设置元数据
      methodMirror.metadata.add(metadata);

      // 添加mirror
      classMirror.setMirror(propertyKey, methodMirror, isStatic);

      // 定义类元数据
      Reflect.defineMetadata(
        ClassMirror,
        classMirror,
        isStatic ? target : target.constructor
      );

      // 定义 MethodMirror 元数据
      Reflect.defineMetadata(MethodMirror, methodMirror, target, propertyKey);

      // 定义函数名称元数据
      Reflect.defineMetadata(descriptor.value, methodMirror, target);

      return descriptor;
    };
  }

  /**
   * 使用函数名称查找映射数据
   * @param type
   * @param method
   * @param isStatic
   */
  public static reflect<T extends Function>(
    type: T,
    method: string | symbol,
    isStatic?: boolean
  ): MethodMirror | undefined;
  /**
   * 使用函数查找映射数据
   * @param type
   * @param method
   * @param isStatic
   *
   * 使用此方法可以目标类上的函数所映射的MethodMirror实例 具体使用方法请查阅test/index.spec.ts文件.
   */
  public static reflect<T extends Function>(
    type: T,
    method: (...args: any[]) => any,
    isStatic?: boolean
  ): MethodMirror | undefined;
  /**
   * 实现方法
   * @param type
   * @param method
   * @param isStatic
   */
  public static reflect<T extends Function>(
    type: T,
    method: unknown,
    isStatic?: boolean
  ): MethodMirror | undefined {
    if (typeof method === 'string' || typeof method === 'symbol') {
      return Reflect.getMetadata(
        MethodMirror,
        isStatic ? type : type.prototype,
        method
      ) as MethodMirror;
    }

    return Reflect.getMetadata(
      method,
      isStatic ? type : type.prototype
    ) as MethodMirror;
  }
}
