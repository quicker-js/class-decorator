import { DeclarationMirror } from '../declaration-mirror';
import { MethodMirror } from '../method-mirror';
import { PropertyMirror } from '../property-mirror';
import {
  ClassMetadata,
  MethodMetadata,
  PropertyMetadata,
} from '../../metadatas';
import { ClassConstructor } from '../../interfaces';
import { ParameterMirror } from '../parameter-mirror';

/**
 * @class ClassMirror
 * 类映射
 */
export class ClassMirror<
  T extends ClassMetadata = any
> extends DeclarationMirror<T> {
  // 构造函数参数
  public parameters: Map<number, ParameterMirror> = new Map();

  /**
   * mirror collection
   */
  public get declarations(): DeclarationMirror[] {
    return ([] as DeclarationMirror[]).concat(
      Array.from(this.staticMembers.values()),
      Array.from(this.instanceMembers.values())
    );
  }

  /**
   * static member collection
   */
  public readonly staticMembers: Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > = new Map();

  /**
   * instance member collection
   */
  public readonly instanceMembers: Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > = new Map();

  /**
   * 获取构造函数参数类型
   */
  public getDesignParamTypes(): Function[] {
    return Reflect.getMetadata('design:paramtypes', this.target) as Function[];
  }

  /**
   * 获取静态方法映射集合
   */
  public getStaticMethodMirrors<T extends MethodMetadata>(): MethodMirror<T>[] {
    return this.getMirrors<ClassConstructor<MethodMirror<T>>>(
      MethodMirror,
      true
    );
  }

  /**
   * 获取实例方法映射集合
   */
  public getMethodMirrors<T extends MethodMetadata>(): MethodMirror<T>[] {
    return this.getMirrors<ClassConstructor<MethodMirror<T>>>(MethodMirror);
  }

  /**
   * 获取静态成员映射集合
   */
  public getStaticPropertiesMirrors<
    T extends PropertyMetadata
  >(): PropertyMirror<T>[] {
    return this.getMirrors<ClassConstructor<PropertyMirror<T>>>(
      PropertyMirror,
      true
    );
  }

  /**
   * 获取静态成员映射集合
   */
  public getPropertiesMirrors<
    T extends PropertyMetadata
  >(): PropertyMirror<T>[] {
    return this.getMirrors<ClassConstructor<PropertyMirror<T>>>(PropertyMirror);
  }

  /**
   * Get Mirror
   * @param mirrorKey mirrorKey
   * @param isStatic
   */
  public getMirror(
    mirrorKey: string | symbol,
    isStatic = false
  ): MethodMirror | PropertyMirror | undefined {
    if (isStatic) {
      return this.staticMembers.get(mirrorKey);
    } else {
      return this.instanceMembers.get(mirrorKey);
    }
  }

  /**
   * 移除 mirror
   * Remove mirror
   * @param mirrorKey
   * @param isStatic
   *
   * 移除一个Mirror
   */
  public removeMirror(mirrorKey: string | symbol, isStatic = false): void {
    if (isStatic) {
      this.staticMembers.delete(mirrorKey);
    } else {
      this.instanceMembers.delete(mirrorKey);
    }
  }

  /**
   * 获取 mirrors
   * @param Type 参数可以是MethodMirror或者PropertyMirror
   * @param isStatic 是否获取静态成员
   *
   * 获取指定的mirror集合，需要指定 Type，Type的参数可以是MethodMirror或者PropertyMirror.
   */
  public getMirrors<T extends ClassConstructor>(
    Type: T,
    isStatic = false
  ): InstanceType<T>[] {
    const mirrors = isStatic ? this.staticMembers : this.instanceMembers;

    return Array.from(mirrors.values()).filter(
      (o) => o instanceof Type
    ) as InstanceType<T>[];
  }

  /**
   * 添加 mirror
   * @param mirrorKey
   * @param mirror DeclarationMirror
   * @param isStatic 是否为静态成员
   * 使用该方法可以添加一个Mirror 可以是 MethodMirror 也可以是 PropertyMirror，ParameterMirror不应添加至此处，ParameterMirror属于
   * MethodMirror管理.
   */
  public setMirror<T extends MethodMirror | PropertyMirror>(
    mirrorKey: string | symbol,
    mirror: T,
    isStatic = false
  ): void {
    if (isStatic) {
      this.staticMembers.set(mirrorKey, mirror);
    } else {
      this.instanceMembers.set(mirrorKey, mirror);
    }
  }

  /**
   * 创建类装饰器
   * @param classMetadata
   * 使用此方法可以创建一个类装饰器 classMetadata 必须继承至 ClassMetadata类.
   */
  public static createDecorator(classMetadata: ClassMetadata): ClassDecorator {
    return (target): void => {
      // 获取已有的类映射管理器 如果没有则创建一个新的
      const classMirror = ClassMirror.reflect(target);
      classMirror.target = target;
      classMetadata.target = target;
      classMetadata.classMirror = classMirror;
      classMirror.metadata.add(classMetadata);

      // 反向映射实例
      Reflect.defineMetadata(classMetadata, classMirror, target);

      // 定义元数据
      Reflect.defineMetadata(ClassMirror, classMirror, target);
    };
  }

  /**
   * 获取映射数据
   * @param type
   *
   * 使用此方法可以获取指定类型 type类上的 ClassMirror实例.
   */
  public static reflect<T extends Function>(type: T): ClassMirror {
    return (
      (Reflect.getMetadata(ClassMirror, type) as ClassMirror) ||
      new ClassMirror()
    );
  }

  /**
   * 判断target的静态成员中是否包含propertyKey
   * @param target
   * @param propertyKey
   */
  public static isStaticMember<T extends Object>(
    target: T,
    propertyKey: string | symbol
  ): boolean {
    // 如果是class constructor === Function
    if (target.constructor === Function) {
      return (
        Object.getOwnPropertyNames(target).includes(propertyKey as any) ||
        Object.getOwnPropertySymbols(target).includes(propertyKey as any)
      );
    } else if ((target as any).prototype) {
      return ClassMirror.isStaticMember((target as any).prototype, propertyKey);
    }
    return false;
  }
}
