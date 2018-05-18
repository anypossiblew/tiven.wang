---
layout: post
theme: UbuntuMono
title: "Try Cloud Foundry - BOSH: CF Basics"
excerpt: "CF Basics with BOSH Lite v2 on AWS"
modified: 2018-05-19T11:51:25-04:00
categories: articles
tags: [BOSH, AWS, Architecture, CloudFoundry]
image:
  vendor: twitter
  feature: /media/DbepoQEW0AESJKV.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/988445154083328000
comments: true
share: true
references:
  - id: 1
    title: "CF Basics"
    url: http://operator-workshop.cloudfoundry.org/labs/cf-basics/
---

* TOC
{:toc}

上一篇 [Try Cloud Foundry - BOSH: Deploying Cloud Foundry](/articles/try-cf-bosh-deploy-cf/) 我们已经安装好了 Cloud Foundry 系统。接下来本篇将介绍 Cloud Foundry 的基础操作和管理。

## Install Cloud Foundry CLI

## Login
这里要登录的 API 地址 `$SYSTEM_DOMAIN` 是上一篇我们部署 Cloud Foundry 时指定的域名 `18.188.115.138.sslip.io`

`cf login -a https://api.$SYSTEM_DOMAIN --skip-ssl-validation`

用户名为 `admin`，密码也在上一篇中。

创建组织和空间，添加用户，开发部署程序...
