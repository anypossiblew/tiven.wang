---
layout: post
theme: UbuntuMono
series:
  url: try-cloudfoundry
  title: Try Cloud Foundry
title: "CF CLI Plugins"
excerpt: "Cloud Foundry command line plugins"
modified: 2018-05-21T11:51:25-04:00
categories: articles
tags: [CF, AWS, Architecture, Cloud Foundry]
image:
  vendor: twitter
  feature: /media/DbepoQEW0AESJKV.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/988445154083328000
comments: true
share: true
references:
  - id: 1
    title: "CF CLI Plugins"
    url: https://plugins.cloudfoundry.org/
---

* TOC
{:toc}

查看检查你的 CF CLI 客户端上有没有 CF-Community 插件库

`cf list-plugin-repos`

如果没有，则添加

`cf add-plugin-repo CF-Community http://plugins.cloudfoundry.org/`

有了插件库就可以安装 CF 插件了，例如安装 [top](https://github.com/ECSTeam/cloudfoundry-top-plugin) 这个插件，它可以查看 Cloud Foundry 平台的实时统计数据

`cf install-plugin -r CF-Community "top"`
