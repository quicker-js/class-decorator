import 'reflect-metadata';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ClassMirror, MethodMirror, PropertyMirror } from '../src';
import { SimpleUsage2 } from '../sample/simple-usage-2';

describe('simple-usage-2.spec.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleUsage2);
  it('should match members length.', function () {
    expect(classMirror.parentClassMirror).instanceof(ClassMirror);

    // 成员
    const propertiesMirrors = classMirror.getPropertyMirrors();
    const staticPropertiesMirrors = classMirror.getStaticPropertyMirrors();
    const propertiesMirrorsFromAll = classMirror.getPropertyMirrors(true);

    expect(propertiesMirrors.length).eq(3);
    expect(propertiesMirrorsFromAll.length).eq(4);
    expect(staticPropertiesMirrors.length).eq(0);

    // 方法
    const methodMirrors = classMirror.getMethodMirrors();
    const staticMethodMirrors = classMirror.getStaticMethodMirrors();
    const methodMirrorsFromAll = classMirror.getMethodMirrors(true);

    expect(methodMirrors.length).eq(1);
    expect(staticMethodMirrors.length).eq(0);
    expect(methodMirrorsFromAll.length).eq(3);

    const propertyMirror = PropertyMirror.reflect(SimpleUsage2, 'name');

    if (propertyMirror) {
      // 包含父类的一个装饰器 总共两个装饰器
      expect(propertyMirror.allMetadata.size).eq(2);
      // 不包含父类 所以只有一个装饰器
      expect(propertyMirror.metadata.size).eq(1);
    }
  });

  it('should MethodMirror.reflect return MethodMirror.', function () {
    const methodMirror = MethodMirror.reflect(SimpleUsage2, 'run');

    if (methodMirror) {
      // 不包含父类 只有一个
      expect(methodMirror.metadata.size).eq(1);
      // 包含父类的装饰器 总共2个
      expect(methodMirror.allMetadata.size).eq(2);

      // 该函数的返回值为String
      expect(methodMirror.getReturnType()).eq(String);
    }

    const methodMirror1 = MethodMirror.reflect(
      SimpleUsage2,
      SimpleUsage2.run,
      true
    );
    const methodMirror2 = MethodMirror.reflect(SimpleUsage2, 'run', true);
    // 上面两种方式获取映射的 MethodMirror 其实是SimpleUsage2同一个静态方法 所以MethodMirror也是同一个
    expect(methodMirror1).eq(methodMirror2);

    if (methodMirror1) {
      // 此方法只有一个装饰器
      expect(methodMirror1.metadata.size).eq(1);
      // 此方法是静态方法，就算父类有相同的静态方法，allMetadata 也不会包含父类的元数据
      expect(methodMirror1.allMetadata.size).eq(methodMirror1.metadata.size);
      // 因为allMetadata是克隆的Set，所以metadata 和allMetadata其实是不相等的
      expect(methodMirror1.metadata === methodMirror1.allMetadata).eq(false);
    }
  });
});
