---
layout: post
theme: UbuntuMono
title: "Microservices - Inter-process communication"
excerpt: "The kernal of Microservices Architecture is inter-process communication"
modified: 2018-04-20T11:51:25-04:00
categories: articles
tags: [Architecture, Scalability, Microservices]
image:
  vendor: twitter
  feature: /media/Dag2judVwAAjTXE.jpg:large
  credit: National Geographic
  creditlink: https://twitter.com/NatGeoPhotos/status/984096508424392708
comments: true
share: true
references:
  - id: 1
    title: "Building Microservices: Inter-Process Communication in a Microservices Architecture"
    url: https://www.nginx.com/blog/building-microservices-inter-process-communication/
---

* TOC
{:toc}


## Introduction

> In a monolithic application, components invoke one another via language‑level method or function calls. In contrast, a microservices‑based application is a distributed system running on multiple machines. Each service instance is typically a process. Consequently, as the following diagram shows, services must interact using an inter‑process communication (IPC) mechanism.


“Inter-Process Communication” 进程间通信（IPC，Inter-Process Communication），指至少两个进程或线程间传送数据或信号的一些技术或方法。

进程是计算机系统分配资源的最小单位(严格说来是线程)。每个进程都有自己的一部分独立的系统资源，彼此是隔离的。为了能使不同的进程互相访问资源并进行协调工作，才有了进程间通信。通常，使用进程间通信的两个应用可以被分为客户端和服务器（见主从式架构），客户端进程请求数据，服务端响应客户端的数据请求。有一些应用本身既是服务器又是客户端，这在分布式计算中，时常可以见到。这些进程可以运行在同一计算机上或网络连接的不同计算机上。


## Socket
## RFC
## MessageQueue
