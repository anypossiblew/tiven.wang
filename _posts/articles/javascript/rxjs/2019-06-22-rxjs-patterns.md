---
layout: post
theme: XiXiuTi
series: 
  url: rxjs
  title: RxJS
title: Patterns
excerpt: "本文介绍 RxJS 常用 Patterns"
modified: 2019-06-23T17:00:00-00:00
categories: articles
tags: [RxJS]
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

## Continue 1 when conditional 2

**Problem**: You need to extract data from observableA before you can load a related observableB.

一个事件继续需要满足条件(某个对象已初始化(初始化异步的)) 否则等待条件完成

https://angularfirebase.com/lessons/top-7-rxjs-patterns-for-angular-development/

https://blog.strongbrew.io/rxjs-patterns-restarting-work/

## switchMap + catchError = retry pattern

查看 [RXJS](https://rxjs-dev.firebaseapp.com/api/operators/catchError) 官方文档的说明 `catchError` 操作的使用还好理解，它就是用来捕捉当前异步链中的异常，然后返回一个可观察对象。

* 这个新的可观察对象可以是发生异常的异步链的可观察对象，那么它会被重新订阅，然后异步链就会重新执行一遍:

```typescript
catchError((err, caught) => caught),
```

* 这个新的可观察对象也可以是一个新的可观察对象，被订阅后会执行新的逻辑得到新的结果:

```typescript
catchError(err => of('I', 'II', 'III', 'IV', 'V')),
```

* 这个新的可观察对象也可以是继续抛出异常的可观察对象:

```typescript
catchError(err => throwError(err)),
```

* 也可以直接抛出异常，让上一层去捕捉和处理此异常：

```typescript
catchError(err => {
    throw 'error in source. Details: ' + err;
  }),
)
.subscribe(
  x => console.log(x),
  err => console.log(err)
);
```

理解了 `catchError` 的作用后我们来一下在多层嵌套异步链中该如何组织异常的捕获和处理。

