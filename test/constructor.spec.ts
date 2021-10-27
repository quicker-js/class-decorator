import 'reflect-metadata';
import { describe, it } from 'mocha';
import { ClassMirror, MethodMirror } from '../src';
import { SimpleUsage3 } from '../sample/simple-usage-3';

describe('constructor.spec.ts', () => {
  it('should ', function () {
    // const classMetadataClassMirror = ClassMirror.reflect(SimpleUsage3);
    const methodMirror = MethodMirror.reflect(SimpleUsage3, 'constructor');
    if (methodMirror) {
      // console.log(methodMirror.getDesignParamTypes(), 'getDesignParamTypes');
      // console.log(methodMirror.getReturnType(), 'getReturnType');

      const mirror = methodMirror.parameters.get(0);
      if (mirror) {
        console.log(mirror.getDesignParamType(), 'xx');
      }
    }
  });
});
