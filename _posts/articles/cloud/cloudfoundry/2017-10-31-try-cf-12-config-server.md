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

创建 Config Server 实例可以通过 CF CLI ， 也可以通过CloudFoundry vendor UI。 推荐使用 CLI。

## Creating an Instance
