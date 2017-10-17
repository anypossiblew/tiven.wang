---
layout: post
title: Try Cloud Foundry 11 - Autoscaler
excerpt: "Autoscaler"
modified: 2017-09-05T17:00:00-00:00
categories: articles
tags: [Autoscaler, Cloud Foundry]
image:
  vendor: twitter
  feature: /media/DMCGHYyXkAI5vDb.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "Scaling an Application Using App Autoscaler"
    url: "https://docs.run.pivotal.io/appsman-services/autoscaler/using-autoscaler.html"
---

* TOC
{:toc}

Pivotal Web Services (PWS) 的 Marketplace 里的 App Autoscaler 是用来根据设定的规则自动伸缩应用程序的一项服务。

## Set up App Autoscaler
在 PWS 界面里创建或者使用 CLI 创建。

`cf cs app-autoscaler standard try-cf-autoscaler`
