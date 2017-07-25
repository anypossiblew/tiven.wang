---
layout: post
title: Microservices - Restful API HATEOAS
excerpt: "Restful API HATEOAS"
modified: 2017-07-18T11:51:25-04:00
categories: articles
tags: [HATEOAS, Microservices]
image:
  feature: http://yourshot.nationalgeographic.com/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDtpPUzKu2MvBBtJImfqzIi1sE7s7CIDaMLJVYkmaG-q9cHOmCh9OXedriWaO_QgZQxP5zMawBJfMyhOMaHXSIJq_wem-bQiXMLi-P18c_1fk7PtVkJFxnG71qT-s7lSuWFEFOL2BpdYtpnxIMhP5H_6eQK9QoTcicepOuiXCRjs/
  credit: national geographic
  creditlink: http://www.nationalgeographic.com/photography/photo-of-the-day/2017/01/fog-clouds-park/
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
