---
layout: post
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


[Netflix Zuul][zuul]


[zuul]:https://github.com/Netflix/zuul
