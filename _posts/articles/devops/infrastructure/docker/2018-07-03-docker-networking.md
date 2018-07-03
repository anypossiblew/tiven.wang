---
layout: post
theme: UbuntuMono
title: "Docker Networking"
excerpt: "Networking in Docker"
modified: 2018-07-03T11:51:25-04:00
categories: articles
tags: [Docker]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6491.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/timbuktu-mali-6491
comments: true
share: true
references:
  - id: 1
    title: "Docker tutorials - Network containers"
    url: https://docs.docker.com/engine/tutorials/networkingcontainers
---

<style>
.blog__post.demo-blog__posts.mdl-grid .mdl-card .mdl-card__media h3 {
  color: maroon;
}
</style>

* TOC
{:toc}

Docker 为容器提供了四种网络模式 bridge, none, container 和 host 。


其中 container 模式就是提供容器间共享网络命名空间（Network Namespace）的模式。



docker0 bridge 与 Linux iptables NAT
brctl show
ip route
CIDR

iptables ipchains brctl ip
