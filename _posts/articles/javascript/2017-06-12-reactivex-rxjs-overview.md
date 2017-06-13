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
  - title: "css-tricks.com - Transpiling ES6"
    url: "https://css-tricks.com/transpiling-es6/"


---

* TOC
{:toc}

RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code.

## Usage

`npm install rxjs`

### Compile ES6 to ES5

`npm install --save-dev babel-cli`

`npm install --save-dev babel-preset-es2015`

.babelrc

```
{
  "presets": ["es2015"]
}
```

`babel index.js --out-file public/index.js`
