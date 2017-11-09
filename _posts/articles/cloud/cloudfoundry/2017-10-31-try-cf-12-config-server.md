---
layout: post
title: Try Cloud Foundry 12 - Config Server
excerpt: "Config Server for Pivotal Cloud Foundry (PCF) is an externalized application configuration service, which gives you a central place to manage an application’s external properties across all environments."
modified: 2017-10-31T17:00:00-00:00
categories: articles
tags: [Scalability, Cloud Foundry]
image:
  vendor: twitter
  feature: /media/DMxA2Z-XcAAqI1_.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "Config Server for Pivotal Cloud Foundry"
    url: "http://docs.pivotal.io/spring-cloud-services/1-4/common/config-server/"
---

* TOC
{:toc}

Cloud Foundry 的 Config Server 是使用了 [Spring Cloud Config](http://cloud.spring.io/spring-cloud-config/single/spring-cloud-config.html) 开源产品。

创建 Config Server 实例可以通过 CF CLI ， 也可以通过CloudFoundry vendor UI。 我们推荐使用 CLI。

## Creating an Instance

```
$ cf marketplace
Getting services from marketplace in org tiven.wang / space development as i.tiven.wang@gmail.com...
OK

service                       plans                                                                                description
...
p-circuit-breaker-dashboard   standard                                                                             Circuit Breaker Dashboard for Spring Cloud Applications
p-config-server               standard                                                                             Config Server for Spring Cloud Applications
p-service-registry            standard                                                                             Service Registry for Spring Cloud Applications
pubnub                        free                                                                                 Build Realtime Apps that Scale
...

* These service plans have an associated cost. Creating a service instance will incur this cost.

TIP:  Use 'cf marketplace -s SERVICE' to view descriptions of individual plans of a given service.

$ cf marketplace -s p-config-server
Getting service plan information for service p-config-server as i.tiven.wang@gmail.com...
OK

service plan   description     free or paid
standard       Standard Plan   free
```

假设存放配置的Git库地址是 https://github.com/spring-cloud-samples/config-repo;
Config Server 还可以单独为某个指定配置库例如：为以 cook 开头的应用指定配置库 https://github.com/spring-cloud-services-samples/cook-config; `count`是说明为此 Config Server 提供几个实例。

```
$ cf create-service -c '{"git": { "uri": "https://github.com/spring-cloud-samples/config-repo", "repos": { "cook": { "pattern": "cook*", "uri": "https://github.com/spring-cloud-services-samples/cook-config" } } }, "count": 3 }' p-config-server standard config-server

FAILED
Invalid configuration provided for -c flag. Please provide a valid JSON object or path to a file containing a valid JSON object.
```

按理应该成功创建的，但是这里告诉我们配置参数的json格式不对，那么可以换用文件路径配置。

```
$ cf create-service p-config-server standard config-server -c ./config-server.json
Creating service instance config-server in org tiven.wang / space development as i.tiven.wang@gmail.com...
OK

Create in progress. Use 'cf services' or 'cf service config-server' to check operation status.
```

创建成功后可以在 Pivotal 控制台打开 Config server 服务的管理界面，可以看到简单的配置信息。

## Config Server Client

这里我们依旧使用 Spring Boot 开发应用程序。 Refer to the [“Cook” sample application](https://github.com/spring-cloud-services-samples/cook/tree/1.4.x) to follow along with the code in this topic.

### Writing Client Applications

使用 Spring Boot application 作为 Config Server 实例的客户端应用程序的话，先要把 maven 依赖包加进来。


```
[INFO] +- io.pivotal.spring.cloud:spring-cloud-services-starter-config-client:jar:1.4.1.RELEASE:compile
[INFO] |  +- org.springframework.cloud:spring-cloud-config-client:jar:1.2.2.RELEASE:compile
[INFO] |  |  +- org.springframework.boot:spring-boot-autoconfigure:jar:1.4.2.RELEASE:compile
[INFO] |  |  +- org.springframework.cloud:spring-cloud-commons:jar:1.1.7.RELEASE:compile
[INFO] |  |  |  \- org.springframework.security:spring-security-crypto:jar:4.1.3.RELEASE:compile
[INFO] |  |  +- org.springframework.cloud:spring-cloud-context:jar:1.1.7.RELEASE:compile
[INFO] |  |  \- com.fasterxml.jackson.core:jackson-annotations:jar:2.8.4:compile
[INFO] |  +- org.springframework.security.oauth:spring-security-oauth2:jar:2.0.12.RELEASE:runtime
[INFO] |  |  +- org.springframework:spring-beans:jar:4.3.4.RELEASE:compile
[INFO] |  |  +- org.springframework:spring-context:jar:4.3.4.RELEASE:compile
[INFO] |  |  +- org.springframework.security:spring-security-core:jar:4.1.3.RELEASE:runtime
[INFO] |  |  |  \- aopalliance:aopalliance:jar:1.0:runtime
[INFO] |  |  +- org.springframework.security:spring-security-config:jar:4.1.3.RELEASE:runtime
[INFO] |  |  +- org.springframework.security:spring-security-web:jar:4.1.3.RELEASE:runtime
[INFO] |  |  +- commons-codec:commons-codec:jar:1.10:compile
[INFO] |  |  \- org.codehaus.jackson:jackson-mapper-asl:jar:1.9.13:runtime
[INFO] |  |     \- org.codehaus.jackson:jackson-core-asl:jar:1.9.13:runtime
[INFO] |  +- io.pivotal.spring.cloud:spring-cloud-services-cloudfoundry-connector:jar:1.4.1.RELEASE:compile
[INFO] |  |  +- io.pivotal.spring.cloud:spring-cloud-services-connector-core:jar:1.4.1.RELEASE:compile
[INFO] |  |  |  \- org.springframework.cloud:spring-cloud-core:jar:1.2.3.RELEASE:compile
[INFO] |  |  \- org.springframework.cloud:spring-cloud-cloudfoundry-connector:jar:1.2.3.RELEASE:compile
[INFO] |  +- io.pivotal.spring.cloud:spring-cloud-services-spring-connector:jar:1.4.1.RELEASE:compile
[INFO] |  |  +- org.projectlombok:lombok:jar:1.16.10:compile
[INFO] |  |  \- org.springframework.cloud:spring-cloud-spring-service-connector:jar:1.2.3.RELEASE:compile
[INFO] |  \- io.pivotal.spring.cloud:cloudfoundry-certificate-truster:jar:1.0.1.RELEASE:compile
```

### Service Detection
