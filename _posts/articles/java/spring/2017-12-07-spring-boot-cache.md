---
layout: post
title: Spring Boot - Caching
excerpt: "The Spring Framework provides support for transparently adding caching to an application. At its core, the abstraction applies caching to methods, reducing thus the number of executions based on the information available in the cache. The caching logic is applied transparently, without any interference to the invoker."
modified: 2017-12-07T17:00:00-00:00
categories: articles
tags: [Spring Boot]
image:
  vendor: nationalgeographic
  feature: /content/dam/photography/PROOF/2017/November/animals-from-above-yourshot/01-animals-from-above-prod-yourshot-230366-11044091.adapt.1190.1.jpg
  credit: Phillip Chang
  creditlink: http://yourshot.nationalgeographic.com/profile/230366/
comments: true
share: true
references:
  - id: 1
    title: "Spring Boot features - Caching"
    url: "https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-caching.html"
  - title: "Caching Data with Spring"
    url: "https://spring.io/guides/gs/caching/"
---

* TOC
{:toc}

参考文章[https://spring.io/guides/gs/caching/](https://spring.io/guides/gs/caching/)步骤运行起一个基本的 Spring Boot Cache 程序。

## Run on Docker

`mvn package`

`docker run -p 8080:8080 -v <project-root-folder>/gs-caching/complete/target:/app java:8 java -D"java.security.egd"=file:/dev/./urandom -jar /app/gs-caching-0.1.0.jar`

## With Hibernate

### Cache in Hibernate


## With Redis
