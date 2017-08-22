---
layout: post
title: Microservices - Service Discovery
excerpt: ""
modified: 2017-08-10T11:51:25-04:00
categories: articles
tags: [Service Discovery, Microservices]
image:
  vendor: unsplash
  feature: /photo-1500479694472-551d1fb6258d?dpr=1.5&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
  credit: Scott Walsh
  creditlink: https://unsplash.com/@outsighted
comments: true
share: true
references:
  - title: "Microservice Architecture - Pattern: Service registry"
    url: "http://microservices.io/patterns/service-registry.html"
  - title: "Microservice Architecture - Pattern: Client-side service discovery"
    url: "http://microservices.io/patterns/client-side-discovery.html"

---

* TOC
{:toc}

> 下載本文完整項目代碼 [Github](https://github.com/joshlong/service-registration-and-discovery)
{: .Tips}

*https://github.com/joshlong/service-registration-and-discovery*

## Concept

**Hero** **Villain** and **Police office**

* Villain       -> Police office "I'm here!"
* Police office -> Hero          "Move!"
* Hero          -> Villain       "Catch you!"
* Hero          -> Police office "Give him to you!"

`docker run --rm --name my-mongo -d -p 27017:27017 mongo`

Start eureka service;
Start photo service;
Start bookmark service;
Start passport service;
