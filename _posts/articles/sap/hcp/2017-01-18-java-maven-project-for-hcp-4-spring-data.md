---
layout: post
title: Apply Spring Data JPA to Java Project on HCP
excerpt: "Spring Data’s mission is to provide a familiar and consistent, Spring-based programming model for data access while still retaining the special traits of the underlying data store. Spring Data JPA, part of the larger Spring Data family, makes it easy to easily implement JPA based repositories. This module deals with enhanced support for JPA based data access layers. It makes it easier to build Spring-powered applications that use data access technologies."
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [Spring, Maven, Java, HCP, HANA]
image:
  feature: /images/cloud/masthead-incubators.jpg
comments: true
share: true
---

* TOC
{:toc}

> The project codes for this article can be downloaded from [Github][github-project].

[Spring][spring.io] helps development teams everywhere build simple, portable, fast and flexible JVM-based systems and applications.
Spring has a lot of projects for whatever the infrastructure needs of your application may be, from configuration to security, web apps to big data, there is a Spring Project to help you build it. Start small and use just what you need.

We used Spring projects:

* [**Spring Data JPA**][spring-data.jpa.reference]: The goal of Spring Data repository abstraction is to significantly reduce the amount of boilerplate code required to implement data access layers for various persistence stores.
* [**Spring Data Rest**][spring-data.rest.reference]: Spring Data REST builds on top of Spring Data repositories and automatically exports those as REST resources. It leverages hypermedia to allow clients to find functionality exposed by the repositories and integrates these resources into related hypermedia based functionality automatically.
* [**Spring Data RestDocs**][spring-data.restdocs.reference]: The aim of Spring REST Docs is to help you to produce documentation for your RESTful services that is accurate and readable.

## Spring Data JPA

### Add Dependencies

```xml
<dependency>
  <groupId>org.springframework.data</groupId>
  <artifactId>spring-data-jpa</artifactId>
  <version>1.9.4.RELEASE</version>
</dependency>
```

### Spring Configuration
The configuration set up Spring to create proxy instances for those interfaces:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xmlns:jpa="http://www.springframework.org/schema/data/jpa"
   xsi:schemaLocation="http://www.springframework.org/schema/beans
     http://www.springframework.org/schema/beans/spring-beans.xsd
     http://www.springframework.org/schema/data/jpa
     http://www.springframework.org/schema/data/jpa/spring-jpa.xsd">
  ...
  <jpa:repositories base-package="com.sap.c4c.wechat.repository"/>
  ...
</beans>
```

### Declare Repository

```java
package com.sap.c4c.wechat.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import com.sap.c4c.wechat.model.Message;

public interface MessageRepository extends CrudRepository<Message, Long> {
	List<Message> findByType(String type);
}
```

[github-project]:https://github.com/anypossiblew/hcp-java-wechat/tree/spring-data

[spring.io]:https://spring.io/
[spring-data.jpa.reference]:http://docs.spring.io/spring-data/jpa/docs/current/reference/html/

[spring-data.rest.reference]:http://docs.spring.io/spring-data/rest/docs/current/reference/html/
[spring-data.restdocs.reference]:http://docs.spring.io/spring-restdocs/docs/current/reference/html5/
