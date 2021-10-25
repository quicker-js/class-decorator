import { ClassMirror, MethodMirror, PropertyMirror } from '../../mirrors';
import { ClassConstructor } from '../../interfaces';

/**
 * @class ClassMirrorManager
 * 类反射管理器
 */
export class ClassMirrorManager {
  /**
   * class映射集合
   */
  public classMirrors: Set<ClassMirror> = new Set();

  /**
   * 属性成员集合
   */
  public properties: Set<PropertyMirror> = new Set();

  /**
   * 静态成员集合
   */
  public staticProperties: Set<PropertyMirror> = new Set();

  /**
   * 方法成员集合
   */
  public methods: Set<MethodMirror> = new Set();

  /**
   * 静态方法成员集合
   */
  public staticMethods: Set<MethodMirror> = new Set();

  /**
   * 实例成员名称列表
   */
  public get propertyKeys(): Array<string | symbol> {
    return this.getKeys(PropertyMirror);
  }

  /**
   * 静态成员名称列表
   */
  public get staticPropertyKeys(): Array<string | symbol> {
    return this.getKeys(PropertyMirror, true);
  }

  /**
   * 获取方法成员名称列表
   */
  public get methodKeys(): Array<string | symbol> {
    return this.getKeys(MethodMirror);
  }

  /**
   * 获取静态方法成员名称列表
   */
  public get staticMethodKeys(): Array<string | symbol> {
    return this.getKeys(MethodMirror, true);
  }

  /**
   * 获取key
   * @param type
   * @param isStatic
   * @private
   */
  private getKeys(
    type: ClassConstructor<MethodMirror | PropertyMirror>,
    isStatic?: boolean
  ): Array<string | symbol> {
    const list: Array<string | symbol> = [];
    let set: Set<MethodMirror | PropertyMirror> | undefined = undefined;
    if (type === MethodMirror) {
      if (isStatic) {
        set = this.staticMethods;
      } else {
        set = this.methods;
      }
    } else {
      if (isStatic) {
        set = this.staticProperties;
      } else {
        set = this.properties;
      }
    }

    set.forEach(
      (o) => !list.includes(o.propertyKey) && list.push(o.propertyKey)
    );

    return list;
  }
}
