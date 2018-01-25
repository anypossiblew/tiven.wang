---
layout: post
title: "Microservices - API Gateway : Zuul"
excerpt: "."
modified: 2018-01-19T11:51:25-04:00
categories: articles
tags: [API Gateway, Scalability, Microservices]
image:
  vendor: unsplash
  feature: /photo-1456086272160-b28b0645b729?dpr=1.5&auto=format&fit=crop&w=1500&h=844&q=80&cs=tinysrgb&crop=
  credit: russn_fckr
  creditlink: https://unsplash.com/@russn_fckr
comments: true
share: true
references:
  - title: "Embracing the Differences : Inside the Netflix API Redesign"
    url: "https://medium.com/netflix-techblog/embracing-the-differences-inside-the-netflix-api-redesign-15fd8b3dc49d"
  - title: "Routing and Filtering"
    url: "https://spring.io/guides/gs/routing-and-filtering/"
---

* TOC
{:toc}

[Zuul][zuul] 是来自 [NetFlix][NetFlix] 的 Microservice 产品家族的 API Gateway 服务或者说是 edge 服务。 Zuul 为开发者构建微服务架构提供了 Routing，Monitoring，Managing resiliency，Security等功能。简单来说，Zuul 可以被看作是一个反向代理，在服务实例间 Zuul 代理内部使用 Eureka server 作为 service discovery，使用Ribbon 作为 load balancing 。

> Zuul is the front door for all requests from devices and web sites to the backend of the Netflix streaming application. As an edge service application, Zuul is built to enable dynamic routing, monitoring, resiliency and security.<br>
  -- [https://github.com/Netflix/zuul/wiki](https://github.com/Netflix/zuul/wiki)

## Spring Cloud

> [Spring Cloud][spring-cloud] provides tools for developers to quickly build some of the common patterns in distributed systems (e.g. configuration management, service discovery, circuit breakers, intelligent routing, micro-proxy, control bus, one-time tokens, global locks, leadership election, distributed sessions, cluster state). Coordination of distributed systems leads to boiler plate patterns, and using Spring Cloud developers can quickly stand up services and applications that implement those patterns. They will work well in any distributed environment, including the developer's own laptop, bare metal data centres, and managed platforms such as Cloud Foundry.

[Spring Cloud][spring-cloud] features:

* Distributed/versioned configuration
* Service registration and discovery
* Routing
* Service-to-service calls
* Load balancing
* Circuit Breakers
* Global locks
* Leadership election and cluster state
* Distributed messaging

### Spring Cloud Netflix

> [Spring Cloud Netflix][spring-cloud-netflix] provides Netflix OSS integrations for Spring Boot apps through autoconfiguration and binding to the Spring Environment and other Spring programming model idioms. With a few simple annotations you can quickly enable and configure the common patterns inside your application and build large distributed systems with battle-tested Netflix components. The patterns provided include Service Discovery (Eureka), Circuit Breaker (Hystrix), Intelligent Routing (Zuul) and Client Side Load Balancing (Ribbon)...

[Spring Cloud Netflix][spring-cloud-netflix] features:

* Service Discovery: Eureka instances can be registered and clients can discover the instances using Spring-managed beans
* Service Discovery: an embedded Eureka server can be created with declarative Java configuration
* Circuit Breaker: Hystrix clients can be built with a simple annotation-driven method decorator
* Circuit Breaker: embedded Hystrix dashboard with declarative Java configuration
* Declarative REST Client: Feign creates a dynamic implementation of an interface decorated with JAX-RS or Spring MVC annotations
* Client Side Load Balancer: Ribbon
* External Configuration: a bridge from the Spring Environment to Archaius (enables native configuration of Netflix components using Spring Boot conventions)
* __Router and Filter__: automatic regsitration of [Zuul][zuul] filters, and a simple convention over configuration approach to reverse proxy creation

## Backend Service

在 Microservices 中首先我们要有一个后端服务，然后才能为其创建 API Gateway 服务。为了测试方便，我们创建一个最简单的 Web 应用程序，假如我们有一个书籍管理服务叫 book service 。

因为只需要最简单的 Restful API 所以只需要 `spring-boot-starter-web` 依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

和两个简单的 Restful API

```java
@RestController
@SpringBootApplication
public class BookApplication {

  @RequestMapping(value = "/available")
  public String available() {
    return "Microservices in Action";
  }

  @RequestMapping(value = "/checked-out")
  public String checkedOut() {
    return "Spring Microservices in Action";
  }

  public static void main(String[] args) {
    SpringApplication.run(BookApplication.class, args);
  }
}
```

book 服务的端口号设置为

```yaml
spring:
  application:
    name: book

server:
  port: 8090
```

## Setting up Zuul

### Dependencies

Spring Cloud 提供了 POM 方便依赖包的管理，其中就包含 `netflix-zuul` 依赖包。

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-dependencies</artifactId>
      <version>${spring-cloud.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

添加 `netflix-zuul` 依赖

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
```

[Spring Boot Actuator][spring-boot-actuator] 提供了生产可用性的功能，当你的应用程序部署到生产环境上时，它会帮助你监控和管理应用程序。为了更好地了解我们开发的程序，所以加入 Spring Boot Actuator 依赖

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
```

### Zuul API Gateway

Spring Cloud 为你创建了一个 Zuul 代理，以满足常见的在 UI 应用开发中调用多个后端服务的需要。Zuul proxy 为你的后端服务们提供了诸如管理 CORS 和 独立身份认证的能力。

使用 `@EnableZuulProxy` 打开 Zuul proxy 功能。

```java
@EnableZuulProxy
@SpringBootApplication
public class ZuulApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZuulApplication.class, args);
	}
}
```


https://cloud.spring.io/spring-cloud-netflix/single/spring-cloud-netflix.html#_router_and_filter_zuul

https://cloud.spring.io/spring-cloud-netflix/single/spring-cloud-netflix.html#netflix-zuul-reverse-proxy



[Building Microservices: Using an API Gateway](https://www.nginx.com/blog/building-microservices-using-an-api-gateway/)

[zuul]:https://github.com/Netflix/zuul
[NetFlix]:https://www.netflix.com/
[spring-cloud]:http://projects.spring.io/spring-cloud/
[spring-cloud-netflix]:https://cloud.spring.io/spring-cloud-netflix/
[spring-boot-actuator]:https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready
