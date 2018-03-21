---
layout: post
theme: 细秀体
title: Angular - Observables and RxJS
excerpt: ""
modified: 2018-03-21T18:00:00-00:00
categories: articles
tags: [RxJS, Observable, Angular, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DYvzvspVMAA-kzt.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/976141747670671366
comments: true
share: true
references:
  - id: 1
    title: "Angular guide - Observables"
    url: "https://angular.io/guide/observables"
  - id: 2
    title: "Taking Advantage of Observables in Angular"
    url: "https://blog.thoughtram.io/angular/2016/01/06/taking-advantage-of-observables-in-angular2.html"
---

* TOC
{:toc}

> Observables provide support for passing messages between publishers and subscribers in your application. Observables offer significant benefits over other techniques for event handling, asynchronous programming, and handling multiple values.[[1.](#reference-1)]
{: .Quotes}

关于 RxJS 框架的介绍和应用可以参考另外几篇文章
* [RxJS Basic](/articles/rxjs-basic/)
* [RxJS Patterns - Error Handling Patterns in High Speed Railway Client](/articles/rxjs-patterns-error-handling/)
* [RxJS Patterns - Implementing Async Lock](/articles/rxjs-patterns-async-lock/)

## Basic

我们来简单看一下 Observable 基本流程

Pattern: [**Observable**][Observable] => [**Subscriber**][Subscriber] => [**Subscription**][Subscription]


```typescript
const timer = new Observable((observer) => {
  let interval = setInterval(()=>
    observer.next(new Date(), 1000)
  );
  return {
    unsubscribe() {
      clearInterval(interval);
    }
  };
});
const timerSubscription = timer.subscribe({
  next(t) { console.log('Current time: ', t); },
  error(msg) { console.log('Error Getting Time: ', msg); }
});

// Stop listening for location after 10 seconds
setTimeout(() => { timerSubscription.unsubscribe(); }, 10000);
```

## Observables in Angular

Angular 为他的很多常用异步操作都实现了 Observable ， 这包括
* [`EventEmitter`][EventEmitter] class extends [Observable][Observable]
* The [HTTP][angular-http] module uses observables to handle AJAX requests and responses.
* The [Router][angular-router] and [Forms][angular-forms] modules use observables to listen for and respond to user-input events.



[Observable]:http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[Subscriber]:http://reactivex.io/rxjs/class/es6/Subscriber.js~Subscriber.html
[Subscription]:http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html
[EventEmitter]:https://angular.io/api/core/EventEmitter
[angular-http]:https://angular.io/guide/http
[angular-router]:https://angular.io/guide/router
[angular-forms]:https://angular.io/guide/forms
