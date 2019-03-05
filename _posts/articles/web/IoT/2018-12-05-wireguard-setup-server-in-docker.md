---
layout: post
theme: UbuntuMono
title: "SetUp WireGuard server using Docker"
excerpt: "How to setup WireGuard server using Docker?"
modified: 2018-12-05T11:51:25-04:00
categories: articles
tags: [WireGuard, Docker, VPN]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2378.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/gairdner-australia-2378
comments: true
share: true
references:
  - id: 1
    title: "Iptables详解"
    url: "https://blog.csdn.net/reyleon/article/details/12976341"
  - id: 2
    title: "iptables详解及一些常用规则"
    url: "https://www.jianshu.com/p/ee4ee15d3658 http://seanlook.com/2014/02/23/iptables-understand/ http://www.zsythink.net/archives/1199"
---

* TOC
{:toc}

[WireGuard][wireguard]

This only works if you have your kernel headers installed in /usr/src and your kernel allows kernel modules (CONFIG_MODULES=y).

If you are like me and set CONFIG_MODULES=n then you can use my kernel-builder Dockerfile to build a custom kernel.

```
$ docker run --rm -it \
    -v /usr/src:/usr/src \
    -v /lib/modules:/lib/modules \
    -v /boot:/boot \
    --name kernel-builder \
    r.j3ss.co/kernel-builder
```

https://nbsoftsolutions.com/blog/routing-select-docker-containers-through-wireguard-vpn

https://blog.jessfraz.com/post/installing-and-using-wireguard/


docker run ubuntu:18.04


[挖掘WireGuard的潜在功能及实际应用](https://www.cnblogs.com/hannuo/p/10204738.html)


[wireguard]:https://www.wireguard.com/