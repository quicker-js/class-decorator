# class-decorator
class-decorator is typescript decorator framework.


## Installing

```shell
npm i @quicker-js/class-decorator
#or
yarn add @quicker-js/class-decorator
```

## Example Usage

- Create class decorator

Create custom metadata file or use `ClassMetadata`, custom metadata must use the `ClassMetadata` extension.
`entity-metadata.ts`
```ts
export class EntityMetadata<
  T = EntityMetadataOption
> extends ClassMetadata<T> {}

export interface EntityMetadataOption {
  readonly title?: string;
  readonly description?: string;
}
```
Create decorator file.

```ts
// import class-decorator
import { ClassMirror } from '@quicker-js/class-decorator';
// import entity-metadata.ts
import { EntityMetadata } from './entity-metadata';

// The decorator can be used in two ways.
export function Entity<T extends Function>(target: T): T | void;
export function Entity(title: string, description: string): ClassDecorator;
export function Entity<T extends Function>(
  ...args: unknown[]
): T | void | ClassDecorator {
  if (args.length === 2) {
    const [title, description] = args as [string, string];
    return ClassMirror.createDecorator(
      new EntityMetadata({
        title,
        description,
      })
    );
  } else {
    return ClassMirror.createDecorator(new EntityMetadata(null))(args[0] as T);
  }
}
```
Create any class file, use `@Entity` or `@Entity(...)` decorator.
```ts
@Entity
class Foo {}

// or

@Entity({title: 'Bar', description: 'Class Bar'})
class Bar {}
```
Use `ClassMirror.reflect` get metadata.

```ts
import {ClassMirror} from "./index";

var reflect1 = ClassMirror.reflect(Foo);
var reflect2 = ClassMirror.reflect(Bar);

console.log(reflect1.metadata) // Set<EntityMetadata>
console.log(reflect2.metadata) // Set<EntityMetadata>
```

- Create property decorator

Create custom metadata file or use `PropertyMetadata`, custom metadata must use the `PropertyMetadata` extension.
`exclude-metadata.ts`
```ts
import { PropertyMetadata } from '@quicker-js/class-decorator';

/**
 * @class ExcludeMetadata
 */
export class ExcludeMetadata<
  T = ExcludeMetadataOption
> extends PropertyMetadata<T> {}

export interface ExcludeMetadataOption {
  readonly toPlainOnly?: boolean;
  readonly toClassOnly?: boolean;
}
```
Create custom property decorator

use `PropertyMirror.createDecorator` create property decorator.
```ts
import { ExcludeMetadata, ExcludeMetadataOption } from './exclude-metadata';
import { PropertyMirror } from '@quicker-js/class-decorator';

// The decorator can be used in two ways.
export function Exclude(target: Object, propertyKey: string | symbol): void;
export function Exclude(option: ExcludeMetadataOption): PropertyDecorator;
export function Exclude(...args: unknown[]): void | PropertyDecorator {
  if (args.length === 1) {
    return PropertyMirror.createDecorator(
      new ExcludeMetadata(args[0] as ExcludeMetadataOption)
    );
  } else {
    const [target, propertyKey] = args as [Object, string | symbol];
    return PropertyMirror.createDecorator(new ExcludeMetadata(null))(
      target,
      propertyKey
    );
  }
}
```

Create any class file, use `@Exclude` or `@Exclude(...)` decorator.
```ts
import {Exclude} from "your decoraror path"
class Foo {
    @Exclude
    public id: string;
    
    @Exclude({toPlainOnly: true})
    public name: string;

    @Exclude
    public static age: number;
}
```

Use `PropertMirror.reflect` or `ClassMirror.reflect` get metadata.

```ts
import {ClassMirror, PropertyMirror} from "./index";

// use ClassMirror get metadata.
const reflectClass = ClassMirror.reflect(Foo);
reflectClass.getMirror('id', false) // PropertyMirror<PropertyMetadata>
reflectClass.getMirror('age', false) //PropertyMirror<PropertyMetadata>

// use PropertyMirror get metadata.
const refect1 = PropertyMirror.reflect(Foo, 'id', false); // PropertyMirror<PropertyMetadata>
const refect2 = PropertyMirror.reflect(Foo, 'age', true); // PropertyMirror<PropertyMetadata>

console.log(refect1.metadata) // Set<ExcludeMetadata>
console.log(refect2.metadata) // Set<ExcludeMetadata>

// id: string
console.log(refect1.getDesignType()) // String
// age: number
console.log(refect2.getDesignType()) // Number
```

- Create method decorator

Create custom metadata file or use `MethodMetadata`, custom metadata must use the `MethodMetadata` extension.
`request-metadata.ts`
```ts
import { MethodMetadata } from '@quicker-js/class-decorator';

/**
 * @class RequestMetadata
 */
export class RequestMetadata<T = MetadataOption> extends MethodMetadata<T> {}

export interface RequestMetadataOption {
    readonly path?: string;
    readonly method?: string;
}

```
Create custom method decorator

use `MethodMirror.createDecorator` create property decorator.
```ts
import { RequestMetadata, RequestMetadataOption } from './request-metadata';
import { MethodMirror } from '@quicker-js/class-decorator';

// Unlike the previous case, the decorator has only one use，but it can also be used in two ways, You must add your own implementation logic.
export function Request(metadata: RequestMetadataOption): MethodDecorator {
    return MethodMirror.createDecorator(new RequestMetadata(metadata));
}
```

Create any class file, use`@Request(...)` decorator.
```ts
import {Request} from "your decoraror path"
class Foo {
    @Request({path: '/', method: 'post'})
    public zoo(): string {
        return 'zoo';
    }

    @Request({path: '/', method: 'post'})
    public static bar(): number {
        return 1;
    }
}
```

Use `Method.reflect` or `ClassMirror.reflect` get metadata.

```ts
import {ClassMirror, PropertyMirror} from "./index";

// use ClassMirror get metadata.
const reflectClass = ClassMirror.reflect(Foo);
reflectClass.getMirror('zoo', false) // MethodMirror<MethodMetadata>
reflectClass.getMirror('bar', false) // MethodMirror<MethodMetadata>

// use MethodMirror get metadata.
const refectMethod1 = MethodMirror.reflect(Foo, 'zoo', false); // MethodMirror<MethodMetadata>
const refectMethod2 = MethodMirror.reflect(Foo, 'bar', true); // MethodMirror<MethodMetadata>

// Use function reflect metadata
MethodMirror.reflect(Foo, Foo.bar, true); // MethodMirror<MethodMetadata>

// Instance use Function reflect metadata
const foo = new Foo();
MethodMirror.reflect(Foo, Foo.zoo, false); // MethodMirror<MethodMetadata>

// Get method parameter metadata mirrors.
console.log(refectMethod1.parameters); // Map<number, ParameterMirror>
console.log(refectMethod2.parameters); // Map<number, ParameterMirror>

//Get reflect medatadata.
console.log(refectMethod1.metadata); // Set<MethodMetadata>
console.log(refectMethod2.metadata); // Set<MethodMetadata>

// Get parameters type
console.log(refectMethod1.getDesignParamTypes()); // []
console.log(refectMethod2.getDesignParamTypes()); // []

// Get Return type
console.log(refectMethod1.getReturnType()); // String
console.log(refectMethod2.getReturnType()); // Number
```

- Create parameter decorator

Create custom metadata file or use `ParameterMetadata`, custom metadata must use the `ParameterMetadata` extension.
`param-metadata.ts`
```ts
import { ParameterMetadata } from '@quicker-js/class-decorator';

/**
 * @class Metadata
 */
export class ParamMetadata<T = MetadataOption> extends ParameterMetadata<T> {}

export interface ParamMetadataOption {
    readonly path: string;
}

```
Create custom parameter decorator

use `ParameterMirror.createDecorator` create parameter decorator.
```ts
import { ParamMetadata, ParamMetadataOption } from './param-metadata';
import { ParameterMirror } from '@quicker-js/class-decorator';

// The decorator can be used in two ways.
export function Param(target: Object, propertyKey: string | symbol, parameterIndex: number): void;
export function Param(option: MetadataOption): ParameterDecorator;
export function Param(...args: unknown[]): ParameterDecorator | void {
    if (args.length === 1) {
        const [option] = args as [MetadataOption];
        return ParameterMirror.createDecorator(new Metadata(option));
    } else {
        const [target, propertyKey, parameterIndex] = args as [
            Object,
                string | symbol,
            number
        ];
        return ParameterMirror.createDecorator(new Metadata(null))(
            target,
            propertyKey,
            parameterIndex
        );
    }
}
```

Create any class file, use `@Param` or `@Param(...)` decorator.
```ts
import {Exclude} from "your decoraror path";
import {Request} from "your decoraror path";

class Foo {
    @Request({path: '/', method: 'post'})
    public zoo(@Param test: Number, @Param({path: '/'}) path: string): string {
        return 'zoo';
    }
    
    public static bar(@Param test: Object, @Param({path: '/'}) path: string): number {
        return 1;
    }
}
```

Use `ParameterMirror.reflect` or `ParameterMirror.reflect` get metadata.

```ts
import {ClassMirror, MethodMirror, ParameterMirror} from "./index";

// use ClassMirror get metadata.
const reflectClass = ClassMirror.reflect(Foo);
reflectClass.getMirror('zoo', false) // MethodMirror<MethodMetadata>
reflectClass.getMirror('bar', false) // MethodMirror<MethodMetadata>

// use MethodMirror get metadata.
const refectMethod1 = MethodMirror.reflect(Foo, 'zoo', false); // MethodMirror<MethodMetadata>
const refectMethod2 = MethodMirror.reflect(Foo, 'bar', true); // MethodMirror<MethodMetadata>

// Get parameters type
console.log(refectMethod1.getDesignParamTypes()); // [Number, String]
console.log(refectMethod2.getDesignParamTypes()); // [Object, String]

// Get method parameter metadata mirrors, you can find metadata in parameters.
console.log(refectMethod1.parameters); // Map<number, ParameterMirror>
console.log(refectMethod2.parameters); // Map<number, ParameterMirror>

refectMethod1.parameters.get(0) // Find 1st parameter metadata
refectMethod1.parameters.get(0) // Find 2nd parameter metadata
```

## Documentation
- [ApiDocs](https://quicker-js.github.io/class-decorator/)
- [samples](https://github.com/quicker-js/class-decorator/tree/master/sample)


## Issues
Create [issues](https://github.com/quicker-js/class-decorator/issues) in this repository for anything related to the Class Decorator. When creating issues please search for existing issues to avoid duplicates.


## License
Licensed under the [MIT](https://github.com/quicker-js/class-decorator/blob/master/LICENSE) License.
