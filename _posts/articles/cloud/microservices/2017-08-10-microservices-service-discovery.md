---
layout: post
theme: UbuntuMono
title: Microservices - Service Discovery
excerpt: "Clients of a service use either Client-side discovery or Server-side discovery to determine the location of a service instance to which to send requests. Why use Service Discovery?"
modified: 2017-08-10T11:51:25-04:00
categories: articles
tags: [Service Discovery, Scalability, Spring Cloud, Microservices]
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
  - title: "Docker: using containers to implement a microservices architecture"
    url: "https://alexandreesl.com/2016/01/08/docker-using-containers-to-implement-a-microservices-architecture/"
  - title: "Spring Cloud Netflix"
    url: "http://cloud.spring.io/spring-cloud-netflix/spring-cloud-netflix.html"
  - title: "Introduction to Spring Cloud Netflix – Eureka"
    url: "http://www.baeldung.com/spring-cloud-netflix-eureka"
  - title: "Docker networking and service discovery"
    url: "https://www.oreilly.com/learning/docker-networking-service-discovery"
  - title: "Service Discovery in a Microservices Architecture"
    url: "https://www.nginx.com/blog/service-discovery-in-a-microservices-architecture/"

---

* TOC
{:toc}


## Concept
Assume we have three services, **Hero**, **Villain** and **Police office**

```
* Villain       -> Police office "I'm here!"
* Police office -> Hero          "Move!"
* Hero          -> Villain       "Catch you!"
* Hero          -> Police office "Give him to you!"
```

## Service Discovery

Clients of a service use either **Client-side discovery** or **Server-side discovery** to determine the location of a service instance to which to send requests.

Why Use Service Discovery? Please refer to the section in [Service Discovery in a Microservices Architecture](https://www.nginx.com/blog/service-discovery-in-a-microservices-architecture/)

### Service Discovery Products

* [Eureka](https://github.com/Netflix/eureka)
* [ZooKeeper](https://zookeeper.apache.org/)
* [Consul](https://www.consul.io/)
* [etcd](https://github.com/coreos/etcd)

[Spring Cloud Netflix](https://cloud.spring.io/spring-cloud-netflix/)

[Spring Cloud Zookeeper](https://cloud.spring.io/spring-cloud-zookeeper/)

[Consul vs. Other Software](https://www.consul.io/intro/vs/zookeeper.html)

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

The application’s Eureka instance name (the name by which it will be registered in Eureka) will be derived from the value of the `spring.application.name` property on the application.

```java
@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT})
ResponseEntity set(String villainId,
                      @RequestParam MultipartFile multipartFile,
                      UriComponentsBuilder uriBuilder) throws IOException {

    InputStream inputStream = multipartFile.getInputStream();
    this.gridFsTemplate.store(inputStream, villainId);

    URI uri = uriBuilder.path("/{villainId}").buildAndExpand(villainId).toUri();
    HttpHeaders headers = new HttpHeaders();
    headers.setLocation(uri);
    return new ResponseEntity(headers, HttpStatus.CREATED);
}
```

* The set method receive a villain id and avatar, then store it in mongodb
* The get method return a villain for who query him
* `@EnableEurekaClient` tell the application to registry in eureka service

First startup a mongodb server in local, for example using docker:
`docker run --rm --name mongoserver -d -p 27017:27017 mongo`

Startup the application and check the cockpit of eureka, you will find the registered application in section **Instances currently registered with Eureka**

`mvn spring-boot:run`

### Police Service

Add the [H2][h2database] database in this application to provide a datasource to store police offices and villains information.

> [H2](https://en.wikipedia.org/wiki/H2_(DBMS)) is a relational database management system written in Java. It can be embedded in Java applications or run in the client-server mode.
{: .Quotes}

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

The police service provide a Restful api to enable villain report himself to the police office:

```java
@RequestMapping(value = "/villains", method = RequestMethod.POST)
@ResponseBody Villain createVillain(@PathVariable String officeName, @RequestBody Villain villain) {

  System.out.println(officeName + ", I'm here, '" + villain.getName() + "'");

  PoliceOffice policeOffice = policeOfficeRepository.findByOfficeName(officeName);

  villain.setPoliceOffice(policeOffice);

  return this.villainRepository.save(villain);
}
```

#### Basic Service Discovery

Now we add logic in villain service to report a villain himself to police office.

Use the `RestTemplate` to call Restful api, and add the `@LoadBalanced` on it, this tells Spring Cloud that we want to take advantage of its load balancing support.

```java
@SpringBootApplication
@EnableEurekaClient
public class Application {

    ...

    @LoadBalanced
    @Bean
    RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

Then we can auto wire the `RestTemplate` instance into controller, and call the police office restful api when creating villain. The url of police write as *http://\<service-name\>/\<api-path\>*, e.g. *http://police-service/Gotham-City/villains*

```java
...

@Autowired
private RestTemplate restTemplate;

@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT})
ResponseEntity<?> set(@PathVariable String villainId,
                      @RequestParam MultipartFile multipartFile,
                      UriComponentsBuilder uriBuilder) throws IOException {

  ...

  this.restTemplate.exchange(
          "http://police-service/Gotham-City/villains",
          HttpMethod.POST,
          new HttpEntity<Villain>(new Villain(villainId)),
          new ParameterizedTypeReference<Villain>() {
          });

  ...

  return new ResponseEntity<>(headers, HttpStatus.CREATED);
}
```

#### Test Basic Service Discovery

Now restart villain service and startup police service,

Send a post request to url *http://localhost:8060/xman*, then you will get the information *Gotham-City, I'm here, 'xman'* in the console of police server.

You can get the complete application sourcecode for this step on [Github](https://github.com/tiven-wang/try-cf/tree/service-discovery-1)

### Hero Service

In this hero service, we change the approach of calling restful api to using feign client. Add the spring cloud feign package:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
</dependency>
```

Enable the application's feign client ability by `@EnableFeignClients`

```java
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
public class Application {
  ...
}
```

Create a client for external service restful api:

```java
@FeignClient("police-service")
interface PoliceOfficeClient {

    @RequestMapping(method = RequestMethod.POST, value = "/Gotham-City/villains/{villainName}")
    void catched(@PathVariable("villainName") String villainName);
}
```

Then use it in business logic in the controller class:

```java
@Autowired
PoliceOfficeClient policeOfficeClient;

@RequestMapping(method = RequestMethod.POST)
@ResponseBody void move(@PathVariable String heroName, @RequestBody Villain villain) {

  System.out.println("I " + heroName + " move!");

  Resource resource = villainClient.get(villain.getName());

  System.out.println(villain.getName() + ", catch you!");

  policeOfficeClient.catched(villain.getName());
}
```

### Test Feign Clients

Startup all of the services, Hero Villain and Police services, the send a request to url:

*http://localhost:8060/xman*

you will get messages

Villain service:

```
I xman am here!
```

Police service:

```
This is Gotham-City, you xman just wait!
Have catched xman
```

Hero service:

```
I Batman move!
xman, catch you!
```

You can get the complete application sourcecode for this step on [Github](https://github.com/tiven-wang/try-cf/tree/service-discovery-2)

## Dockerization
Probably you have learnt [docker][docker] in your past project experiences, now we apply docker in our these services:

> Before run docker runtime container, you need package the applications by `mvn package`
{: .Notes}

1 Startup the eureka server `docker run --rm --name eureka-service -h eureka-service -p 8761:8761 -v \<project-path\>/eureka-service:/data -w /data openjdk java -jar ./target/eureka-service.jar`

2 Startup a mongodb server `docker run --rm --name mongoserver -d -p 27017:27017 mongo`

Because applications run own OS container separately, so thy can't use `localhost` to access another service.
Change the service url for eureka server in all the applications and add mongodb server host address:

```yaml
eureka:
  client:
    serviceUrl:
      defaultZone: http://eureka-service:8761/eureka/

---
spring:
  data:
    mongodb:
      host: mongoserver
      port: 27017
```

3 `docker run --rm --name villain-service -h villain-service -p 8060:8060 --link eureka-service --link mongoserver -v \<project-path\>/villain-service:/data -w /data openjdk java -jar ./target/villain-service.jar`

Add a docker `--link` as `eureka-service` in the command to enable this container be able to access the *eureka service* container. And the `mongoserver` be too.

4 `docker run --rm --name police-service -h police-service -p 9098:9098 --link eureka-service --link hero-service -v \<project-path\>/police-service:/data -w /data openjdk java -jar ./target/police-service.jar`

5 `docker run --rm --name hero-service -h hero-service -p 8050:8050 --link eureka-service --link police-service --link villain-service -v \<project-path\>/hero-service:/data -w /data openjdk java -jar ./target/hero-service.jar`

> You can't startup the applications, because the container link dependencies.
{: .Warning}

So next

### Docker Network

> [What is Docker networking](https://www.oreilly.com/learning/what-is-docker-networking)
{: .Quotes}

[Docker container networking][docker-networking]

Create a network for our microservices:

`docker network create microservices-net`

And add the network into all the Docker containers:

`docker run --rm --name eureka-service -h eureka-service --network microservices-net -p 8761:8761 -v \<project-path\>/eureka-service:/data -w /data openjdk java -jar ./target/eureka-service.jar`

`docker run --rm --name mongoserver -d --network microservices-net -p 27017:27017 mongo`

`docker run --rm --name villain-service -h villain-service --network microservices-net -p 8060:8060 -v \<project-path\>/villain-service:/data -w /data openjdk java -jar ./target/villain-service.jar`

`docker run --rm --name police-service -h police-service --network microservices-net -p 9098:9098 -v \<project-path\>/police-service:/data -w /data openjdk java -jar ./target/police-service.jar`

`docker run --rm --name hero-service -h hero-service --network microservices-net -p 8050:8050 -v \<project-path\>/hero-service:/data -w /data openjdk java -jar ./target/hero-service.jar`

You can get the complete application sourcecode for this step on [Github](https://github.com/tiven-wang/try-cf/tree/service-discovery-dockerization)

## Cloud Foundry

In production, how to deploy our services to CloudFoundry platform? Please refer to [Try Cloud Foundry 10 - Service Discovery](/articles/try-cf-10-service-discovery/).



[eureka]:https://github.com/Netflix/eureka
[spring-cloud-netflix]:https://cloud.spring.io/spring-cloud-netflix/
[h2database]:http://www.h2database.com
[docker]:https://www.docker.com/
[docker-networking]:https://docs.docker.com/engine/userguide/networking/
