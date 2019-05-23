---
layout: post
theme: UbuntuMono
title: Microservices - API Gateway
excerpt: "Implement an API gateway that is the single entry point for all clients. The API gateway handles requests in one of two ways. Some requests are simply proxied/routed to the appropriate service. It handles other requests by fanning out to multiple services."
modified: 2017-09-22T11:51:25-04:00
categories: articles
tags: [Scalability, Microservices]
image:
  vendor: unsplash
  feature: /photo-1456086272160-b28b0645b729?dpr=1.5&auto=format&fit=crop&w=1500&h=844&q=80&cs=tinysrgb&crop=
  credit: russn_fckr
  creditlink: https://unsplash.com/@russn_fckr
comments: true
share: true
references:
  - title: "Embracing the Differences : Inside the Netflix API Redesign"
    url: "https://medium.com/netflix-techblog/embracing-the-differences-inside-the-netflix-api-redesign-15fd8b3dc49d"
  - title: "Optimizing the Netflix API"
    url: "https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19"
---

* TOC
{:toc}

## Context

* [Pattern: API Gateway / Backends for Frontends](https://microservices.io/patterns/apigateway.html)
* [Building Microservices: Using an API Gateway](https://www.nginx.com/blog/building-microservices-using-an-api-gateway/)
* [Netflix Zuul][zuul]

![](https://cdn.wp.nginx.com/wp-content/uploads/2016/04/Richardson-microservices-part2-3_api-gateway.png)

## How API Gateway can perform services composition

Typically, you need to write code that handles each incoming request by invoking the various backend services and combining the results.

The API Gateway needs to be implemented using a scalable server technology that has a 'scripting language', e.g. NodeJS, NGINX, Java NIO based server such as Vertx, ...

Ideally the API gateway should invoke the backend services concurrently. But you want to avoid callback hell. Here is an presentation that I gave on this topic: https://www.slideshare.net/chris.e.richardson/futures-and-rx-observables-powerful-abstractions-for-consuming-web-services-asynchronously-springone-s2gx

[zuul]:https://github.com/Netflix/zuul
