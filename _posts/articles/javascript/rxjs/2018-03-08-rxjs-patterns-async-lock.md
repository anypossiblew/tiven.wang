---
layout: post
theme: Josefin-Sans
title: RxJS Patterns - Implementing Async Lock
excerpt: "RxJS 中通过 Observable 和 Subject 实现异步锁的机制"
modified: 2018-03-13T17:00:00-00:00
categories: articles
tags: [RxJS, TypeScript, JavaScript]
image:
  vendor: yourshot.nationalgeographic
  feature: /u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNfNHPnVooiA8n5vE0-cAR15tNTA-kJQmkOJJQ3pUh29FLhiRIAue1X5mY_HEakGQW3u2qj1gappgadEl86J1EngUipsJriseu4q94H5luZ6y2TFfBO0qrNWI-CmtrikL8JN1wbJfJ_vnu6TJFkXZx95AAgNCGJo7-pbjIfw3QSkvtGvQ/
  credit: Dong Giang
  creditlink: https://yourshot.nationalgeographic.com/profile/1423443
comments: true
share: true
references:
  - title: "The Node.js Event Loop, Timers, and process.nextTick()"
    url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/"
  - title: "What you should know to really understand the Node.js Event Loop"
    url: "https://medium.com/the-node-js-collection/what-you-should-know-to-really-understand-the-node-js-event-loop-and-its-metrics-c4907b19da4c"
  - title: "The introduction to Reactive Programming you've been missing"
    url: "https://gist.github.com/staltz/868e7e9bc2a7b8c1f754"
  - title: "What are schedulers in RxJS"
    url: "https://blog.strongbrew.io/what-are-schedulers-in-rxjs/"

---

* TOC
{:toc}

JavaScript 语言本身是单线程的，Nodejs 在单线程内是通过 event loop 机制执行非阻塞 I/O 操作的。在 event loop 的一个 callback 程序中代码执行是不会被打断的，所以并不需要加锁(locking)。但如果你的事务操作或者临界区是含有异步代码（file I/O, timer等）或者称为跨越多个 event loop callback 的，那么它就不是并发安全的，就需要 locking 机制来进行保护。

> 本文完整代码可下载自 [Github](https://github.com/tiven-wang/rxjs-tutorial/tree/railway-patterns)
{: .Tips}

## Lock
例如考虑下面的代码
```javascript
redis.get('key', function(err, value) {
    redis.set('key', value * 2);
});
```
拿到一个 key 的值后乘以2再放回，如果这段代码并并发执行两次的话，就可能出现下面结果

```
1: redis.get('key') -> 1
2: redis.get('key') -> 1
1: redis.set('key', 1 x 2) -> 2
2: redis.set('key', 1 x 2) -> 2
```

由于 JavaScript 语言本身就是单线程的，所以简单来说我们只需要一个变量就可以做到锁的机制。如下面这段 [TypeScript][TypeScript] 代码使用变量和最基本的 callback 函数方式来实现加锁解锁机制。

```typescript
class Lock {
  private locked = false;
  private queue: Array<{callback: Function, released: Function}> = [];
  public acquire(callback: (done: Function)=>void, released: (err)=>void) {
    this.queue.push({callback, released});
    if(!this.locked) {
      this.exec(this.queue.shift());
    }
  }

  private exec(lockReq: {callback: Function, released: Function}) {
    this.locked = true;
    lockReq.callback(()=> {
      this.locked = false;
      lockReq.released(null);
      if(this.queue.length > 0) {
        this.exec(this.queue.shift());
      }
    });
  }
}
```
然后调用加锁程序如下，执行后可以看到结果就是一个接着一个顺序执行的了
```typescript
let lock = new Lock();
lock.acquire((done)=> {
  console.log('got lock 1');
  setTimeout(()=>done(), 2000);
}, (err)=>console.log('released 1'));

lock.acquire((done)=> {
  console.log('got lock 2');
  setTimeout(()=>done(), 3000);
}, (err)=>console.log('released 2'));

lock.acquire((done)=> {
  console.log('got lock 3');
  setTimeout(()=>done(), 2000);
}, (err)=>console.log('released 3'));
```
当然你也可以把 callback 方式改成 [Promise][Promise] 方式，形式差不多。

> 上面方式若要找现成的 npm package 可以参见 [async-lock][async-lock]

接下来我们使用纯 [RxJS][rxjs] 来实现上面锁的机制，做到更 [Reactive Programming][Reactive_programming] 的方式。


## Implementing Lock with RxJS Observable

### Thinking in Reactive
什么是响应式编程(Reactive Programming)，关于它网上存在大量的定义和解释都不怎么样。[Wikipedia][Reactive_programming]太笼统和理论化。，[Stackoverflow][stackoverflow-reactive-programming]的回答又太高级，明显不适合初学者。响应式宣言[Reactive Manifest][reactivemanifesto]给客户或者领导看看嘛还可以。 Microsoft 的 [Rx terminology][rx] "Rx = Observables + LINQ + Schedulers" 太重，不好入手。"reactive" 和 "propagation of change" 这些说法在传统的 MV* 架构和大多数语言中也都有，并不能很好得表达出响应式编程的意义。

所以我们直截了当的讲 **“响应式编程就是用异步数据流的方式编程”**

这种方式并没有什么新鲜玩意，一个事件总线(event bus)或者你的鼠标点击事件(click events)都是异步事件数据流，你可以观察它并对它的数据做一些处理。除了浏览器或者用户界面上的点击或输入这种典型的数据流，你可以为任何事物创建数据流，比如 variables, user inputs, properties, caches, data structures, 等等。

拿我们这个问题举例，我们可以把加锁和解锁看成异步数据流，当消费者程序请求加锁时，这个请求被当作一个事件发送给加锁数据流。加锁程序在得到此事件后会做出响应，做进一步数据处理。相应地解锁也看成一个事件发送到解锁数据流，然后锁程序会做出响应处理。

### Observable Operator zip
我们来详细分析如何通过异步数据流做到加锁加锁机制。当消费端程序 A 请求加锁，那么一个请求加锁事件 **lock event** 会发送到加锁数据流。锁程序得到此事件后就会判断当前手里有没有锁或者锁是否已经被另外的消费端程序拿走，如果手里有锁自然就给他行了，如果锁已经被消费端程序 B 拿走那就要知道他什么时候还。上面我们讲到释放锁是可以通过 callback 方式或者 Promise 方式实现，但这不够响应式 (Reactive)。所以我们把释放锁也看作一个异步数据流，当锁程序得到消费端程序 B 释放锁的事件 **release lock event** 时要和消费端程序 A 的请求加锁事件 **lock event** 匹配上。在异步数据流里如何做到呐？

强大的 RactiveX 库为我们提供了这样的工具，Operators [Zip][reactivex-zip] 可以合并多个数据流，按先后顺序一对一匹配每个数据流上的事件，然后合并成一个事件。可以利用它实现我们的锁程序，加锁数据流事件必须等到释放锁数据流相应的事件后才能往下执行。

![IMAGE: RactiveX zip](/images/JavaScript/RxJS/zip.png)

### Implementing Lock
下面来看一下具体实现，首先创建一个锁类 `Lock`，它有两个属性，请求锁的队列和释放锁的队列。然后在构造函数中建立两者的关系，并且初始化一个原始锁给到释放锁队列。在实际应用当中你可能需要更严谨的程序，比方说释放锁方法做些检查，不是任何程序都能调用，你得有锁才能释放锁等限制。

```typescript
class Lock {
  // 请求锁队列
  private lockAcquire = new Subject<Observer<void>>();
  // 释放锁队列
  private lockRelease = new Subject();

  constructor() {
    this.lockAcquire
      .zip(this.lockRelease)
      .subscribe(([acquirer, released])=> {
        acquirer.next();
        acquirer.complete();
      });

    // 初始化时先 release 一个释放锁事件
    this.release();
  }

  public acquire(): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      this.lockAcquire.next(observer);
    });
  }

  public release() {
    this.lockRelease.next();
  }
}
```

然后调用锁程序，请求锁后做些异步的操作，整个流程使用 RxJS 实现的效果如下程序

```typescript
let lock = new Lock();

lockAndProcess('1');
lockAndProcess('2');
lockAndProcess('3');
lockAndProcess('4');

function lockAndProcess(val: string) {
  lock.acquire()
    .mergeMap(()=>asyncProcess(val))
    .subscribe(()=> {
      console.log(`My work ${val} is done`);
    },err=>{
      console.error(err);
    },()=> {
      console.log('releasing lock');
      console.log();
      lock.release();
    });
}

function asyncProcess(val: string): Observable<string> {
  return Observable.create((observer: Observer<string>)=> {
    console.log('got lock and processing');
    console.log('waiting 2 seconds ...');
    setTimeout(()=> {
      observer.next('answer '+val);
      observer.complete();
    }, 2000);
  });
}
// Output:
/**
got lock and processing
waiting 2 seconds ...
My work 1 is done
releasing lock

got lock and processing
waiting 2 seconds ...
My work 2 is done
releasing lock

got lock and processing
waiting 2 seconds ...
My work 3 is done
releasing lock

got lock and processing
waiting 2 seconds ...
My work 4 is done
releasing lock

*/
```

可以看到整个过程的异步操作都是用 [Observable][rxjs-Observable] 来实现的。

## Queue
基于以上逻辑，我们还可以实现任务队列，虽然 JavaScript 本就是按照队列异步处理 callback 函数的，但对于跨 event loop callback 的话还是需要自定义队列逻辑。

```typescript
class Queue {
  // 任务事件队列
  private taskQueue = new Subject<Observer<void>>();
  // 任务完成事件队列
  private taskCompleteQueue = new Subject<void>();

  constructor() {
    this.taskQueue
      .zip(this.taskCompleteQueue)
      .subscribe(([taskObserver, taskComplete])=> {
        taskObserver.next();
        taskObserver.complete();
      });

    // 初始化时先 release 一个任务完成事件
    this.completeTask();
  }

  public addTask(task: ()=>Observable<void>): Observable<void> {

    return Observable.create((observer: Observer<void>) => {
        this.taskQueue.next(observer);
      })
      .mergeMap(()=>task())
      .subscribe(
        ()=>{},
        (err)=>console.error(err),
        ()=>this.completeTask());
  }

  public completeTask() {
    this.taskCompleteQueue.next()
  }
}

let queue = new Queue();

processTask('1');
processTask('2');
processTask('3');
processTask('4');

function processTask(val: string) {
  queue.addTask(()=> {
    console.log(`task ${val} starting`);
    return asyncProcess(val).do(()=>console.log(`Task ${val} is done`));
  });
}
// Output:
/**
task 1 starting
waiting 2 seconds ...
Task 1 is done
task 2 starting
waiting 2 seconds ...
Task 2 is done
task 3 starting
waiting 2 seconds ...
Task 3 is done
task 4 starting
waiting 2 seconds ...
Task 4 is done
*/
```


## Pool
可以做队列，就可以进一步做池子。这个留给读者自己做练习。




[async-lock]:https://www.npmjs.com/package/async-lock
[TypeScript]:/articles/typescript/
[Reactive_programming]:https://en.wikipedia.org/wiki/Reactive_programming
[Reactive-Programming]:https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
[stackoverflow-reactive-programming]:http://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming
[reactivemanifesto]:http://www.reactivemanifesto.org/
[rx]:https://archive.codeplex.com/?p=rx

[rxjs]:https://github.com/ReactiveX/rxjs
[soa]:https://en.wikipedia.org/wiki/Service-oriented_architecture
[Promise]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Q]:https://github.com/kriskowal/q
[bluebird]:https://github.com/petkaantonov/bluebird
[angular-http]:https://angular.io/guide/http
[npm-request]:https://www.npmjs.com/package/request

[rxjs-Observable]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[rxjs-Observable-fromPromise]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromPromise
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

[Exponential_backoff]:https://en.wikipedia.org/wiki/Exponential_backoff
[MapReduce]:https://en.wikipedia.org/wiki/MapReduce

[reactivex-zip]:http://reactivex.io/documentation/operators/zip.html
