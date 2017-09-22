---
layout: post
title: Microservices - Load Balancing
excerpt: "在微服务架构中每个服务都可能有多个运行实例， 那么服务消费者在调用服务时怎么定位应该把请求发送给哪个实例呐？ 这就是负载均衡 Load Balancing 要做的事情。Load Balancing 可以在服务端也可以是在消费端。"
modified: 2017-08-30T11:51:25-04:00
categories: articles
tags: [Load Balancing, Scalability, Spring Cloud, Microservices]
image:
  vendor: unsplash
  feature: /photo-1485250377294-bb65ba51aa46?dpr=1.5&auto=format&fit=crop&w=1500&h=902&q=80&cs=tinysrgb&crop=
  credit: Ishan
  creditlink: https://unsplash.com/@seefromthesky
comments: true
share: true
references:
  - title: "Intro to Feign"
    url: "http://www.baeldung.com/intro-to-feign"
  - title: "Spring Cloud Netflix - Client Side Load Balancer: Ribbon"
    url: "http://cloud.spring.io/spring-cloud-netflix/single/spring-cloud-netflix.html#spring-cloud-ribbon"
  - title: "Spring Cloud - Spring RestTemplate as a Load Balancer Client"
    url: "http://projects.spring.io/spring-cloud/spring-cloud.html#_spring_resttemplate_as_a_load_balancer_client"
---

* TOC
{:toc}

## Load Balancing Concepts
在微服务架构中每个服务都可能有多个运行实例， 那么服务消费者在调用服务时怎么定位应该把请求发送给哪个实例呐？ 这就是负载均衡 [Load Balancing][Load_balancing] 要做的事情。Load Balancing 可以在服务端也可以是在消费端。

### Client-side
在客户端做负载均衡是指在客户端配置一个服务地址的列表，服务地址可以是IP也可以是域名URI，然后客户端使用某种算法为请求选择服务的某个地址，这样就可以达到负载均衡的效果。服务的IP或者URI列表可以通过Hardcode的方式配置在客户端，也可以使用[Service Discovery](/articles/microservices-service-discovery/)的方式获取。

例如 [Netflix][Netflix] 提供的 Client Side Load Balancer: [Ribbon][Ribbon].

> Ribbon is a Inter Process Communication (remote procedure calls) library with built in software load balancers. The primary usage model involves REST calls with various serialization scheme support.
{: .Quotes}

### Server-side
服务端的负载均衡是在服务端进行请求分发的方式，常见的方式有[Round-robin DNS][Round-robin_DNS]，更多的其他方式是跟具体产品或者平台有关，如[NGINX][NGINX]. 由 Load Balancing 发展成更高级一点的概念是 [application delivery controller ADC][Application_delivery_controller]，增加了一些高级属性。

例如，CloudFoundry 平台就支持把同一URI请求路由到不同的 App instances 上去，[Cloud Foundry Components Router](/articles/try-cf-2-cloud-foundry-components-router/)。

#### Session Affinity
一个重要的问题是，当同一用户的不同请求被分发到不同的服务实例上时服务实例如何共享用户的session数据。
* 第一种方式，如果用户session存储在单个服务实例本地local的话，把同一用户的请求转发到同一实例上去，需要Load Balancer支持，用户信息可以存储在浏览器cookie里。
* 第二种方式，把用户session数据存储在共享的单独的缓存服务上，每个服务实例都从缓存服务上读取和存储用户session数据。

## Client Side Load Balancer Ribbon

可以单独引入ribbon的依赖包
```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```

如果使用了 Eureka Service Discovery 的话，使用`@FeignClient`或者`@LoadBalanced @Bean RestTemplate`;

> Feign already uses Ribbon, so if you are using `@FeignClient` then the ribbon client configurations also applies.

如果没有使用 Eureka Service Discovery 的话，就要配置`@RibbonClient`;

```java
@RibbonClient(name = "some-service", configuration = SomeServiceConfig.class)
public class TestConfiguration {
}
```

显式配置 ribbon client：

```yaml
some-service:
  ribbon:
    eureka:
      enabled: false
    listOfServers: http://localhost:5000, http://localhost:5001
```

[Difference between `@RibbonClient` and `@LoadBalanced`](https://stackoverflow.com/questions/39587317/difference-between-ribbonclient-and-loadbalanced)



[Load_balancing]:https://en.wikipedia.org/wiki/Load_balancing_(computing)
[Application_delivery_controller]:https://en.wikipedia.org/wiki/Application_delivery_controller
[Netflix]:https://www.netflix.com/
[Ribbon]:https://github.com/Netflix/ribbon
[Round-robin_DNS]:https://en.wikipedia.org/wiki/Round-robin_DNS
[NGINX]:https://www.nginx.com
