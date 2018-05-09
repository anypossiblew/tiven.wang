---
layout: post
theme: UbuntuMono
title: "Microservices - Inter-Process Communication"
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

打个比方，把一台电脑看做一个人，他会做不同的工作（process）。原来我们要提高其处理工作的速度，便是增加他的大脑能力(cpu)和肢体动作(others)的速度，但随着此人大脑的扩大，再提升其大脑能力的话成本（各种脑白金补补补）会大幅增加。万一他再生个病倒下了，也不是一时半会能治好的。怎么办呐，不要把风险都压在一个人身上，那就把工作分给不同的人（电脑，实际上是OS，假如一台电脑只做一件工作，则实际上就是 process）去做，也就是多个人（process）要共同完成一项任务。现代社会最不缺的就是人（廉价的电脑）（但却人才），人手不够就多买或租几个人，一个人倒下可以马上换另一个人顶上去，这就解决了之前一个人工作的问题。那么现在最大的问题就是如何让这么多人之前进行有效的沟通，需要建立一个高效的沟通机制（通信协议），对于电脑来说就是进程间的通信 Inter-Process Communication 。

接下来我们就讨论怎么进行有效的沟通。首先我们来划分一下人与人之间的交互方式。
一个维度是划分为一对一、一对多的方式：

* One‑to‑one  – Each client request is processed by exactly one service instance.
* One‑to‑many – Each request is processed by multiple service instances.

另一个维度是同步(我问问题你要回答)或异步(我问问题你可以不回答，稍后再告诉我答案)：

* Synchronous  – The client expects a timely response from the service and might even block while it waits.
* Asynchronous – The client doesn’t block while waiting for a response, and the response, if any, isn’t necessarily sent immediately.

每个人都可以选择一种组合的交互方式。

## IPC Technologies
让我们来看一下两台计算机系统（物理的或虚拟的）之间具体有哪些通信技术。如果两个服务之间需要使用同步(synchronous) request/response 的沟通机制的话，可以选择基于 HTTP 的 [REST][restfulapi] 或者 [Thrift][thrift]。另外，如果服务之间想要使用异步的 (asynchronous) 基于消息的沟通机制，可以选择 [AMQP][amqp] 或者 [STOMP][stomp]。



## Socket
## RFC
## MessageQueue


[restfulapi]:https://restfulapi.net/
[thrift]:https://thrift.apache.org/
[amqp]:https://www.amqp.org/
[stomp]:https://stomp.github.io/
