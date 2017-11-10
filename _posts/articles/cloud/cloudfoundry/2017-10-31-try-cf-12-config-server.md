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

使用 Spring Boot application 作为 Config Server 实例的客户端应用程序的话，先要把 maven 依赖包加进来。为了方便起见，Spring 提供了一个 starter BOM 包专门提供 Config client 所需依赖 `spring-cloud-services-starter-config-client`. config server 属于 `spring-cloud-services` 的一部分，所以可以统一设置依赖管理。想要使用 Spring Cloud Services service instances，你的客户端应用必须添加 [BOMs](http://www.baeldung.com/spring-maven-bom) `spring-cloud-services-dependencies` 和 `spring-cloud-dependencies`. 关于她们之间并且和 Spring Boot 之间的版本兼容请详细参考 [Client Dependencies](http://docs.pivotal.io/spring-cloud-services/1-4/common/client-dependencies.html)

```xml
<dependencyManagement>
  <dependencies>
     <dependency>
         <groupId>io.pivotal.spring.cloud</groupId>
         <artifactId>spring-cloud-services-dependencies</artifactId>
         <version>1.5.0.RELEASE</version>
         <type>pom</type>
         <scope>import</scope>
     </dependency>
     <dependency>
         <groupId>org.springframework.cloud</groupId>
         <artifactId>spring-cloud-dependencies</artifactId>
         <version>Dalston.SR1</version>
         <type>pom</type>
         <scope>import</scope>
     </dependency>
  </dependencies>
</dependencyManagement>
```

然后在依赖里添加 Config client BOM

```xml
<dependencies>
  <dependency>
    <groupId>io.pivotal.spring.cloud</groupId>
    <artifactId>spring-cloud-services-starter-config-client</artifactId>
  </dependency>
</dependencies>
```

使用命令`mvn dependency:tree`查看依赖关系树

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

假设我们已经获取到了配置文件，就可以在 Spring 程序里使用变量

```java
@Value("${cook.special}")
String special;
```

### Service Detection

至于如何做到把 Config Server 上的配置文件加载到我们的客户端应用程序里的，接下来分析。

在 CloudFoundry 上 push 此应用时会有这样的配置，把 Config Server 绑定给我们的程序

```
services:
  - config-server
```

那么 CloudFoundry 就会 set 这样的环境变量：使用命令 `cf env cook` 获取应用的环境变量

```
$ cf env cook
Getting env variables for app cook in org tiven.wang / space development as i.tiven.wang@gmail.com...
OK

System-Provided:
{
"VCAP_SERVICES": {
 "p-config-server": [
  {
   "credentials": {
    "access_token_uri": "https://p-spring-cloud-services.uaa.run.pivotal.io/oauth/token",
    "client_id": "p-config-server-fde9103d-7c83-46d2-8744-86b5b81da6fa",
    "client_secret": "nZyy8XIvbAaz",
    "uri": "https://config-36050167-e8fb-47b4-8530-9f6b8b3ed40b.cfapps.io"
   },
   "label": "p-config-server",
   "name": "config-server",
   "plan": "standard",
   "provider": null,
   "syslog_drain_url": null,
   "tags": [
    "configuration",
    "spring-cloud"
   ],
   "volume_mounts": []
  }
 ]
}
}

{
"VCAP_APPLICATION": {
 "application_id": "74bb0f74-ff7d-4146-8591-19828838f828",
 "application_name": "cook",
 "application_uris": [
  "try-cf-cookie.cfapps.io"
 ],
 "application_version": "b46b9f88-f8e0-46e1-829a-396fca6c9431",
 "cf_api": "https://api.run.pivotal.io",
 "limits": {
  "disk": 1024,
  "fds": 16384,
  "mem": 1024
 },
 "name": "cook",
 "space_id": "b8ad7c89-2917-436b-930f-dac3d81f9ba5",
 "space_name": "development",
 "uris": [
  "try-cf-cookie.cfapps.io"
 ],
 "users": null,
 "version": "b46b9f88-f8e0-46e1-829a-396fca6c9431"
}
}

User-Provided:
SPRING_PROFILES_ACTIVE: dev

No running env variables have been set

No staging env variables have been set
```

接下来该做的就是应用程序把这些信息拿去用。

#### Spring Cloud® Connectors

在 CloudFoundry 平台上为了从客户端应用里连接 Config Server，Spring Cloud Services 使用 [Spring Cloud Connectors](http://cloud.spring.io/spring-cloud-connectors/spring-cloud-connectors.html) 里的 [Spring Cloud Cloud Foundry Connector](http://cloud.spring.io/spring-cloud-connectors/spring-cloud-cloud-foundry-connector.html) 去发现绑定到应用程序上的服务。
