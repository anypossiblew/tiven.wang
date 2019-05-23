---
layout: post
theme: UbuntuMono
title: "SAP Gateway Foundation (SAP_GWFND)"
excerpt: "SAP Gateway Foundation (SAP_GWFND)"
modified: 2019-04-18T11:51:25-04:00
categories: articles
tags: [SAP_GWFND, ABAP, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2083.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/yellowstone-national-park-united-states-2083
comments: true
share: true
---

* TOC
{:toc}

Group
Repository
Service

Overview of The Service Builder

![](https://help.sap.com/doc/PRODUCTION/68bf513362174d54b58cddec28794093/7.51.8/en-US/loioe50da51fd1cd4ad6be2d767d5e01e8d4_LowRes.png)

## OData

开发 High-Quality OData Services 的一些 Recommendations：

[**Dos** and **Don'ts**](https://help.sap.com/viewer/68bf513362174d54b58cddec28794093/7.51.8/en-US/d5a326519eff236ee10000000a445394.html)

一些 Best Practices：

[**Dos** and **Don'ts**](https://help.sap.com/viewer/68bf513362174d54b58cddec28794093/7.51.8/en-US/c6fd2651c294256ee10000000a445394.html)

Performance Best Practices

[**Dos** and **Don'ts**](https://help.sap.com/viewer/68bf513362174d54b58cddec28794093/7.5.14/en-US/27eb9cc3f04d44fda07ff19cc261b7f9.html)

## 技术点

### Catalog Service

服务目录（Catalog Service）提供了汇总所有可用服务的数据，对应于事务 `/IWFND/MAINT_SERVICE` 所做的操作。
这里需要说明的是，它有自己的 OData service 是
* `/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/ServiceCollection`
它的 metadata
* `/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/$metadata`

### Media Links

可以用 OData Service 实现多媒体文件的访问。

### Service Life-Cycle

一个服务的生命循环

* `/IWFND/MAINT_SERVICE` Activate and Maintain Services
* `/IWBEP/REG_MODEL` Maintain Model
* `/IWBEP/REG_SERVICE` Maintain Service

### Processing Mode

由于 SAP Gateway 可以把接收 HTTP 请求的 HTTP handler 与具体逻辑实现的 backend runtime 分开部署，所以 SAP Gateway 其实还做了两者之间的桥接功能。分开部署与部署同一台服务器的模式相比势必会降低数据传输效率，所以 SAP Gateway 提供了一个选项处理模式（Processing Mode）来让用户选择。

![](/images/abap/gateway/Co-Deployment.png)

* Routing-based **基于路由** 这种模式可以让请求分发到不同的后台处理器，但效率会低一些
* Co-deployed only **仅联合部署** 这种模式是部署在同一服务器上，所以效率会高

## Deep Insert