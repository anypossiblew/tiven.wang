---
layout: post
title: Cloud-Native Applications
excerpt: "How to build cloud-native applications on a cloud platform."
modified: 2017-10-19T17:00:00-00:00
categories: articles
tags: [Cloud-Native, Cloud]
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

这里提到了四个概念：DevOps, continuous delivery, microservices, 和 containers. 这些基本上是当今应用程序编程领域最流行的概念，那么可以说 Cloud-native 是集大成者嘛。不不，不能简单地这么认为，顾名思义 Cloud-native 侧重的是 Cloud 的应用程序开发，而这四个流行概念却不是针对 Cloud 独有的。也就是说 Cloud-native 是抽取出了这些概念里的适应 Cloud 端的特性，摒弃了非 Cloud 端的属性。具体哪些特性呐？

### 12-factor principles

the [12-factor](https://12factor.net/) principles
