import 'reflect-metadata';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ClassMirror, PropertyMirror } from '../src';
import { SimpleUsage1 } from '../sample/simple-usage-1';

describe('simple-usage-1.spec.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleUsage1);
  it('should match members length.', function () {
    expect(classMirror.parentClassMirror).eq(null);

    // 成员
    const propertiesMirrors = classMirror.getPropertiesMirrors();
    const staticPropertiesMirrors = classMirror.getStaticPropertiesMirrors();
    const propertiesMirrorsFromAll = classMirror.getPropertiesMirrorsFromAll();

    expect(propertiesMirrors.length).eq(2);
    expect(propertiesMirrorsFromAll.length).eq(2);
    expect(staticPropertiesMirrors.length).eq(1);

    // 方法
    const methodMirrors = classMirror.getMethodMirrors();
    const staticMethodMirrors = classMirror.getStaticMethodMirrors();
    const methodMirrorsFromAll = classMirror.getMethodMirrorsFromAll();
    expect(methodMirrors.length).eq(3);
    expect(staticMethodMirrors.length).eq(3);
    expect(methodMirrorsFromAll.length).eq(3);

    // 因为构造函数未使用参数装饰器 所以是0
    expect(classMirror.parameters.size).eq(0);
    expect(classMirror.getDesignParamTypes()).instanceof(Array);
    // 获取构造函数参数的数量可以使用此方法 但是必须使用了类装饰器/或者参数装饰器 否则获取不到
    expect(classMirror.getDesignParamTypes().length).eq(1);

    const propertyMirror = PropertyMirror.reflect(SimpleUsage1, 'name');

    if (propertyMirror) {
      // 获取当前类中指定成员的元数据数量
      expect(propertyMirror.metadata.size).eq(1);
      // 获取指定成员的元数据数量 包含父类
      expect(propertyMirror.allMetadata.size).eq(1);
    }
  });
});
