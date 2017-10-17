---
layout: post
title: Simple Component Pattern
excerpt: "The single responsibility principle."
modified: 2017-10-16T17:00:00-00:00
categories: articles
tags: [Pattern, Reactive]
image:
  vendor: unsplash
  feature: /photo-1492778297155-7be4c83960c7?dpr=1&auto=compress,format&fit=crop&w=1950&h=&q=80&cs=tinysrgb&crop=
  credit: Igor Miske
  creditlink: https://unsplash.com/@igormiske
comments: true
share: true
references:
  - id: 1
    title: Single responsibility principle
    url: https://en.wikipedia.org/wiki/Single_responsibility_principle
  - id: 2
    title: "Single Responsibility Principle: A Recipe for Great Code"
    url: "https://www.toptal.com/software/single-responsibility-principle"
---

* TOC
{:toc}

> The **S**ingle **R**esponsibility **P**rinciple (**SRP**) is a computer programming principle that states that every module or class should have responsibility over a single part of the functionality provided by the software, and that responsibility should be entirely encapsulated by the class. All its services should be narrowly aligned with that responsibility. Robert C. Martin expresses the principle as, "A class should have only one reason to change."[[1](#reference-1)]
{: .Quotes}

分而治之 ([Divide and Conquer](https://en.wikipedia.org/wiki/Divide_and_rule))策略讲的是把大的问题分割成更小的问题，进而找到每个小问题的方位和责任。通过这种责任划分的过程你可以更轻松的解决看似很庞大的但具有层级结构的问题。这就涉及到划分到什么程度才是合适的，SRP给出的答案是每个task（e.g. modular, class）应该具有完整的不可分割的单独的责任，或者用 Robert C. Martin 的话说，"一个类应该只有一个改变的理由。"。

## Applying SRP in Reactive Application

S.O.L.I.D.

http://aspiringcraftsman.com/2011/12/08/solid-javascript-single-responsibility-principle/

https://medium.com/@cramirez92/s-o-l-i-d-the-first-5-priciples-of-object-oriented-design-with-javascript-790f6ac9b9fa
