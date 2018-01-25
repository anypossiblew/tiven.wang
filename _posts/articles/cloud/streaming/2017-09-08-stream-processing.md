---
layout: post
title: Stream Processing
excerpt: "Stream processing is a computer programming paradigm, equivalent to dataflow programming, event stream processing, and reactive programming, that allows some applications to more easily exploit a limited form of parallel processing. The stream processing paradigm simplifies parallel software and hardware by restricting the parallel computation that can be performed. Given a sequence of data (a stream), a series of operations (kernel functions) is applied to each element in the stream. "
modified: 2017-09-08T17:00:00-00:00
categories: articles
tags: [Streams, Reactive]
image:
  vendor: unsplash
  feature: /photo-1490645935967-10de6ba17061?dpr=1.5&auto=format&fit=crop&w=1080&h=735&q=80&cs=tinysrgb&crop=
  credit: Brooke Lark
  creditlink: https://unsplash.com/@brookelark
comments: true
share: true
references:
  - title: "A short intro to stream processing"
    url: "http://www.jonathanbeard.io/blog/2015/09/19/streaming-and-dataflow.html"
  - title: "A Journey into Reactive Streams"
    url: "https://blog.redelastic.com/a-journey-into-reactive-streams-5ee2a9cd7e29"
  - title: "Java 9 Reactive Streams"
    url: "http://www.baeldung.com/java-9-reactive-streams"
  - title: "Making Sense of Stream Processing"
    url: "http://www.oreilly.com/data/free/stream-processing.csp"

---

* TOC
{:toc}

// TODO

Streams Processing Language (SPL)

[Functional reactive programming][Functional_reactive_programming] could be considered stream processing in a broad sense.

Batch File Based Processing (emulates some of actual stream processing, but much lower performance in general)

* Apache Kafka
* Apache Flink
* Apache Storm
* Apache Apex
* Apache Spark

Stream Processing Services:

* Amazon Web Services - Kinesis
* Google Cloud - Dataflow
* Microsoft Azure - Stream Analytics

http://www.reactive-streams.org/

https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html

https://docs.spring.io/spring/docs/5.0.0.BUILD-SNAPSHOT/spring-framework-reference/html/web-reactive.html


[Spark Streaming](https://spark.apache.org/streaming/)



[Functional_reactive_programming]:https://en.wikipedia.org/wiki/Functional_reactive_programming
