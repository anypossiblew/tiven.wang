---
layout: post
title: Try Cloud Foundry 6 - Multi Tenancy
excerpt: "Cloud Foundry: Support Multi Tenancy using Identity Zone Management APIs of UAA"
modified: 2017-05-26T17:00:00-00:00
categories: articles
tags: [Multi Tenancy, Cloud Foundry, Pivotal]
image:
  feature: cloud/masthead-cf.jpg
comments: true
share: true
references:
  - title: "Cloud Foundry - The User Account and Authentication Service (UAA)"
    url: "https://docs.cloudfoundry.org/api/uaa/index.html"
---

> [冠斑犀鸟](https://en.wikipedia.org/wiki/Malabar_pied_hornbill)（学名：Anthracoceros coronatus）大型鸟类，体长74~78厘米。嘴具大的盔突，颜色为蜡黄色或象牙白色，盔突前面有显着的黑色斑；上体黑色，具金属绿色光泽，下体除腹为白色外，亦全为黑色，外侧尾羽具宽阔的白色末端。翅缘、飞羽先端和基部亦为白色，飞翔时极明显。喜较开阔的森林及林缘。成对或喧闹成群，振翅飞行或滑翔在树间。喜食昆虫多于果实。

* TOC
{:toc}

Try CloudFoundry Series:

1. [Pivotal Web Services](/articles/try-cf-1-pivotal-web-services/)
2. [Cloud Foundry Components Router](/articles/try-cf-2-cloud-foundry-components-router/)
3. [Cloud Foundry Components UAA](/articles/try-cf-3-cloud-foundry-components-uaa/)
4. [Cloud Foundry Custom Domain](/articles/try-cf-4-custom-domain/)
5. [UAA Single Sign On with OAuth2](/articles/try-cf-5-uaa-oauth2/)
6. [Cloud Foundry Multi Tenancy](/articles/try-cf-6-multi-tenancy/)

## Multi Tenancy

## Identity Zones

The UAA supports multi tenancy. This is referred to as identity zones. An identity zones is accessed through a unique subdomain. If the standard UAA responds to https://uaa.10.244.0.34.xip.io a zone on this UAA would be accessed through https://testzone1.uaa.10.244.0.34.xip.io





[SCIM]:http://www.simplecloud.info/
