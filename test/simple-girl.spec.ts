import 'reflect-metadata';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ClassMirror } from '../src';
import { SimpleGirl } from '../sample/simple-girl';

describe('simple-girl.spec.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleGirl);

  it('should match members length.', function () {
    // 获取方法成员 含父类
    const methodMirrorsFromAll = classMirror.getMethodMirrors(true);
    // 获取属性成员 含父类
    const propertiesMirrorsFromAll = classMirror.getPropertyMirrors(true);

    // 获取静态方法成员 不含父类
    const staticMethodMirrors = classMirror.getStaticMethodMirrors();
    // 获取静态属性成员 不含父类
    const staticPropertiesMirrors = classMirror.getStaticPropertyMirrors();
    // 实例成员方法 不含父类
    const methodMirrors = classMirror.getMethodMirrors();
    // 实例属性成员 不含父类
    const propertiesMirrors = classMirror.getPropertyMirrors();

    // 当前类 静态
    expect(staticMethodMirrors).instanceof(Array);
    expect(staticMethodMirrors.length).eq(0);
    expect(staticPropertiesMirrors).instanceof(Array);
    expect(staticPropertiesMirrors.length).eq(0);

    // 当前类 非静态
    expect(methodMirrors).instanceof(Array);
    expect(methodMirrors.length).eq(0);
    expect(propertiesMirrors).instanceof(Array);
    expect(propertiesMirrors.length).eq(0);

    // 含父类 非静态
    expect(methodMirrorsFromAll).instanceof(Array);
    expect(methodMirrorsFromAll.length).eq(0);
    expect(propertiesMirrorsFromAll).instanceof(Array);
    expect(propertiesMirrorsFromAll.length).eq(3);
  });
});
