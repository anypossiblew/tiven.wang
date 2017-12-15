---
layout: post
title: Apache Camel - Testing
excerpt: "Testing is a crucial activity in any piece of software development or integration. Typically Camel Riders use various different technologies wired together in a variety of patterns with different expression languages together with different forms of Bean Integration and Dependency Injection so its very easy for things to go wrong! (smile) . Testing is the crucial weapon to ensure that things work as you would expect."
modified: 2017-12-15T17:00:00-00:00
categories: articles
tags: [Camel, EIP, Testing, Spring Boot]
image:
  vendor: twitter
  feature: /media/DRAkRGuUEAUw-fG.jpg:large
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

> Testing is a crucial activity in any piece of software development or integration. Typically Camel Riders use various different technologies wired together in a variety of patterns with different expression languages together with different forms of Bean Integration and Dependency Injection so its very easy for things to go wrong! (smile) . Testing is the crucial weapon to ensure that things work as you would expect.
>
> Camel is a Java library so you can easily wire up tests in whatever unit testing framework you use (JUnit 3.x (deprecated), 4.x, or TestNG). However the Camel project has tried to make the testing of Camel as easy and powerful as possible so we have introduced the following features.
>
> We can use Spring for IoC and the Camel Mock and Test endpoints to create sophisticated integration/unit tests that are easy to run and debug inside your IDE.  There are three supported approaches for testing with Spring in Camel.

本文所演示项目代码是基于另一文章[Spring Boot - Apache Camel](/articles/spring-boot-camel/)介绍了 Spring Boot 程序里运行 Apache Camel 的基本架构，其代码下载 [Github](https://github.com/tiven-wang/spring-boot-guides/tree/camel/restful-api)

## Testing Dependencies

`camel-test-spring` 提供了 Camel 和 Spring 结合使用的测试方法。`spring-boot-starter-test` 提供了 Spring 基本测试框架。

```xml
<!-- Testing -->
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-test-spring</artifactId>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

## Unit Test
Using the `org.apache.camel.test.spring.CamelSpringBootRunner` runner with the `@RunWith` annotation or extending `org.apache.camel.testng.AbstractCamelTestNGSpringContextTests` provides the full feature set of Spring Test with support for the feature set provided in the `CamelTestSupport` classes.  

```java
import org.apache.camel.test.spring.CamelSpringBootRunner;
import org.springframework.boot.test.context.SpringBootTest;

@RunWith(CamelSpringBootRunner.class)
@SpringBootTest
public class StarterApplicationTests {
  ...
}
```

因为之前的代码是 Camel 创建 Restful API 的 Route，那么要测试的话就需要调用 Rest endpoint。这里还可以通过 Camel 的 `direct:[endpoint]` 来测试。修改一下代码，把原来的 Rest route 断开，新增一个 direct 端点：

```java
rest("/books").description("Books REST service")
  .get("/").description("The list of all the books")
      .route().routeId("books-api")
      .inOut("direct:books")              
      .endRest()
  .get("/{id}").description("Details of an book by id")
      .route().routeId("book-api")
      .inOut("direct:book");

from("direct:books").bean("bookRepository", "getAll");
from("direct:book").bean("bookRepository", "getByIsbn(${header.id})");
```

这个就可以对 `direct:books` 和 `direct:book` 进行独立测试，下面是对 book route 的测试代码

```java
@Test
public void testBook() {

	Exchange exchange = new DefaultExchange(camelContext);
	Message in = new DefaultMessage(camelContext);
	in.setHeader("id", 123);
	exchange.setIn(in);
	exchange = camelContext.createProducerTemplate().send("direct:book", exchange);
	Message message = exchange.getIn();
	assertEquals("123", ((Book) message.getBody()).getIsbn());
}
```

本篇完整代码 [Github](https://github.com/tiven-wang/EIP-Camel/tree/testing/direct)
