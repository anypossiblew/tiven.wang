---
layout: post
title: Microservices - Service Discovery
excerpt: ""
modified: 2017-08-10T11:51:25-04:00
categories: articles
tags: [Service Discovery, Microservices]
image:
  vendor: unsplash
  feature: /photo-1500479694472-551d1fb6258d?dpr=1.5&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
  credit: Scott Walsh
  creditlink: https://unsplash.com/@outsighted
comments: true
share: true
references:
  - title: "Microservice Architecture - Pattern: Service registry"
    url: "http://microservices.io/patterns/service-registry.html"
  - title: "Microservice Architecture - Pattern: Client-side service discovery"
    url: "http://microservices.io/patterns/client-side-discovery.html"
  - title: "Microservice Architecture - Pattern: Client-side service discovery"
    url: "https://alexandreesl.com/2016/01/08/docker-using-containers-to-implement-a-microservices-architecture/"
  - title: "Spring Cloud Netflix"
    url: "http://cloud.spring.io/spring-cloud-netflix/spring-cloud-netflix.html"
  - title: "Introduction to Spring Cloud Netflix – Eureka"
    url: "http://www.baeldung.com/spring-cloud-netflix-eureka"

---

* TOC
{:toc}

> 下載本文完整項目代碼 [Github](https://github.com/joshlong/service-registration-and-discovery)
{: .Tips}

*https://github.com/joshlong/service-registration-and-discovery*

## Concept

**Hero** **Villain** and **Police office**

* Villain       -> Police office "I'm here!"
* Police office -> Hero          "Move!"
* Hero          -> Villain       "Catch you!"
* Hero          -> Police office "Give him to you!"

## Building

### Parent POM

首先配置 parent maven 配置文件:

```xml
<parent>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-parent</artifactId>
  <version>Dalston.SR2</version>
  <relativePath/>
</parent>

<groupId>wang.tiven.microservices</groupId>
<artifactId>service-registration-and-discovery</artifactId>
<version>0.0.1-SNAPSHOT</version>

<packaging>pom</packaging>

<modules>
  <module>villain-service</module>
  <module>hero-service</module>
  <module>police-service</module>
  <module>eureka-service</module>
</modules>
```

* 设置本项目的 parent 为 `spring-cloud-starter-parent` 版本为本文编写时最新稳定版 `Dalston.SR2`
* 并包含几个子模块 `eureka-service` 提供本地测试用的 service registry 服务
* 其他三个子模块分别对应我们的 Hero Villain 和 Police

### Eureka Service

> [Eureka][eureka] is a REST (Representational State Transfer) based service that is primarily used in the AWS cloud for locating services for the purpose of load balancing and failover of middle-tier servers.
>
> At Netflix, Eureka is used for the following purposes apart from playing a critical part in mid-tier load balancing.
{: .Quotes}

> [Spring Cloud Netflix][spring-cloud-netflix] provides Netflix OSS integrations for Spring Boot apps through autoconfiguration and binding to the Spring Environment and other Spring programming model idioms.
{: .Quotes}

```xml
<parent>
  <groupId>wang.tiven.microservices</groupId>
  <artifactId>service-registration-and-discovery</artifactId>
  <version>0.0.1-SNAPSHOT</version>
</parent>

<name>service-registration-and-discovery:eureka-service</name>
<artifactId>eureka-service</artifactId>
<packaging>jar</packaging>
<properties>
  <start-class>wang.tiven.microservices.registry.Application</start-class>
</properties>

<dependencies>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka-server</artifactId>
  </dependency>
</dependencies>
```

To run your own server use the `spring-cloud-starter-eureka-server` dependency and `@EnableEurekaServer`.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class Application {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
```

Config the attribute `server port` default as `8761` in

```yaml
server:
  port: 8761

eureka:
  client:
    registerWithEureka: false
    fetchRegistry: false
  server:
    waitTimeInMsWhenSyncEmpty: 0
```

You can run the eureka server through command:
`mvn spring-boot:run`

Once the server startup, you can access the eureka application cockpit in local through url
[*http://127.0.0.1:8761/*](http://127.0.0.1:8761/){:target="\_blank"}

### Villain Service

Big villain here. The project most attributes are similar to eureka service's, so we only introduce the dependencies for this application:

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
  </dependency>
</dependencies>
```

* `spring-cloud-starter-eureka` enable this spring boot application to be discovery-aware
* in order to create a RESTful api we have to include the `spring-boot-starter-web` package
* the application need to store the avatar for villain in database, so we include `spring-boot-starter-data-mongodb` package

The application configuration file:

```yaml
server:
  port: 8060

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

* The web application port default as **8060**
* The server url for local eureka service is *http://localhost:8761/eureka/*


```java
@RestController
@RequestMapping("/{villainId}")
class VillainRestController {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT})
    ResponseEntity<?> set(String villainId,
                          @RequestParam MultipartFile multipartFile,
                          UriComponentsBuilder uriBuilder) throws IOException {

        try (InputStream inputStream = multipartFile.getInputStream()) {
            this.gridFsTemplate.store(inputStream, villainId);
        }
        URI uri = uriBuilder.path("/{villainId}").buildAndExpand(villainId).toUri();
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(uri);
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.GET)
    ResponseEntity<Resource> get(String villainId) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.IMAGE_JPEG);
        return new ResponseEntity<>(
                this.gridFsTemplate.getResource(villainId), httpHeaders, HttpStatus.OK);
    }
}
```

* The set method receive a villain id and avatar, then store it in mongodb
* The get method return a villain for who query him
* `@EnableEurekaClient` tell the application to registry in eureka service

Startup the application and check the cockpit of eureka, you will find the registered application in section **Instances currently registered with Eureka**

`mvn spring-boot:run`

### Police Service

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>com.h2database</groupId>
  <artifactId>h2</artifactId>
</dependency>
```

Villain report himself to police office:

```java
@RequestMapping(value = "/villains/{villainName}", method = RequestMethod.POST)
Villain createVillain(@PathVariable String officeName,
                     @PathVariable String villainName) {
	PoliceOffice policeOffice = policeOfficeRepository.findByOfficeName(officeName);

	Villain villain = new Villain(villainName);
	villain.setPoliceOffice(policeOffice);

    return this.villainRepository.save(villain);
}
```

#### Basic Service Discovery

Now we can add a method in villain service to report himself to police office:

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
</dependency>
```


## Docker

`docker run --rm --name eureka-service -h eureka-service -p 8761:8761 -v C:\dev\github\cf\service-registration-and-discovery\eureka-service:/data -w /data openjdk java -jar ./target/eureka-service.jar`

`docker run --rm --name bookmark-service -h bookmark-service -p 9098:9098 --link eureka-service -v C:\dev\github\cf\service-registration-and-discovery\bookmark-service:/data -w /data openjdk java -jar ./target/bookmark-service.jar`

`docker run --rm --name mongoserver -d -p 27017:27017 mongo`

`docker run --rm --name photo-service -h photo-service -p 8060:8060 --link eureka-service --link mongoserver -v C:\dev\github\cf\service-registration-and-discovery\photo-service:/data -w /data openjdk java -jar ./target/photo-service.jar`

`docker run --rm --name passport-service -h passport-service -p 8050:8050 --link eureka-service --link bookmark-service -v C:\dev\github\cf\service-registration-and-discovery\passport-service:/data -w /data openjdk java -jar ./target/passport-service.jar`

### Docker Network

`docker network create microservices-net`

`docker run --rm --name eureka-service --network microservices-net -p 8761:8761 -v C:\dev\github\cf\service-registration-and-discovery\eureka-service:/data -w /data openjdk java -jar ./target/eureka-service.jar`

`docker run --rm --name bookmark-service --network microservices-net -h bookmark-service -p 9098:9098 --link eureka-service -v C:\dev\github\cf\service-registration-and-discovery\bookmark-service:/data -w /data openjdk java -jar ./target/bookmark-service.jar`

`docker run --rm --name passport-service -p 8050:8050 --link eureka-service -v C:\dev\github\cf\service-registration-and-discovery\passport-service:/data -w /data openjdk java -jar ./target/passport-service.jar`


[eureka]:https://github.com/Netflix/eureka
[spring-cloud-netflix]:https://cloud.spring.io/spring-cloud-netflix/
