---
layout: post
title: Try Cloud Foundry 10 - Service Discovery
excerpt: "Service Registry for Pivotal Cloud Foundry (PCF) provides your applications with an implementation of the Service Discovery pattern, one of the key tenets of a microservice-based architecture. Trying to hand-configure each client of a service or adopt some form of access convention can be difficult and prove to be brittle in production. Instead, your applications can use the Service Registry to dynamically discover and call registered services."
modified: 2017-08-08T17:00:00-00:00
categories: articles
tags: [Service Discovery, Microservices, Cloud Foundry]
image:
  vendor: unsplash
  feature: /photo-1427434991195-f42379e2139d?dpr=1.5&auto=format&fit=crop&w=1500&h=844&q=80&cs=tinysrgb&crop=
  credit: Vladimir Kudinov
  creditlink: https://unsplash.com/@madbyte
comments: true
share: true
references:
  - title: "Pattern: Client-side service discovery"
    url: "http://microservices.io/patterns/client-side-discovery.html"
  - title: "Spring Cloud Services - Service Registry for Pivotal Cloud Foundry"
    url: "http://docs.pivotal.io/spring-cloud-services/1-4/common/service-registry/index.html"
  - title: "Spring Cloud Services - Spring Cloud® Services"
    url: "http://docs.pivotal.io/spring-cloud-services/1-4/common/index.html"

---

* TOC
{:toc}

> 下載本篇完整代碼 [Github](https://github.com/tiven-wang/try-cf/tree/service-discovery-cf)
{: .Notes}

## Create Service Registry

`cf marketplace -s p-service-registry`

Create a service registry service:

`cf create-service p-service-registry standard service-registry`

Show created service:

```
$ cf service service-registry

Service instance: service-registry
Service: p-service-registry
Bound apps: try-cf-service-registry
Tags:
Plan: standard
Description: Service Registry for Spring Cloud Applications
Documentation url: http://docs.pivotal.io/spring-cloud-services/
Dashboard: https://spring-cloud-service-broker.cfapps.io/dashboard/p-service-registry/377790cc-d543-4a45-8982-66b34c1e8adf

Last Operation
Status: create succeeded
Message:
Started: 2017-08-08T09:42:02Z
Updated: 2017-08-08T09:45:19Z
```

## Rebuild the Applications

To work with Spring Cloud Services service instances, your client applicaiton must include the `spring-cloud-services-dependencies` and `spring-cloud-dependencies` BOMs. Unless you are using the `spring-boot-starter-parent` or `spring-cloud-starter-parent` or Spring Boot Gradle plugin, you must also specify the `spring-boot-dependencies` BOM as a dependency.

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
        <groupId>io.pivotal.spring.cloud</groupId>
        <artifactId>spring-cloud-services-dependencies</artifactId>
        <version>1.3.1.RELEASE</version>
        <type>pom</type>
        <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

Change the spring cloud eureka dependency to

```xml
<dependency>
  <groupId>io.pivotal.spring.cloud</groupId>
  <artifactId>spring-cloud-services-starter-service-registry</artifactId>
</dependency>
```

### Spring Cloud Connectors

To connect client applications to the Service Registry, Spring Cloud Services uses [Spring Cloud Connectors](http://cloud.spring.io/spring-cloud-connectors/spring-cloud-connectors.html), including the [Spring Cloud Cloud Foundry Connector](http://cloud.spring.io/spring-cloud-connectors/spring-cloud-cloud-foundry-connector.html), which discovers services bound to applications running in Cloud Foundry.

### Register a Service

Change the `@EnableEurekaClient` to `@EnableDiscoveryClient`

```java
@SpringBootApplication
@EnableDiscoveryClient
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

The application’s Eureka instance name (the name by which it will be registered in Eureka) will be derived from the value of the `spring.application.name` property on the application.
If you do not provide a value for this property, the application’s Eureka instance name will be derived from its Cloud Foundry application name, as set in `manifest.yml`:

```yaml
---
instances: 1
memory: 1G
applications:
  - name: hero-service
  ...
```

Set the spring.application.name property in application.yml:

```yaml
spring:
  application:
    name: hero-service
```

#### Eureka Instance Auto Configuration

Application use class [EurekaInstanceAutoConfiguration][EurekaInstanceAutoConfiguration] to configure a Eureka instance's settings based on the value of `spring.cloud.services.registrationMethod`.

* **route** will register `vcap.application.uris[0]`
* **direct** will register using the container *IP* address and *PORT* environment variable.

The default behaviour is **route**.

If you want change the default value, you may set the `spring.cloud.services.registrationMethod` to `direct`, please refer to [Using Container-to-Container Networking](#using-container-to-container-networking):

```yaml
spring:
  cloud:
    services:
      registrationMethod: direct
```

#### Disable HTTP Basic Authentication

The Spring Cloud Services Starter for Service Registry has a dependency on [Spring Security][Spring-Security]. Unless your application has other security configuration, this will cause all application endpoints to be protected by HTTP Basic authentication.

If you do not yet want to address application security, you may turn off Basic authentication by setting the `security.basic.enabled` property to `false`. In `application.yml` or `bootstrap.yml`.

You might make this setting specific to a profile (such as the `dev` profile if you want Basic authentication disabled only for development):

```yaml
---

spring:
  profiles: dev

security:
  basic:
    enabled: false
```

For more information, see ["Security" in the Spring Boot Reference Guide][boot-features-security].

### Testing

http://police-service-dative-urnfield.cfapps.io/Gotham-City/villains/xman

```json
{
    "name": "xman",
    "id": 1,
    "catched": true
}
```

## Using Container-to-Container Networking

To use Cloud Foundry’s container networking to reach an application registered with the Service Registry, you must add a network policy. You can do this using the [Networking cf CLI plugin](https://github.com/cloudfoundry-incubator/cf-networking-release/).

### Install Networking cf CLI plugin

Ensure you have a recent version of the CF CLI `cf version`, Should show version 6.28 or higher. If not, update your CF CLI.

Install the plugin from the [Cloud Foundry Community Plugins Repository](https://plugins.cloudfoundry.org/):

`cf install-plugin -r CF-Community network-policy`

### Setting List Access

Run the `cf list-access` command to list current network policies:

```
$ cf list-access
Listing policies as anypossible.w@gmail.com...
OK

Source  Destination     Protocol        Port
```

Use the `cf allow-access` command to grant access from the Villain application to the Police application:

```
$ cf allow-access villain-service police-service --protocol tcp --port 8080
Allowing traffic from villain-service to police-service as anypossible.w@gmail.com...
OK
```

Use `cf list-access` again to view the new access policy:

The Villain application can now use container networking to access the Police application via the Service Registry. For more information about configuring container networking, see the [Administering Container-to-Container Networking](https://docs.pivotal.io/pivotalcf/devguide/deploy-apps/cf-networking.html) topic in the Pivotal Cloud Foundry documentation.

## Self-Signed SSL Certificate

// TODO

[EurekaInstanceAutoConfiguration]:https://github.com/pivotal-cf/spring-cloud-services-connector/blob/master/spring-cloud-services-spring-connector/src/main/java/io/pivotal/spring/cloud/service/eureka/EurekaInstanceAutoConfiguration.java
[Spring-Security]:http://projects.spring.io/spring-security/
[boot-features-security]:http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-security
