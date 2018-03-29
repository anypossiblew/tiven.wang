---
layout: post
theme: Josefin-Sans
title: Spring Boot 2 - Reactive Web Application
excerpt: ""
modified: 2018-03-29T17:00:00-00:00
categories: articles
tags: [IDE, Spring Boot, Java]
image:
  vendor: twitter
  feature: /media/DYQqCesW4AQs9im.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/973949644089806849
comments: true
share: true
references:
  - id: 1
    title: "Building Reactive Rest APIs with Spring WebFlux and Reactive MongoDB"
    url: "https://www.callicoder.com/reactive-rest-apis-spring-webflux-reactive-mongo/"
  - id: 2
    title: "Spring Boot Reactive Tutorial"
    url: "https://medium.com/@mohitsinha.it/spring-boot-reactive-tutorial-ffab309b2dcd"
  - id: 3
    title: "What’s new in Spring Boot 2?"
    url: "http://www.baeldung.com/new-spring-boot-2"
  - id: 4
    title: "Spring Boot 2.0 New Features: Infrastructure Changes"
    url: "https://dzone.com/articles/spring-boot-20-new-features-infrastructure-changes"
---

* TOC
{:toc}

Spring Boot 2 带来了一群新的对不同的响应式模块支持的 starters ，例如 WebFlux 和对 MongoDB, Cassandra or Redis 的响应式配套装备。还有一些为 WebFlux 配备的测试工具如 [`@WebFluxTest`][@WebFluxTest]，它和 `@WebMvcTest` 的行为差不多。

另外一些功能也增加了对新的 reactive module 的支持，如 [Spring Boot Actuator][spring-boot-actuator].

我们就来看一下如何使用 Spring Boot 2 新的 Reactive modules 创建响应式 Web Application。
本篇练习的场景是模拟一个简单的 twitter application，它只有一个 domain model `Tweet`，两个属性字段 `text` 和 `createdAt`。使用 MongoDB 作为数据存储服务，并使用其 reactive mongodb driver 创建响应式的数据接口，然后创建 asynchronous Restful API 与其配套起来。这就我们就学到了

**How to stream data from the database to the client.**

接上一篇 [Spring Boot 2 - Setup](/articles/spring-boot-2-setup/) 创建好的项目，本篇完整代码可下载自 [Github]() .


## Creating the Domain Model
创建新的 package `model`，然后新建 domain model `Tweet`。
```java
package wang.tiven.reactive.web.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@Document(collection = "tweets")
public class Tweet {
    @Id
    private String id;

    @NotBlank
    @Size(max = 140)
    private String text;

    @NotNull
    private Date createdAt = new Date();

    public Tweet() {

    }

    public Tweet(String text) {
        this.id = id;
        this.text = text;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
```
`Tweet` model 非常简单，两个字段属性 `text` 和 `createdAt`， `text` 加了注解 `@NotBlank` 和 `@Size` 来保证它不为空和最大长度限制为 140 个字符。`@Document` 注解表示 [MongoDB][mongodb] 这种文档数据库即非关系型数据库的模型，类似于关系型数据库里表的概念。

## Creating the Repository
接下来创建响应式的数据访问层，用来访问 [MongoDB][mongodb] 数据库。创建新的 package `repository`，然后在里面创建新的类 `TweetRepository.java`
```java
package wang.tiven.reactive.web.repository;

import wang.tiven.reactive.web.model.Tweet;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TweetRepository extends ReactiveMongoRepository<Tweet, String> {

}
```
此接口 `TweetRepository` 继承了 [`ReactiveMongoRepository`][ReactiveMongoRepository] 接口，它暴露了对 MongoDB 数据库 Document 最基本的 CRUD 操作。Spring Boot 会在运行时自动生成此接口的实现类并插入 `SimpleReactiveMongoRepository`。`SimpleReactiveMongoRepository` 使用 reactor 实现了异步方法，例如下面几个

```java
reactor.core.publisher.Flux<T> findAll();

reactor.core.publisher.Mono<T> findById(ID id);

<S extends T> reactor.core.publisher.Mono<S> save(S entity);

reactor.core.publisher.Mono<Void> delete(T entity);
```
这几个方法都是通过 `Flux` 或者 `Mono` 类型返回异步的 Publisher 。

## Creating the Controller Endpoints
最后重头戏，让我们来把异步的接口暴露给客户端。Spring WebFlux 支持两种编程方式暴露 APIs 给客户端

* 传统基于注解如 `@Controller`, `@RequestMapping` 或者其他常在 Spring MVC 用的注解的模式
* 一种新的基于 Java 8 lambdas 的函数式 Functional 编程模式来负责 routing 和 handling requests

本篇我们使用传统基于注解的模式来实现 Reactive Restful Service 的 Controller。
创建新的 package `controller` ，然后在里面新建文件 `TweetController.java`
```java
package wang.tiven.reactive.web.controller;

import wang.tiven.reactive.web.model.Tweet;
import wang.tiven.reactive.web.repository.TweetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.validation.Valid;

@RestController
public class TweetController {

    @Autowired
    private TweetRepository tweetRepository;

    @GetMapping("/tweets")
    public Flux<Tweet> getAllTweets() {
        return tweetRepository.findAll();
    }

    @PostMapping("/tweets")
    public Mono<Tweet> createTweets(@Valid @RequestBody Tweet tweet) {
        return tweetRepository.save(tweet);
    }

    @GetMapping("/tweets/{id}")
    public Mono<ResponseEntity<Tweet>> getTweetById(@PathVariable(value = "id") String tweetId) {
        return tweetRepository.findById(tweetId)
                .map(savedTweet -> ResponseEntity.ok(savedTweet))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/tweets/{id}")
    public Mono<ResponseEntity<Tweet>> updateTweet(@PathVariable(value = "id") String tweetId,
                                                   @Valid @RequestBody Tweet tweet) {
        return tweetRepository.findById(tweetId)
                .flatMap(existingTweet -> {
                    existingTweet.setText(tweet.getText());
                    return tweetRepository.save(existingTweet);
                })
                .map(updatedTweet -> new ResponseEntity<>(updatedTweet, HttpStatus.OK))
                .defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/tweets/{id}")
    public Mono<ResponseEntity<Void>> deleteTweet(@PathVariable(value = "id") String tweetId) {

        return tweetRepository.findById(tweetId)
                .flatMap(existingTweet ->
                        tweetRepository.delete(existingTweet)
                            .then(Mono.just(new ResponseEntity<Void>(HttpStatus.OK)))
                )
                .defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Tweets are Sent to the client as Server Sent Events
    @GetMapping(value = "/stream/tweets", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Tweet> streamAllTweets() {
        return tweetRepository.findAll();
    }
}
```

[Server-sent events (SSE)][Server-sent events]

[spring-boot-actuator]:https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready
[mongodb]:https://www.mongodb.com/
[project-reactor]:https://projectreactor.io/
[project-reactor-reference]:https://projectreactor.io/docs/core/release/reference/
[Server-sent events]:https://en.wikipedia.org/wiki/Server-sent_events

[@WebFluxTest]:https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/reactive/WebFluxTest.html
[ReactiveMongoRepository]:https://docs.spring.io/spring-data/mongodb/docs/2.0.0.RC2/api/org/springframework/data/mongodb/repository/ReactiveMongoRepository.html

[publisher-Flux]:https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html
