---
layout: post
title: Microservices - Restful API Spring Restful
excerpt: "Representational state transfer (REST) or RESTful web services is a way of providing interoperability between computer systems on the Internet. REST-compliant Web services allow requesting systems to access and manipulate textual representations of Web resources using a uniform and predefined set of stateless operations. Other forms of Web service exist, which expose their own arbitrary sets of operations such as WSDL and SOAP."
modified: 2017-07-25T11:51:25-04:00
categories: articles
tags: [Restful, Spring, Microservices]
image:
  vendor: 500px
  feature: /photo/55365754/q%3D80_m%3D2000/v2?webp=true&sig=a090e2986b9d784a08695aeea1ca32ddd3f4c81c1d85cf01ae9a7a28dcc24ea5
  credit: 500px
comments: true
share: true
references:
  - title: "Spring Data Commons - Reference Documentation"
    url: "https://docs.spring.io/spring-data/data-commons/docs/current/reference/html/#core.repository-populators"
  - title: "Spring Data REST - Reference Documentation"
    url: "https://docs.spring.io/spring-data/rest/docs/current/reference/html/"
  - title: "Spring Data JPA Tutorial: Sorting"
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

> 下載本文完整項目代碼 [Github](https://github.com/tiven-wang/try-cf/tree/spring-rest)

本文在 [Spring Boot][Spring Boot] 構建項目基礎上進行的，如果讀者想要了解 [Spring Boot][Spring Boot] 項目如何創建請參考[Try Cloud Foundry 7 - Spring Boot](/articles/try-cf-7-spring-boot/)。

## Spring Web

### Setup Spring Web

如果你的Spring Boot項目裡還沒有添加Spring Web依賴，可以添加如下組件：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### Build Restful API

使用 `@RestController` `@RequestMapping` 可以编写我们的 Restful API。

```java
@RestController
@RequestMapping("/hero")
public class HeroController {

  @Autowired(required = false) HeroRepository heroRepository;

  @RequestMapping("")
  Iterable<Hero> getAll() {
      return heroRepository.findAll();
  }

  @RequestMapping(path="", method=RequestMethod.POST)
  Hero create(@RequestBody Hero hero) {
      return heroRepository.save(hero);
  }

  @RequestMapping("/{id}")
  Hero get(@PathVariable BigInteger id) {
      return heroRepository.findOne(id);
  }

  @RequestMapping(path="/{id}", method=RequestMethod.DELETE)
  void delete(@PathVariable BigInteger id) {
      heroRepository.delete(id);
  }
}
```

啟動應用程序可訪問鏈接 *http://127.0.0.1:8080/hero*

## Spring Data Commons

如果你的項目使用了 Spring Data framework 的話，參考文檔[Spring Data Commons - Reference Documentation - 3.8.2. Web support](https://docs.spring.io/spring-data/data-commons/docs/current/reference/html/#core.web)
配置對 Web 的支持。

如果是註解的方式可以如下配置：

```java
@Configuration
@EnableWebMvc
@EnableSpringDataWebSupport
class WebConfiguration { }
```

`@EnableSpringDataWebSupport` 註解會啟動對Restful API的特性的支持。

如果使用了 Spring Boot `@EnableAutoConfiguration` 自動發現配置功能（`@SpringBootApplication`包含了`@EnableAutoConfiguration`），則不需要`@EnableSpringDataWebSupport`，Spring Boot會自動查找到 `SpringDataWebConfiguration` 並進行正確的配置。

如果你仍然在使用xml配置方式：

```xml
<bean class="org.springframework.data.web.config.SpringDataWebConfiguration" />

<!-- If you're using Spring HATEOAS as well register this one *instead* of the former -->
<bean class="org.springframework.data.web.config.HateoasAwareSpringDataWebConfiguration" />
```

> 以上方式中的 Spring HATEOAS 都是在你把 Spring HATEOAS 組件加入項目依賴中自動發現配置的。

### Paging and Sorting

把Crud換成`PagingAndSortingRepository`

```java
public interface HeroRepository extends PagingAndSortingRepository<Hero, BigInteger> {
}
```

然後 `RestController` 的 query method 加上參數 `Pageable pageable`:

```java
@RequestMapping("")
Page<Hero> getAll(Pageable pageable) {
    return heroRepository.findAll(pageable);
}
```

最終在查詢時使用的參數格式為：
*http://127.0.0.1:8080/hero?size=2&page=1&sort=name,desc*


## Spring Data Rest

Spring 提供了更为简便的方式创建 Restful APIs ， [Spring Data REST][spring-data-rest] is part of the umbrella [Spring Data][spring-data] project and makes it easy to build hypermedia-driven REST web services on top of Spring Data repositories.

### Basics

Spring data rest configuration with Maven:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>
```

為 Hero Repository 添加註解 `@RepositoryRestResource(collectionResourceRel = "heros", path = "heros")`，為了與`@RestController`說明的 Restful api 區分這裡使用`heros`作為路徑。

```java
@RepositoryRestResource(collectionResourceRel = "heros", path = "/heros")
public interface HeroRepository  extends CrudRepository<Hero, BigInteger> {
}
```

啟動應用 `mvn spring-boot:run` 則可以看到 hero 的 restful apis ：

*http://127.0.0.1:8080/heros*

> Spring Data REST uses the [HAL format][HAL format] for JSON output. It is flexible and offers a convenient way to supply links adjacent to the data that is served.

### More

你的 HeroRespository 也可以继承 `PagingAndSortingRepository` 或者 `MongoRepository`之类的，可以提供更为丰富的 Restful 功能。


[Spring Boot]:http://projects.spring.io/spring-boot/
[spring-data]:http://projects.spring.io/spring-data/
[spring-data-rest]:http://projects.spring.io/spring-data-rest/
[HAL format]:http://stateless.co/hal_specification.html
