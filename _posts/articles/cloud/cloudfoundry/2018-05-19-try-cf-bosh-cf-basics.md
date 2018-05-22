---
layout: post
theme: UbuntuMono
title: "Try Cloud Foundry - BOSH: CF Basics"
excerpt: "CF Basics with BOSH Lite v2 on AWS"
modified: 2018-05-19T11:51:25-04:00
categories: articles
tags: [BOSH, AWS, Architecture, Cloud Foundry]
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

上一篇 [Try Cloud Foundry - BOSH: Deploying Cloud Foundry](/articles/try-cf-bosh-deploy-cf/) 我们已经在 AWS 上安装好了 Cloud Foundry 系统。接下来本篇将介绍 Cloud Foundry 的基础操作和管理。

## Install Cloud Foundry CLI
我们安装的是 Cloud Foundry 开源软件，所以他并不能像商业软件那样具有功能齐全的界面系统，所以我们只能使用 [Cloud Foundry CLI][cf-cli] 来管理和开发 CF 系统和应用了。

那么就先要 [安装 CF CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)。

## Ops
### Login
这里要登录的 API 地址 `$SYSTEM_DOMAIN` 是上一篇我们部署 Cloud Foundry 时指定的域名 `18.188.115.138.sslip.io`

`cf login -a https://api.$SYSTEM_DOMAIN --skip-ssl-validation`

用户名为 `admin`，密码也在上一篇中。

创建组织和空间，添加用户，开发部署程序...



[cf-cli]:https://docs.cloudfoundry.org/cf-cli/
