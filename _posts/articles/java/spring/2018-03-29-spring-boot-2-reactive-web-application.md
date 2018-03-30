---
layout: post
theme: Josefin-Sans
title: Spring Boot 2 - Reactive Web Application
excerpt: ""
modified: 2018-03-29T17:00:00-00:00
categories: articles
tags: [Reactive, Spring Boot, Java]
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
  - id: 5
    title: "WebSockets vs. Server-Sent events/EventSource"
    url: "https://stackoverflow.com/questions/5195452/websockets-vs-server-sent-events-eventsource"

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
* 一种新的基于 [Java 8 lambdas][java/Lambda-QuickStart] 的函数式(Functional)编程模式来负责 routing 和 handling requests

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

上面方法都是返回 Publisher 类型，对于客户端来说并没有什么明显区别，因为他们默认提供 `application/json` 格式的结果，除了 `streamAllTweets()` 方法提供的是 `text/event-stream` 类型即 [Server-sent events (SSE)][Server-sent events] 的 Http Response，客户端需要一定的特殊处理。方法里面的逻辑我们会在 Spring WebFlux 文章专门介绍。

### Server-sent events (SSE)

[Server-sent events (SSE)][Server-sent events] 意图在于寻求一种在现有 Http 连接里做到服务器发送事件(events)即异步的能力。传统的 Http 请求都可以看作是同步的，也就是说只有当所有的数据都传输完成后客户端才能得到整个结果集。而 SSE 通过对结果集进行分批并加以事件标识来做到异步的能力。例如我们的 `stream/tweets` 接口得到的结果如下，它通过单个单个 Tweet 加以 `data` 标识来发送结果集，这样客户端程序就可以做到在得到部分结果的情况下可解析。

```
data:{"id":"5abcb137a192d499b007b7cd","text":"Good","createdAt":"2018-03-29T09:26:15.723+0000"}

data:{"id":"5abcb2c7a192d4924092f9da","text":"Hello","createdAt":"2018-03-29T09:32:55.671+0000"}

data:{"id":"5abdcea5998bbfb940cc311a","text":"World","createdAt":"2018-03-30T05:44:05.476+0000"}
```

#### WebSockets vs. Server-Sent events/EventSource

[[5.](#reference-5)]

Both WebSockets and Server-Sent Events are capable of pushing data to browsers. What is the difference between them? When would you choose one over the other?

Websockets and SSE (Server Sent Events) are both capable of pushing data to browsers, however they are not competing technologies.

Websockets connections can both send data to the browser and receive data from the browser. A good example of an application that could use websockets is a chat application.

SSE connections can only push data to the browser. Online stock quotes, or twitters updating timeline or feed are good examples of an application that could benefit from SSE.

In practice since everything that can be done with SSE can also be done with Websockets, Websockets is getting a lot more attention and love, and many more browsers support Websockets than SSE.

However, it can be overkill for some types of application, and the backend could be easier to implement with a protocol such as SSE.

Furthermore SSE can be polyfilled into older browsers that do not support it natively using just JavaScript. Some implementations of SSE polyfills can be found on the Modernizr github page.

Gotchas:

SSE suffers from a limitation to the maximum number of open connections, which can be specially painful when opening various tabs as the limit is per browser and set to a very low number (6). The issue has been marked as "Won't fix" in Chrome and Firefox
Only WS can transmit both binary data and UTF-8, SSE is limited to UTF-8.

HTML5Rocks has some good information on SSE. From that page:

> **Server-Sent Events vs. WebSockets**<br>
> Why would you choose Server-Sent Events over WebSockets? Good question.
>
> One reason SSEs have been kept in the shadow is because later APIs like WebSockets provide a richer protocol to perform bi-directional, full-duplex communication. Having a two-way channel is more attractive for things like games, messaging apps, and for cases where you need near real-time updates in both directions. However, in some scenarios data doesn't need to be sent from the client. You simply need updates from some server action. A few examples would be friends' status updates, stock tickers, news feeds, or other automated data push mechanisms (e.g. updating a client-side Web SQL Database or IndexedDB object store). If you'll need to send data to a server, XMLHttpRequest is always a friend.
>
> SSEs are sent over traditional HTTP. That means they do not require a special protocol or server implementation to get working. WebSockets on the other hand, require full-duplex connections and new Web Socket servers to handle the protocol. In addition, Server-Sent Events have a variety of features that WebSockets lack by design such as automatic reconnection, event IDs, and the ability to send arbitrary events.

#### TLDR summary
**Advantages of SSE over Websockets:**

* Transported over simple HTTP instead of a custom protocol
* Can be poly-filled with javascript to "backport" SSE to browsers that do not support it yet.
* Built in support for re-connection and event-id
* Simpler protocol

**Advantages of Websockets over SSE:**

* Real time, two directional communication.
* Native support in more browsers

**Ideal use cases of SSE:**

* Stock ticker streaming
* twitter feed updating
* Notifications to browser

**SSE gotchas:**

* No binary support
* Maximum open connections limit

## Integration Test with WebTestClient
Spring 5 提供了一个异步的响应式的 Http Client [`WebClient`][WebClient] 以帮助我们测试异步的 streaming 的 APIs，他相当于响应式版本的 [`RestTemplate`][RestTemplate] 。

在加上 [`WebTestClient`][WebTestClient] 可以帮助我们写集成测试

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class WebApplicationTests {

	@Autowired
	private WebTestClient webTestClient;

	@Autowired
	TweetRepository tweetRepository;

	@Test
	public void testCreateTweet() {
		Tweet tweet = new Tweet("This is a Test Tweet");

		webTestClient.post().uri("/tweets")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .body(Mono.just(tweet), Tweet.class)
				.exchange()
				.expectStatus().isOk()
				.expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
				.expectBody()
                .jsonPath("$.id").isNotEmpty()
                .jsonPath("$.text").isEqualTo("This is a Test Tweet");
	}

}
```
如果配置了 [`SpringBootTest`][SpringBootTest] 的 `webEnvironment` 参数，它就会为测试类提供 `TestRestTemplate` 和/或 `WebTestClient` bean 作为调用服务器的工具使用。

完整代码请查看 [Github](https://github.com/tiven-wang/spring-boot-guides/tree/2-reactive-web)




[spring-boot-actuator]:https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready
[mongodb]:https://www.mongodb.com/
[project-reactor]:https://projectreactor.io/
[project-reactor-reference]:https://projectreactor.io/docs/core/release/reference/
[Server-sent events]:https://en.wikipedia.org/wiki/Server-sent_events
[java/Lambda-QuickStart]:http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/Lambda-QuickStart/index.html
[whatwg/server-sent-events]:https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events


[@WebFluxTest]:https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/reactive/WebFluxTest.html
[ReactiveMongoRepository]:https://docs.spring.io/spring-data/mongodb/docs/2.0.0.RC2/api/org/springframework/data/mongodb/repository/ReactiveMongoRepository.html
[WebClient]:https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/reactive/function/client/WebClient.html
[WebTestClient]:https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/test/web/reactive/server/WebTestClient.html
[RestTemplate]:https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html
[SpringBootTest]:https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html


[publisher-Flux]:https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html
