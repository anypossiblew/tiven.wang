---
layout: post
title: Microservices - Circuit Breaker
excerpt: ""
modified: 2017-09-20T11:51:25-04:00
categories: articles
tags: [Circuit Breaker, Scalability, Microservices]
image:
  vendor: unsplash
  feature: /photo-1502899845910-573a1d1c390d?dpr=1.5&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
  credit: Davies Designs
  creditlink: https://unsplash.com/@davies_designs
comments: true
share: true
references:
  - title: "Intro to Feign"
    url: "https://spring.io/guides/gs/circuit-breaker/"
---

* TOC
{:toc}

## Concept
微服务是一种分布式的架构, 也就是说它所有的组件(服务)都是部署在分开的应用程序里, 并通过一些远程访问协议相互访问.
这样就存在着一个问题, 如何管理服务的 [Availability][Availability] 和 [Responsiveness][Responsiveness] .
服务的 Availability 是服务消费者能连上服务并能发送请求的能力. 服务的 Responsiveness 是服务从请求连上来后需要多长时间回复消费者.
如果服务消费者连不上服务, 那么意味着它会马上得到通知, 然后它可以返回给客户端错误信息或者重试几遍后抛出异常. 假如连上了服务并发送了请求, 但服务没有返回结果怎么办? 通常服务消费者会选择一定的超时时间, 当等待超过超时时间后放弃等待并抛出异常. 这种通常的做法在微服务架构里会造成一定的风险.

### Timeout
设置超时时间怎么了, 有什么风险呐? 我们来看一下, 服务 A 请求服务 B 平均消耗时间为2000ms, 负载情况下最大消耗时间为5000ms, 那么为了保证不遗漏掉服务 B 的正常返回结果我们通常设置的timeout时间为最大消耗时间的两倍, 应该是 5000ms x 2 = 10000ms .
那么问题来了, 如果服务 B 由于各种原因阻塞住了没有了反应, 那么对于服务 A 的每个请求都会等待到超时时间并超时, 这样以来服务 A 也会被不断的10000ms的请求消耗资源并最终阻塞住.

```
 _ _ _ _ _ _ _ _ _ _ _        Place Trade       _ _ _ _ _ _ _ _ _ _ _
|                     |----------------------->|                     |
| Service Component A |    2000 ms (average)   | Service Component B |
|_ _ _ _ _ _ _ _ _ _ _|<-----------------------|_ _ _ _ _ _ _ _ _ _ _|
                       5000 ms (max under load)
```

问题很明显, 明知服务 B 很可能在未来一段时间内都没有反应, 还要不断发送请求给它. 肯定有更好的办法处理这种情况.

### Circuit Breaker
访问远程服务时, 比依赖超时时间更好一些的方式是一种叫断路器([Circuit Breaker][Circuit_breaker])的模式. 服务 A 通过断路器连接服务 B, 当断路器闭合时, 服务 A 可以连上服务 B; 当断路器打开时, 服务 A 则连不上服务 B.

```
 _ _ _ _ _ _ _ _ _ _ _         _ _ _ _ _ _ _ _          _ _ _ _ _ _ _ _ _ _ _ _
|                     |------>|Circuit Breaker|------->|                       |
| Service Component A |       |     Closed    |        | Service Component B   |
|_ _ _ _ _ _ _ _ _ _ _|<------|_ _ _ _ _ _ _ _|<-------|_ _ _ _ _ _ _ _ _ _ _ _|

 _ _ _ _ _ _ _ _ _ _ _         _ _ _ _ _ _ _ _          _ _ _ _ _ _ _ _ _ _ _ _
|                     |------>|Circuit Breaker|        |                       |
| Service Component A!|       |     Open      |        | Service Component B X |
|_ _ _ _ _ _ _ _ _ _ _|<------|_ _ _ _ _ _ _ _|        |_ _ _ _ _ _ _ _ _ _ _ _|
```

举个更形象的例子, Circuit Breaker 就像一位交通警察, 在前方道路畅通的情况下, 他会放行; 当前方道路由于各种原因拥堵时, 他会告诉你前方道路不通请回; 如果他是个更智能的交警的话, 还会告诉你前方道路部分拥堵, 只允许部分车辆通过, 比如实行单双号.

那么问题来了, 到哪里才能找到这么好交警呐?

### Hystrix from Netflix

[Netflix][Netflix] 公司创建的叫 [Hystrix][Hystrix] 的库就实现了 Circuit Breaker 模式.

> Hystrix is a latency and fault tolerance library designed to isolate points of access to remote systems, services and 3rd party libraries, stop cascading failure and enable resilience in complex distributed systems where failure is inevitable.
{: .Quotes}

同时, [Spring Cloud Netflix][spring-cloud-netflix]项目提供了 Spring Boot 应用程序与 Netflix OSS 良好的集成, 丰富的自动配置和注解, 帮助你使用 Netflix 的组件快速地构建大型分布式的应用服务.

## Build
我们在前面文章 [Service Discovery](/articles/microservices-service-discovery/) 的基础上来实现断路器模式.

### Dependency
在项目中引入依赖包

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-hystrix</artifactId>
</dependency>
```

### Hystrix Circuit Breaker

`@HystrixCommand`会被识别到，并在`@Service`的Proxy类中为此方法增加Circuit Breaker的功能

`fallbackMethod = "reliable"`Circuit Breaker打开时即调用失败时执行的方法

```java
@Service
public class PoliceService {

  private final RestTemplate restTemplate;

  public PoliceService(RestTemplate rest) {
    this.restTemplate = rest;
  }

  @HystrixCommand(fallbackMethod = "reliable")
  public String notify(String villainId) {

    this.restTemplate.exchange(
            "http://police-service/Gotham-City/villains",
            HttpMethod.POST,
            new HttpEntity<Villain>(new Villain(villainId)),
            new ParameterizedTypeReference<Villain>() {
            });
    return "Successful! " + villainId;
  }

  public String reliable(String villainId) {
    return "Ops! " + villainId;
  }
}
```

`@EnableCircuitBreaker`告诉Spring这个是启用`CircuitBreaker`的应用程序

```java
@EnableCircuitBreaker
@SpringBootApplication
@EnableEurekaClient
public class Application {
  ...
}
```

正常调用方法
`String message = policeService.notify(villainId)`

```java
String message = policeService.notify(villainId);
System.out.println(message);
```

下载本文完整代码 [Github](https://github.com/tiven-wang/try-cf/tree/circuit-breaker)

### Hystrix Dashboard

// TBD

[Availability]:https://en.wikipedia.org/wiki/Availability
[Responsiveness]:https://en.wikipedia.org/wiki/Responsiveness
[Circuit_breaker]:https://en.wikipedia.org/wiki/Circuit_breaker
[Netflix]:https://www.netflix.com/
[Hystrix]:https://github.com/Netflix/Hystrix
[spring-cloud-netflix]:https://cloud.spring.io/spring-cloud-netflix/
