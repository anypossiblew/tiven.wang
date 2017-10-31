---
layout: post
title: Try Cloud Foundry 11 - Autoscaler
excerpt: "Autoscaler"
modified: 2017-09-05T17:00:00-00:00
categories: articles
tags: [Scalability, Cloud Foundry]
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

用命令行创建 AutoScaler 服务实例 `cf cs app-autoscaler standard try-cf-autoscaler`。<br>
绑定到 Application `cf bind-service try-cf-spring-boot try-cf-autoscaler`。<br>
然后重启应用程序 `cf restage try-cf-spring-boot`

## Configure Autoscaling for an App

打开 AutoScaler 实例的管理界面

![full-autoscaler.png](https://docs.run.pivotal.io/appsman-services/autoscaler/images/full-autoscaler.png)

首先 AutoScaler 可以设置最小最大实例数限制。

其次 Autoscaler Scale 应用程序是通过事件机制实现的。目前事件有两种，基于 Rule 的事件，和 Scheduled 的事件。

### Rules

基于 rule 的事件有三种指标：


| Metric	| Description |
|-------- |:----------- |
|CPU Utilization|	Average CPU percentage for all instances of the app|
|HTTP Latency|	Average Latency of applications response to HTTP requests. This does not include Gorouter processing time or other network latency. Average is calculated on the middle 99% or middle 95% of all HTTP requests.|
|HTTP Throughput|	Total HTTP Requests per second (divided by total app instances).|

当规则中指标达到设定的上下限时，会产生相应的事件，Autoscaler 根据事件增加或减少应用程序实例数量。

### Scheduled Limit Changes

可以设定时间去改变应用程序实例数的范围数值，以达到定时增加或减少应用程序实例的目的。

## Event History

Event History 是一个简单记录事件的页面。
