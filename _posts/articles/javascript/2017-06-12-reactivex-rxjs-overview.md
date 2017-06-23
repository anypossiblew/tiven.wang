---
layout: post
title: ReactiveX RxJS
excerpt: "RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code."
modified: 2017-06-12T17:00:00-00:00
categories: articles
tags: [RxJS, ReactiveX, JavaScript]
image:
  feature: nationalgeographic/Strutting-Stork.jpg
comments: true
share: true
references:
  - title: "The ReactiveX library for JavaScript"
    url: "http://reactivex.io/rxjs/"
  - title: "Github - ReactiveX/rxjs"
    url: "https://github.com/ReactiveX/rxjs"
  - title: "GitBook - Learn RxJS"
    url: "https://www.learnrxjs.io/"
---

* TOC
{:toc}

RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code.

We used [ES6](https://github.com/lukehoban/es6features) to code in this project.

## Usage

`npm install --save @reactivex/rxjs`

### Compile ES6 to ES5

[Compile ES6 to ES5](/articles/to-es5-compiler/)

### Rx Hello world

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

## More Complex

### Create a Subject of timer

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
