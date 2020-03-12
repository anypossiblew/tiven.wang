---
layout: post
theme: UbuntuMono
star: true
series:
  url: abap-cds
  title: ABAP CDS
title: VDM Annotations
excerpt: "The Virtual Data Model in SAP S/4HANA and VDM Annotations for ABAP CDS"
modified: 2020-03-08T12:00:00-00:00
categories: articles
tags: [VDM, CDS, HANA, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/13929.jpg
  credit: Google Earth
  creditlink: https://www.gstatic.com/prettyearth/assets/full/13929.jpg
comments: true
share: true
references:
  - title: "SAP Blog - Predefined Virtual Data Model as example for understanding difference of CDS View type"
    url: "https://blogs.sap.com/2018/10/18/predefined-virtual-data-model-as-example/"
---

* TOC
{:toc}

Virtual Data Model (VDM) 实际上只是从业务含义上对 CDS View 一种划分方法, 主要目的是使开发者或者用户能从业务层面对 Data Model (CDS Views) 有比较直观的理解, 名称上的一致性, 复杂模型的相通性, 避免冗余和重复开发. 在 S/4HANA 系统里 CDS Views 是直接暴露给业务用户的, 他们可以用 CDS Views 直接规划生成自己的报表, 方便了业务专家们灵活使用 S/4HANA 系统里的各种数据模型.

VDM 以层次结构来划分 CDS Views, 如下图所示

![ABAP CDS VDM Layers](/images/abap/cds/VDM-Layers.png)
{: .middle.center}

## Basic Interface Views

`@VDM.viewType: #BASIC`

*Basic interface views* 是直接对接数据库透明表的, 也只能用它来对接数据库表. Basic interface views 用来封装 ABAP Tables 的技术差异性比如表名字段名的非可理解英文问题, 字段类型等, 封装成为可以从业务方面理解的技术名词. 还可以把多张分散的数据表合成一张视图.

Basic interface views 对 ABAP 数据表的业务含义转换不仅仅体现在字段名上面, 还有 ABAP DDIC 的数据元素, CDS 可以通过 `cast` 函数将字段转成相应的数据元素类型, 并在整个基于此 view 的视图结构中可用, 确保了字段含义和描述在整个系统保持一致性.

此外还可以为字段添加语义注解 `@Semantics` 更丰富了 VDM Basic interface views 的业务意义.

Basic interface views 可以认为是从业务含义上替代数据库表的, 所以它应该是在整个 VDM 中没有冗余的. 如果一个数据库表里包含了不同语义的数据实体, 也可以用不同的 Basic interface views 来表示. 如同一个表里有 *sales order* 和 *sales contract* 那么可以分别定义 `I_SalesOrder` 和 `I_SalesContract` 来表示.

Interface Views 之间存在的关系可以用 Associations 和相关的 Annotations 来表示, 如下图

![VDM Views Relations](/images/abap/cds/VDM-Views-Relations.png)
{: .middle.center}

## Composite Interface Views

`@VDM.viewType: #COMPOSITE`

*Composite interface views* 是由 basic interface views 和/或 其他的 composite interface views 构建而成. 一个典型的 composite interface view 是 analytic cube view. 另外一种 cds transactional views (由 `@VDM.viewType: #TRANSCTIONAL` 标识) 其实是属于一种 composite interface views.

Composite interface views 和 Basic interface views 在命名上都是以 `I_` 为前缀的. 下图演示了不同 interface views 之间的关联关系,
横向的代表关联关系, 纵向的代表选择关系

![VDM Interface Views](/images/abap/cds/VDM-Interface-Views.png)
{: .middle.center}

## Consumption Views

`@VDM.viewType: #CONSUMPTION`

Consumption Views 是构建在 basic 和 composite interface views 之上的视图, 是在最顶层的视图, 通常以 `C_` 为前缀。 Consumption Views 可用在 analytic queries, transactional comsumption view 和 SAP Fiori apps 所用的 OData services.

一般会为每个 App 或者应用场景创建一个 Consumption View, 而相对地使用同一个 Composite view.

另外在最顶层还有一种视图叫 Remote API views, 是专门用来作为远程 API （OData service 或者 web services）所用的视图模型, 它通常有特有的权限控制和字段配置. Remote API views 以 `A_` 为前缀.

下图所示, Consumption views 和 Remote API views 与其他视图的关系

![VDM Consumption views](/images/abap/cds/VDM-Consumption-Views.png)
{: .middle.center}

## Other Types of VDM Views

其他的 VDM 视图类型还有 Private view 是以 `P_` 为前缀, 主要是做一些辅助性的非公开的计算. 还有 Extension include views 以 `E_` 主要是 SAP 公司为了客户扩展其标准产品而定义的扩展点.
