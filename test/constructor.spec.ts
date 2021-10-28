import 'reflect-metadata';
import { describe, it } from 'mocha';
import { ClassMirror, ParameterMirror } from '../src';
import { SimpleUsage3 } from '../sample/simple-usage-3';

describe('constructor.spec.ts', () => {
  it('should ', function () {
    const classMetadataClassMirror = ClassMirror.reflect(SimpleUsage3);
    console.log(classMetadataClassMirror.getDesignParamTypes());
    const parameterMirror = ParameterMirror.reflectConstructor(SimpleUsage3, 1);
    if (parameterMirror) {
      console.log(parameterMirror.getDesignParamType(), 'xxxxxx');
    }
  });
});
