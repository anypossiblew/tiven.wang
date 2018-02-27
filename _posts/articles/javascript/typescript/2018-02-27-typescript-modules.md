---
layout: post
theme: Josefin-Sans
title: TypeScript - Modules
excerpt: ""
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
  - title: "TypeScript Handbook - Modules"
    url: "https://www.typescriptlang.org/docs/handbook/modules.html"
---

* TOC
{:toc}

> **A note about terminology**: It’s important to note that in TypeScript 1.5, the nomenclature has changed. “Internal modules” are now “namespaces”. “External modules” are now simply “modules”, as to align with ECMAScript 2015’s terminology, (namely that `module X {` is equivalent to the now-preferred `namespace X {`).

## Introduction

Modules are declarative; the relationships between modules are specified in terms of imports and exports at the file level.

Modules 本身在 TypeScript 语言中相对简单，但是为了适应转换成不同目标语言的复杂场景，则会出现多种表达方式需要注意。

TypeScript 使用了与 ECMAScript 2015 modules 相同的概念。一个 module 是一个执行 scope，在一个 module 内声明的 variables, functions, classes 等不会被外部访问到，除非 module 用 [export][export] 形式显式地暴露出他们。相对应的，要使用别的 module 暴露出来的类型则可以使用 [import][import] 形式引入他们。

当一个源码文件中顶层级别包含 import 或 export 时被认为是一个 module，一个源代码文件只对应一个 module。

module loader 是运行时负责为 module 查找定位和执行其所有依赖的引擎。JavaScript 常见的 module loader 有 Node.js 的 [CommonJS][CommonJS] module loader 和 Web applications 常使用的 [require.js][requirejs]。


## Basic

### Export and Import
任何声明 declaration （例如 a variable, function, class, type alias, or interface）都可以在其前面添加关键字 `export` 暴露出来。

*Validation.ts*
```typescript
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```

*ZipCodeValidator.ts*
```typescript
import { StringValidator } from "./Validation";

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

*index.ts*
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
一个 module 中还可以对另一个 module 里的声明在不引入本地的情况下转发暴露出去：

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




[export]:https://www.typescriptlang.org/docs/handbook/modules.html#export
[import]:https://www.typescriptlang.org/docs/handbook/modules.html#import
[CommonJS]:https://en.wikipedia.org/wiki/CommonJS
[requirejs]:http://requirejs.org/
