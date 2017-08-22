---
layout: post
title: Microservices - Restful API Client
excerpt: "RestTemplate provides higher level methods that correspond to each of the six main HTTP methods that make invoking many RESTful services a one-liner and enforce REST best practices."
modified: 2017-08-04T11:51:25-04:00
categories: articles
tags: [Restful, Microservices]
image:
  vendor: 500px
  feature: /photo/206721307/q%3D80_m%3D2000/v2?user_id=15281525&webp=true&sig=738400c89e1ee3f44eb0a9281e3cf2b016efd36db44678ea65c22f2afed35fe9
  credit: Detlef Knapp
  creditlink: https://500px.com/knipser62
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

基於上一篇[Microservices - Restful API HATEOAS](/articles/microservices-restful-api-hateoas/)介紹了支持 HATEOAS 特性的 Restful API，本篇介紹如何調用這樣的 Restful APIs，即 consumer client 端的代碼編寫。 [Template method pattern][Template_method_pattern]

> 下載本文完整項目代碼 [Github](https://github.com/tiven-wang/try-cf/tree/spring-rest-client)

## Dependency

我們使用 spring web 裡的 `RestTemplate` 去調用 Restful API，所以在 Spring Boot Maven 項目裡只需要添加這個依賴包

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## Create Client

創建一個新的類英雄管理者 `HeroManager` 來作為客戶端調用英雄的 Restful APIs

```java
@Component
public class HeroManager implements CommandLineRunner {

	public static String BASE_URL = "http://localhost";

	@Value("${server.port}")
	public String serverPort;

	private final RestTemplate template = new RestTemplate();

	@Override
	public void run(String... args) throws Exception {

		String heroUrl = BASE_URL + ":" + serverPort + "/hero";

		Hero batman = new Hero("Batman");

		BigInteger id = template.postForObject(heroUrl, batman, BigInteger.class);

		HeroResource hero = template.getForObject(heroUrl + "/{hero}", HeroResource.class, id);

		System.out.println("Got you " + hero.getName());
	}

}
```

## Test

本地創建一個 MongoDB 服務

`docker run --rm --name my-mongo -d -p 27017:27017 mongo`

啟動應用程序

`mvn spring-boot:run`

可以在後台看到打印出的信息

```
...
2017-08-04 17:31:32.961  INFO 16292 --- [nio-8090-exec-1] org.mongodb.driver.connection            : Opened connection [connectionId{localValue:2, serverValue:7}] to localhost:27017
Got you Batman
2017-08-04 17:31:33.169  INFO 16292 --- [           main] wang.tiven.trycf.HeroApplication         : Started HeroApplication in 9.013 seconds (JVM running for 14.152)
```

## Authentication

## Exception



[Template_method_pattern]:https://en.wikipedia.org/wiki/Template_method_pattern
