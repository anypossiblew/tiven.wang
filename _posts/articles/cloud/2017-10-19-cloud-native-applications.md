---
layout: post
title: Cloud-Native Applications
excerpt: "How to build cloud-native applications on a cloud platform."
modified: 2017-10-19T17:00:00-00:00
categories: articles
tags: [Cloud-Native, Resilience, Elastic, Cloud]
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
  - title: "The Twelve-Factor App"
    url: "https://12factor.net/zh_cn/"
---

> Cloud-native is an approach to building and running applications that fully exploits the advantages of the cloud computing delivery model. Cloud-native is about how applications are created and deployed, not where. While today public cloud impacts the thinking about infrastructure investment for virtually every industry, a cloud-like delivery model isn’t exclusive to public environments. It's appropriate for both public and private clouds. Most important is the ability to offer nearly limitless computing power, on-demand, along with modern data and application services for developers. When companies build and operate applications in a cloud-native fashion, they bring new ideas to market faster and respond sooner to customer demands. [[1](#reference-1)]

* TOC
{:toc}

## Cloud-native
本文开头引用的一段话是 Pivotal 公司网站上对 Cloud-native 的介绍，我们不看这种很官方很抽象的概念。就像“卖保健品的要搞养生”一样，Pivotal 在伴随着 CloudFoundry 产品推出时提出了 Cloud-native 的概念。那么 Cloud-native 在技术层面代表着什么呐？ Pivotal 网站这么说道：
> Organizations require a platform for building and operating cloud-native applications and services that automates and integrates the concepts of DevOps, continuous delivery, microservices, and containers:

![Image: Cloud Native diagram](https://d1fto35gcfffzn.cloudfront.net/images/topics/cloudnative/diagram-cloud-native.png)
{: .center.middle}

这里提到了四个概念：DevOps, continuous delivery, microservices, 和 containers. 这些基本上是当今应用程序编程领域最流行的概念，那么可以说 Cloud-native 是集大成者嘛。不不，不能简单地这么认为，顾名思义 Cloud-native 侧重的是 Cloud 的应用程序开发，而这四个流行概念却不是针对 Cloud 独有的。也就是说 Cloud-native 是抽取出了这些概念里的适应 Cloud 端的特性，摒弃了非 Cloud 端的属性。

**DevOps** is the collaboration between software developers and IT operations with the goal of constantly delivering high-quality software that solves customer challenges. It creates a culture and environment where building, testing and releasing software happens rapidly, frequently, and more consistently.

Continuous Delivery, enabled by **Agile** product development practices, is all about shipping small batches of software to production constantly, through automation. Continuous delivery makes the act of releasing dull and reliable, so organizations can deliver frequently, at less risk, and get feedback faster from end users.

[**Microservices**](/articles/microservices-architecture/) is an architectural approach to developing an application as a collection of small services; each service implements business capabilities, runs in its own process and communicates via HTTP APIs or messaging. Each microservice can be deployed, upgraded, scaled, and restarted independent of other services in the application, typically as part of an automated system, enabling frequent updates to live applications without impacting end customers.

**Containers** offer both efficiency and speed compared with standard virtual machines (VMs). Using operating system (OS)-level virtualization, a single OS instance is dynamically divided among one or more isolated containers, each with a unique writable file system and resource quota. The low overhead of creating and destroying containers combined with the high packing density in a single VM makes containers an ideal compute vehicle for deploying individual microservices. [[1](#reference-1)]

技术层面上来讲具体哪些特性呐？

## Cloud Native Principles

the [12-factor](https://12factor.net/) principles

黄金法则:

__Decompose__ => __Isolation__ => __Loose Coupling__ => __Scalability__ => __High Availability__

### Codebase

> One codebase, one application

### API First

### Dependency Management

### Design Build Release and Run

### Configuration, Credentials and Code
通常应用程序的配置包括数据库连接、后端服务、第三方服务认证信息、每份部署的特定配置如域名等。初级阶段是把这些配置尽量写在程序代码常量里，但这并不符合我们的原则。检验配置是否完全从代码中剥离出来的一种方式是 __你的代码是否可以开源__。很显然如果代码里还有你特有的配置，那么它并不适合开源出来。

另外一种方式是使用配置文件，但这仍然不是最好的方式，配置文件很容易以不同的方式分散在项目代码的不同地方，难以统一管理。而且仍然是和代码一块放在repository里。

[The Twelve-Factor App][12-factor-config] __把配置存储在环境变量里__。在以往的应用程序开发中用环境变量存储配置并不是一种普遍的方式，为什么在云原生应用中又被推出来呐？云原生应用火起来的一个重要因素是 __容器化__(Containerization)，容器化可以使云不依赖任何一种开发语言和任何一种操作系统地创建和销毁（即伸缩 Scale）容器（指操作系统容器，一般是 Linux 系统）。容器化使得我们将原来关注应用服务器（包括Tomcat，WebLogic，JBoss等）的管理转变到关注操作系统容器的管理上来了，那么相应的原来我们想法设法在应用服务器上找到配置的最好管理方式也就变成了在操作系统容器上管理配置了，显然环境变量（env vars ， env）是操作系统级别最简单最直接的方式。

在原生云应用实际开发中，容器的环境变量只是传递配置给应用的方式，不同部署的不同配置还需要一种集中管理的方式。这里当然少不了 Spring 的努力

> [Spring Cloud Config][spring-cloud-config] provides server and client-side support for externalized configuration in a distributed system. With the Config Server you have a central place to manage external properties for applications across all environments.
{: .Quotes}

Spring Cloud Config Server 可以配置 git Repository 作为其配置库，这样方便了项目中使用持续交付(CD Continuous Delivery)工具链进行多环境的自动部署任务，这样就能更好地支持另外一个因素[环境平等(Environment Parity)](#environment-parity)。

关于 [Spring Cloud Config][spring-cloud-config] 在 [Pivotal Cloud Foundry][pivotal-cf] (PCF) 和 Java 语言中的具体应用请参考另外一篇 [Try Cloud Foundry](/series/try-cloudfoundry/) 之 [Config Server](/articles/try-cf-12-config-server/) 。

由于现代社会对个人隐私和商业机密的高度重视， Credentials 和一般的 Configuration 安全级别完全不同，所以在 Kevin Hoffman 的《 Beyond the Twelve-Factor App 》里指出

> 把 Configuration，Credentials 和 Code 看作不稳定物质，放在一块就会爆炸。
{: .Quotes}

一般云平台都会有一个单独的安全级别更高的服务来存储 Credentials 以区别一般的 Configuration 。

### Logs

日志（ Logs ）应该被当作事件流（ event streams ），就是从一个应用程序发出的按时间排序的事件序列。在传统基于服务器的环境中日志通常被以某种文本格式写入硬盘文件，或者其他的存储方式。作为一个真正 Cloud-Native 的应用程序处理日志的关键原则是 “__你不要管这些破事__”。

云应用程序不能保证会被运行在同一文件系统上，实际上对于云应用来说文件系统只是短暂的（ ephemeral ），云应用随时都可能被销毁或者又被创建。一个 Cloud-Native 的应用会把日志写入 **stdout** 和 **stderr** ，然后聚合，处理和存储日志交由云平台或者云平台提供的后端服务（ [backing services](#backing-services) ）来负责。有很多优秀的工具可以帮助你收集和分析日志，例如 ELK stack (ElasticSearch, Logstash, and Kibana), Splunk, Sumologic 等。

这符合 Cloud-Native 对程序员的原则

> __“溺爱”__ ：“一切跟代码无关事情都不需要你来做”。
{: .Tips}

还有一个云应用不应该控制日志管理的重要原因是，**为了弹性伸缩(elastic scalability)** 。对于云应用这是一项很重要的指标。假如你有固定数量的服务器和固定数量的应用实例，那么应用程序管理日志还可以接受。当云应用会动态地从1个实例增加到100个时，再由应用程序管理日志显然是不合理的，必须把这些不确定数量的实例的日志收集到一个统一的日志管理系统里，并进行详细地高级地分析。

关于如何在 CloudFoundry 平台上配置日志管理服务请参见 [Try Cloud Foundry 13 - Logs](/articles/try-cf-13-logs/)

### Disposability

[易处理](https://12factor.net/zh_cn/disposability)(Disposability) 是说原生云应用的进程可以迅速地开启或停止。在这个时代云应用讲究的就是 **快** 字，只有快速启动和优雅终止才能有利于更快地弹性伸缩应用，迅速部署变化的代码或配置，和稳健的部署应用。

在传统的企业应用开发中使用的应用程序容器或者大型 web 服务器通常要花很长时间（以分钟计）启动，例如运行 Java 语言应用程序的 Weblogic，Jboss。而 Tomcat 只是开发人员用来本地测试的小工具或者入门学习的，但在云原生应用最受欢迎的 Spring Boot 程序中它已经作为默认嵌入的 servlet 容器了。除此之外还有像 Jetty， Undertow 等小型 servlet 容器在云原生应用中发挥更积极的作用。

你肯定会问 “原来功能齐全大型企业级应用服务器为什么能被小而简单的 servlet 容器所替代，很多功能都不需要了吗？”。 这就是我所说的云原生应用平台接管了几乎所有的应用服务器的功能，包括 Load Balancer，Clustering，Routing，Logging，Monitoring 等，可以说云原生应用平台部分可称为云版本的应用程序服务器。我们说接管了几乎所有的并不是所有的，因为云原生应用平台不仅是适用 Java 语言环境，他是一个通用的平台并不限定于某种运行语言的某种容器。那么这就引出了支持云原生应用做到易处理的另外一项更重要的技术 __容器化__([Containerization][an-overview-of-containerization]).

传统的企业应用开发和运行过程中需要花费大量的工作量在服务器硬件和操作系统级别的管理和运维上面。__容器化__([Containerization][an-overview-of-containerization])做到了在操作系统级别的虚拟化，它是对硬件和原始操作系统的抽象化，使得应用程序面对的是统一的标准化的容器，这大大降低了应用程序开发的复杂度。而标准化正是自动化的前提，有了标准化的容器云原生平台自动化处理应用程序起来就非常得意。容器化技术本身的快速启动和销毁也正是云原生应用易处理的前提。主流容器化技术有 [Docker](https://www.docker.com/), [LXC](https://linuxcontainers.org/) 还有 CloudFoundry 内置的 [Garden](https://github.com/cloudfoundry/garden) 等。

至于在程序开发中如何优化编程以做到快速启动和停止，可以参见另外一篇文章[Try Cloud Foundry -  ](#)。

### Backing Services

后端服务（[backing services][backing-services]）是指你的应用程序所依赖其功能的任何服务。这是一种太广泛的定义，在实际应用中通常是指程序运行所需要的通过 __网络调用__ 的各种服务，如数据库（MySQL，CouchDB），消息/队列系统（RabbitMQ，Beanstalkd），SMTP 邮件发送服务（Postfix），以及缓存系统（Memcached）等。这里需要强调的是网络调用，而不是应用程序进程内的调用或者操作系统内进程之间的调用。在传统的企业应用程序开发中，程序通常需要存储读取一些临时或永久文件在本地硬盘或者其他存储介质内，例如临时存储待处理的图片、声音或者视频文件在本地文件系统，或者输出程序日志到本地日志文件等。但在云原生环境中，文件系统是会随程序的容器（Container）转瞬即逝的，所以程序必须通过网络的方式把数据存储在永久的外部服务里。

![Image: An application relying on backing services](https://d3ansictanv2wj.cloudfront.net/btfa_0801-aee4431df0e362d2b1e9eba0a3077133.png)
{: .center.middle}

云原生应用的原则声明 __“把后端服务(backing services)当作附加资源”__。附加资源（attached resource）或者绑定资源（bound resource）仅仅是应用程序连接后端服务的一种途径，它就像一个 interface 。当你在创建了后端服务实例并绑定给应用程序时，就相当于把 impelemented object 分配给了这个 interface 。所以我们说云原生平台的这种方式与编程语言中的控制反转（[Inversion of Control][Inversion_of_control]）和依赖注入（[Dependency Injection][Dependency_injection]）有异曲同工之妙，它的好处自然不必赘述。这就好比传统的 Java EE 应用开发中用 [JNDI][JNDI] 为应用绑定 DataSource 一样，所以我们说云原生平台接替了企业应用服务容器的管理功能。

应用的后端服务与微服务（[Microservices][Microservices]）概念中服务并没有本质区别，都是绑定给应用的附加资源。只不过后端服务是功能相对通用的服务，而应用程序的微服务是业务范围内其他业务逻辑的服务，一般只能在业务范围内被共用。所以调用后端服务和调用微服务一样都存在连锁故障（[cascading failure][Cascading_failure]）的问题，解决的办法同样是使用断路器（[Circuit breakers][Circuit_breaker]）模式。关于断路器的详细介绍请参见我的另一系列文章 [Microservices](/series/microservices/) 之 [Circuit Breaker](/articles/microservices-circuit-breaker/) 。

至于在具体某云平台如何绑定后端服务请参见我的 [CloudFoundry 系列](/series/try-cloudfoundry/)文章里的 [Pivotal Web Services](/articles/try-cf-1-pivotal-web-services/) 和 [Spring Cloud Connector](/articles/try-cf-8-spring-cloud-connector/) 。

另外关于微服务里的服务注册与发现的实际应用请参见 [Microservices](/series/microservices/) 之 [Service Discovery](/articles/microservices-service-discovery/) 。

### Environment Parity

### Administrative Processes

### Port Binding

### Stateless Processes

### Concurrency

### Telemetry

### Authentication and Authorization

http://presos.dsyer.com/decks/spring-cloud-dev-experience.html

http://blog.didispace.com/12factor-zh-cn/

[12-factor]:https://12factor.net/
[12-factor-config]:https://12factor.net/config
[spring-cloud-config]:http://cloud.spring.io/spring-cloud-config/single/spring-cloud-config.html
[pivotal-cf]:https://network.pivotal.io/products/pivotal-cf
[backing-services]:https://12factor.net/zh_cn/backing-services
[Inversion_of_control]:https://en.wikipedia.org/wiki/Inversion_of_control
[Dependency_injection]:https://en.wikipedia.org/wiki/Dependency_injection
[Microservices]:/articles/microservices-architecture/
[Cascading_failure]:https://en.wikipedia.org/wiki/Cascading_failure
[Circuit_breaker]:https://en.wikipedia.org/wiki/Circuit_breaker
[JNDI]:https://en.wikipedia.org/wiki/Java_Naming_and_Directory_Interface
[an-overview-of-containerization]:https://www.digitalocean.com/community/tutorials/the-docker-ecosystem-an-overview-of-containerization
