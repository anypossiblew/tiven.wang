---
layout: post
theme: Josefin-Sans
title: Spring Boot 2 - Setup
excerpt: "Setup a project of Spring Boot 2 in Visual Studio Code IDE"
modified: 2018-03-28T17:00:00-00:00
categories: articles
tags: [IDE, Spring Boot, Java]
image:
  vendor: twitter
  feature: /media/DXzgdJIW0AEQH7C.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/971898413548818432
comments: true
share: true
references:
  - id: 1
    title: "Getting started with Spring boot 2.0"
    url: "https://g00glen00b.be/getting-started-spring-boot-2/"
  - id: 2
    title: "Build Java Web Apps with VS Code"
    url: "https://code.visualstudio.com/docs/java/java-tutorial"
  - id: 3
    title: "Web on Reactive Stack"
    url: "https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html"

---

* TOC
{:toc}

可以使用以下方式之一创建一个 Spring Boot 项目

* http://start.spring.io/
* [Spring Boot CLI][spring-boot-cli]
* [Spring Initializr](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-initializr) in Visual Studio Code

我们选择使用 http://start.spring.io/ 创建项目，选择了依赖 Reactive web, Reactive MongoDB, Actuator 。

参考 https://code.visualstudio.com/docs/java/java-tutorial 教程把 Spring Boot 项目在 Visual Studio Code IDE 中配置好，然后启动程序。

你会发现连接 MongoDB 的端口 `27017` 错误，所以我们使用 [Docker][Docker] 创建一个 MongoDB 数据库服务，命令如下

`docker run --name my-mongo -d -p 27017:27017 mongo`

当然你也可以选择其他方式得到 MongoDB 数据库服务，例如在本机安装 MongoDB。

## Test
可以选择基于 JUnit4 的 [Test Runner][visualstudio-test] 工具, 或者使用 Maven 命令 `mvn test`。

本篇完整代码可下载自 [Github](https://github.com/tiven-wang/spring-boot-guides/tree/2-setup)



[spring-boot-cli]:https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#cli
[Docker]:https://www.docker.com/
[visualstudio-test]:https://code.visualstudio.com/docs/languages/java#_testing
