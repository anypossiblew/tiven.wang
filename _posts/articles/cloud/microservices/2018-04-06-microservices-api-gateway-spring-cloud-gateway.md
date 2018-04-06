---
layout: post
title: "Microservices - API Gateway : Spring Cloud Gateway"
excerpt: "."
modified: 2018-04-06T11:51:25-04:00
categories: articles
tags: [API Gateway, Spring Cloud, Scalability, Microservices]
image:
  vendor: twitter
  feature: /media/DZ-VsLUU8AAH-8K.jpg:large
  credit: National Geographic
  creditlink: https://twitter.com/NatGeo/status/981667831917006848
comments: true
share: true
references:
  - id: 1
    title: "Spring Cloud Gateway"
    url: http://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.0.0.M9/single/spring-cloud-gateway.html
  - id: 2
    title: "API Gateway - Spring Cloud Gateway"
    url: https://spencer.gibb.us/preso/pivotal-toronto-api-gateway-2017-02
  - id: 3
    title: "Comparing API Gateway Performances: NGINX vs. ZUUL vs. Spring Cloud Gateway vs. Linkerd"
    url: https://engineering.opsgenie.com/comparing-api-gateway-performances-nginx-vs-zuul-vs-spring-cloud-gateway-vs-linkerd-b2cc59c65369
---

* TOC
{:toc}

Spring Cloud Gateway 是一个新的基于 Spring Framework 5, Project Reactor and Spring Boot 2.0 的 API Gateway 产品。

## Implementation
我们先来看看怎么实现，然后再去讨论它有什么优点。

接上一篇 [Microservices - API Gateway : Zuul](/articles/microservices-api-gateway-zuul/) 我们创建好的 Book 应用程序（如果你对 Spring Boot 创建 Application 很熟悉可以不用关心原来的代码，因为它很简单），本篇使用 Spring Cloud Gateway 重新创建 API Gateway Application 。

### Dependency

你可以选择手动添加需要的配置，也可以用 http://start.spring.io/ 从零创建一个项目。因为 Spring Cloud Gateway 需要 Spring Boot 2 的支持，所以应当选择 Spring Boot 2 以上版本。我们使用版本如下
```xml
<parent>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-parent</artifactId>
	<version>2.0.1.RELEASE</version>
</parent>
```

在引入 Spring Cloud Gateway 依赖时尽量使用 pom 的方式
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-gateway</artifactId>
            <version>2.0.0.M9</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
</dependencies>
<repositories>
    <repository>
        <id>spring-milestones</id>
        <name>Spring Milestones</name>
        <url>https://repo.spring.io/libs-milestone</url>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </repository>
</repositories>
```
如果你已经有 Spring Boot Application 类，那么应该可以没有错误地运行起来。

### Routes
你可以通过配置文件自定义路由表，如下
```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: book_route
        uri: http://localhost:8090
        predicates:
        - Path=/available/**
```
Spring Cloud Gateway 是通过 [Predicate (Java 8 Function Predicate)][Predicate] 匹配请求的，有很多种 Predicate 可供使用。上面是使用的 Path Route Predicate Factory 也就是通过区分请求的路径进行匹配。凡是路径匹配 `/available/**` 的请求都会被转发给 *http://localhost:8090* 服务。

还可以通过 filters (`GatewayFilter`) 修改经过路由里的请求。例如上面的例子我们要为路径添加个前缀 `/book` ，那么可以书写如下
```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: book_route
        uri: http://localhost:8090
        predicates:
        - Path=/book/available/**
        filters:
        - RewritePath=/book/(?<segment>.*), /$\{segment}
```
它通过为路径匹配添加前缀以区分不同的服务，然后再在 Filter 里去掉前缀后转发给相应服务。

## Java DSL
如果想要更加灵活的编程，还可以使用其提供的 Java Routes API

```java
// static imports from GatewayFilters and RoutePredicates
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
	//@formatter:off
	return builder.routes()
			.route(r -> r.path("/inventory/**")
				.filters(f ->
						f.rewritePath("/inventory/(?<segment>.*)", "/${segment}"))
				.uri("http://localhost:8091")
			)
			.build();
	//@formatter:on
}
```

本篇完整代码可下载自 [Github](https://github.com/tiven-wang/microservices/tree/api-gateway-spring)

## Conclusion



[Predicate]:http://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html
