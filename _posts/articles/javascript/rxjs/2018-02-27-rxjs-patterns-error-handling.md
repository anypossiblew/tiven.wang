---
layout: post
theme: Josefin-Sans
title: RxJS - Error Handling Patterns in High Speed Railway Client
excerpt: "RxJS 多种模式在高铁客户端中的应用"
modified: 2018-03-13T17:00:00-00:00
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
  - title: "Top 7 RxJS Patterns for Angular Development"
    url: "https://angularfirebase.com/lessons/top-7-rxjs-patterns-for-angular-development/"
  - title: "Efficient design patterns for event handling with RxJS"
    url: "https://medium.com/@OlegVaraksin/efficient-design-patterns-for-event-handling-with-rxjs-d49b56d2ae36"
  - title: "mergeMap vs flatMap vs concatMap vs switchMap"
    url: "https://tolikcode.github.io/post/rxjsMap/"    
  - title: "RxJS Antipatterns"
    url: "http://brianflove.com/2017/11/01/ngrx-anti-patterns//"
---

* TOC
{:toc}

一个产品生产可用性的重要特征是其对错误的容忍度，从代码角度看就是 Error Handling 做得怎么样。Error Handling 处理方式做好的话可以增加代码的健壮性和错误容忍度。如果处理不好，则会增加代码复杂度和降低代码可阅读性。[RxJS][rxjs] 也不例外，一个健壮的 RxJS Stream 程序需要把 Error Handling 逻辑做好。但 RxJS 属于响应式编程，他并不像传统命令式编程(imperative programming)的异常处理那样，他有着自己的一套响应式编程的错误处理方式。

对于普通的异常处理 JavaScript 可以使用 `try catch` 来捕获和处理, 但 Error Handling 用在异步函数上则情况更加复杂一些，特别是异步调用远程连接即 Remote HTTP call 时会出现更复杂的情况，如 网络异常、远程服务器错误、连接超时、系统忙、数据不存在、CDN 类错误等等问题。如果对类似这些错误处理不好，你的代码逻辑将陷入紊乱之中。如果你找一个公开的远程系统来做 RxJS 编程练习的话，没有哪个系统比火车票订票系统更合适的了。它把远程服务调用 Remote HTTP call 会出现的错误场景演绎的淋漓尽致，几十个 API 之间数据相互流转让你有足够的余地发挥 RxJS Data Processing Stream 的能力。

本篇将介绍我在拿订票系统做 RxJS 练习时用到的一些模式，包括 Async Call, Error Handling, retry, Backoff strategy 等相关的。

> 本文完整代码可下载自 [Github](https://github.com/tiven-wang/rxjs-tutorial/tree/railway-patterns)
{: .Tips}

## Remote HTTP call
远程 HTTP 调用如 普通 http、RESTFul API、SOAP、OData、GraphQL等在当下的软件开发过程中占据重要位置，不管是 [SOA][soa] 还是 [Microservices](/articles/microservices-architecture/) 理论中对 HTTP services 的处理都要给予重点关注。

在响应式编程里远程 HTTP 调用有三个过程：异步调用、错误处理、数据处理。接下来看一下有哪些 RxJS 模式可以用在这些过程当中。

### Async Calling
JavaScript 语言中基本的异步处理是通过 callbacks 函数完成的，后来发展出来 [Promise][Promise], async/await, EventEmiter 等技术。其中以 [Promise][Promise] 最为成熟，并且有很多第三方成熟的 Promise 库如 [Q][Q], [bluebird][bluebird], ES6 Promise 等。

> 关于 JavaScript 异步的发展过程请参见 [JavaScript Asynchronous](/articles/javascript-asynchronous/) 一文.
{: .Notes}

RxJS 并没有自己的 HTTP Client 库，像 angular 这样的库都实现有自己的 [HttpClient][angular-http] 与 RxJS 配合使用。所以对于我们使用 Node.js 来说则需要 npm 库如 [request][npm-request] 来做 HttpClient 了。

拿查询余票接口为例，首先假设我们已经创建调用函数如下
```typescript
function queryLeftTicket(trainDate: string, fromStation: string, toStation: string): Promise<any> {

  var query = {
    "leftTicketDTO.train_date": trainDate
    ,"leftTicketDTO.from_station": fromStation
    ,"leftTicketDTO.to_station": toStation
    ,"purpose_codes": "ADULT"
  }

  var param = querystring.stringify(query);

  var url = "https://kyfw.12306.cn/otn/leftTicket/queryZ?"+param;

  return new Promise((resolve, reject)=> {
    request(url, (error, response, body)=> {
      if(error) return reject(error.toString());

      if(response.statusCode === 200) {
        if(!body) {
          return reject("系统返回无数据");
        }
        if(body.indexOf("请您重试一下") > 0) {
          return reject("系统繁忙!");
        }else {
          try {
            var data = JSON.parse(body).data;
          }catch(err) {
            return reject(err);
          }
          // Resolved
          return resolve(data);
        }
      }else {
        reject(response.statusCode);
      }
    });
  });
}
```
在调用此函数时输入需要查询的参数，函数会返回一个 promise ，当调用服务完成后在callback函数里根据返回结果情况会调用 resolve 或者 reject 决定 promise 是成功还是失败。

RxJS Observable 提供了一个静态方法 [fromPromise][rxjs-Observable-fromPromise] 可以从一个 promise 对象创建 Observable 对象。

> **Observable~fromPromise**: Converts an ES2015 Promise or a Promises/A+ spec compliant Promise to an Observable. If the Promise resolves with a value, the output Observable emits that resolved value as a next, and then completes. If the Promise is rejected, then the output Observable emits the corresponding Error.
{: .Quotes}

看
```typescript
Observable.fromPromise(queryLeftTicket('2018-03-02', 'TBP', 'JGK'))
  .subscribe(data=> console.log(data), err=>console.error(err));
```


这样只是单次调用，如果做到根据事件触发多次调用呐？我们可以创建另外一个 Observable 事件序列，来触发这个上面这个调用查询余票服务的 Observable 对象。这就需要用到 RxJS Observable 的一个 operator [mergeMap][rxjs-Observable-mergeMap] 了。mergeMap 是一个事件触发另一个事件序列并合并到本序列；如果另一个事件序列就只有一个事件，那么就可以说一个事件触发另外一个事件；如果另外一个事件是一次服务调用的 Promise 的话，可以说一个事件触发一次服务调用并得到其结果合并到本序列。这样就做到了事件触发服务调用。

```typescript
Observable.of(1, 2, 3)
  .map(val=>['2018-03-01', 'TBP', 'JGK'])
  .mergeMap(([trainDate, fromStation, toStation])=>Observable.fromPromise(queryLeftTicket(trainDate, fromStation, toStation)))
  .subscribe(data=> console.log(data.result[0]), err=> console.log(err));
```

如上面代码，三个事件会触发三次服务调用。如果当前面的服务调用还没结束，但你只想看当前的服务调用结果，那么可以忽略之前事件触发的服务调用，使用另外一个 operator [switchMap][rxjs-Observable-switchMap] 可以做到。

> 关于 mergeMap 和 switchMap 的详细实际应用可以参考文章 [Medium - Understanding mergeMap and switchMap in RxJS](https://netbasal.com/understanding-mergemap-and-switchmap-in-rxjs-13cf9c57c885)
{: .Notes}

Observable 可以做到 Promise 可以做的事情，而且做得更好功能更多，为什么不直接把 Observable 用在调用服务的函数里作为返回对象呐？

```typescript
Observable.of(1, 2, 3)
  .map(val=>['2018-03-01', 'TBP', 'JGK'])
  .mergeMap(([trainDate, fromStation, toStation])=>queryLeftTicket(trainDate, fromStation, toStation))
  .subscribe(data=> console.log(data.result[0]), err=> console.log(err));

function queryLeftTicket(trainDate: string, fromStation: string, toStation: string): Observable<any> {

  ...

  return Observable.create((observer: Observer<any>)=> {
    request(url, (error, response, body)=> {
      if(error) throw error.toString();

      if(response.statusCode === 200) {
        if(!body) {
          throw "系统返回无数据";
        }
        if(body.indexOf("请您重试一下") > 0) {
          throw "系统繁忙!";
        }else {
          try {
            var data = JSON.parse(body).data;
          }catch(err) {
            throw err;
          }
          // Resolved
          observer.next(data);
        }
      }else {
        throw response.statusCode;
      }
    });
  });
}
```

这样就省去了创建 Promise 一步，如果你是全新开始编程序当然可以这么做，如果你是面对的遗留程序当然还是可以用 fromPromise + Promise 的。


总结：**事件触发服务调用模式** = **Observable** + [ **mergeMap** \| **switchMap** ] + [ **Observable** \| [ **fromPromise** + **Promise** ]] + **request**


在你实际运行当中，并不会每次执行都能得到正确结果，经常会遇到 _"系统繁忙"_ 这样的错误，那么遇到这样的错误该怎么办呐，那就接着往下看吧，错误处理模式。

### Error Handling
不出意外你肯定看到了调用服务的错误信息，上面我们代码的逻辑是连续发出三个事件，几乎同时触发三个服务调用，订票系统会拒绝太频繁的请求以非正常的方式比如返回一个错误页面，或者更直接地返回空数据。对于这种任性的系统常见的 HTTP 错误问题如网络异常、远程服务器错误、连接超时、系统忙、数据不存在、CDN 类错误等等都可能出现。这就对我们程序的异常处理机制提出了实在的挑战，另一方面它也是上天赐给我们程序员的礼物。

总起来看服务返回结果应该分为三类：正常返回的正确数据结果，正常返回的错误信息结果，不正常的异常错误。
前两者说明调用服务是成功的，只不过结果分为正确数据和错误信息；后者是调用异常可能是网络异常、连接失败、刷新频繁等等，总起来说是需要重新调用的。所以对于需要重新调用的情况要单独处理，而调用成功的结果则后续处理。

普通的 JavaScript 程序通常是用 try/catch 捕获并处理异常或者在 callback 函数里写判断错误逻辑。但在 RxJS 里数据出理是以流的形式存在，相应地异常处理是以 operators 形式加入到数据流中去的。常用的异常处理 operators 包括 catch(), retry(), retryWhen(), finally().

#### Observable Error Processing
首先我们来了解一下 Observable 本身的错误处理机制。在订阅 [subscribe][rxjs-Observable-subscribe] 一个 Observable 对象时可以传入 error function 或者 [Observer][rxjs-Observer] 对象来作为错误发生时的回调函数。当 Observable 对象需要输出错误时，会调用 observer.error(err) 方法通知到 Observers，然后 [Observer][rxjs-Observer] 的 [error][rxjs-Observer~error] 函数被回调。


```typescript
Observable.create((observer: Observer<any>)=> {
    observer.error("错误信息");
  })
  .subscribe((data:any)=> console.log(data), (err:string)=> console.log("err:"+err));

// Output:
/**
err:错误信息
*/
```

💡这里有个坑，如果你习惯性地用关键字 **throw** 抛出一个异常，虽然它会被当作错误触发 error 函数的，但它也会被抛出 exception， 如果不用 try/catch 捕捉的话就会中断程序执行。

```typescript
try {
  Observable.create((observer: Observer<any>)=> {
      // observer.error("错误信息");
      throw "异常信息";
    })
    .subscribe((data:any)=> console.log(data.result[0]), (err:string)=> setTimeout(()=>console.log("Err:"+err)));
}catch(err) {
  console.log("Exception:"+err)
}

console.log("After");

//Output:
/**
Exception:异常信息
After
Err:异常信息
*/
```
即使目前看使用 try/catch 可以捕捉到异常，error 函数也被调用了，程序也没有中断。但如果你把 **throw** 用在异步回调函数里时 try/catch 也是无能为力的。

```typescript
try {
  queryLeftTicket('2018-03-01', 'TBP', 'JGK')
    .subscribe((data:any)=> console.log(data.result[0]), (err:string)=> setTimeout(()=>console.log("Err:"+err)));
}catch(err) {
  console.log("Exception:"+err)
}
console.log("After");

function queryLeftTicket(trainDate: string, fromStation: string, toStation: string): Observable<any> {
  // ...
  return Observable.create((observer: Observer<any>)=> {
    request(url, (error, response, body)=> {
      throw "系统繁忙!";
      // ...
    });
  });
}

//Output:
/**
After

\rxjs-tutorial\dist\index.js:58
            throw "系统繁忙!";
            ^
系统繁忙!
*/
```

所以在响应式编程里你需要改变思维方式了，try/catch 可以捕捉到命令式编程的异常，但在响应式编程里任何异常都要通过回调函数进行，在 RxJS 里它就是 error 函数。所以我们之前的例子里的 queryLeftTicket 函数里使用的 throw 是不合适的。更正如下

```typescript
function queryLeftTicket(trainDate: string, fromStation: string, toStation: string): Observable<any> {
  // ...
  return Observable.create((observer: Observer<any>)=> {
    request(url, (error, response, body)=> {
      if(error) return observer.error(error.toString());

      if(response.statusCode === 200) {
        if(!body) {
          return observer.error("系统返回无数据");
        }
        if(body.indexOf("请您重试一下") > 0) {
          return observer.error("系统繁忙!");
        }else {
          try {
            var data = JSON.parse(body).data;
          }catch(err) {
            return observer.error(err);
          }
          // Resolved
          observer.next(data);
        }
      }else {
        return observer.error(response.statusCode);
      }
    });
  });
}
```


> 你如果发现在 operator map 里 throw 一个异常它可以被正确地传播到 error function 并不会抛出异常，那是因为在 map 函数的代码里已经使用 try/catch 捕捉了异常并调用了 observer.error() 函数。
{: .Warning}

> RxJS 基本的 Operators 都已经使用 try/catch 转换异常到 error 函数了。
{: .Tips}

#### Operator catch
到目前为止我们了解了响应式编程正确的异常处理机制，接下来我们看一下在 RxJS 里 Operator [catch][rxjs-Observable~catch] 是怎么帮助在数据流中捕获并处理异常的。上面我们讲了要把思维方式从命令式编程转变到函数式编程和响应式编程上来，传统的 try/catch/finally 就被 error, catch 和 finally 函数替代了。

本质上 catch 函数是捕获的 error 函数中传输的错误信息，它是在错误传播到 Subscriber 之前提前 catch 到 error 信息并做相应处理，要嘛传出正常结果给后续 Operators，要嘛继续传播错误给到 Subscriber。

```typescript

queryLeftTicket('2018-03-01', 'TBP', 'JGK')
  .catch((err)=>{
    console.log('发现错误，该怎么办呢');
    return Observable.of({result:[]});
  })
  .subscribe((data:any)=> console.log(data.result[0]), (err:string)=> setTimeout(()=>console.log("Err:"+err)));

console.log("After");
//Output:
/**
After
发现错误，该怎么办呢
undefined
*/
```
#### Retry Patterns
有些错误信息需要编写逻辑进行处理，但有些错误只需要重新调用就可以解决的，比如网络问题，连接超时，系统繁忙，特别是像订票系统这种在负载非常大的时候就更需要多试几次调用，才能做到 **抢**。

RxJS 提供了 Operators [retry][rxjs-Observable~retry], [retryWhen][rxjs-Observable~retryWhen] 方便了我们重试操作。

```typescript
queryLeftTicket(new Date(new Date()-1000*60*60*24).toJSON().slice(0,10), 'TBP', 'JGK')
  .retry(3)
  .catch((err)=>{
    console.log('发现错误，该怎么办呢');
    return Observable.of({result:[]});
  })
  .subscribe((data:any)=> console.log(data.result[0]), (err:string)=> console.log("Err:"+err));

function queryLeftTicket(trainDate: string, fromStation: string, toStation: string): Observable<any> {
  ...
  return Observable.create((observer: Observer<any>)=> {
    console.log("request leftTicket...")
    request(url, (error, response, body)=> {
      ...
    });
  });
}
//Output:
/**
request leftTicket...
request leftTicket...
request leftTicket...
request leftTicket...
发现错误，该怎么办呢
undefined
*/
```
为一个 Observable 对象添加了 [retry][rxjs-Observable~retry] 操作，当遇到 error 时 retry 会为后续操作重新订阅 subscribe 此 Observable 对象以做到重试功能。所以 retry(3) 你会发现重试三次，加上第一次总共四次调用。

如果这是你自己的系统就不应该这么暴力了，应该选择一种退避策略(backoff strategy)，例如固定间隔，线性增长间隔，指数增长间隔，随机间隔 jitter。

##### Retry Constant Backoff
另一个 Operator [retryWhen][rxjs-Observable~retryWhen] 能使我们更精确地控制什么时候怎么样进行重试。例如要在固定时间间隔后进行充实，则可以使用 retryWhen + delay 来做到。

```typescript
queryLeftTicket(new Date(new Date()-1000*60*60*24).toJSON().slice(0,10), 'TBP', 'JGK')
  .retryWhen(error$ => error$.delay(2000))
  .subscribe((data:any)=> console.log(data.result[0]), (err:string)=> console.log("Err:"+err));
//Output:
/**
request leftTicket...
// 等待 2 秒
request leftTicket...
// 等待 2 秒
request leftTicket...
// 等待 2 秒
...
*/
```
如果还想加上最大重试次数的限制呐，那就在 retryWhen 函数返回的 Observable 对象上添加 Operator 逻辑来实现，你可以看到 Observable 对象的强大。Operator [scan][rxjs-Observable~scan] 可以把一个 Observable 对象上发出的事件累加起来，如同 [MapReduce][MapReduce] 里的 reduce。所以我们可以利用 scan 做到计数器功能。

> **scan**: It's like [reduce][rxjs-Observable~reduce], but emits the current accumulation whenever the source emits a value.
{: .Quotes}

```typescript
const maxRetries = 3;

queryLeftTicket(new Date(new Date()-1000*60*60*24).toJSON().slice(0,10), 'TBP', 'JGK')
  .retryWhen(error$ =>
      error$.delay(2000)
        .scan((errorCount, err)=> {
          if(errorCount >= maxRetries) {
            throw err;
          }
          return errorCount + 1;
        }, 0)
  )
  .catch((err)=>{
    console.error(err);
    console.log('发现错误，该怎么办呢');
    return Observable.of({result:[]});
  })
  .subscribe((data:any)=> console.log(data.result[0]), (err:string)=> console.log("Err:"+err));
// Output:
/**
request leftTicket...
// 等待 2 秒
request leftTicket...
// 等待 2 秒
request leftTicket...
// 等待 2 秒
request leftTicket...
系统繁忙!
发现错误，该怎么办呢
undefined
*/
```

总结：**固定间隔限定次数重试模式** = **Observable** + [ **retryWhen** + **deply** + **scan** ]

##### Retry Linear Backoff
固定的时间间隔去重试服务调用显然是最直接的方式，但在实际中更有效的一个重试策略是按线性增长的时间间隔重试远程服务调用。这种技术应用在现代的 web 网站上已经很成熟了，第一次重试操作立马进行，再失败的话就要增加下次调用前的时间间隔，依次类推。

现在问题就是要为定时器创建一个线性增长的时间事件序列，Observable [range][rxjs-Observable~range] 可以生成数字序列。例如

```typescript
const maxRetries = 3;
Observable.range(0, maxRetries)
  .subscribe(val=>console.log(val));
// 0,1,2
```
接下来就是如何把这个序列 one to one 分配给 error$ 事件序列，如果 error$ 序列是 error1,error2,error3 的话，那么我们想要得到的效果就是 [error1,0],[error2,1],[error3,2] 这样的一个序列。RxJS 为我们准备了完备的 Operator 工具箱，里面有一个 [zip][rxjs-Observable~zip] 就是为此准备的。

```typescript
const maxRetries = 3;
Observable.range(0, maxRetries)
  .zip(Observable.of('error1', 'error2', 'error3', 'error4'))
  .subscribe(val=>console.log(val));
// Output:
/**
[ 0, 'error1' ]
[ 1, 'error2' ]
[ 2, 'error3' ]
*/
```

整合到 retryWhen 里面去

```typescript
const maxRetries = 3;

queryLeftTicket(new Date(new Date()-1000*60*60*24).toJSON().slice(0,10), 'TBP', 'JGK')
  .retryWhen(error$ =>
      Observable.range(0, maxRetries)
        .zip(error$)
        .mergeMap(([i, err])=>
          Observable.timer(i * 1000)
            .do(()=> console.log(`Retrying after ${i} second(s)...`))
        )
  )
  .catch((err)=>{
    console.error(err);
    console.log('发现错误，该怎么办呢');
    return Observable.of({result:[]});
  })
  .subscribe((data:any)=> console.log(data.result[0]), (err:string)=> console.log("Err:"+err));
// Output:
/**
request leftTicket...
Retrying after 0 second(s)...
request leftTicket...
Retrying after 1 second(s)...
request leftTicket...
Retrying after 2 second(s)...
request leftTicket...
*/
```

最后错误呐？漏掉了，当时间序列被用完时，error$ 序列再产生的事件就无处可去了，丢掉了。所以在创建定时器时要判断一下如果已经用过了最后一个机会那么就抛出此错误。

```typescript
const maxRetries = 3;

queryLeftTicket(new Date(new Date()-1000*60*60*24).toJSON().slice(0,10), 'TBP', 'JGK')
  .retryWhen(error$ =>
      Observable.range(0, maxRetries+1)
        .zip(error$)
        .mergeMap(([i, err])=> {
          if(i === maxRetries) {
            return Observable.throw(err);
          }
          return Observable.timer(i * 1000)
                  .do(()=> console.log(`Retrying after ${i} second(s)...`))
        })
  )
  .catch((err)=>{
    console.error(err);
    console.log('发现错误，该怎么办呢');
    return Observable.of({result:[]});
  })
  .subscribe((data:any)=> console.log(data.result[0]), (err:string)=> console.log("Err:"+err));
// Output:
/**
request leftTicket...
Retrying after 0 second(s)...
request leftTicket...
Retrying after 1 second(s)...
request leftTicket...
Retrying after 2 second(s)...
request leftTicket...
系统返回无数据
发现错误，该怎么办呢
undefined
*/
```

总结：**线性指数增长间隔限定次数重试模式** = **Observable** + [ **retryWhen** + [ **range** + **zip** + **mergeMap** + **timer** ]]

##### Retry Exponential Backoff
如果是指数性增长的时间间隔，则只需要稍微更改一下时间事件流逻辑即可，如

```typescript
const maxRetries = 4;
Observable.range(0, maxRetries)
  .map(val=>val*val)
  .subscribe((data:any)=> console.log(data), (err:string)=> console.log("Err:"+err));
// 0,1,4,9
```


## RxJS Study Tools

[RxJS Marbles](http://rxmarbles.com)
[Rx Visualizer](https://rxviz.com/)





[rxjs]:https://github.com/ReactiveX/rxjs
[soa]:https://en.wikipedia.org/wiki/Service-oriented_architecture
[Promise]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Q]:https://github.com/kriskowal/q
[bluebird]:https://github.com/petkaantonov/bluebird
[angular-http]:https://angular.io/guide/http
[npm-request]:https://www.npmjs.com/package/request

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
