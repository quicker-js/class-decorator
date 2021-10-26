import { DeclarationMirror } from '../declaration-mirror';
import { MethodMirror } from '../method-mirror';
import { PropertyMirror } from '../property-mirror';
import { ClassMetadata, DeclarationMetadata } from '../../metadatas';
import { ClassConstructor } from '../../interfaces';

/**
 * @class ClassMirror
 * 类映射
 */
export class ClassMirror<T = unknown> extends DeclarationMirror<T> {
  /**
   * 当前ClassMirror所属的target
   */
  public target: Object;

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
  public staticMembers: Map<string | symbol, MethodMirror | PropertyMirror> =
    new Map();

  /**
   * instance member collection
   */
  public instanceMembers: Map<string | symbol, MethodMirror | PropertyMirror> =
    new Map();

  /**
   * 获取静态方法映射集合
   */
  public getStaticMethodMirrors(): MethodMirror[] {
    return this.getMirrors(MethodMirror, true);
  }

  /**
   * 获取实例方法映射集合
   */
  public getMethodMirrors(): MethodMirror[] {
    return this.getMirrors(MethodMirror);
  }

  /**
   * 获取静态成员映射集合
   */
  public getStaticPropertiesMirrors(): PropertyMirror[] {
    return this.getMirrors(PropertyMirror, true);
  }

  /**
   * 获取静态成员映射集合
   */
  public getPropertiesMirrors(): PropertyMirror[] {
    return this.getMirrors(PropertyMirror);
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
   * 获取元数据列表
   * 元数据中会包含父类（超类）的元数据 此方法用于过滤掉除自己以外的元数据
   */
  public getSelfMetadata(): ClassMetadata[] {
    const list: ClassMetadata[] = [];
    this.metadata.forEach((metadata) => {
      if (
        metadata instanceof ClassMetadata &&
        metadata.target === this.target
      ) {
        list.push(metadata);
      }
    });
    return list;
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
}
