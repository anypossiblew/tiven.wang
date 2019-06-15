---
layout: post
theme: Josefin-Sans
series: 
  url: typescript
  title: TypeScript
title: Decorators
excerpt: "Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members."
modified: 2019-06-15T17:00:00-00:00
categories: articles
tags: [Decorators, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/D8T4Tw5U0AAQGGt.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/1136306026272231425
comments: true
share: true
references:
  - id: 1
    title: "TypeScript Handbook - Decorators"
    url: "https://www.typescriptlang.org/docs/handbook/decorators.html"
---

* TOC
{:toc}

自从有了 TypeScript 和 ES6 中的 Classes 就有了需求要求支持注解 (annotating) 或者修改 classes 或者 classes members 的功能。Decorators 正是提供了这种注解 (annotating) 和 meta-programming syntax for class declarations and members 的功能。Decorators 是 JavaScript 第二阶段的 Proposal，现在是 TypeScript 的 experimental feature, 可以通过 `experimentalDecorators` 参数启用此功能。

## Decorators

Decorators 是可以附在 class declaration, method, accessor, property, or parameter 上的一种声明。Decorators 使用 `@expression` 形式书写，`expression` 等于一个可以在运行时被调用的函数名。例如你要有个 `@sealed` decorator, 那你就得有个函数是

```typescript
function sealed(target) {
    // do something with 'target' ...
}
```

多个 Decorators 可以叠加使用，如

```typescript
@f @g x
// or
@f
@g
x
```

那么这样在运行时就如同数学函数的组合调用一样，`(f ∘ g)(x)` 等于 `f(g(x))`。

如果要更清晰地看到 Decorators 是怎么被调用的，可以使用下面这段代码

```typescript
function f() {
    console.log("f(): evaluated");
    return function (target:any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target:any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}
```

执行命令 `npx ts-node index.ts` 可以看到输出

```text
f(): evaluated
g(): evaluated
g(): called
f(): called
```

也可以编译成 `ES5` 看看编译后的代码跟深入地理解以下

```javascript
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey, descriptor) {
        console.log("f(): called");
    };
}
function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey, descriptor) {
        console.log("g(): called");
    };
}
var C = /** @class */ (function () {
    function C() {
    }
    C.prototype.method = function () { };
    __decorate([
        f(),
        g()
    ], C.prototype, "method", null);
    return C;
}());
```

## Class Decorators

那么对于 Class 级别的 Decorators 也可以通过下面这个例子做深入理解

```typescript
function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

@classDecorator
class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}

console.log(new Greeter("world"));
```

现在很多引擎都已经支持 `ES2015` 了，所以对于 JavaScript 初学者就没必要再去理解老版 JavaScript 代码了，所以我们在 *tsconfig.json* 配置里改为 `"target": "ES2015"`，这样生成的 ES2015 版代码如下

```javascript
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function classDecorator(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.newProperty = "new property";
            this.hello = "override";
        }
    };
}
let Greeter = class Greeter {
    constructor(m) {
        this.property = "property";
        this.hello = m;
    }
};
Greeter = __decorate([
    classDecorator
], Greeter);
console.log(new Greeter("world"));
```

## Metadata

Metadata 相当于一个 Decorators 应用场景，目前也是 experimental 的功能，可以通过 `emitDecoratorMetadata` 参数启用。 Metadata 会通过 Decorators 的方式给 Target (class, method ...) 添加 metadata (key-value) ，然后解析的地方又可以通过 Metadata 的 API 读取到 metadata 信息。

```typescript
import "reflect-metadata";

class Point {
    x: number;
    y: number;
}

class Line {
    private _p0: Point;
    private _p1: Point;

    @validate
    set p0(value: Point) { this._p0 = value; }
    get p0() { return this._p0; }

    @validate
    set p1(value: Point) { this._p1 = value; }
    get p1() { return this._p1; }
}

function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    let set = descriptor.set;
    descriptor.set = function (value: T) {
        let type = Reflect.getMetadata("design:type", target, propertyKey);
        if (!(value instanceof type)) {
            throw new TypeError("Invalid type.");
        }
        set.call(target, value);
    }
}
```

因为 TypeScript compiler 会为 `p0` `p1` 添加 metaddata 所以我们可以在 `validate` 方法里通过 ` Reflect.getMetadata` 获取到名为 `design:type` 的 metadata 信息来使用。