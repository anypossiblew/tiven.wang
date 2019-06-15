---
layout: post
theme: UbuntuMono
series:
  url: try-cloudfoundry
  title: Try Cloud Foundry
title: Config Server
excerpt: "Config Server for Pivotal Cloud Foundry (PCF) is an externalized application configuration service, which gives you a central place to manage an application’s external properties across all environments."
modified: 2017-10-31T17:00:00-00:00
categories: articles
tags: [Scalability, Cloud Native, Cloud Foundry]
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
  - title: "Project Configuration with Spring"
    url: "http://www.baeldung.com/project-configuration-with-spring"
  - title: "Cloud Foundry Environment Variables"
    url: "https://docs.pivotal.io/pivotalcf/1-12/devguide/deploy-apps/environment-variable.html"
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

这样 CloudFoundry 就会为此服务设置环境变量：使用命令 `cf env cook` 获取该应用的环境变量

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

**VCAP_SERVICES**　节点下代表所有服务的环境配置，其中 **p-config-server** 就是我们创建的配置服务器。

接下来该做的就是应用程序把这些信息拿去用。

#### Spring Cloud® Connectors

在 CloudFoundry 平台上为了从客户端应用里连接 Config Server，[Spring Cloud Services][spring-cloud-services] 使用 [Spring Cloud Connectors][spring-cloud-connectors] 里的 [Spring Cloud Cloud Foundry Connector][spring-cloud-cloud-foundry-connector] 去发现绑定到应用程序上的服务。

Spring Cloud Connectors 框架的总体架构如下图所示：

![Image: spring-cloud-connectors-design](http://cloud.spring.io/spring-cloud-connectors/images/spring-cloud-connectors-design.png)

CloudConnector 实例会决定当前运行的云环境；
ServiceConnectorCreator 和 ServiceInfoCreator 实例会根据 Service 的 tags 决定是否属于自己，然后创建相应的 ServiceConnector 和 [ServiceInfo][ServiceInfo]；
ServiceConnector 指的是不同的服务自己不同的 Connector 类型，如 Database 的 DataSource 。

> Spring Cloud Connectors uses the [Java SPI][java-SPI] to discover available connectors.
{: .Notes}

接下来，例如 Spring Cloud Config 组件中，创建的 [ServiceInfo][ServiceInfo] 会被相应的 [ServiceInfoPropertySourceAdapter][ServiceInfoPropertySourceAdapter] 组装成 [PropertySource][PropertySource] 添加到 Spring 的 [ConfigurableEnvironment][ConfigurableEnvironment] 环境中，
继而被相关组件使用。

例如：Spring Cloud Config 会使用注解来把 [ConfigurableEnvironment][ConfigurableEnvironment] 环境中的变量识别成对象
`@ConfigurationProperties("spring.cloud.config")`
然后会自动配置利用，进行Config server client的创建。

#### Spring Cloud Config Client

Spring Cloud Config Client 组件会根据环境变量自动配置一个 ConfigServicePropertySourceLocator 实例进行 Config Server 的读取操作，然后把读取到的配置信息塞到 Spring ConfigurableEnvironment 的 PropertySources 里去；

Spring Cloud Config Client 组件同时还支持调用接口重试能力，它是通过 Spring Retry 项目组件来做的；

还可以通过 [HealthIndicator][HealthIndicator] 做 Health Check；

还可以通过配置 Spring Cloud Service Discovery 组件来自动获取 Config Server 的服务地址。

详细逻辑可以通过研读源代码获得了解。

## Trying It Out

1. 打包此 Maven 项目 `mvn package`;
2. 部署之前更改 _manifest.yml_ 中的`host`成你自己的应用程序地址
3. 通过命令部署 `cf push -p ./target/cook-0.0.1-SNAPSHOT.jar`
4. 应用程序成功部署后可以打开链接 _http://try-cf-cookie.cfapps.io/restaurant_ 查看返回结果以校验配置正确：我们配置配置的 Spring Profile 是 **dev** 所以得到的结果是 "_Today's special is: Pickled Cactus_"。

如果在 _manifest.yml_ 中把 `env` 配置成 `SPRING_PROFILES_ACTIVE: production` 或者在 _application.yml_ 把配置改成
```
spring:
  profiles: production
```
重新部署后再此访问可以看到结果的变化:
首先就要输入用户名密码，因为 Spring Cloud Config Client starter 包含了一个 [Spring Security][spring-security] 依赖包，默认会使用 HTTP Basic authentication 来保护你的所有的应用程序 endpoints ，除非你配置成其他的安全设置。[如何配置?](http://docs.pivotal.io/spring-cloud-services/1-4/common/config-server/writing-client-applications.html#disable-http-basic-auth) 默认用户名为 **user** ，随机密码在 console 打印中有，形式如下
```
Using default security password: 78fa095d-3f4c-48b1-ad50-e24c31d5cf35
```
登录后可以看到输出结果变为了 "_Today's special is: Cake a la mode_" 。





[spring-cloud-connectors]:http://cloud.spring.io/spring-cloud-connectors/spring-cloud-connectors.html
[spring-cloud-cloud-foundry-connector]:http://cloud.spring.io/spring-cloud-connectors/spring-cloud-cloud-foundry-connector.html
[spring-cloud-services]:http://docs.pivotal.io/spring-cloud-services/1-4/common/
[ServiceInfo]:https://docs.spring.io/autorepo/docs/spring-cloud/1.1.1.RELEASE/api/org/springframework/cloud/service/ServiceInfo.html
[ConfigurableEnvironment]:https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/core/env/ConfigurableEnvironment.html
[ServiceInfoPropertySourceAdapter]:https://docs.spring.io/autorepo/docs/spring-cloud-services-connector/1.1.0.RELEASE/api/io/pivotal/spring/cloud/config/java/ServiceInfoPropertySourceAdapter.html
[PropertySource]:https://docs.spring.io/autorepo/docs/spring/4.1.6.RELEASE/javadoc-api/org/springframework/context/annotation/PropertySource.html
[HealthIndicator]:https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/health/HealthIndicator.html

[java-SPI]:https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html

[spring-security]:http://projects.spring.io/spring-security/
