---
layout: post
theme: Josefin-Sans
series: 
  url: typescript
  title: TypeScript
title: Modules
excerpt: "Starting with ECMAScript 2015, JavaScript has a concept of modules. TypeScript shares this concept."
modified: 2018-02-27T17:00:00-00:00
categories: articles
tags: [Modules, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DVnLLn6VQAAIrjZ.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/962023398489468928
comments: true
share: true
references:
  - id: 1
    title: "TypeScript Handbook - Modules"
    url: "https://www.typescriptlang.org/docs/handbook/modules.html"
  - id: 2
    title: "TypeScript Handbook - Namespaces"
    url: "https://www.typescriptlang.org/docs/handbook/namespaces.html"
---

* TOC
{:toc}

> **A note about terminology**: It’s important to note that in TypeScript 1.5, the nomenclature has changed. “Internal modules” are now “namespaces”. “External modules” are now simply “modules”, as to align with ECMAScript 2015’s terminology, (namely that `module X {` is equivalent to the now-preferred `namespace X {`).

## Introduction

Modules are declarative; the relationships between modules are specified in terms of imports and exports at the file level.

Modules 本身在 TypeScript 语言中相对简单，但是为了适应转换成不同目标语言的复杂场景, 则会出现多种表达方式, 需要注意。

TypeScript 使用了与 ECMAScript 2015 modules 相同的概念。一个 module 是一个执行 scope，在一个 module 内声明的 variables, functions, classes 等不会被外部访问到，除非 module 用 [export][export] 形式显式地暴露出他们。相对应的，要使用别的 module 暴露出来的类型则可以使用 [import][import] 形式引入他们。

当一个源码文件中顶层级别包含 import 或 export 时被认为是一个 module，一个源代码文件只对应一个 module。

module loader 是运行时负责为 module 查找定位和执行其所有依赖的引擎。JavaScript 常见的 module loader 有 Node.js 的 [CommonJS][CommonJS] module loader 和 Web applications 常使用的 [require.js][requirejs]。

## Basic

### Export

任何声明 declaration （例如 a variable, function, class, type alias, or interface）都可以在其前面添加关键字 `export` 暴露出来。

_Validation.ts_

```typescript
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```

_ZipCodeValidator.ts_

```typescript
import { StringValidator } from "./Validation";

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

_index.ts_

```typescript
import { ZipCodeValidator, numberRegexp } from "./src/ZipCodeValidator";

let myValidator = new ZipCodeValidator();
let s = "123456";

console.log(myValidator.isAcceptable(s));
console.log(myValidator.isAcceptable(s) === (s.length === 5 && numberRegexp.test(s)));

// Output:
/**
false
true
*/
```

### Export statements

还可以使用 export 独立语句暴露声明或者暴露出重命名后的声明:

```typescript
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

### Re-exports

一个 module 中还可以对另一个 module 里的声明在不引入本地的情况下直接转发或重命名后暴露出去：

*ParseIntBasedZipCodeValidator.ts*

```typescript
export class ParseIntBasedZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && parseInt(s).toString() === s;
    }
}

// Export original validator but rename it
export {ZipCodeValidator as RegExpBasedZipCodeValidator} from "./ZipCodeValidator";
```

所以可以有一个专门的 module 负责暴露所有其他 modules 的声明，使用语句`export * from "module"`转发所有的

*AllValidators.ts*

```typescript
export * from "./StringValidator"; // exports interface 'StringValidator'
export * from "./LettersOnlyValidator"; // exports class 'LettersOnlyValidator'
export * from "./ZipCodeValidator";  // exports class 'ZipCodeValidator'
```

### Import

相对应地，Import 就好理解了，引入 module 的其中一个声明

```typescript
import { ZipCodeValidator } from "./ZipCodeValidator";

let myValidator = new ZipCodeValidator();
```

引入重命名的声明

```typescript
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";

let myValidator = new ZCV();
```

引入所有声明成为一个对象

```typescript
import * as validator from "./ZipCodeValidator";

let myValidator = new validator.ZipCodeValidator();
```

## Compatible with

### Default exports

每个 module 都可以设置一个默认输出，`export default `。使用 `import name from module`引入默认声明，那么可以任意。例如像 jQuery 这样的库可能会有默认输出 $ 或 jQuery，就可以使用下面形式引入

*JQuery.d.ts*

```typescript
declare let $: JQuery;
export default $;
```

*App.ts*

```typescript
import $ from "JQuery";

$("button.continue").html( "Next Step..." );
```

#### export = and import = require()

CommonJS 和 AMD 都有 exports 对象的概念，它包含了一个 module 的所有输出，他们也都支持把 exports 对象替换成自定义对象。`export default`的行为和这差不多，但两者并不兼容。所以 TypeScript 使用 `export =` 来表达传统的 CommonJS and AMD 工作流程。

使用 `export =` 语法暴露一个 module 默认的声明，使用 `import module = require("module")` 引入一个 module 默认的声明。对于想 jQuery 这样的库可以写成如下形式：

*JQuery.d.ts*

```typescript
declare let $: JQuery;
export = $;
```

*App.ts*

```typescript
import $ = require("JQuery");

$("button.continue").html( "Next Step..." );
```

### Code Generation for Modules

TypeScript 可以被编译成不同的目标语言如 Node.js (CommonJS), require.js (AMD), UMD, SystemJS, or ECMAScript 2015 native modules (ES6) 的 module-loading systems 的代码。在编译工具上指定参数 `--module` 来指定目标语言，如 Node.js, 用 `--module commonjs` 。 require.js, 用 `--module amd`。

`tsc --module commonjs -p ./`

设置不同的参数来查看编译后的目标语言版本差别。

> 关于 Modules 更多高级情况请参考 TypeScript 官方 Handbook [[1](#reference-1)]
{: .Notes}

## Namespaces

namespace 在之前叫做 internal module ，可见他和 module 意思差不多。namespace 就如同 package 一样用于区分名字相同的不同开发对象，但鉴于可以通过不同的 module 文件和 import 重命名开发对象来做到区分，而且 namespace 也没有对应的 import 引入语法（只能通过 /// \<reference path="myModules.d.ts" /\> 这样间接的方式）来表达依赖关系，所以 namespace 应用场景并不多。

> 关于 Namespaces 更多高级情况请参考 TypeScript 官方 Handbook [[2](#reference-2)]
{: .Notes}
>
> 本文相关完整代码可以下载自 [Github](https://github.com/tiven-wang/typescript-tutorial/tree/modules)
{: .Notes}

[export]:https://www.typescriptlang.org/docs/handbook/modules.html#export
[import]:https://www.typescriptlang.org/docs/handbook/modules.html#import
[CommonJS]:https://en.wikipedia.org/wiki/CommonJS
[requirejs]:http://requirejs.org/
