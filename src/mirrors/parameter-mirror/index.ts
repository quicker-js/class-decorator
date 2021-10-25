import { DeclarationMirror } from '../declaration-mirror';
import { ClassMirror } from '../class-mirror';
import { MethodMirror } from '../method-mirror';
import { ParameterMetadata } from '../../metadatas/parameter-metadata';

/**
 * 参数装饰器映射
 * @class ParameterMirror
 */
export class ParameterMirror<T = unknown> extends DeclarationMirror<T> {
  public methodMirror: MethodMirror;

  public classMirror: ClassMirror;

  public target: Object;

  public propertyKey: string | symbol;

  public index: number;

  /**
   * 创建装饰器
   * @param metadata
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

      const methodMirror =
        (classMirror.getMirror(propertyKey, isStatic) as MethodMirror) ||
        new MethodMirror();

      if (!methodMirror.descriptor) {
        methodMirror.target = target;
        methodMirror.propertyKey = propertyKey;
        methodMirror.isStatic = isStatic;
        methodMirror.classMirror = classMirror;

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
      Reflect.defineMetadata(
        MethodMirror,
        methodMirror,
        isStatic ? target : target.constructor,
        propertyKey
      );

      // 定义类元数据
      Reflect.defineMetadata(
        ClassMirror,
        classMirror,
        isStatic ? target : target.constructor
      );
    };
  }
}
