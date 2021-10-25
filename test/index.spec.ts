import 'reflect-metadata';
import { describe, it } from 'mocha';
import * as chai from 'chai';
import { SimpleUsage1 } from '../sample/simple-usage-1';
import {
  ClassMirror,
  DeclarationMirror,
  MethodMirror,
  PropertyMirror,
} from '../src';

describe('index.spec.ts test SimpleUsage1.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleUsage1);

  it('Reflect class SimpleUsage1.run should return type MethodMirror.', function () {
    const methodMirror = MethodMirror.reflect(
      SimpleUsage1,
      SimpleUsage1.run,
      true
    );

    chai.assert(
      methodMirror instanceof MethodMirror,
      'SimpleUsage1 SimpleUsage1.run reflect type MethodMirror.'
    );

    if (methodMirror) {
      chai.assert(
        methodMirror.getReturnType() === Boolean,
        'return type not Boolean.'
      );
    }
  });

  it('Reflect class SimpleUsage1.getMetadataKeys should return type MethodMirror.', function () {
    const methodMirror = MethodMirror.reflect(
      SimpleUsage1,
      SimpleUsage1.getMetadataKeys,
      true
    );

    chai.assert(
      methodMirror instanceof MethodMirror,
      'SimpleUsage1 SimpleUsage1.getMetadataKeys reflect type MethodMirror.'
    );

    if (methodMirror) {
      chai.assert(
        methodMirror.getReturnType() === Number,
        'return type not Number.'
      );
    }
  });

  it('Reflect class SimpleUsage1.info should return type MethodMirror.', function () {
    const methodMirror = MethodMirror.reflect(SimpleUsage1, 'run');
    const methodMirror2 = MethodMirror.reflect(SimpleUsage1, 'run', true);
    const methodMirror3 = MethodMirror.reflect(SimpleUsage1, 'test1');

    if (methodMirror && methodMirror2 && methodMirror3) {
      const parameterMirror0 = methodMirror.parameters.get(0);
      const parameterMirror1 = methodMirror.parameters.get(1);

      if (parameterMirror0 && parameterMirror1) {
        chai.assert(
          parameterMirror0.getDesignParamType() === String,
          'SimpleUsage1.run parameter[0] is String type.'
        );

        chai.assert(
          parameterMirror1.getDesignParamType() === Number,
          'SimpleUsage1.run parameter[1] is Number type.'
        );
      }

      chai.assert(
        methodMirror.parameters.size === 2,
        'SimpleUsage1.run have 2 parameters.'
      );

      chai.assert(
        methodMirror2.parameters.size === 1,
        'SimpleUsage1.run (static) have 1 parameters.'
      );

      chai.assert(
        methodMirror3.parameters.size === 1,
        'SimpleUsage1.test1 have 1 parameters.'
      );
    }

    // chai.assert(
    //   methodMirror instanceof MethodMirror,
    //   'SimpleUsage1 SimpleUsage1.info reflect type MethodMirror.'
    // );
    //
    // if (methodMirror) {
    //   chai.assert(
    //     methodMirror.getReturnType() === Number,
    //     'return type not Number.'
    //   );
    // }
  });

  it('check SimpleUsage1 property.', function () {
    const propertiesMirrors = classMirror.getPropertiesMirrors();
    chai.assert(
      propertiesMirrors.length === 2,
      'SimpleUsage1 property not 2 size.'
    );

    propertiesMirrors.forEach((prop) => {
      chai.assert(prop.getDesignType(), 'Cannot found design:type.');
    });
  });

  it('check SimpleUsage1 static property.', function () {
    const propertiesMirrors = classMirror.getStaticPropertiesMirrors();
    chai.assert(
      propertiesMirrors.length === 1,
      'SimpleUsage1 static property not 1 size.'
    );
    propertiesMirrors.forEach((prop) => {
      chai.assert(prop.getDesignType(), 'Cannot found design:type.');
    });
  });

  it('check SimpleUsage1 method.', function () {
    const mirrors = classMirror.getMethodMirrors();
    chai.assert(mirrors.length === 3, 'SimpleUsage1 method not 3 size.');
    mirrors.forEach((o) => {
      chai.assert(
        Array.isArray(o.getDesignParamTypes()),
        `SimpleUsage1 static property ${o.propertyKey.toString()} design param types not a array.`
      );
      chai.assert(
        o.getReturnType(),
        `SimpleUsage1 ${o.propertyKey.toString()} not fount return type.`
      );
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
        Array.isArray(o.getDesignParamTypes()),
        `SimpleUsage1 static property ${o.propertyKey.toString()} design param types not a array.`
      );
      chai.assert(
        o.getReturnType(),
        `SimpleUsage1 static property ${o.propertyKey.toString()} not fount return type.`
      );
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

  it('Reflect class SimpleUsage1.id should type PropertyMirror ', function () {
    const propertyMirror1 = PropertyMirror.reflect(SimpleUsage1, 'id');
    const propertyMirror2 = PropertyMirror.reflect(SimpleUsage1, 'test', true);

    chai.assert(
      propertyMirror1.getDesignType() === Number,
      'SimpleUsage1.id type is Number.'
    );
    chai.assert(
      propertyMirror2.getDesignType() === String,
      'SimpleUsage1.test (static) type is String.'
    );
    console.log(
      propertyMirror1.getDesignType(),
      propertyMirror2.getDesignType()
    );
  });
});
