import { DeclarationMirror } from '../declaration-mirror';
import { ClassMirror } from '../class-mirror';
import { MethodMetadata } from '../../metadatas';
import { ParameterMirror } from '../parameter-mirror';

/**
 * @class MethodMirror
 * 方法反射
 */
export class MethodMirror<
  T = unknown,
  D = unknown
> extends DeclarationMirror<T> {
  /**
   * classMirror
   */
  public classMirror: ClassMirror;

  /**
   * propertyKey
   */
  public propertyKey: string | symbol;

  /**
   * parameters
   */
  public parameters: Map<number, ParameterMirror> = new Map();

  /**
   * target
   */
  public target: Object;

  /**
   * descriptor
   */
  public descriptor: D;

  /**
   * isStatic
   */
  public isStatic: boolean;

  /**
   * 获取参数的类型映射
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
  public getReturnType(): Function {
    return Reflect.getMetadata(
      'design:returntype',
      this.target,
      this.propertyKey
    ) as Function;
  }

  /**
   * 创建方法装饰器
   * @param metadata
   */
  public static createDecorator(metadata: MethodMetadata): MethodDecorator {
    return <T>(
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> => {
      const isStatic = target.constructor === Function;
      const classMirror = ClassMirror.reflect(
        isStatic ? (target as Function) : target.constructor
      );

      const methodMirror =
        (classMirror.getMirror(propertyKey, isStatic) as MethodMirror) ||
        new MethodMirror();

      methodMirror.isStatic = isStatic;
      methodMirror.classMirror = classMirror;
      // 设置基本属性
      methodMirror.propertyKey = propertyKey;
      methodMirror.descriptor = descriptor;
      methodMirror.target = target.constructor;

      // metadata信息设置
      metadata.target = target;
      metadata.descriptor = descriptor;
      metadata.propertyKey = propertyKey;

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
      Reflect.defineMetadata(
        MethodMirror,
        methodMirror,
        isStatic ? target : target.constructor,
        propertyKey
      );

      // 定义函数名称元数据
      Reflect.defineMetadata(
        descriptor.value,
        methodMirror,
        isStatic ? target : target.constructor
      );

      return descriptor;
    };
  }

  /**
   * 使用函数查找映射数据
   * @param type
   * @param method
   * @param isStatic
   */
  public static reflect<T extends Function>(
    type: T,
    method: (...args: any[]) => any,
    isStatic?: boolean
  ): MethodMirror | undefined;
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
