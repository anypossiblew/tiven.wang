---
layout: post
theme: UbuntuMono
series:
  url: try-cloudfoundry
  title: Try Cloud Foundry
title: Spring Cloud Connector
excerpt: "Spring Cloud Connectors simplifies the process of connecting to services and gaining operating environment awareness in cloud platforms such as Cloud Foundry and Heroku, especially for Spring applications. It is designed for extensibility: you can use one of the provided cloud connectors or write one for your cloud platform, and you can use the built-in support for commonly-used services (relational databases, MongoDB, Redis, RabbitMQ) or extend Spring Cloud Connectors to work with your own services."
modified: 2017-07-25T17:00:00-00:00
categories: articles
tags: [Spring Cloud, Cloud Foundry]
image:
  vendor: 500px
  feature: /photo/221057513/q%3D80_m%3D2000/v2?user_id=15281525&webp=true&sig=60aff417e3a09b742e25817d38e1434edcde82324f3b51ad969164e0b129a274
comments: true
share: true
references:
  - title: "Cloud Foundry - Spring Cloud Connectors"
    url: "http://cloud.spring.io/spring-cloud-connectors/spring-cloud-connectors.html"
---

> Autumn [Grizzly](https://en.wikipedia.org/wiki/Grizzly_bear) [Denali National Park](https://earth.google.com/web/@63.21366,-151.11581685,1529.07672297a,335251.48439207d,35y,0h,0t,0r), [Alaska](https://en.wikipedia.org/wiki/Alaska)
{: .Notes}

* TOC
{:toc}

`spring-boot-starter-cloud-connectors` is a starter for using Spring Cloud Connectors which simplifies connecting to services in cloud platforms like Cloud Foundry and Heroku.

> 下載本篇完整代碼 [Github](https://github.com/tiven-wang/try-cf/tree/spring-cloud-connectors)
{: .Notes}

## Setup

> Spring Cloud Connectors simplifies the process of connecting to services and gaining operating environment awareness in cloud platforms such as Cloud Foundry and Heroku, especially for Spring applications.
{: .Notes}

添加 [Spring Boot][Spring Boot] 的 Cloud connectors starter 里面包含了几个 Cloud connectors 相关的组件

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-cloud-connectors</artifactId>
</dependency>
```

## MongoDB

為了測試 Cloud connectors 的數據庫連接效果，這裡我們使用 mongodb 數據庫服務。

添加 [Spring Boot][Spring Boot] starter 的 [spring data mongodb][spring-data/mongodb] 組件

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

### Model

新建一個 MongoDB 文檔模型 **Hero**:

```java
@Document(collection = "hero")
public class Hero {

  @Id
  @JsonSerialize(using = ToStringSerializer.class)
  private BigInteger id;

  private String name;

  ...
}
```

### Repository

為 Hero 模型創建一個 Repository， 只有簡單的CRUD操作的 Repository：

```java
public interface HeroRepository  extends CrudRepository<Hero, BigInteger> {
}
```

### Controller

在 Controller 裡使用 HeroRepository 來操作數據庫進行增刪改查：

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

## Cloud Configuration

為了告訴 Spring 如果去創建 Cloud 的環境配置，需要創建類 `CloudConfiguration`:

```java
@Configuration
@ServiceScan
@Profile("cloud")
public class CloudConfiguration extends AbstractCloudConfig {
  @Bean
  public ApplicationInstanceInfo applicationInfo() {
    return cloud().getApplicationInstanceInfo();
  }
}
```

* `@ServiceScan` 註解類似Spring中的`@ComponentScan`， 它會掃描綁定在此app上的服務，並為每個服務創建一個bean
* `@Profile("cloud")` 說明當程序指定激活`cloud`配置时才加载这里的配置, 如在`manifest.yml`中指定
  ```yaml
  # ...
  env:
      SPRING_PROFILES_ACTIVE: cloud
  ```

## Test

可以在本機啟動一個MongoDB服務，因為本機運行不起用 profile *cloud* 時默認使用localhost的 MongoDB 服務。

例如使用docker在本機創建一個MongoDB服務

`docker run --rm --name my-mongo -d -p 27017:27017 mongo`

然後啟動應用 `mvn spring:run`

訪問鏈接 *http://localhost:8080/hero* 則可以創建查詢 Hero; Post 请求可以创建 hero

## Deploy

像之前講的方式一樣 push 到 CloudFoundry 上去

`mvn clean package`

`cf push`

但還需要在 CloudFoundry 上創建一個 MongoDB 服務：

`cf create-service mlab sandbox try-cf-mongodb`

並綁定到此應用（也可以在 *manifest.yml* 指定 *services* 配置）

`cf bind-service try-cf-spring-boot try-cf-mongodb`

重啟應用：

`cf restart`

訪問鏈接 *https://try-cf-spring-boot.cfapps.io/hero* 可以增刪查Hero啦。

### Manifest

或者使用 manifest 配置文件部署

```yaml
---
applications:
- name: try-cf-spring-boot
  buildpack: java_buildpack
  instances: 1
  memory: 1G
  host: try-cf-spring-boot
  env:
    APP_LOGGING_LEVEL: DEBUG
    SPRING_PROFILES_ACTIVE: cloud
  path: target/try-cf-spring-boot-0.0.1-SNAPSHOT.jar
  services:
    - try-cf-mongodb
```

[Spring Boot]:http://projects.spring.io/spring-boot/
[spring-data/mongodb]:https://docs.spring.io/spring-data/mongodb/docs/1.10.6.RELEASE/reference/html/
