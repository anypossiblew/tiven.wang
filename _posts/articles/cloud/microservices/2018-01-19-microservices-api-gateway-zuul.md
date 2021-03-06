---
layout: post
theme: UbuntuMono
title: "Microservices - API Gateway : Zuul"
excerpt: "Zuul 是来自 NetFlix 的 Microservice 产品家族的 API Gateway 服务或者说是 edge 服务。 Zuul 为开发者构建微服务架构提供了 Routing，Monitoring，Managing resiliency，Security等功能。简单来说，Zuul 可以被看作是一个反向代理，在服务实例间 Zuul 代理内部使用 Eureka server 作为 service discovery，使用Ribbon 作为 load balancing"
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
  - id: 1
    title: "Spring Cloud Netflix reference doc - 8. Router and Filter: Zuul"
    url: https://cloud.spring.io/spring-cloud-netflix/single/spring-cloud-netflix.html#_router_and_filter_zuul
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
首先来看一下 Spring Cloud 这个工具包，它为 Cloud 开发提供了很多实用便利的工具集，方便了在 Spring Frameworks 基础上实现 Cloud 功能开发。

> [Spring Cloud][spring-cloud] provides tools for developers to quickly build some of the common patterns in distributed systems (e.g. configuration management, service discovery, circuit breakers, intelligent routing, micro-proxy, control bus, one-time tokens, global locks, leadership election, distributed sessions, cluster state). Coordination of distributed systems leads to boiler plate patterns, and using Spring Cloud developers can quickly stand up services and applications that implement those patterns. They will work well in any distributed environment, including the developer's own laptop, bare metal data centres, and managed platforms such as Cloud Foundry.

[Spring Cloud][spring-cloud] features:

* Distributed/versioned configuration
* Service registration and discovery
* [Routing](/articles/microservices-api-gateway/)
* Service-to-service calls
* Load balancing
* Circuit Breakers
* Global locks
* Leadership election and cluster state
* Distributed messaging

### Spring Cloud Netflix

> [Spring Cloud Netflix][spring-cloud-netflix] provides Netflix OSS integrations for Spring Boot apps through `autoconfiguration` and binding to the Spring Environment and other Spring programming model idioms. With a few simple annotations you can quickly enable and configure the common patterns inside your application and build large distributed systems with battle-tested Netflix components. The patterns provided include Service Discovery (Eureka), Circuit Breaker (Hystrix), Intelligent [Routing](#) (Zuul) and Client Side Load Balancing (Ribbon)...

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
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Zuul API Gateway

Spring Cloud 为你创建了一个 Zuul 代理，以满足常见的在 UI 应用开发中调用多个后端服务的需要。Zuul proxy 为你的后端服务们提供了诸如管理 CORS 和 独立身份认证的能力。

使用 [`@EnableZuulProxy`][EnableZuulProxy] 打开 Zuul proxy 功能。

```java
@EnableZuulProxy
@SpringBootApplication
public class ZuulApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZuulApplication.class, args);
	}
}
```

[`@EnableZuulProxy`][EnableZuulProxy] 会为我们建立一个路由器，但我们还要告诉他应该怎么路由进来的请求，转发给哪个服务接口。

通过属性 `zuul.routes` 为 Zuul proxy 配置路由表，例如配置 `books` 服务的路由如下

```yaml
zuul:
  routes:
    books:
      url: http://localhost:8090
```

这样 Zuul proxy 会转发路径为 `/books/*` 的请求到此服务接口上，如地址为 *http://localhost:8080/books/available* 的请求会转发给地址 *http://localhost:8090/available* 。

Spring Cloud Netflix Zuul 是使用 Netflix’s Ribbon 执行 client-side load balancing，但 Ribbon 默认使用 Netflix Eureka 做 service discovery 。因为我们这里指定了 service url ，所以需要把 Eureka 自动服务发现功能关掉，如下

```yaml
ribbon:
  eureka:
    enabled: false
```

## Add a filter
Zuul 除了路由请求功能，还有过滤请求功能。Zuul 有四种标准的过滤器类型: `pre`, `route`,
`post`, `error` 顾名思义。

![Image: Zuul Request Lifecycle](https://camo.githubusercontent.com/4eb7754152028cdebd5c09d1c6f5acc7683f0094/687474703a2f2f6e6574666c69782e6769746875622e696f2f7a75756c2f696d616765732f7a75756c2d726571756573742d6c6966656379636c652e706e67)

继承 `com.netflix.zuul.ZuulFilter` 的 `@Bean` 都会被 Spring Cloud Netflix 识别，成为 Zuul 的 Filter 。例如我们创建一个 `pre` filter

*wang.tiven.microservices.apigateway.zuul.filters.pre.SimpleFilter.java*
```java
package wang.tiven.microservices.apigateway.zuul.filters.pre;

import javax.servlet.http.HttpServletRequest;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.ZuulFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SimpleFilter extends ZuulFilter {

    private static Logger log = LoggerFactory.getLogger(SimpleFilter.class);

    @Override
    public String filterType() {
      return "pre";
    }

    @Override
    public int filterOrder() {
      return 1;
    }

    @Override
    public boolean shouldFilter() {
      return true;
    }

    @Override
    public Object run() {
      RequestContext ctx = RequestContext.getCurrentContext();
      HttpServletRequest request = ctx.getRequest();

      log.info(String.format("%s request to %s", request.getMethod(), request.getRequestURL().toString()));

      return null;
    }
  }
```

重启并调用接口便会在后台看到 `pre` filter 的日志输出。

## Management Endpoints
如果你在项目中使用 `@EnableZuulProxy` 并且加入了 Spring Boot Actuator ，那么默认情况下就会有两个 endpoints 用来查看 Zuul 配置情况

* Routes `/routes` 查看路由表
* Filters `/filters` 查看过滤器们

本篇完整代码可下载自 [Github](https://github.com/tiven-wang/microservices/tree/api-gateway-zuul)

## Asynchronous and Non-Blocking

Zuul 在 2 版本增加非阻塞异步解决方案，也就是会拥抱响应式 Reactive 编程方式。

> Zuul [1] was originally a blocking and synchronous solution. The new effort called Zuul 2 is a non-blocking and asynchronous solution. The major architectural difference between Zuul 2 and Zuul 1 is that Zuul 2 is running on an asynchronous and non-blocking framework, using Netty. Instead of relying on multiple threads to provide increased throughput in Zuul, the Netty framework relies on an event loop and callbacks to do the same for Zuul 2.<br>
> -- [Netflix Zuul Gets a Makeover to a Asynchronous and Non-Blocking Architecture](https://www.infoq.com/news/2016/10/netflix-zuul-asynch-nonblocking)

## Conclusion

本文介绍了使用 Zuul 为 Microservices 创建反向代理服务，并且自定义了过滤器。虽然本本篇没有讲到但 Zuul 还具有服务发现能力，负载平衡能力。同时我们也看到在 Zuul 书写过滤器路由器是多么笨拙，虽然我们可以使用过滤器做任何事情，但它不适合编写调和服务接口的逻辑。所以接下来我们有兴趣介绍一下另外一个出自 Spring 的 API Gateway 产品 Spring Cloud Gateway 。


[zuul]:https://github.com/Netflix/zuul
[NetFlix]:https://www.netflix.com/
[spring-cloud]:http://projects.spring.io/spring-cloud/
[spring-cloud-netflix]:https://cloud.spring.io/spring-cloud-netflix/
[spring-boot-actuator]:https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready

[EnableZuulProxy]:https://github.com/spring-cloud/spring-cloud-netflix/blob/master/spring-cloud-netflix-zuul/src/main/java/org/springframework/cloud/netflix/zuul/EnableZuulProxy.java
