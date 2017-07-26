---
layout: post
title: Microservices - Restful API Spring Rest
excerpt: "Restful API Spring REST"
modified: 2017-07-25T11:51:25-04:00
categories: articles
tags: [Spring, Microservices]
image:
  feature: https://drscdn.500px.org/photo/55365754/q%3D80_m%3D2000/v2?webp=true&sig=a090e2986b9d784a08695aeea1ca32ddd3f4c81c1d85cf01ae9a7a28dcc24ea5
  credit: 500px
comments: true
share: true
references:
  - title: "Spring Data Commons - Reference Documentation"
    url: "https://docs.spring.io/spring-data/data-commons/docs/current/reference/html/#core.repository-populators"
  - title: "Spring Data Commons - Reference Documentation"
    url: "https://www.petrikainulainen.net/programming/spring-framework/spring-data-jpa-tutorial-part-six-sorting/"

---

<style>
@import url('https://fonts.googleapis.com/css?family=Dosis:400,500');
.mdl-card__supporting-text.blog__post-body {
  font-family: 'Dosis', sans-serif;
}
</style>

> [Oryx](https://en.wikipedia.org/wiki/Oryx) on top of a dune in the [NamibRand Nature Reserve](https://earth.google.com/web/@-25,16,988.35747719a,946.79718433d,35y,0h,45t,0r/data=CgQaAhgC), [Namibia](https://en.wikipedia.org/wiki/Namibia).

* TOC
{:toc}

本文在 [Spring Boot][Spring Boot] 構建項目基礎上進行的，如果讀者想要了解 [Spring Boot][Spring Boot] 項目如何創建請參考[Try Cloud Foundry 7 - Spring Boot](/articles/try-cf-7-spring-boot/)。

## Setup

### Spring Boot

Spring Boot的啟動入口為， 其中 `@SpringBootApplication` 為一方便性的註解，它包含了

* `@Configuration` 標註此class在應用上下文 application context 中為一定義bean的class。
* `@EnableAutoConfiguration` tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings.
* 如果 Spring Boot 發現 **spring-webmvc** on the classpath， 則自動添加 `@EnableWebMvc`， 你也可以手動添加 `@EnableWebMvc`
* `@ComponentScan` 則說明自動查找其他components, configurations, and services

```java
@SpringBootApplication
public class HeroApplication {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(HeroApplication.class, args);
    }

}
```

### Spring Web

如果你的Spring Boot項目裡還沒有添加Spring Web依賴，可以添加如下組件：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## Build Restful API

```java
@RestController
@RequestMapping("/hero")
public class HeroController {

    @RequestMapping("")
    List<String> getAll() {
        return new ArrayList<String>();
    }

    @RequestMapping("/{id}")
    String get(@PathVariable String id) {
        return "I am hero " + id;
    }
}
```

## Spring Data

[Spring Data REST][spring-data-rest] is part of the umbrella [Spring Data][spring-data] project and makes it easy to build hypermedia-driven REST web services on top of Spring Data repositories.





[Spring Boot]:http://projects.spring.io/spring-boot/
[spring-data]:http://projects.spring.io/spring-data/
[spring-data-rest]:http://projects.spring.io/spring-data-rest/
