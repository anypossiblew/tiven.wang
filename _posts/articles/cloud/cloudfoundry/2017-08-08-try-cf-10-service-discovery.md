---
layout: post
title: Try Cloud Foundry 10 - Service Discovery
excerpt: ""
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
---

* TOC
{:toc}

> 下載本篇完整代碼 [Github](https://github.com/tiven-wang/try-cf/tree/service-discovery)

`cf set-env message-generation TRUST_CERTS api.cf.wise.com`

`cf restage message-generation`

创建 Config Server for Spring Cloud Applications ：
`cf create-service p-service-registry standard service-registry`

綁定到應用程序：
`cf bind-service try-cf-service-registry service-registry`

to ensure your env variable changes take effect:
`cf restage try-cf-service-registry`
