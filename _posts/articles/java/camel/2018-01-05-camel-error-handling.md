---
layout: post
title: Apache Camel - Error Handling
excerpt: "."
modified: 2018-01-05T17:00:00-00:00
categories: articles
tags: [Exception, Camel, EIP]
image:
  vendor: twitter
  feature: /media/DNo1tG9U8AA8ARn.jpg:large
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

对于 Java 开发来说错误都是以 [Exception][Exception] 表示的，当程序遇到错误时会创建并抛出一个 Exception 对象。在 Camel 里 Error 分为可恢复（recoverable）和不可恢复（irrecoverable）错误。

* Exceptions 通常表示可恢复错误，使用 [Exchange][Exchange] 对象的 Exception 属性表示
  ```java
  void setException(Throwable cause);
  Exception getException();
  ```
* Fault messages 通常表示不可恢复错误，使用 Fault message 表示
  ```java
  Message msg = Exchange.getOut();
  msg.setFault(true);
  msg.setBody("Unknown customer");
  ```

Camel 对于不可恢复的错误 Fault messages 通常处理方式是返回给 Consumer 或者输出到 Log 。但对于可恢复错误 Camel 会有 Redelivery 操作。

Camel's error handling only applies within the lifecycle of an exchange.

## Irrecoverable Error
Camel 实现了 [Java Business Integration][JBI] (JBI) 规范，JBI 规定了 Fault message 规范，表示一种失败消息返回给服务的 Consumer。如果是 [SOAP][SOAP] 协议的服务的话，会被转换成 [SOAP Fault Message][SOAP-Fault-Message]，而如果是 Restful API 会被转换成 HTTP Status code = 500 的 Response.

例如下面的代码逻辑，当消息的头 `id` 不是 "CamelinAction" 时，Camel route 会返回一个 fault message ，然后路由不再往下执行，Exchange 携带 fault message 被返回给 Consumer ：

```java
from("direct:book").process(new Processor() {
	@Override
	public void process(Exchange exchange) throws Exception {
		if (!"CamelinAction".equalsIgnoreCase(exchange.getIn().getHeader("id").toString())) {
			Message fault = exchange.getOut();
			fault.setFault(true);
			fault.setBody("Unknown book!");
		}
	}
}).bean("bookRepository", "getByIsbn(${header.id})");
```

## Recoverable Error
对于程序中的 Exception 被认为是可恢复的错误，但并不代表所有的 Exception 都是可恢复的错误。Camel 通过 `exchange.getException() != null` 来判断是否有异常，如果有异常则触发 error handler。 Camel 提供了几种 error handlers :

### Default Error Handler
`DefaultErrorHandler` 是 Camel 默认的 Error Handler，它默认不会 redelivery 并且异常会被抛回给调用方。但我们可以显式指定 Maximum Redeliveries 等属性，测试便会发现当遇到 Exception 时 Camel 会重试，直到达到最到重试数或得到正常结果。

```java
errorHandler(defaultErrorHandler().maximumRedeliveries(10).redeliveryDelay(100));
```

在 Bean 方法里模拟不确定的 Exception 现象：

```java
@Override
public Book getByIsbn(String isbn) throws Exception {
	int i = new Random().nextInt(10);
	if(i > 5) {
		logger.debug("We got the book! "+i);
		return new Book(isbn, "This is book "+isbn);
	}else {
		logger.debug("We can't service now! " + i);
		throw new Exception("System is bussy! " + i);
	}
}
```

`DefaultErrorHandler` 和后面的 `DeadLetterChannel` `TransactionErrorHandler` 通过继承 `RedeliveryErrorHandler` 都支持 Redelivery 功能。Exchange 上也有一些 [Redelivery](https://github.com/apache/camel/blob/master/camel-core/src/main/java/org/apache/camel/Exchange.java#L194-L198) 相关的属性可以查看当前 Redelivery 的情况。


### Dead Letter Channel

`DeadLetterChannel` 实现了 [Dead Letter Channel][Dead-Letter-Channel] 集成模式。

当 Exchange 被 Error Handler 处理后，它上面的 Exception 会被移到 [Exchange.EXCEPTION_CAUGHT][Exchange.EXCEPTION_CAUGHT] 属性上。

```java
.onException(Exception.class).handled(true)
  .process(new Processor() {
    @Override
    public void process(Exchange exchange) throws Exception {
      Exception cause = exchange.getProperty(Exchange.EXCEPTION_CAUGHT, Exception.class);
      // we now have the caused exception
    }
  })
.end()
```

### Transaction Error Handler

### No Error Handler

### Logging Error Handler

## Exception Policies

### Scopes
Camel 支持定义异常处理的两种级别的 Scopes ：Context scope 和 Route scope 。

### On Exception
除了定义统一的 Error Handler 异常处理逻辑，还可以定义细化到每个不同 Exception 类型的处理逻辑：

* `onException()`
* `doTry() doCatch() doFinally()`

```java
from("direct:books")
  .errorHandler(deadLetterChannel("log:DLC").maximumRedeliveries(3).redeliveryDelay(100).onPrepareFailure(new Processor() {
    @Override
    public void process(Exchange exchange) throws Exception {
      Exception exception = exchange.getProperty(Exchange.EXCEPTION_CAUGHT, Exception.class);
      exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 503);
      exchange.getIn().setBody(exception.getMessage());
    }
    })).onException(ServiceError.class).handled(true).process(new Processor() {
    @Override
    public void process(Exchange exchange) throws Exception {
      Exception exception = exchange.getProperty(Exchange.EXCEPTION_CAUGHT, Exception.class);
      exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 501);
      exchange.getIn().setBody(exception.getMessage());
    }
  }).end()
  .bean("bookRepository", "getAll").end();
```

查看本文完整代码 [Github](https://github.com/tiven-wang/EIP-Camel/tree/error-handling)



[JBI]:https://en.wikipedia.org/wiki/Java_Business_Integration
[SOAP]:https://en.wikipedia.org/wiki/SOAP
[SOAP-Fault-Message]:https://msdn.microsoft.com/en-us/library/ms189538(v=sql.105).aspx
[Dead-Letter-Channel]:http://www.enterpriseintegrationpatterns.com/patterns/messaging/DeadLetterChannel.html


[Exception]:https://docs.oracle.com/javase/7/docs/api/java/lang/Exception.html
[Exchange]:http://camel.apache.org/maven/current/camel-core/apidocs/org/apache/camel/Exchange.html
[Exchange.EXCEPTION_CAUGHT]:https://github.com/apache/camel/blob/master/camel-core/src/main/java/org/apache/camel/Exchange.java#L117
