---
layout: post
title: Microservices - Architecture
excerpt: "Microservice architecture (MSA) is an approach to building software systems that decomposes business domain models into smaller, consistent, bounded-contexts implemented by services. These services are isolated and autonomous yet communicate to provide some piece of business functionality. Microservices are typically implemented and operated by small teams with enough autonomy that each team and service can change its internal implementation details (including replacing it outright!) with minimal impact across the rest of the system."
modified: 2017-09-06T11:51:25-04:00
categories: articles
tags: [Microservices]
image:
  vendor: instagram
  feature: /t51.2885-15/e35/21371957_343797492726746_672750594775056384_n.jpg
  credit: natgeoyourshot
  creditlink: https://www.instagram.com/natgeoyourshot/
comments: true
share: true
references:
  - title: "O’Reilly &lt;&lt;Building Microservices&gt;&gt; Designing Fine-Grained Systems"
    url: "http://shop.oreilly.com/product/0636920033158.do"
    id: 1
  - title: "O’Reilly &lt;&lt;Microservice Architecture&gt;&gt; Aligning Principles, Practices, and Culture"
    url: "http://shop.oreilly.com/product/0636920050308.do"
    id: 2
  - title: "O’Reilly &lt;&lt;Reactive Microservices Architecture&gt;&gt; Design Principles for Distributed Systems"
    url: "http://www.oreilly.com/programming/free/reactive-microservices-architecture-orm.csp"
    id: 3
  - title: "O’Reilly - Free Programming Ebooks"
    url: "http://www.oreilly.com/programming/free/?cmp=li-business-free-info-onboarding_li_freereport_programming_ac"
    id: 4

---

* TOC
{:toc}

## Introduction

一个企业要想在现在这个快速发展的时代站住脚，那他必须能对市场变化做出及时有效的反应，改变自己，否则将被更敏捷的公司迅速取代。

> In the new world, it is not the big fish which eats the small fish, it’s the fast fish which eats the slow fish.<br>
—Klaus Schwab

那么就现在的企业系统，如何做到对市场变化迅速敏捷的反应呐？ 微服务架构是这样一个简单的原则：它倡导通过创建一群这样的服务：

* **小的** Small
* **隔离的** Isolation
  * **拥有属于自己的数据**
  * **无依赖地隔离**
* **可伸缩的** Scalable
* **可快速恢复的** Resilient to failure

来构建系统。

**小而隔离** 具有很重要的意义<a href="#reference-1">\[1\]</a>，意味着它可以被一个小型的团队负责，更好地实施敏捷开发方法，意味着它更适应CI/CD，意味着它可以选择适合自己的技术栈。

**可伸缩** 这一特性已经是现代系统的标准，可伸缩才能是系统对负载做出及时响应，才能使企业按需付费，避免了资产的闲置浪费。

**可快速恢复** 是走向高可用性（[High availability][High_availability]）的另一通道，单纯地以提高单个硬件系统和软件系统的高可用性来达到整个系统的高可用性的代价是很大的。而通过提高小而独立的可伸缩的服务的从失败中快速恢复性，来达到整个系统的高可用性是很实用很快捷的方法。

所以本系列文章将介绍通过哪些技术栈可以达到微服务的以上特性。

### Monolith

现在大多数企业构建复杂并且稳定的系统都会用到的一项标准的技术平台就是 Java Enterprise Edition (Java EE). 传统上 Java EE 是把 Web Application Archives (WARs) 和 Java Archives (JARs) 绑定打包成 Enterprise Archive (EAR) 进行部署的。Java EE 为企业提供了成熟稳定的开发模式，使得企业很容易构建好的设计的大型应用系统，正应了那句

> Develop once, run everywhere!

凡事都具有两面性，一方面 Java EE 提供了标准的模式，另一方面它也你很少去重新思考应用系统的架构。

![Image: Classical Java EE architecture](/images/cloud/microservices/Classical Java EE architecture.png)
{: .center.middle}
<style>.center img{border: 1px solid lightgrey;}</style>

不可否认，在软件架构领域我们从来都没停止过思考，来寻找更好的思路。例如运行多台应用程序实例，然后通过负载均衡器分发请求给它们，以增加程序的处理能力。这样就需要一些交叉关注点，例如 Single Sign-On (SSO), Logging, Monitoring, Databases 等中心化企业级的基础设施。一切看起来还是太耦合，一个小小的改动都需要从头到尾的小心翼翼的测试，发布一个新的程序版本可能需要几个月甚至一两年。同时部署配置文件、服务器配置文件还有第三方组件的配置参数等大量的配置需要小心谨慎。

### SOA

方法始终不是一瞬间产生的，在微服务之前我们已经在做了，把应用程序系统划分成不同的应用程序服务然后在通过统一协议的API连接起来，以做到松耦合的效果，这就是 [Service Oriented Architecture (SOA)][SOA]. 虽然 SOA 的基础思想也是 解耦(decoupling), 隔离(isolation), 组合(composition), 集成(integration), 分离(discrete), 自治的服务(autonomous service), 但它并没有深入地走下去，反而纠结于一些技术争论（例如，对[ESB][ESB]来说 `WS-*`和`REST`哪一个更好？）。

> Although the word “SOA” is dead, the requirement for service-oriented architecture is stronger than ever.
>
> But perhaps that’s the challenge: The acronym got in the way. People forgot what SOA stands for. They were too wrapped up in silly technology debates (e.g., “what’s the best ESB?” or “WS-* vs. REST”), and they missed the important stuff: architecture and services.
>
> Successful SOA (i.e., application re-architecture) requires disruption to the status quo. SOA is not simply a matter of deploying new technology and building service interfaces to existing applications; it requires redesign of the application portfolio. And it requires a massive shift in the way IT operates.<br>
— [Anne Thomas Manes: SOA is Dead; Long Live Services](http://apsblog.burtongroup.com/2009/01/soa-is-dead-long-live-services.html)
{: .Quotes}

世界在快速变革，适者生存，适应新事物的新思想总会出现，微服务([Microservices][Microservices])接过了这一棒。

> It is not the strongest of the species that survive, but the one most responsive to change.<br>
— Charles Darwin

### Why Now
新事物新思想总是会出现，为什么是现在呐？ 总有一些量变的因素存在：

* **Idea** 划分出隔离的、松耦合的服务的想法并不是什么新的概念，SOA 时代就已经大肆宣传，但限于当时网络速度慢，硬盘内存价格昂贵，组织结构庞大，使得面向服务的架构很难发挥重要作用
* **Hardware** 这个时代有更快的网络速度，更廉价更快的硬盘，更便宜的内存，更多更便宜的CPU内核
* **Software** 丰富的云架构 Cloud architectures (IaaS, PaaS, SaaS and CloudFoundry, Kubernetes ...), 成熟的容器化VM Containers (Linux Containers LXC, Docker and Unikernels ...)

特别是 Cloud computing, Mobile devices 和 Internet of Things 的快速发展对 Microservices 提供了更多需求。

关于 Cloud Architecture 可以参考系列 [Try Cloud Foundry](/series/try-cloudfoundry/)

### Reactive
新的挑战总是会唤醒新的思考，思考可以从不同的角度，不同的思路可以是相辅相成的相互补充的。基于反应式的原则([reactive principles][Reactive_programming])构建应用系统是另一个新的思路，也并不是什么新的方法，很早之前的 Actor Model 和 Erlang 都是基于此原则，只不过现在环境下它发挥了更重要的作用。

> Today applications are deployed on everything from mobile devices to cloud-based clusters running thousands of multi-core processors. Users expect millisecond response times and 100% uptime. Data is measured in Petabytes. Today's demands are simply not met by yesterday’s software architectures.
>
> We believe that a coherent approach to systems architecture is needed, and we believe that all necessary aspects are already recognised individually: we want systems that are Responsive, Resilient, Elastic and Message Driven. We call these Reactive Systems.
>
> — [The Reactive Manifesto](http://www.reactivemanifesto.org/)
{: .Quotes}

Reactive 原则与 Microservices 理论的结合在当今 Cloud 环境下开发会发挥更积极更重要的效果。

更多关于 Reactive 编程的讨论可以参考系列[Reactive Design Patterns](/series/reactive-design-patterns).

### Who

就目前情况来看，什么样的应用系统适合微服务架构呐？有什么好的principles和practices

要想走在微服务的道路上，两个要点要牢记在心：去中心化(Decentralization)和自治 (autonomy)。

你肯定已经看到不少同事已经在学习和使用 [Docker][docker], [continuous delivery][continuous-delivery] 或者 [service discovery][service-discovery] 等这些工具或者开发模式，其实这些工作的结果就是在构建微服务系统。但微服务不是仅使用某些工具或者开发模式开发过程所能达到的，你应该专注于它的目标本身：构建更容易改变的系统。

## Microservice Systems Design
微服务讲要建立小而隔离(Isolated)自治(Autonomous)的服务，那么问题是多小算小服务，怎么样才算隔离或者说自治？

多小算小，如果说一个微服务多少行代码才算小, 这样回答并不好. 这个问题应该说一个微服务到底应该有合适大小的责任,适合你团队大小的才算最好. 专业做好一件事.

> Do one thing and do it well.  — Doug McIlroy

所以接下来我们提供一些方式方法以供参考。

![microservice system design model](/images/cloud/microservices/microservice system design model.png "microservice system design model")
{: .center}

### Service Design

微服务架构核心原则之一就是：分而治之 ([Divide and Conquer](https://en.wikipedia.org/wiki/Divide_and_rule)), 即把系统分解成通过明确定义的协议通讯的不相关的隔离的子系统。

隔离(Isolation)是一切的前提：弹性(Elasticity) 伸缩性(Scalability) 回复性(Resilience) 可用性(Availability)等。有了隔离才能更好的利用持续集成(Continuous Integration)和持续交付(Continuous Delivery).

如果做到服务的隔离，需要从多个方面考虑

* Share-Nothing
* Autonomous
* Responsibility
* State
* Bounded Context

#### Share-Nothing

// TODO

[Divide and conquer algorithm](https://en.wikipedia.org/wiki/Divide_and_conquer_algorithm)

microservices applications share some important characteristics:
* Small in size
* Messaging enabled
* Bounded by contexts
* Autonomously developed
* Independently deployable
* Decentralized
* Built and released with automated processes

### Services Communication

#### Restful API

// TODO

#### Asynchronous Messaging-Passing

// TODO

### Service Discovery

### Service Deployment

### Service Testing

### Service Monitoring

#### Circuit Breakers

### Service Security

JSON Web Token

[Secure a Spring Boot REST API With JSON Web Token + Reference to Angular Integration](https://medium.com/@nydiarra/secure-a-spring-boot-rest-api-with-json-web-token-reference-to-angular-integration-e57a25806c50)

## Conclusion

微服务让我们像组织团队一样地组织我们的应用系统，划分组织成员的职责，可以保证他们的工作自由。微服务使得系统开发被由大型核心团队负责划分到更小更能理解他们负责的软件的团队。
DevOps Agile CI/CD

[Microservices]:https://en.wikipedia.org/wiki/Microservices
[High_availability]:https://en.wikipedia.org/wiki/High_availability
[SOA]:https://en.wikipedia.org/wiki/Service-oriented_architecture
[ESB]:https://en.wikipedia.org/wiki/Enterprise_service_bus
[Reactive_programming]:https://en.wikipedia.org/wiki/Reactive_programming
[docker]:https://www.docker.com/
[continuous-delivery]:https://www.thoughtworks.com/continuous-delivery
[service-discovery]:http://microservices.io/patterns/client-side-discovery.html
