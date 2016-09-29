---
layout: post
title: HANA New Features to support Microservices
excerpt: "作为传统老牌企业管理软件供应商SAP在新技术应用方面总是慢一步。面对日益增长的企业数据量和业务系统复杂度，SAP受到了来自竞争对手的压力意欲改变自己传统的应用系统架构。HANA作为SAP未来一段时间下一代系统的基石，也在不断改变和完善自身功能，以适应新兴的系统设计模式和架构理念，其中一项即是对Microservices设计思想的支持。本篇将介绍SAP HANA增加了哪些支持Microservices的开发功能，并不涉及太多Microservices和SOA的理论。"
modified: 2016-07-30T12:47:25-04:00
categories: articles
tags: [HANA, SOA, Microservices, Node.js, XSA, HDI, OLAP]
image:
  feature: hana/masthead-microservices.jpg
comments: true
share: true
references:
  - title: "Microservice architecture"
    url: "http://microservices.io/"
  - title: "Wikipedia - Microservices"
    url: "https://en.wikipedia.org/wiki/Microservices"
  - title: "infoq - 微服务与SOA"
    url: "http://www.infoq.com/cn/news/2014/06/microservices-soa/"
  - title: "Pdf - Reference Model for Service Oriented Architecture 1.0"
    url: "https://www.oasis-open.org/committees/download.php/19679/soa-rm-cs.pdf"
  - title: "Book - O'Reilly &lt;&lt;Building Microservies&gt;&gt;"
  - title: "Book - Addison-Wesley &lt;&lt;The Art of Scalability&gt;&gt;"
  - title: "Architecture Cubed"
    url: "https://www.benefitfocus.com/blogs/design-engineering/architecture-cubed"
  - title: "SAP HANA XS Advanced, Creating an HDI Module"
    url: "http://go.sap.com/developer/tutorials/xsa-hdi-module.html"
  - title: "SAP HANA SPS 11: New Developer Features"
    url: "http://scn.sap.com/community/developer-center/hana/blog/2015/12/08/sap-hana-sps-11-new-developer-features"
        
---

过去的几年来，“微服务”这个术语逐渐得到关注，它描述的是由一系列更小的服务所组成的架构，在众多互联网公司得到广泛应用。作为传统老牌企业管理软件供应商SAP在新技术应用方面总是慢一步。面对日益增长的企业数据量和业务系统复杂度，SAP受到了来自竞争对手的压力意欲改变自己传统的应用系统架构。HANA作为SAP未来一段时间下一代系统的基石，也在不断改变和完善自身功能，以适应新兴的系统设计模式和架构理念，其中一项即是对Microservices设计思想的支持。本篇将介绍SAP HANA增加了哪些支持Microservices的开发功能，并不涉及太多Microservices和SOA的理论(关于这些知识读者可以参考References中的链接)。

## 背景
SAP HANA诞生于分析“海量数据”的需求，起初是作为高效分析应用的内存数据库来使用。SAP为了给传统企业和新兴行业提供灵活轻量级的开发平台，创造了基于HANA内存数据库的HANA开发平台。相较于Netweaver平台，HANA平台提供了更流行的开发技术，更轻量的开发框架，更灵活的开发模式。

### HANA Architecture
SAP HANA开发平台在HANA内存数据库之上增加了应用层开发能力，但应用层仍然像Netweaver平台一样是基于一个大的运行时容器，所有的开发内容都放在同一容器，虽然有分不同的程序包或者应用组件。

如下图：

- Index Server是数据库核心功能；
- XS是应用层容器，可以开发XSJS逻辑、ODATA服务、UI5应用程序等，整个XS容器是运行在一个计算机进程里。
![HANA Architecture Main](/images/hana/sap-hana-architecture-main.png)

### Scalability
关于应用的可扩展性，可以分为三个维度：

* X维度通过克隆整个应用得到多个拷贝用负载均衡来提高处理能力。
* Y维度通过切分应用的不同功能到多个小的应用去，来提高应用扩展能力。
* Z维度通过划分数据集到不同的服务器来提高应用处理能力。

![HANA Architecture Main](/images/hana/sap-hana-architecture-scalability.png)

如下图所示，SAP HANA开发平台提供X维度扩展能力，通过创建多个HANA实例来做负载均衡。

![HANA Architecture Main](/images/hana/sap-hana-architecture-distributed.png)

### HANA New Architecture
为了在Y维度提供更强大的扩展能力，SAP HANA平台（SPS11起）增加了很多功能对microservices开发模式进行支持。

* 应用层和数据库层的分离 - 以便应用服务可以部署在不同的服务器上。
* HDI概念 - 支持数据库schema的独立。
* XSA支持为不同应用运行不同的multiple languages/runtimes - 如Apache TomEE Java和Google V8 JavaScript/Node.js等。

![HANA Architecture Main](/images/hana/sap-hana-architecture-xsa.png)

## HANA New Features
从HANA SPS 11版本起，新增了很多功能来支持microservices的开发，老的开发功能依然存在。

* XS引擎改成XS Advanced，但老的XS引擎仍然作为XSA的一部分存在（XS Classic）。
* XSA的代码版本管理迁移到了Git/GitHub上，原有的HANA Repository功能仍存在。
* 新增HDI(HANA Deployment Infrastructure)，提供独立的声明式的可持续部署的数据库对象管理容器。
* Node.js开发能力。

详情请参考SAP SCN系列文章:<a target="_blank" href="{{ page.references[8].url }}">{{ page.references[8].title }}</a>

### XSA
//TODO

### HDI
//TODO

### Nodejs
//TODO

## 如何发挥HANA高效分析能力
//TODO

## 总结

&lt;&lt;未完&gt;&gt;
