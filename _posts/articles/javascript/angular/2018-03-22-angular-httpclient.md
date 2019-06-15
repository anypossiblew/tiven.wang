---
layout: post
theme: XiXiuTi
series: 
  url: angular
  title: Angular
title: HttpClient
excerpt: ""
modified: 2018-03-22T18:00:00-00:00
categories: articles
tags: [Http, Reactive, Observable Stream, Angular, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DViPTJkW4AEFDO8.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/961676082335363072
comments: true
share: true
references:
  - id: 1
    title: "Angular guide - HttpClient"
    url: "https://angular.io/guide/http"
  - id: 2
    title: "The new Angular HttpClient API"
    url: "https://blog.angularindepth.com/the-new-angular-httpclient-api-9e5c85fe3361"
---

* TOC
{:toc}

作为一个前端框架，与后端服务的通讯是 Angular 的重要任务之一，而 Http 协议是最常用的通讯协议。Angular 专门创建了一个模块负责这项任务 `@angular/common/http` ， 其中的类 `HttpClient` 提供了一个简单的 Http 客户端。在浏览器端有两种 APIs 负责 Http 通讯 [`XMLHttpRequest`][XMLHttpRequest] 和 [`fetch()`][Fetch_API]，而 `HttpClient` 使用的是前者。如果你熟悉 Node.js 的 [`request`][request/request] 库的话，那么 Angular HttpClient 并没有什么新鲜玩意，除了 Angular HttpClient 全面支持 [RxJS][rxjs] [Observable][Observable] 接口。

Angular HttpClient 全面融合了 RxJS 的能力，自然而然 RxJS 的优点就被带入了 Angular HttpClient ，例如 reactive style programming 、event data transformation 、 streamlined error handling 等。所以可以简单总结为

**XMLHttpRequest** + [**RxJS**][rxjs] => [Angular.**Http**][guide-http]

对于 [`HttpClient`][angular-HttpClient] 的基本知识我们不做介绍，详细请参考官方教程 [Angular Guide - HttpClient][guide-http] 。本篇重点介绍如何在 Angular 应用程序中使用响应式编程模式处理 Http 请求数据的任务。

## Encapsulate in a Service
// TODO

## Flow
先来了解一下在前端应用日常开发中关于数据流程经常会遇到的几个概念。可以把前端应用看成是由一个个基本的任务组成的，我们称一个最基本的且完整的功能为 **_Flow_** ，例如用户登录，搜索，创建订单等。一个完整的 Flow 又是由多个任务 **_Task_** 组成，当所有的 Task 都完成后此 Flow 才算完成。一个 Task 可以是一个 Http **_Request_** 或者一个用户动作 **_User Event_**。例如用户登录流程可以包括用户点击提交按钮（User Event）和提交登录请求（Http Request），搜索流程可以包括用户输入搜索关键字（User Event）和提交搜索请求（Http Request）等。


本篇拿火车订票系统用户登录流程作为示例，下图为登录流程图，可以看到图中出现这几个概念

* Flow
* Task
* Request
* User Event

![Image: LoginDataFlow](/images/angular/http/LoginDataFlow.png "LoginDataFlow")
{: .center.middle}

### Covert to Code
如果我们用传统的编程方式实现上面登录流程代码可能如下，看起来并没有逻辑问题，编程不能止步于逻辑正确，好的程序需要做到容易阅读和维护，这样的程序才能减少程序漏洞的出现。下面的程序不能直观得体现出上面流程图所要表达的逻辑，例如初始化验证图片的函数 `buildCaptch()` 调用出现在三处：构造函数中，验证失败后和登录失败后。其实上面流程图所表达的是如果中间某个 Task 出现错误，整个流程只需要从头开始再来一遍即可（后面会用 RxJS retry 来实现），不需要中间的逻辑转向。如果在验证请求中只是出现网络错误，这种情况并不需要重新获取验证图片和重新验证，那么这段逻辑也是不合适的。从代码结构上来说，这种编程使用的 Promise chain 本质上也就是 Callback 不便于阅读，随着程序功能的复杂度逐渐增大，这种嵌套会爆炸式增长，那么维护难度可想而知。所以这就可以介绍 RxJS 怎么实现此逻辑了。


```typescript
constructor() {
  this.buildCaptch();
}

buildCaptch() {
  this.service.getCaptch()
    .then(() => {
      // display captch
    });
}

onSubmit() {
  this.service.checkCaptch()
    .then(
      () => {
        this.service.login()
          .then(() => {
            // login success
          }, err => {
            // fail then rebuild
            this.buildCaptch();
          });
      }, err => {
        this.buildCaptch();
      });
}
```

从 [Angular - Observables and RxJS](/articles/angular-observables-and-rxjs/) 一篇我们了解了 Observables 的基本应用。我们称一个 [Observable][Observable] 对象和其带的 [Operators][operators] Chain 为一个 **_Observable Stream_** 。我们称一个流程中可以单独重新执行的域为 **_Retry Scope_** 。那么 Observable Stream 是 Retry Scope 的最小单位，也就是说一个 Retry Scope 可以由一个或者多个 Observable Stream 组成。这些概念会用在后面要介绍的 Error Handling Retry 逻辑中。

简单来说 **“响应式编程就是用[异步数据流](# "Async Data Stream")的方式编程。”**

一切事物都可以看作数据流，比如 variables, user inputs, properties, caches, data structures 等等。所以对于上面定义的概念来说，Flow, Task, Request, User Event 都可以看作是数据流。比如对于 User Event, 可以把用户每一次点击按钮或者输入字符事件看作是 events，那么加上时间变量他就是一个 event stream，也就是数据流。一个 Request 可以看作为只有一个 event（当Request完成时）的数据流。Task 是由 User Event 和 Request 组成，Flow 由 Task 组成，所以他们可以看作是数据流。

接下来我们就要看看如何使用 [RxJS][rxjs] 实现这个异步数据流样式的程序。

从 Angular HttpClient 官方教程里可以学习到 Http Request 如何使用 Observable 接口。下面是登录请求的代码

*account.service.ts*
```typescript
login(user: Account): Observable<string> {
    const params = new HttpParams()
      .set('appid', 'otn')
      .set('username', user.username)
      .set('password', user.password);

    return this.http.post(URLs.login, params.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
      .map((result: any) => {
        if (result.result_code !== 0) {
          throw result.result_message;
        } else {
          return result.uamtk;
        }
      });
  }
```

[HttpClient][angular-HttpClient] 的 post 方法返回一个 Observable 接口的对象，我们为其添加了 [map][rxjs-Observable-map] 操作，解析判断返回结果是否正确，如果不正确则抛出异常信息，如果正确则返回结果。map 操作返回的仍然是一个 Observable 对象，所以就能形成 Observable stream 。

对于例如点击按钮的用户事件我们可以为其创建一个 [Subject][rxjs-Subject] 对象用来接收事件流，[Subject][rxjs-Subject] 继承自 [Observable][rxjs-Observable], 所以 Subject 对象也是 Observable 对象。

*app.component.ts*
```typescript
private submit$ = new Subject();

onSubmit(user) {
  this.submit$.next('');
}
```

使用监听函数去接收点击事件并转给 Subject 对象，这样 `submit$` 就是一个 Observable 异步数据流。

然后我们为整个 Flow 创建一个 Observable 对象并把其他 Tasks 通过 operators 串起来

```typescript
private login$ = Observable.of(1);

constructor(private service: AccountService) {
  this.login$.mergeMap(() => this.service.getCaptch())
    .do((image) => {
      this.captchImage = image;
    })
    .switchMap(() => this.submit$)
    .switchMap(() => this.service.checkCaptcha(this.captchPostions))
    .switchMap(() => this.service.login(this.account))
    .subscribe(() => console.log('Login successfully!'), err => console.error(err) , () => console.log('Login flow completed!'));
}
```

上面代码是通过 operator [mergeMap][rxjs-Observable-mergeMap] 和 [switchMap][rxjs-Observable-switchMap] 把 Task 的 Observable stream join 到 Flow 的 Observable stream 上的。可以看到整个流程是以 Observable stream 为基本单位组成的。接下来我们介绍基于这个 Observable stream 的 error handling 处理。

## Error Handling
上面介绍到了 **_Retry Scope_** 的概念，我们知道 Observable stream 是 Retry Scope 的最小单位，所以当我们在进行错误处理时要考虑我们的 Retry Scope 是整个 Flow 还是单独某个 Task 。例如当登录请求返回用户名或密码错误时，此时的 Retry Scope 就是整个 Flow，需要从头重新执行流程。而当登录请求只是出现网络异常时，Retry Scope 就要限制在这个 Task 内，因为网络错误只需要重新调用一些这个接口，并不需要重新执行整个流程。所以修改代码添加 retry 逻辑后如下

*account.service.ts*
```typescript
login(user: Account): Observable<string> {
  const params = new HttpParams()
    .set('appid', 'otn')
    .set('username', user.username)
    .set('password', user.password);

  return this.http.post(URLs.login, params.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
    })
    .retry(100)
    .map((result: any) => {
      if (result.result_code !== 0) {
        throw result.result_message;
      } else {
        return result.uamtk;
      }
    });
}
```

*app.component.ts*
```typescript
constructor(private service: AccountService) {
  this.login$.mergeMap(() => this.service.getCaptch())
    .do((image) => {
      this.captchImage = image;
    })
    .switchMap(() => this.submit$)
    .switchMap(() => this.service.checkCaptcha(this.captchPostions))
    .switchMap(() => this.service.login(this.account))
    .retry(100)
    .subscribe(() => console.log('Login successfully!'), err => console.error(err) , () => console.log('Login flow completed!'));
}
```

关于本篇完整项目代码下载 [Github](https://github.com/tiven-wang/angular-tutorial/tree/httpclient)

## Unit Test

// TODO

[guide-http]:https://angular.io/guide/http
[rxjs]:http://reactivex.io/rxjs
[operators]:http://reactivex.io/documentation/operators.html
[Observable]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[Subscriber]:http://reactivex.io/rxjs/class/es6/Subscriber.js~Subscriber.html
[Subscription]:http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html
[EventEmitter]:https://angular.io/api/core/EventEmitter
[angular-HttpClient]:https://angular.io/api/common/http/HttpClient

[request/request]:https://github.com/request/request
[XMLHttpRequest]:https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
[Fetch_API]:https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

[rxjs-Observable]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[rxjs-Observable-fromPromise]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromPromise
[rxjs-Observable-map]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
[rxjs-Observable-mergeMap]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap
[rxjs-Observable-switchMap]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-switchMap
[rxjs-Observable-subscribe]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-subscribe
[rxjs-Observer]:http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html
[rxjs-Observer~error]:http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html#instance-method-error
[rxjs-Observable~catch]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-catch
[rxjs-Observable~retry]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-retry
[rxjs-Observable~retryWhen]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-retryWhen
[rxjs-Observable~scan]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan
[rxjs-Observable~reduce]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-reduce
[rxjs-Observable~range]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-range
[rxjs-Observable~zip]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-zip

[rxjs-Subject]:http://reactivex.io/rxjs/class/es6/Subject.js~Subject.html
