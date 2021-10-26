import { DeclarationMirror } from '../declaration-mirror';
import { ClassMirror } from '../class-mirror';
import { MethodMirror } from '../method-mirror';
import { ParameterMetadata } from '../../metadatas';

/**
 * 参数装饰器映射
 * @class ParameterMirror
 */
export class ParameterMirror<T = unknown> extends DeclarationMirror<T> {
  /**
   * methodMirror
   * 当前参数所属MethodMirror
   */
  public methodMirror: MethodMirror;

  /**
   * classMirror
   * 当前参数所属ClassMirror
   */
  public classMirror: ClassMirror;

  /**
   * target
   * 当前参数装饰的目标
   */
  public target: Object;

  /**
   * propertyKey
   * 当前参数的key名称
   */
  public propertyKey: string | symbol;

  /**
   * index
   * 当前参数的下标
   */
  public index: number;

  /**
   * 获取当前参数的类型
   * 如果该参数没有类型则返回undefined.
   */
  public getDesignParamType(): Function | undefined {
    return this.methodMirror.getDesignParamTypes()[this.index];
  }

  /**
   * 创建装饰器
   * @param metadata 元数据对象
   * 创建一个参数装饰器， metadata 必须继承至 ParameterMetadata 类.
   */
  public static createDecorator(
    metadata: ParameterMetadata
  ): ParameterDecorator {
    return (
      target: Object,
      propertyKey: string | symbol,
      parameterIndex: number
    ): void => {
      const isStatic: boolean = target.constructor === Function;
      const classMirror = ClassMirror.reflect(
        isStatic ? (target as Function) : target.constructor
      );

      classMirror.target = isStatic ? target : target.constructor;

      const methodMirror =
        (classMirror.getMirror(propertyKey, isStatic) as MethodMirror) ||
        new MethodMirror();

      if (!methodMirror.descriptor) {
        methodMirror.propertyKey = propertyKey;
        methodMirror.isStatic = isStatic;
        methodMirror.classMirror = classMirror;
        methodMirror.target = target;
        methodMirror.descriptor = Object.getOwnPropertyDescriptor(
          target,
          propertyKey
        );
      }

      // 查找参数
      const parameterMirror =
        (methodMirror.parameters.get(parameterIndex) as ParameterMirror) ||
        new ParameterMirror();

      // 元数据关联
      metadata.target = target;
      metadata.classMirror = classMirror;
      metadata.methodMirror = methodMirror;
      metadata.propertyKey = propertyKey;
      metadata.index = parameterIndex;

      // 添加元数据
      parameterMirror.metadata.add(metadata);

      // 设置基本信息
      parameterMirror.target = target;
      parameterMirror.propertyKey = propertyKey;
      parameterMirror.index = parameterIndex;
      parameterMirror.classMirror = classMirror;
      parameterMirror.methodMirror = methodMirror;

      // 设置参数
      methodMirror.parameters.set(parameterIndex, parameterMirror);

      // 设置方法映射
      classMirror.setMirror(propertyKey, methodMirror, isStatic);

      // 定义方法元数据
      Reflect.defineMetadata(MethodMirror, methodMirror, target, propertyKey);

      // 定义类元数据
      Reflect.defineMetadata(
        ClassMirror,
        classMirror,
        isStatic ? target : target.constructor
      );
    };
  }
}
