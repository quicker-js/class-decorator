import 'reflect-metadata';
import { describe, it } from 'mocha';
import * as chai from 'chai';
import { SimpleUsage1 } from '../sample/simple-usage-1';
import { ClassMirror, DeclarationMirror, MethodMirror } from '../src';

describe('index.spec.ts test SimpleUsage1.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleUsage1);

  it('MethodMirror reflect should return type MethodMirror.', function () {
    const methodMirror = MethodMirror.reflect(
      SimpleUsage1,
      SimpleUsage1.run,
      true
    );

    chai.assert(
      methodMirror instanceof MethodMirror,
      'SimpleUsage1 SimpleUsage1.run reflect type MethodMirror.'
    );
  });

  it('check SimpleUsage1 property.', function () {
    const propertiesMirrors = classMirror.getPropertiesMirrors();
    chai.assert(
      propertiesMirrors.length === 2,
      'SimpleUsage1 property not 2 size.'
    );
  });

  it('check SimpleUsage1 static property.', function () {
    const propertiesMirrors = classMirror.getStaticPropertiesMirrors();
    chai.assert(
      propertiesMirrors.length === 1,
      'SimpleUsage1 static property not 1 size.'
    );
  });

  it('check SimpleUsage1 method.', function () {
    const mirrors = classMirror.getMethodMirrors();
    chai.assert(mirrors.length === 3, 'SimpleUsage1 method not 3 size.');
    mirrors.forEach((o) => {
      chai.assert(
        o.descriptor,
        `SimpleUsage1 ${o.propertyKey.toString()} not fount descriptor.`
      );
    });
  });

  it('check SimpleUsage1 static method.', function () {
    const mirrors = classMirror.getStaticMethodMirrors();
    chai.assert(mirrors.length === 3, 'SimpleUsage1 static method not 3 size.');
    mirrors.forEach((o) => {
      chai.assert(
        o.descriptor,
        `SimpleUsage1 ${o.propertyKey.toString()} not fount descriptor.`
      );
    });
  });

  it('check member should in mirror.', function () {
    classMirror.staticMembers.forEach((mirror) => {
      chai.assert(
        mirror.propertyKey,
        `${DeclarationMirror.name} propertyKey is not found.`
      );

      chai.assert(
        mirror.target,
        `${DeclarationMirror.name} target is not found.`
      );
    });

    classMirror.instanceMembers.forEach((mirror) => {
      chai.assert(
        mirror.propertyKey,
        `${DeclarationMirror.name} propertyKey is not found.`
      );
      chai.assert(
        mirror.target,
        `${DeclarationMirror.name} target is not found.`
      );
    });
  });
});
