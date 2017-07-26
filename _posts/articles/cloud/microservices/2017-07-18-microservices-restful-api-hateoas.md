---
layout: post
title: Microservices - Restful API HATEOAS
excerpt: "Restful API HATEOAS"
modified: 2017-07-18T11:51:25-04:00
categories: articles
tags: [HATEOAS, Microservices]
image:
  feature: https://drscdn.500px.org/photo/221202183/q%3D80_m%3D2000/v2?user_id=15281525&webp=true&sig=d846d6dd286097443ef7ba53d6a163116274e569a12fc45ef9c060951a3da4fc
  credit: 500px
  creditlink: https://500px.com/photo/221202183
comments: true
share: true
references:
  - title: "Spring.io guides - Building a Hypermedia-Driven RESTful Web Service"
    url: "https://spring.io/guides/gs/rest-hateoas/"
  - title: "Spring Data extensions - Web support"
    url: "https://docs.spring.io/spring-data/data-commons/docs/current/reference/html/#core.extensions"
---

<style>
@import url('https://fonts.googleapis.com/css?family=Dosis:400,500');
.mdl-card__supporting-text.blog__post-body {
  font-family: 'Dosis', sans-serif;
}
</style>

> [Leopard](https://en.wikipedia.org/wiki/Leopard)

* TOC
{:toc}

Spring Data Commons 1.6 version 以上版本可以使用 `@EnableSpringDataWebSupport` annotation 啟用 web support：

```java
@Configuration
@EnableWebMvc
@EnableSpringDataWebSupport
class WebConfiguration { }
```

* `DomainClassConverter` 組件可以使用 request 的 parameters 或者 path variables 並通過 repository 得到相應實例。

```java
@Controller
@RequestMapping("/users")
public class UserController {

  @RequestMapping("/{id}")
  public User showUserForm(@PathVariable("id") User user) {
    return user;
  }
}
```
