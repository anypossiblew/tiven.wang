---
layout: post
title: Cloud-Native Applications
excerpt: "How to build cloud-native applications on a cloud platform."
modified: 2017-10-19T17:00:00-00:00
categories: articles
tags: [Cloud-Native, Resilience, Elastic, Cloud]
image:
  vendor: twitter
  feature: /media/DLoIbsZU8AA4XxK.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - id: 1
    title: "Cloud-Native Applications"
    url: "https://pivotal.io/cloud-native"
---

> Cloud-native is an approach to building and running applications that fully exploits the advantages of the cloud computing delivery model. Cloud-native is about how applications are created and deployed, not where. While today public cloud impacts the thinking about infrastructure investment for virtually every industry, a cloud-like delivery model isn’t exclusive to public environments. It's appropriate for both public and private clouds. Most important is the ability to offer nearly limitless computing power, on-demand, along with modern data and application services for developers. When companies build and operate applications in a cloud-native fashion, they bring new ideas to market faster and respond sooner to customer demands. [[1](#reference-1)]

* TOC
{:toc}

## Cloud-native
本文开头引用的一段话是 Pivotal 公司网站上对 Cloud-native 的介绍，我们不看这种很官方很抽象的概念。就像“卖保健品的要搞养生”一样，Pivotal 在伴随着 CloudFoundry 产品推出时提出了 Cloud-native 的概念。那么 Cloud-native 在技术层面代表着什么呐？ Pivotal 网站这么说道：
> Organizations require a platform for building and operating cloud-native applications and services that automates and integrates the concepts of DevOps, continuous delivery, microservices, and containers:
>
![](https://d1fto35gcfffzn.cloudfront.net/images/topics/cloudnative/diagram-cloud-native.png)

这里提到了四个概念：DevOps, continuous delivery, microservices, 和 containers. 这些基本上是当今应用程序编程领域最流行的概念，那么可以说 Cloud-native 是集大成者嘛。不不，不能简单地这么认为，顾名思义 Cloud-native 侧重的是 Cloud 的应用程序开发，而这四个流行概念却不是针对 Cloud 独有的。也就是说 Cloud-native 是抽取出了这些概念里的适应 Cloud 端的特性，摒弃了非 Cloud 端的属性。

**DevOps** is the collaboration between software developers and IT operations with the goal of constantly delivering high-quality software that solves customer challenges. It creates a culture and environment where building, testing and releasing software happens rapidly, frequently, and more consistently.

Continuous Delivery, enabled by **Agile** product development practices, is all about shipping small batches of software to production constantly, through automation. Continuous delivery makes the act of releasing dull and reliable, so organizations can deliver frequently, at less risk, and get feedback faster from end users.

[**Microservices**](/articles/microservices-architecture/) is an architectural approach to developing an application as a collection of small services; each service implements business capabilities, runs in its own process and communicates via HTTP APIs or messaging. Each microservice can be deployed, upgraded, scaled, and restarted independent of other services in the application, typically as part of an automated system, enabling frequent updates to live applications without impacting end customers.

**Containers** offer both efficiency and speed compared with standard virtual machines (VMs). Using operating system (OS)-level virtualization, a single OS instance is dynamically divided among one or more isolated containers, each with a unique writable file system and resource quota. The low overhead of creating and destroying containers combined with the high packing density in a single VM makes containers an ideal compute vehicle for deploying individual microservices. [[1](#reference-1)]

技术层面上来讲具体哪些特性呐？

## 12-factor principles

the [12-factor](https://12factor.net/) principles

### Codebase

> One codebase, one application

### API First

### Dependency Management

### Design Build Release and Run

### Configuration, Credentials and Code

Please refer to [Try Cloud Foundry 12 - Config Server](/articles/try-cf-12-config-server/)

### Logs

### Disposability

### Backing Services

### Environment Parity

### Administrative Processes

### Port Binding

### Stateless Processes

### Concurrency

### Telemetry

### Authentication and Authorization
