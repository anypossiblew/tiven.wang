---
layout: post
theme: Josefin-Sans
title: RxJS - Patterns in High Speed Railway Client
excerpt: "RxJS 多种模式在高铁客户端中的应用"
modified: 2018-02-27T17:00:00-00:00
categories: articles
tags: [RxJS, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DW0bAaPVoAAce9s.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/967459192129847296
comments: true
share: true
references:
  - title: ""
    url: ""
---

* TOC
{:toc}

一个产品生产可用性的重要特征是其对错误的容忍度，从代码角度看就是 Error Handling 做得怎么样。Error Handling 处理方式做好的话可以增加代码的健壮性和错误容忍度。如果处理不好，则会增加代码复杂度和降低代码可阅读性。[RxJS][rxjs] 也不例外，一个健壮的 RxJS Stream 程序需要把 Error Handling 逻辑做好。但 RxJS 属于响应式编程，他并不像传统命令式编程(imperative programming)的异常处理那样，他有着自己的一套响应式编程的错误处理方式。

对于普通的异常处理 JavaScript 可以使用 `try catch` 来捕获和处理, 但 Error Handling 用在异步函数上则情况更加复杂一些，特别是异步调用远程连接即 Remote HTTP call 时会出现更复杂的情况，如 网络异常、远程服务器错误、连接超时、系统忙、数据不存在、CDN 类错误等等问题。如果对类似这些错误处理不好，你的代码逻辑将陷入紊乱之中。如果你找一个公开的远程系统来做 RxJS 编程练习的话，没有哪个系统比火车票订票系统更合适的了。它把远程服务调用 Remote HTTP call 会出现的错误场景演绎的淋漓尽致，几十个 API 之间数据相互流转让你有足够的余地发挥 RxJS Data Processing Stream 的能力。

本篇将介绍我在拿订票系统做 RxJS 练习时用到的一些模式，包括 Error Handling、Coordinating business processes 等相关的。

## Remote HTTP call
远程 HTTP 调用如 普通 http、RESTFul API、SOAP、OData、GraphQL等在当下的软件开发过程中占据重要位置，不管是 [SOA][soa] 还是 [Microservices](/articles/microservices-architecture/) 理论中对 HTTP services 的处理都要给予重点关注。

在响应式编程里远程 HTTP 调用有三个过程：异步调用、错误处理、数据处理。接下来看一下有哪些 RxJS 模式可以用在这些过程当中。

### Async Calling
JavaScript 语言中基本的异步处理是通过 callbacks 函数完成的，后来发展出来 [Promise][Promise], async/await, EventEmiter 等技术。其中以 [Promise][Promise] 最为成熟，并且有很多第三方成熟的 Promise 库如 [Q][Q], [bluebird][bluebird], ES6 Promise 等。

> 关于 JavaScript 异步的发展过程请参见 [JavaScript Asynchronous](/articles/javascript-asynchronous/) 一文.
{: .Notes}

RxJS 并没有自己的 HTTP Client 库，像 angular 这样的库都实现有自己的 [HttpClient][angular-http] 与 RxJS 配合使用。所以对于我们使用 Node.js 来说则需要 npm 库如 [request][npm-request] 来做 HttpClient 了。


```

### Error Handling

### Data Processing





Top 7 RxJS Patterns for Angular Development
https://angularfirebase.com/lessons/top-7-rxjs-patterns-for-angular-development/

RxJS is great. So why have I moved on?
https://medium.com/@puppybits/rxjs-is-great-so-why-have-i-moved-on-534c513e7af3

RxJS Antipatterns
http://brianflove.com/2017/11/01/ngrx-anti-patterns/

Efficient design patterns for event handling with RxJS
https://medium.com/@OlegVaraksin/efficient-design-patterns-for-event-handling-with-rxjs-d49b56d2ae36




[rxjs]:https://github.com/ReactiveX/rxjs
[soa]:https://en.wikipedia.org/wiki/Service-oriented_architecture
[Promise]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Q]:https://github.com/kriskowal/q
[bluebird]:https://github.com/petkaantonov/bluebird
[angular-http]:https://angular.io/guide/http
[npm-request]:https://www.npmjs.com/package/request
