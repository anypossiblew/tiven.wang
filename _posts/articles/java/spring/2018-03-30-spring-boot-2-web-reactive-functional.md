---
layout: post
theme: Josefin-Sans
title: Spring Boot 2 - Web Reactive Functional
excerpt: "如何使用函数式编程（ Functional Programming ）方式编写 Spring 响应式（ Reactive ）的 Web Application"
modified: 2018-03-30T17:00:00-00:00
categories: articles
tags: [Functional, Reactive, Spring Boot, Java]
image:
  vendor: twitter
  feature: /media/DY06_ANWAAEdQyB.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeo/status/976501551299690496
comments: true
share: true
references:
  - id: 1
    title: "Spring WebFlux - Functional Endpoints"
    url: "https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#webflux-fn"
  - id: 2
    title: "Java 8 Stream Tutorial"
    url: http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-example
---

* TOC
{:toc}

上一篇我们讲了如何创建 Spring 响应式的 (Reactive) Web Application，本篇再进一步来讲一下如何使用函数式的编程（[Functional Programming][functional-programming]）方式书写响应式的 Web Application 。

[Spring WebFlux][spring-webflux] 自带了一个轻量级函数式编程模型，它使用函数来路由和处理请求。它只是用来作为基于注解的编程模型的替代项，除此之外都是使用一样的 Web 基础功能。可以使用函数进行替代的有两个地方 Handler 和 Router，前者是处理每个请求后者是负责分发请求给相应的处理函数。

本篇完整代码可下载自 [Github](https://github.com/tiven-wang/spring-boot-guides/tree/2-web-reactive-functional)

## HandlerFunction

HandlerFunction 负责处理进来的 Http 请求，它本质上是一个输入 `ServerRequest` 类型的参数返回一个 `Mono<ServerResponse>` 类型的参数的函数。它就相当于基于注解编程中的 `@RequestMapping` 。例如我们的 Tweet 应用的 Handler 可以书写如下

```java
public class TweetHandler {
  ...
  public Mono<ServerResponse> getAllTweets(ServerRequest request) {
    Flux<Tweet> tweet = repository.findAll();
    return ServerResponse.ok().contentType(APPLICATION_JSON).body(tweet, Tweet.class);
  }
}
```

可以把它看作是一个输入 `ServerRequest` 并且返回 `Mono<ServerResponse>` 的函数，会被用在后面的 Router 里。

## RouterFunction

`RouterFunction` 负责分发路由进来的请求给相应 `HandlerFunction` 来处理。 `RouterFunction` 是一个用 `@FunctionalInterface` 注解的函数类型，[FunctionalInterface][java-8-functional-interfaces] 是为了在面向对象的 Java 语言中实现函数功能的注解，可以把一个 Lambda 表达式分配给他，其目的是努力做到类方法可以作为函数进行传递的能力。除了 Lambda 表达式可以分配给 FunctionalInterface ，类实例方法、类静态方法都可以分配给它，这就为程序运行时的灵活性提升很多。例如下面的 RouterFunction 是通过方法 `RouterFunctions.route` 创建的，它第二个参数是接收一个类实例方法作为 FunctionalInterface 的。这要在原来你是要为这个方法定义接口 Interface 才能调用的。

```java
public class TweetRouter {
  ...
  public RouterFunction<ServerResponse> router() {
      return RouterFunctions.route(GET("/tweets").and(accept(APPLICATION_JSON)), this.tweetHandler::getAllTweets);
  }
}
```

## Configuration

然后需要把 RouterFunction 放到配置方法里，这样 Spring Boot 会负责具体的配置工作。

```java
@Bean
public RouterFunction<?> routerFunctionTweet(TweetRepository repository) {
  return new TweetRouter(repository).router();
}
```

## from OO to Functional

对于习惯了面向对象编程的人员来说，需要转变哪些思维方式来做到编写代码更函数式呐？最纯理论的函数式认为一切都是函数，一切值也都是函数演化来的。例如 `0` 就是 `init()`,  `3` 就是 `plus(plus(plus(init())))` 。

### Method to Function
在面向对象编程里 Method 可以做到函数 Function 的功能，例如静态方法可以当作函数来调用。对于一个功能比较独立的方法来说，不如把它定义为一个 Lambda 函数，这样相较于类的方法来说更加简洁清晰。例如我们有一堆模式重复，功能不同的方法，他们都是使用相同类型的输入输出参数，只不过处理逻辑不一样。

```java
public class TweetHandler {
  public Mono<ServerResponse> getAllTweets(ServerRequest request) {
    Flux<Tweet> tweet = repository.findAll();
    return ServerResponse.ok().contentType(APPLICATION_JSON).body(tweet, Tweet.class);
  }

  public Mono<ServerResponse> createTweets(ServerRequest request) {
  }

  public Mono<ServerResponse> deleteTweets(ServerRequest request) {
  }

  ...
}
```

转变为

```java
route(GET("/tweets"), request -> {
  Flux<Tweet> tweet = repository.findAll();
  return ServerResponse.ok().contentType(APPLICATION_JSON).body(tweet, Tweet.class);
})
...
```

### Import Static Method
类的静态方法和函数并没有本质上的区别，只不过静态方法不能脱离类单独存在，也就不能作为值进行传递。但是调用静态方法可以像调用函数一样方便，通过 `import static` 关键字把类里的静态方法引入进来后便可以像函数一样调用了。

```java
RouterFunctions.nest(RequestPredicates.path("/tweets"),
                     RouterFunctions.route(RequestPredicates.GET("/{id}"), request -> ...));
```

转变为

```java
import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import static org.springframework.web.reactive.function.server.RouterFunctions.*;

...
nest(path("/tweets"), route(GET("/{id}"), request -> ...));
```

这样既能做到代码简洁，又更函数式。

### Fluent interface

In software engineering, a [fluent interface][Fluent_interface] (as first coined by Eric Evans and Martin Fowler) is a method for constructing object oriented APIs, where the readability of the source code is close to that of ordinary written prose, essentially creating a domain-specific language within the interface.

```java
nest(path("/tweets"),
      route(GET("/{id}"), request -> { })
      .andRoute(PUT("/{id}"), request -> { })
      .andRoute(DELETE("/{id}"), request -> { })
      .andRoute(method(HttpMethod.GET).and(accept(APPLICATION_JSON)), request -> { })
      .andRoute(method(HttpMethod.POST).and(accept(APPLICATION_JSON)), request -> { })
)
.andRoute(GET("/stream/tweets"), request -> { });
```

A fluent interface is normally implemented by using [method chaining][Method_chaining] to implement [method cascading][Method_cascading] (in languages that do not natively support cascading), concretely by having each method return this (self). Stated more abstractly, a fluent interface relays the instruction context of a subsequent call in method chaining, where generally the context is

defined through the return value of a called method
self-referential, where the new context is equivalent to the last context
terminated through the return of a void context.
Note that a "fluent interface" means more than just method cascading via chaining; it entails designing an interface that reads like a DSL, using other techniques like "nested functions and object scoping".

Fluent interface 可以使你更好的利用函数进行数据处理，做到代码清晰，逻辑流畅。

### Java 8 Stream
Stream 是用函数式编程方式在集合类上进行复杂操作的工具，其集成了 Java 8 中的众多新特性之一的聚合操作，开发者可以更容易地使用Lambda表达式，并且更方便地实现对集合的查找、遍历、过滤以及常见计算等。显然 Java Stream 是在 Java 函数式编程中应当考虑使用的。

```java
List<String> myList =
    Arrays.asList("a1", "a2", "b1", "c2", "c1");

myList
    .stream()
    .filter(s -> s.startsWith("c"))
    .map(String::toUpperCase)
    .sorted()
    .forEach(System.out::println);

// C1
// C2
```

## Conclusion

本篇我们介绍了如何使用函数式编程方式书写 Spring Reactive Web Application，又介绍了对于熟悉了面向对象的程序员如何转变思维方式，把 Java 程序书写地更加函数式。




[functional-programming]:/articles/what's-functional-programming
[spring-webflux]:https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#spring-webflux

[java-8-functional-interfaces]:https://www.oreilly.com/learning/java-8-functional-interfaces
[Fluent_interface]:https://en.wikipedia.org/wiki/Fluent_interface
[Method_chaining]:https://en.wikipedia.org/wiki/Method_chaining
[Method_cascading]:https://en.wikipedia.org/wiki/Method_cascading
