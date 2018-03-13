---
layout: post
title: RxJS Basic
excerpt: "本文介绍 RxJS 项目基础安装步骤"
modified: 2018-02-05T17:00:00-00:00
categories: articles
tags: [RxJS, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DVHM4hMXcAAt-uy.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "GitBook - TypeScript Deep Dive - TypeScript with Node.js"
    url: "https://basarat.gitbooks.io/typescript/docs/quick/nodejs.html"
  - title: "RxJS v4.0"
    url: "https://xgrommx.github.io/rx-book/index.html"
---

* TOC
{:toc}

[RxJS][rxjs] 是当前 web 开发中最热门的库之一。它提供强大的功能性方法来处理事件，并将集成点集中到越来越多的框架、库和实用程序中，这一切使得学习 Rx 变得前所未有的吸引人。并且它还有能力利用你之前所掌握的语言知识，因为它几乎涵盖了所有语言。如果熟练掌握响应式编程 (reactive programming) 的话，那它所提供的一切似乎都可以变得很容易。

## Setup with Node.js

在 Node.js 项目中安装 RxJS 模块。

`npm install rxjs`

### ES6

使用 ES6 语法导入 RxJS ：

```javascript
import Rx from 'rxjs/Rx';

Rx.Observable.of(1,2,3)
```

截至 [Node.js v9.5.0][esm] 暂不直接支持 ES6 Modules import 语法，需要开启实验功能才能使用，而且运行文件要以 `mjs` 后缀结尾：

`node --experimental-modules index.mjs`

或者使用诸如 [Babel][babeljs] 这种编译工具把 ES6 代码编译成 ES5 代码，然后才能使用 Node.js 直接运行。

### CommonJS

还可以使用 [Node Module system][modules] 即 [CommonJS][commonjs] 语法导入 RxJS 模块

```javascript
var Rx = require('rxjs/Rx');

Rx.Observable.of(1,2,3); // etc
```

然后直接运行 `node index.js`

### All Module Types (CJS/ES6/AMD/TypeScript)

还可以安装另外一个模块 `@reactivex/rxjs`，支持所有类型的语法包括 TypeScript

`npm install @reactivex/rxjs`

此要求 npm version 3。

或者如果你使用 npm version 2 的话可以指定版本安装

`npm install @reactivex/rxjs@5.0.0`

#### TypeScript

可以在 TypeScript 程序中直接使用以下语法引入 RxJS 模块

```typescript
import Rx = require('@reactivex/rxjs');

let ob: Rx.Observable<number> = Rx.Observable.of(1,2,3);

ob.subscribe(x=>console.log(x));
```

在编译 TypeScript 时如果遇到错误 `error TS2304: Cannot find name 'Promise'` 或者 `error TS2304: Cannot find name 'Iterable'`
可以安装 `npm install @types/es6-shim -D` 以解决。

如果遇到编译错误：

```
../../node_modules/rxjs/scheduler/VirtualTimeScheduler.d.ts(22,22): error TS2415: Class 'VirtualAction<T>' incorrectly extends base class 'AsyncAction<T>'.
  Types of property 'work' are incompatible.
    Type '(this: VirtualAction<T>, state?: T | undefined) => void' is not assignable to type '(this: AsyncAction<T>, state?: T | undefined) => void'.
      The 'this' types of each signature are incompatible.
        Type 'AsyncAction<T>' is not assignable to type 'VirtualAction<T>'.
          Property 'index' is missing in type 'AsyncAction<T>'
```

可以设置 `"skipLibCheck": true` 在 `tsconfig.json` 文件里。参考 https://github.com/ReactiveX/rxjs/issues/3031


关于更多 TypeScript 知识，可以参考另外一个系列 [TypeScript - Setup with Node.js](/articles/typescript-setup-with-nodejs/)


> 为了突出主题不引入过多额外学习成本，本系列 RxJS 教程使用 `@reactivex/rxjs@5.5.6` 和 ES5 做代码演示。
{: .Notes}



## Related Productions

https://github.com/redux-observable/redux-observable




[rxjs]:https://github.com/ReactiveX/rxjs
[esm]:https://nodejs.org/docs/latest-v9.x/api/esm.html
[babeljs]:https://babeljs.io/
[commonjs]:http://requirejs.org/docs/commonjs.html
[modules]:https://nodejs.org/docs/latest/api/modules.html
