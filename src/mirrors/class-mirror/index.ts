import { DeclarationMirror } from '../declaration-mirror';
import { MethodMirror } from '../method-mirror';
import { PropertyMirror } from '../property-mirror';
import {
  ClassMetadata,
  MethodMetadata,
  ParameterMetadata,
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
  /**
   * 构造函数参数
   * 此处的`parameters.size`数量是构造函数使用了`ParameterMirror.createDecorator`创建的装饰的成员数量,
   * 要获取所有参数的数量，请使用方法 `[new ClassMirror].getDesignParamTypes`.
   */
  public parameters: Map<number, ParameterMirror> = new Map();

  /**
   * 获取所有元数据 包含父类
   */
  public get allMetadata(): Set<T> {
    if (this.parentClassMirror) {
      const set = new Set(this.parentClassMirror.allMetadata);
      this.metadata.forEach((o) => set.add(o));
      return set;
    }
    return this.metadata;
  }

  /**
   * 父ClassMirror
   */
  public parentClassMirror: ClassMirror | null = null;

  /**
   * static member collection
   */
  public readonly staticMembers: Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > = new Map();

  /**
   * 全部静态成员缓存
   * @private
   */
  private _allStaticMembers: Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > | null = null;

  /**
   * 全部实例成员缓存
   * @private
   */
  private _allInstanceMembers: Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > | null = null;

  /**
   * 所有实例成员包含父，当前成员会覆盖父级同名成员, 要获取不覆盖的集合请使用getAllMirrors方法
   */
  public get allInstanceMembers(): Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > {
    if (!this._allInstanceMembers) {
      const map = new Map();
      this._allInstanceMembers = map;
      if (this.parentClassMirror) {
        this.parentClassMirror.allInstanceMembers.forEach((v, k) => {
          map.set(k, v);
        });
      }
      this.instanceMembers.forEach((v, k) => {
        map.set(k, v);
      });
    }

    return this._allInstanceMembers;
  }

  /**
   * 实例成员集合
   */
  public readonly instanceMembers: Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > = new Map();

  /**
   * 获取指定位置的参数装饰器反射, 不包含父类（基类）.
   * @param index
   */
  public getParameter<T extends ParameterMetadata>(
    index: number
  ): ParameterMirror<T> {
    return this.parameters.get(index) as ParameterMirror<T>;
  }

  /**
   * 获取构造函数参数类型, 不包含父类（基类）.
   */
  public getDesignParamTypes<T extends Function = Function>(): T[] {
    return Reflect.getMetadata('design:paramtypes', this.target) as T[];
  }

  /**
   * 获取静态方法映射集合, 不包含父类（基类）.
   */
  public getStaticMethodMirrors<
    T extends MethodMetadata = any
  >(): MethodMirror<T>[] {
    return this.getMirrors<ClassConstructor<MethodMirror<T>>>(
      MethodMirror,
      true
    );
  }

  /**
   * 获取实例方法映射集合.
   * @param includeSuper 是否包含父类`MethodMirror`
   */
  public getMethodMirrors<T extends MethodMetadata = any>(
    includeSuper = false
  ): MethodMirror<T>[] {
    return this.getMirrors<ClassConstructor<MethodMirror<T>>>(
      MethodMirror,
      false,
      includeSuper
    );
    return this.getMirrors<ClassConstructor<MethodMirror<T>>>(MethodMirror);
  }

  /**
   * @deprecated 请使用[ClassMirror].getMethodMirrors(true) 代替.
   * 获取成员方法，包含父类（基类）.
   */
  public getMethodMirrorsFromAll<
    T extends MethodMetadata = any
  >(): MethodMirror<T>[] {
    return this.getMirrorsFromAll<ClassConstructor<MethodMirror<T>>>(
      MethodMirror
    );
  }

  /**
   * @deprecated [ClassMirror.]getStaticPropertyMirrors(true) 代替;
   * 获取静态成员映射集合, 不包含父类（基类）.
   */
  public getStaticPropertiesMirrors<
    T extends PropertyMetadata = any
  >(): PropertyMirror<T>[] {
    return this.getMirrors<ClassConstructor<PropertyMirror<T>>>(
      PropertyMirror,
      true
    );
  }

  /**
   * getStaticPropertyMirrors
   * 获取静态成员映射集合 静态成员无继承关系，无法获取父类（基类）同属性名称装饰器的元数据
   * Get the static member mapping collection.
   * The static member has no inheritance relationship and
   * cannot get the metadata of the decorator with the same attribute name of the parent class (base class).
   */
  public getStaticPropertyMirrors<
    T extends PropertyMetadata = any
  >(): PropertyMirror<T>[] {
    return this.getMirrors<ClassConstructor<PropertyMirror<T>>>(
      PropertyMirror,
      true
    );
  }

  /**
   * @deprecated 请使用 [ClassMirror.]getPropertyMirrors(true) 代替;
   * 获取静态成员映射集合, 不包含父类（基类）.
   */
  public getPropertiesMirrors<
    T extends PropertyMetadata = any
  >(): PropertyMirror<T>[] {
    return this.getMirrors<ClassConstructor<PropertyMirror<T>>>(PropertyMirror);
  }

  /**
   * getPropertyMirrors
   * 获取静态成员映射集合
   * @param includeSuper 是否包含父类
   */
  public getPropertyMirrors<T extends PropertyMetadata = any>(
    includeSuper = false
  ): PropertyMirror<T>[] {
    if (includeSuper) {
      return this.getMirrorsFromAll<ClassConstructor<PropertyMirror<T>>>(
        PropertyMirror
      );
    }
    return this.getMirrors<ClassConstructor<PropertyMirror<T>>>(PropertyMirror);
  }

  /**
   * @deprecated 请使用 [ClassMirror.]getPropertyMirrors(true) 代替;
   * 获取实例成员，包含父类（基类）.
   */
  public getPropertiesMirrorsFromAll<
    T extends MethodMetadata = any
  >(): PropertyMirror<T>[] {
    return this.getMirrorsFromAll<ClassConstructor<PropertyMirror<T>>>(
      PropertyMirror
    );
  }

  /**
   * Get MethodMirror, 不包含父类（基类）.
   * @param mirrorKey mirrorKey
   * @param isStatic
   */
  public getMirror<T extends MethodMetadata = any>(
    mirrorKey: string | symbol,
    isStatic: boolean
  ): MethodMirror<T> | undefined;
  /**
   * Get PropertyMirror, 不包含父类（基类）.
   * @param mirrorKey
   * @param isStatic
   */
  public getMirror<T extends PropertyMetadata = any>(
    mirrorKey: string | symbol,
    isStatic: boolean
  ): PropertyMirror<T> | undefined;
  /**
   * 实现
   * @param mirrorKey
   * @param isStatic
   * @param includeSuper 是否包含supper 父类（基类）中的Mirror.
   * 如果从选择从父类或者基类获取相同名称的成员装饰器元数据，当前类的会优先于父类（基类），当前class会覆盖父类的同名成员的元数据.
   */
  public getMirror<T extends MethodMirror | PropertyMirror = any>(
    mirrorKey: string | symbol,
    isStatic = false,
    includeSuper = false
  ): T | undefined {
    if (isStatic) {
      return this.staticMembers.get(mirrorKey) as T;
    } else {
      return this.instanceMembers.get(mirrorKey) as T;
    }
  }

  /**
   * @deprecated 请使用 [ClassMirror].getMirror(mirrorKey, isStatic, true). 代替
   * 从所有mirror中获取mirror, 含父类（基类）中的mirror，优先获取当前类中的Mirror.
   * @param mirrorKey
   * @param isStatic
   */
  public getMirrorFromAll<T extends MethodMirror | PropertyMirror = any>(
    mirrorKey: string | symbol,
    isStatic: boolean
  ): T | undefined {
    return (
      isStatic
        ? this.staticMembers.get(mirrorKey)
        : this.allInstanceMembers.get(mirrorKey)
    ) as T;
  }

  /**
   * 移除 mirror， 不含父类（基类）中的mirror
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
   * 获取所有的Mirror
   * @param Type 参数可以是MethodMirror或者PropertyMirror
   * @param isStatic 是否获取静态成员
   * 获取指定的mirror集合，需要指定 Type，Type的参数可以是MethodMirror或者PropertyMirror.
   * @param includeSuper 是否包含基类中的Mirror
   */
  public getMirrors<T extends ClassConstructor = any>(
    Type: T,
    isStatic = false,
    includeSuper = false
  ): InstanceType<T>[] {
    const mirrors = isStatic ? this.staticMembers : this.instanceMembers;
    return Array.from(mirrors.values()).filter(
      (o) => o instanceof Type
    ) as InstanceType<T>[];
  }

  /**
   * @deprecated 请使用[ClassMirror].getMirrors(Type, isStatic, true) 代替.
   * 获取 mirrors，含父类（基类）中的mirror 优先获取当前类中的Mirror，当前类的成员覆盖父类（基类）中的成员
   * @param Type
   * @param isStatic
   */
  public getMirrorsFromAll<T extends ClassConstructor = any>(
    Type: T,
    isStatic = false
  ): InstanceType<T>[] {
    const mirrors = isStatic ? this.staticMembers : this.allInstanceMembers;
    return Array.from(mirrors.values()).filter(
      (o) => o instanceof Type
    ) as InstanceType<T>[];
  }

  /**
   * 获取所有的mirrors，含父类（基类）中的mirror
   * @param Type
   * @param isStatic
   */
  public getAllMirrors<T extends ClassConstructor>(
    Type: T,
    isStatic = false
  ): InstanceType<T>[] {
    if (this.parentClassMirror) {
      return this.parentClassMirror
        .getAllMirrors(Type, isStatic)
        .concat(this.getMirrors(Type, isStatic));
    }
    return this.getMirrors(Type, isStatic);
  }

  /**
   * 添加 mirror，只在当前类中添加
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
    const metadata = Reflect.getMetadata(
      ClassMirror,
      type
    ) as DeclarationMirror;
    if (metadata instanceof ClassMirror) {
      if (metadata.target === type) {
        return metadata;
      } else {
        const classMirror = new ClassMirror();
        classMirror.parentClassMirror = metadata;
        return classMirror;
      }
    }
    return new ClassMirror();
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
