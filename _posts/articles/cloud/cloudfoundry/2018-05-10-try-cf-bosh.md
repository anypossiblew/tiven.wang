---
layout: post
theme: UbuntuMono
title: "Try Cloud Foundry - BOSH"
excerpt: ""
modified: 2018-05-10T11:51:25-04:00
categories: articles
tags: [Architecture, Cloud Foundry]
image:
  vendor: twitter
  feature: /media/DcxFO1EX4AIpyci.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/994245741240639488
comments: true
share: true
references:
  - id: 1
    title: "Pivotal Cloud Foundry vs Kubernetes: Choosing The Right Cloud-Native Application Deployment Platform"
    url: https://blog.takipi.com/pivotal-cloud-foundry-vs-kubernetes-choosing-the-right-cloud-native-application-deployment-platform/
  - id: 2
    title: "Ultimate Guide to BOSH"
    url: https://ultimateguidetobosh.com/
---

* TOC
{:toc}

## BOSH
BOSH is PCF’s infrastructure management component.

BOSH is an open source tool for release engineering, deployment, lifecycle management, and monitoring of distributed systems.

![Image: Cloud Foundry BOSH CF Architecture](/images/cloud/cf/cloudfoundry-bosh-cloudfoundry-architecture.png "Cloud Foundry BOSH CF Architecture")
{: .middle.center}

BOSH 被设计成可以部署到不同 IaaS 的，在部署 BOSH 或者 BOSH 部署 Cloud Foundry / Others 时都需要在 IaaS 上创建虚拟机 VM ，但不同的 IaaS 需要的 VM Image 格式不同，所以 BOSH 使用 [Stemcell][bosh-stemcell] 进行封装 VM Image 以做到统一规范。
不同的服务组件不同的版本又需要自己的配置文件、运行脚本、源代码等用来构建部署软件的东西，统一规范为叫做一个 [release][bosh-release]。release 是 Stemcell 之上的一层。

![Image: Pivotal Cloud Foundry architecture](https://384uqqh5pka2ma24ild282mv-wpengine.netdna-ssl.com/wp-content/uploads/2017/12/pcf-commercialization-1.png "Pivotal Cloud Foundry architecture")
{: .center}


https://github.com/cloudfoundry-incubator/docker-boshrelease

## vs. Kubernetes
Kubernetes is a mature container orchestrator that runs in the same market as Docker Swarm and Apache Mesos.

## Cloud Foundry Container Runtime (CFCR)




[bosh-release]:https://bosh.io/docs/release/
[bosh-stemcell]:https://bosh.io/docs/stemcell/
