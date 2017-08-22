---
layout: post
title: Microservices - Restful API Async
excerpt: ""
modified: 2017-08-07T11:51:25-04:00
categories: articles
tags: [Async, Restful, Microservices]
image:
  vendor: 500px
  feature: /photo/176835417/q%3D80_m%3D2000/v2?user_id=15281525&webp=true&sig=06a73673c12986c27045bbe9248e9f4573452631ae9f44bea96e870ec27a365b
  credit: Christian Miller
  creditlink: https://www.500px.com/scubadaddy
comments: true
share: true
references:
  - title: "stackoverflow.com - Asynchronous vs synchronous execution, what does it really mean?"
    url: "https://stackoverflow.com/questions/748175/asynchronous-vs-synchronous-execution-what-does-it-really-mean"
  - title: "When to use Spring @Async vs Callable controller (async controller, servlet 3)"
    url: "https://stackoverflow.com/questions/17167020/when-to-use-spring-async-vs-callable-controller-async-controller-servlet-3"
  - title: "Creating Asynchronous Methods"
    url: "https://spring.io/guides/gs/async-method/"
  - title: "www.baeldung.com - Guide To CompletableFuture"
    url: "http://www.baeldung.com/java-completablefuture"
  - title: "Spring MVC 3.2 Preview: Introducing Servlet 3, Async Support"
    url: "https://spring.io/blog/2012/05/07/spring-mvc-3-2-preview-introducing-servlet-3-async-support"

---

* TOC
{:toc}

> 下載本文完整項目代碼 [Github](https://github.com/tiven-wang/try-cf/tree/spring-async)

同步執行任務就是你需要等待任務執行完成才能接著執行後續步驟，而異步執行則是你不需要等待任務執行完成就能繼續執行後續步驟。在計算機環境中異步任務會在另外的線程 Thread 裡執行。

對於 Restful API 來說，每個 HTTP Request 都有一個 Request 和 一個 Response。 套用同步和異步的概念則是，同步指你發送 Request 後 API 需要等待任務執行完成後返回給你 Response，異步指 API 不需要等待任務執行完成而返回空或者臨時值的 Response 給你。

舉個例子：英雄管理者告訴 server 要求 Hero “Batman” 去抓捕 Villains “X”，但管理者並不需要等待抓捕完成（或許他會通過其他方式得到通知，或者他後續會去查詢抓捕結果）

如何在 Java Servlet 裡實現異步操作有很多方式：

* Servlet 3 `request.startAsync()`
* Spring `@Async`
* Send a event or message to event or message server

## Spring Async

### Async Class Method

新建 `HeroService` 它有一個抓捕壞蛋的方法 `catchVillains`:

```java
@Service
public class HeroService {

  @Autowired VillainsRepository villainsRepository;

  @Async
  public CompletableFuture<BigInteger> catchVillains(Hero hero, String name) throws InterruptedException {
    Thread.sleep(3000L);
    Villains villains = new Villains(name);
    villains.setCatchedBy(hero);
    return CompletableFuture.completedFuture(villainsRepository.save(villains).getId());
  }
}
```

`@Async` 註解說明 method 或者 type 是異步操作，Spring 需要為其生成運行單獨線程的 proxy class。

`@Async` 的方法返回值需要特定類型，我們使用 [CompletableFuture][CompletableFuture]

`Thread.sleep(3000L)` 模擬抓捕線程需要運行3秒

### Spring Configuration

在 Spring 配置類中添加註解 `@EnableAsync` 啟用 Spring 對 `@Async` 的支持。

```java
@Configuration
@EnableAsync
public class AsyncConfiguration {

  @Bean
  public Executor asyncExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(2);
    executor.setMaxPoolSize(2);
    executor.setQueueCapacity(500);
    executor.setThreadNamePrefix("Hero-");
    executor.initialize();
    return executor;
  }
}
```

默認 Spring 使用 `SimpleAsyncTaskExecutor` 執行異步任務，你也可以配置自己的 `Executor`，
這裡我們使用 `ThreadPoolTaskExecutor` 並設並行運行線程個數最大為2，隊列容量最大500。

### Controller

為 `HeroController` 新增一個抓捕的API，此方法返回類型為 `void`。
方法調用 `HeroService` 的 catchVillains 方法。

> 注意 這裡不要調用返回值 `CompletableFuture` 的 `get` 方法獲取任務結果，那樣的話此 API 就仍然需要等待異步任務執行完成才返回 Response。因為我們想要的效果是不需要等待抓捕結果。
{: .WARNING}

```java
@RequestMapping(path="/{id}/catch/{villains}", method=RequestMethod.POST)
void catchVillains(@PathVariable("id") Hero hero, @PathVariable("villains") String villains) throws InterruptedException {
  heroService.catchVillains(hero, villains);
}
```

### Test

利用以前得到的英雄的ID調用URL去告訴他去抓捕x壞蛋，可以看到調用並沒有耗時太多：

*http://127.0.0.1:8090/hero/27710009554537466484656569850/catch/x*

大體上3秒後查詢會得到結果；

*http://127.0.0.1:8090/villains*

## Message Broker

如果你的應用程序架構使用了 Message Broker 處理消息的話，則可以在 Controller 裡發送一個消息給消息服務器，然後即可返回 Response。
消息接收方會處理相應的後續邏輯。

關於 Message Broker 的基本架構可以參考 [Try Cloud Foundry](/series/try-cloudfoundry) 系列中的 [Try Cloud Foundry 9 - Message Broker](/articles/try-cf-9-message-broker/)

## Reactive Programming

**TODO**

[CompletableFuture]:http://www.baeldung.com/java-completablefuture
