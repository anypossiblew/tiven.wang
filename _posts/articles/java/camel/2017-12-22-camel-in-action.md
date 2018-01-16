---
layout: post
title: Apache Camel in Action
excerpt: "."
modified: 2017-12-22T17:00:00-00:00
categories: articles
tags: [Camel, EIP]
image:
  vendor: twitter
  feature: /media/DQXk0qYW4AEEQC7.jpg:large
  credit: 500px
  creditlink: https://twitter.com/500px
comments: true
share: true
references:
  - title: "Camel examples: Spring Boot"
    url: "https://github.com/apache/camel/tree/master/examples/camel-example-spring-boot"

---

* TOC
{:toc}

## Testing

## Transforming Data
Camel 是企业系统之间的数据交换中心，面对繁杂的多种多样的数据类型自然会有一套数据转换的能力。
Camel 支持不同的数据转换方式，它提供了很多现成的组件对常见数据类型进行转换，如 `camel-csv`, `camel-jackson`, `camel-xstream` 等。但如果涉及到更加灵活的数据处理，则需要用到强大易用的脚本表达式（Expression）了。Camel 提供了很多种脚本语言的支持，比如内置的 simple 语言，JavaScript 语言等。更加传统的编写自定义逻辑的方式莫过于书写 Java 代码了，Camel 有几种可以编写 Java 代码逻辑的方式，Processor, Bean, Content Enricher 等。最后需要用到模板转换数据的话，Camel 也提供了几种支持，XSLT， Apache Velocity 等。

* Data formats - XML, JSON ...
* Expression - Languages
* Java - Processor, Bean, Content Enricher
* Templates - XSLT,  Apache Velocity ...

关于数据转换的详细介绍参见 [Apache Camel - Transforming Data](/articles/camel-transforming-data/)

## Error Handling

Camel 对错误的分类定义为：可恢复的（recoverable）错误和不可恢复的（irrecoverable）错误，分别使用 Exception 和 Fault Message 表示。对于 Exception 用户可以自定义处理逻辑，而 Fault Message 会作为错误消息直接返回给服务消费者。

用户可以对 Exception 定义不同的 Error Handlers，或者使用 `onException()` 对每一种 Exception 分别定义逻辑。而对 Exceptions 的处理逻辑主要是 Redelivery 和 Log 。

详细介绍请参见文章 [Apache Camel - Error Handling](/articles/camel-error-handling/)

## Components
### Scripting

[Apache Camel Scripting](/articles/camel-script/)

### Automating tasks

[Quartz](/articles/camel-component-quartz/)

## Asynchronous Messages

## Concurrency and Scalability
