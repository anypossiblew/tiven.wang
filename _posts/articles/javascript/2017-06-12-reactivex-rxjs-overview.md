---
layout: post
title: Async JavaScript and ReactiveX RxJS
excerpt: "RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code."
modified: 2017-06-12T17:00:00-00:00
categories: articles
tags: [RxJS, ReactiveX, Async, TypeScript, JavaScript]
image:
  feature: nationalgeographic/mountain-goat.jpg
comments: true
share: true
references:
  - title: "The ReactiveX library for JavaScript"
    url: "http://reactivex.io/rxjs/"
  - title: "Github - ReactiveX/rxjs"
    url: "https://github.com/ReactiveX/rxjs"
  - title: "GitBook - Learn RxJS"
    url: "https://www.learnrxjs.io/"
  - title: "Gist - Reactive Programming you've been missing"
    url: "https://gist.github.com/staltz/868e7e9bc2a7b8c1f754"
  - title: "ruanyifeng.com - ECMAScript 6 入门"
    url: "http://es6.ruanyifeng.com/"
  - title: "Google web developers - JavaScript Promises"
    url: "https://developers.google.com/web/fundamentals/getting-started/primers/promises"

---

> 落基山羊 又名白山羊（[Mountain Goat](https://en.wikipedia.org/wiki/Mountain_goat)）是北美洲一种类似山羊的动物，它不是真正的山羊，但归入山羚羊一类。原产地在阿拉斯加东南部往华盛顿州、爱达荷州及蒙大拿州一带，后被引入其它州。 落基山羊十分敏捷，是攀岩、跳跃的能手。它们的蹄上有一圈突出的外缘和一块儿柔软的内垫，使其能在光滑的表面产生足够的摩擦力。列入《世界自然保护联盟》（IUCN） 2008年濒危物种红色名录ver 3.1——低危（LC）。

* TOC
{:toc}

RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code.

## Problem

在异步编程模式中经常会遇到的一个问题是，多个异步任务之间的依赖（即当一个或多个任务完成时才能执行下一个任务），包括一个任务依赖另一个任务，一个任务依赖另外多个任务，多个任务依赖一个任务等等。在传统的JavaScript语法中我们会使用callback形式的function去执行异步任务完成时的逻辑，多个异步就会有多个callback嵌套。从逻辑上是没有任何问题，但这种callback嵌套使得代码难以读懂和维护，也就有了把异步任务的callback嵌套改成同步执行的语句，同时又能完成异步的动力。

## Write Async Synchronously

### Callback Functions

下面我们用实际例子来做演示：我们有一个Cloud环境，首先获得当前Cloud的环境变量，然后登录此Cloud环境拿到token，再获取当前Cloud的所有applications，当然这些都是异步的任务。如果用传统JavaScript的callback function书写此逻辑如下：

```javascript
// Async job 1
CloudController.getInfo(function(err, result) {
  if(err) return console.log(err);
  UsersUAA.setEndPoint(result.authorization_endpoint);
  // Async job 2
  UsersUAA.login(username, password, function(err, result) {
    if(err) return console.log(err);
    Apps.setToken(result);
    // Async job 3
    Apps.getApps(function(err, result) {
      if(err) return console.log(err);
      console.log(result);
    });
  });
});
```

对于习惯了同步执行程序的人来说，很难一眼就能搞懂这些callback关联逻辑（当然这个还是相对简单的依赖逻辑）。

### Promise

为了改变这种必须在调用时传入callback function的'不人道'的异步调用方式，人们往前进一步创造出了[Promise][Promise]，它让异步任务返回一个Promise对象，后续程序可以为此Promise对象添加callback function以执行异步完成时的逻辑。此方式**部分**解绑了异步任务execution语句和callback function，为什么说是**部分**解绑，以为即使是后续添加但还是要通过then方法为Promise添加callback function。

The example code from [Github - prosociallearnEU/cf-nodejs-client](https://github.com/prosociallearnEU/cf-nodejs-client)

```javascript
CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
}).then( (result) => {
    Apps.setToken(result);
    return Apps.getApps();
}).then( (result) => {
    console.log(result);
}).catch( (reason) => {
    console.error("Error: " + reason);
});
```

* Async job 1 `CloudController.getInfo()`
* Async job 2 `UsersUAA.login(username, password)`
* Async job 3 `Apps.getApps()`
* Result `console.log(result);`
* Exception `catch( (reason) => {`

### Generator

为了再进一步，完全去除callback function，让书写异步任务像同步执行代码一样，就有了generator function和yield关键字。执行generator函数会返回一个对象，执行此对象的next方法会运行generator函数里的语句知道遇到yield关键字并执行此yield的异步任务。
yield关键字说明其后面的语句是异步语句并且会返回一个Promise对象，此Promise对象可以作为添加处理异步任务的后续操作。

```javascript
function* getCloudApps() {
  var result = yield CloudController.getInfo();
  UsersUAA.setEndPoint(result.authorization_endpoint);
  result = yield UsersUAA.login(username, password);
  Apps.setToken(result);
  yield Apps.getApps();
}

var cloudApps = getCloudApps();

// run the async generator function
cloudApps.next().value.then(function(result) {
  cloudApps.next(result).value.then(function(result) {
    cloudApps.next(result).value.then(function(result) {
      console.log(result);
    });
  });
});
```

完整代码 <script src="https://gist.github.com/anypossiblew/26cdd5f18b130f3a8df5a5f87b75fa7e.js"></script>

#### Automatic Generator Execution
显然单纯执行generator函数似乎又回到了callback和promise时代，但使用yield关键字在形式上把async语句sync化使得异步语句运行自动化起来更方便。如[tj/co](https://github.com/tj/co)库便是为了自动化yield语法，它是通往[async/await proposal](https://github.com/lukehoban/ecmascript-asyncawait)重要一步。

```javascript
var co = require('co');
...

co(function *() {
  console.log('start get cloud apps')
  var result = yield CloudController.getInfo();
  UsersUAA.setEndPoint(result.authorization_endpoint);
  result = yield UsersUAA.login(username, password);
  Apps.setToken(result);
  result = yield Apps.getApps();
  console.log(result);
}).catch(onerror);
```

完整代码 <script src="https://gist.github.com/anypossiblew/fc436d4a481ea3a3b5e816c0ef1aa004.js"></script>

### async/await

还能不能再进一步简化书写，那就是[async function][async_function]。执行async function会返回一个[Promise][Promise]对象，await表示其后语句为异步操作会返回Promise的resolve的结果。

> The purpose of async/await functions is to simplify the behavior of using promises synchronously and to perform some behavior on a group of Promises. Just like Promises are similar to structured callbacks, async/await is similar to combining generators and promises.

下面我使用[Async Await](https://basarat.gitbooks.io/typescript/docs/async-await.html) in TypeScript 去重写上面的异步任务逻辑：

```typescript
async function getCloudApps(): Promise<void> {
  var result = await CloudController.getInfo();
  UsersUAA.setEndPoint(result.authorization_endpoint);
  result = await UsersUAA.login(username, password);
  Apps.setToken(result);
  return await Apps.getApps();
}

getCloudApps().then((result)=> {
  console.log(result);
});
```

完整代码 <script src="https://gist.github.com/anypossiblew/6cd3f2eafd51a5106684cdfeb19a8474.js"></script>

## Concurrent Async

上面演示的异步任务同步化书写已经相当完美了，但并发的异步任务并不能十分满足。比如当多个异步任务都完成时再进行下一个任务，或者当多个异步任务里满足条件的都完成时等等，显然有些捉襟见肘。

复杂的场景显然需要功能完善的功能代码库来满足。[Bluebird][Bluebird]或者[Async][Async]可以满足你这方面的需要。

```typescript
var Promise = require("bluebird");
...

async function getCloudApps(): Promise<void> {
  var result = await CloudController.getInfo();
  UsersUAA.setEndPoint(result.authorization_endpoint);
  result = await UsersUAA.login(username, password);
  Apps.setToken(result);
  var apps = await Apps.getApps();

  // Concurrent Async jobs
  return Promise.map(apps, (app)=> {
      return Apps.getAppInfo(app);
    } , { concurrency: 5} );
}

getCloudApps().then((result)=> {
  console.log(result);
});
```

完整代码 <script src="https://gist.github.com/anypossiblew/c73470b03f471bd0bddeb52416180e85.js"></script>

## Reactive Programming

鉴于现在Rich Web Application的壮大和智能设备的普及，程序已经不是简单的从头到尾执行既定任务，用户交互事件越来越频繁越来越重要，响应事件这种异步编程也就变得愈加重要和复杂。有需求就有动力，[ReactiveX][ReactiveX]虽然不是什么新技术，但现在顺应时代变得又热火起来。

简单的说, [ReactiveX][ReactiveX] (Rx) 是一个简化异步调用的库. Rx是从微软的函数响应式编程库(Reactive Extensions)发展而来的, 提供了一种新的组织和协调异步事件的方式. 例如协调多个从网络上返回的多个异步的数据流, Rx能够是的我们用一个简单的方式来处理这些数据流, 极大的简化了代码的编写。
Rx作为一个通用库, 现在已经多种语言的实现版本(都是开源的), 包含RxJava, RxCpp, RxSwift, RxKotlin, RxGroovy, [RxJS][RxJS] 等, 具体可以参考所有支持语言。

### RxJS Usage

`npm install --save @reactivex/rxjs`

### RxJS Hello world

Now we can create a basic reactive programming flow that is how to print a "Hello world!":

```javascript
import Rx from '@reactivex/rxjs';

let observable = Rx.Observable.of('Hello', 'world', '!')

observable.subscribe((x) => {
  console.log(x);
})
```

1. `import Rx from '@reactivex/rxjs';` We use the keyword **import** of ES6 to import the entire core set of functionality.
2. `let observable = Rx.Observable.of('Hello', 'world', '!')` Create a [Observable][Observable] object that can be subscribed by [Observer][Observer].
3. `observable.subscribe((x) => { console.log(x);})` Subscribe the [Observable][Observable] using a callback [Observer][Observer].

### RxJS Basic Concepts

#### Observable

Observable代表一个事件源(也可以叫被观察者), 可以被Observer订阅。Observer代表一个订阅者(也可以叫观察者), 订阅Observable, 获取事件。

#### Operators

对事件的各种处理称为Operators，Operators are pure functions that enable a functional programming style of dealing with collections with operations like map, filter, concat, flatMap, etc.

### More Complex

#### Create a Subject of timer

First we create a timer to trigger a event every 2 seconds which can be subscribed by multi observers.

```javascript
// Observable: timer(trigger a event every 2 seconds)
let timerObservable = Rx.Observable.timer(0, 2000)
    .timeInterval();
// Subject: timer
let timerSubject = new Rx.Subject();
let timerMulticasted = timerObservable.multicast(timerSubject);

// Subscription: print the timer event
timerMulticasted.subscribe({
  next: (v) => {
    console.log(v);
  }
});
```



[Observable]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[Observer]:http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html
[Promise]:https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[async_function]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[Bluebird]:http://bluebirdjs.com
[Async]:https://github.com/caolan/async
[ReactiveX]:http://reactivex.io/
[RxJS]:http://reactivex.io/rxjs/
