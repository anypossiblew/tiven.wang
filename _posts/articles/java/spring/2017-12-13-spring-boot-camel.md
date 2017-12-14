---
layout: post
title: Spring Boot - Apache Camel
excerpt: "This article shows how to work with a simple Apache Camel application using Spring Boot."
modified: 2017-12-13T17:00:00-00:00
categories: articles
tags: [Camel, EIP, Swagger, Spring Boot]
image:
  vendor: twitter
  feature: /media/DQx77qwVQAA_At6.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "Camel examples: Spring Boot"
    url: "https://github.com/apache/camel/tree/master/examples/camel-example-spring-boot"
  - title: "How to Integrate Spring Boot and Apache Camel"
    url: "https://dzone.com/articles/how-to-integrate-spring-boot-and-apache-camel"

---

* TOC
{:toc}

## Camel

> Apache Camel is an open source Java framework that focuses on making integration easier and more accessible to developers. It does this by providing:
>
> * concrete implementations of all the widely used Enterprise Integration Patterns (EIPs)
> * connectivity to a great variety of transports and APIs
> * easy to use Domain Specific Languages (DSLs) to wire EIPs and transports together
>
> —— [Open Source Integration with Apache Camel and How Fuse IDE Can Help](https://dzone.com/articles/open-source-integration-apache)

> Apache Camel is messaging technology glue with routing. It joins together messaging start and end points allowing the transference of messages from different sources to different destinations. For example: JMS -> JSON, HTTP -> JMS or funneling FTP -> JMS, HTTP -> JMS, JSON -> JMS
>
> —— [What exactly is Apache Camel?](https://stackoverflow.com/questions/8845186/what-exactly-is-apache-camel)


### EIP

[Enterprise Integration Patterns][Enterprise_Integration_Patterns]

> In order to understand what Apache Camel is, you need to understand what Enterprise Integration Patterns are.
>
> Let's start with what we presumably already know: The Singleton pattern, the Factory pattern, etc; They are merely ways of organizing your solution to the problem, but they are not solutions themselves. These patterns were analyzed and extracted for the rest of us by the Gang of Four, when they published their book: Design Patterns. They saved some of us tremendous effort in thinking of how to best structure our code.
>
> Much like the Gang of Four, Gregor Hohpe and Bobby Woolf authored the book Enterprise Integration Patterns (EIP) in which they propose and document a set of new patterns and blueprints for how we could best design large component-based systems, where components can be running on the same process or in a different machine.
>
> They basically propose that we structure our system to be message oriented -- where components communicate with each others using messages as inputs and outputs and absolutely nothing else. They show us a complete set of patterns that we may choose from and implement in our different components that will together form the whole system.
>
> —— [What exactly is Apache Camel?](https://stackoverflow.com/questions/8845186/what-exactly-is-apache-camel)


## Spring Boot with Camel
使用 [Camel][Camel] 做企业集成模式 [EIP][eip] 开发时需要用到大量的不同技术需求的 package，为了方便管理 packages 之间版本依赖关系 Camel 为适应 [Spring Boot][spring-boot] 创建了一个 BOM 。在 *pom.xml* 中添加它，这样你就可以方便地添加 Camel 需要的 package 了

```xml
<dependencyManagement>
  <dependencies>
    <!-- Camel BOM -->
    <dependency>
      <groupId>org.apache.camel</groupId>
      <artifactId>camel-spring-boot-dependencies</artifactId>
      <version>${camel.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

### Dependencies

使用 Spring Boot 开发 Java 应用程序，需要添加

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter</artifactId>
</dependency>
```

使用 Spring Boot Web 提供 Servlet container 能力，把它默认的 Tomcat [Embedded Servlet Container][howto-embedded-servlet-containers] 改为 [Undertow][Undertow]

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
  <exclusions>
    <exclusion>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-tomcat</artifactId>
    </exclusion>
  </exclusions>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

> [Spring Boot Actuator][Spring Boot Actuator] enable production-ready features to a Spring Boot application – without having to actually implement these things yourself.
>
> They’re mainly used to expose different types of information about the running application – health, metrics, info, dump, env etc. And while these are no replacement for a production-grade monitoring solution – they’re a very good starting point.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-actuator</artifactId>
</dependency>
```

Camel Spring Boot starter package 提供了 Camel 与 Spring Boot 集成所需功能, 例如 Camel 核心包, Actuator, Cloud, HeathCheck, Security 等功能.

```xml
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-spring-boot-starter</artifactId>
</dependency>
```

另外就是再添加具体业务程序所需要的 Camel 依赖包了, `camel-stream-starter` 提供 Camel 输入输出流功能, `camel-test-spring` 提供基于 Spring 的测试能力

```xml
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-stream-starter</artifactId>
</dependency>
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-test-spring</artifactId>
  <scope>test</scope>
</dependency>
```

### Camel Routes

基于 Spring `@Component` 来创建 Camel Routes , 继承 `RouteBuilder` 类, 在 `configure` 方法里创建自己的流程

```java
@Component
public class SampleCamelRouter extends RouteBuilder {

    @Override
    public void configure() throws Exception {
        from("timer:hello?period={{timer.period}}").routeId("hello")
                .transform().method("myBean", "saySomething")
                .filter(simple("${body} contains 'foo'"))
                    .to("log:foo")
                .end()
                .to("stream:out");
    }

}
```

### Configurations
在 Spring Boot 配置文件中添加程序需要的参数, 和更改一些标准配置, 例如 Spring Boot Actuator 相关配置

```yaml
# the name of Camel
camel:
  springboot:
    name: SpringBootCamel

# what to say
greeting: Hello World

# how often to trigger the timer
timer:
  period: 2000

# Spring Boot Actuator: all access to actuator endpoints without security
management:
  security:
    enabled: false

# Spring Boot Actuator: turn on actuator health check
endpoints:
  health:
    enabled: true
```

到此步骤完整代码 [Github](https://github.com/tiven-wang/spring-boot-guides/tree/camel/spring-web)

## Camel Restful API

Camel 最终要解决的问题就是 __“从哪里来到哪里去”__ ， 而数据会从很多地方来，也会去很多地方。Restful API 就是数据的一种来源，本章节讲解如何在 Spring Boot 程序里配置 Camel 的 Restful API endpoints 。

### Camel Rest Dependencies
为了给 Camel 增加服务于 servlet 和 restful api 的能力，我们需要添加几个依赖

```xml
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-servlet-starter</artifactId>
</dependency>
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-jackson-starter</artifactId>
</dependency>
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-swagger-java-starter</artifactId>
</dependency>
```

### Camel Rest Configuration

同样在 `RouteBuilder` 里编写 Camel routes，这里需要注意使用方法 `bean` 可以调用 Spring 的 Component。

```java
@Override
public void configure() throws Exception {
  restConfiguration()
          .contextPath("/camel-rest-jpa").apiContextPath("/api-doc")
              .apiProperty("api.title", "Camel REST API")
              .apiProperty("api.version", "1.0")
              .apiProperty("cors", "true")
              .apiContextRouteId("doc-api")
          .bindingMode(RestBindingMode.json);

  rest("/books").description("Books REST service")
      .get("/").description("The list of all the books")
          .route().routeId("books-api")
          .bean("bookRepository", "getAll")
          .endRest()
      .get("/{id}").description("Details of an book by id")
          .route().routeId("book-api")
          .bean("bookRepository", "getByIsbn(${header.id})");
}
```

这需要在配置文件中增加参数，为 Camel servlet 配置路径

```yaml
camel:
  ...
  component:
      servlet:
        mapping:
          contextPath: /camel-rest-jpa/*
```

其中原理是 `camel-servlet-starter` package 里的代码逻辑把 CamelServlet 和 Spring Context 和 Spring Servlet 做了连接。Camel servlet 本身使用了 [Swagger][swagger] 做 Restful APIs 的管理。

### Test

直接在浏览器中访问以下 Restful API 链接

* *http://localhost:8080/camel-rest-jpa/api-doc*

* http://localhost:8080/camel-rest-jpa/books

* http://localhost:8080/camel-rest-jpa/books/123

完整代码 [Github](https://github.com/tiven-wang/spring-boot-guides/tree/camel/restful-api)

[Camel]:http://camel.apache.org/
[spring-boot]:https://projects.spring.io/spring-boot/
[Undertow]:http://undertow.io/
[howto-embedded-servlet-containers]:https://docs.spring.io/spring-boot/docs/current/reference/html/howto-embedded-servlet-containers.html
[Spring Boot Actuator]:https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready.html
[swagger]:https://swagger.io/

[eip]:http://camel.apache.org/enterprise-integration-patterns.html
[Enterprise_Integration_Patterns]:https://en.wikipedia.org/wiki/Enterprise_Integration_Patterns

[camel-example-spring-boot-rest-jpa]:https://github.com/apache/camel/tree/master/examples/camel-example-spring-boot-rest-jpa
