---
layout: post
theme: UbuntuMono
star: true
series:
  url: analytics
  title: Analytics
title: Use Hierarchy CDS Views in Analytics
excerpt: "Analytics"
modified: 2020-01-04T12:00:00-00:00
categories: articles
tags: [CDS, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6055.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/durgun-mongolia-6055
comments: true
share: true
references:
  - title: "SAP Blog - Hierarchies in CDS views"
    url: "https://blogs.sap.com/2016/11/25/hierarchies-in-cds-views/"
  - title: "CDS Hierarchies: Example I"
    url: "https://wiki.scn.sap.com/wiki/display/BI/CDS+Hierarchies%3A+Example+I"
  - title: "SAP Blog - How to build a Custom Hierarchy in ABAP CDS views"
    url: "https://blogs.sap.com/2017/02/22/how-to-build-a-custom-hierarchy-in-abap-cds-views/"
---

* TOC
{:toc}

https://wiki.scn.sap.com/wiki/display/BI/Using+Hierarchy+in+CDS

https://wiki.scn.sap.com/wiki/display/BI/OT-OLAP-HIER%3A+Characteristic+Hierarchies


The main purpose of a hierarchy in analytics is to aggregate facts and provide a high-level overview with the option to drill into the lower hierarchy branches and nodes.
**Facts** are represented as CDS analytical views, which are identified by the analytical data category `CUBE` provided as CDS view annotation.

A hierarchy is usually not defined on the facts themselves but on some **master data column** that categorizes the facts. This master data entity, or any business entity that should be arranged in a hierarchy, is given by a CDS view of analytical data category **DIMENSION**.

In general, a separate hierarchy view is needed, identified by data category **HIERARCHY**. Its rows represent the nodes of the hierarchy. The hierarchical relation of these nodes can be specified in two ways:

* By two sets of columns, one identifying a node as *child*, often the **key** columns of the node, and the other one identifying the related *parent node*
* By a **self-association** of the view with `cardinality [1 : 0..1]` pointing to the parent node of the node

**Root** nodes are those nodes which have no parent.

The **hierarchy directory** is represented by a CDS view of data category DIMENSION.

the **hierarchy node view** and the **hierarchy directory** 的区别？

The connection between the hierarchy node view and the hierarchy directory is modeled with an association between these two views, where the on-condition must include all key elements of the hierarchy view.

## In S4HANA

In S4/HANA all set definitions are now stored in new HRRP* tables. The SAP VDM views assume the hierarchy data (GL Accounts, Cost Centers, Profit Centers, etc.) is stored in the new HRRP* tables.

SAP provides a program to replicate the FI Financial Statement Version hierarchies and the FI-SL based sets (SETHEADER, SETLEAF, etc.) to the new HRRP* tables.

There are two programs to do this:

* First you have to specify with hierarchies (“sets”) you want to replicate to the HRRP tables. To do so, use tcode HRY_REPRELEV.
* Next, you have to to the actual replication of the set data. To do so, use tcode HRRP_REP.
These tcodes are also included in IMG: *Financial Accounting (New) -> Financial Accounting Global Settings (New) -> Tools -> Set Report Relevancy for Hierarchies (and Replicate Runtime Hierarchies).*

There is also a Fiori app/tile to perform the replication.

ABAP CDS [Hierarchy Annotations](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.5.9/en-US/23473e6a8b1c4da2b0ba5be4f319a16c.html) 可以告诉 Analytic manager 引擎哪个字段是 Hierarchy 结构的主数据，并且引擎根据 Hierarchy Association 去逐级分析。但目前看这种功能仅限于 Analytic manager 引擎可以使用，但对于 OData Service 来说我们要另辟蹊径了。

## For Fiori

hierarchy 结构的数据如果要查询树状结构的结果肯定要递归调用 hierarchy 结构的节点，这步工作要嘛在后台处理如  Analytic manager 引擎，要嘛在前端处理。如果在前端处理，递归地调用 OData Service 的方式并不是很合适，那么只能返回全量的数据然后在前端转成树状结构。那么下面我们来看一下如何实现 Hierarchy 结构的全量数据。

* 最简单的情形是业务数据全部都在叶子节点上，那么只需要对所有节点进行汇总数据，前端只需要拿到这些汇总数据和一个 hierarchy 结构的节点数据就可以方便地计算出树状的汇总数据。即使有在不是叶子节点上的实体数据也可以通过前端累计得到树状结果。
* 但是如果有些指标是乘除类型的如比例比率之类的，那么要在前端计算就需要把这种计算的配置信息配置给前端，那么我们就需要找到一种比较好的配置方式如 Typescript decorator ?
* 也可以在后端计算，因为 OData Service 的 SADL 框架暂时应该是不支持 `@Hierarchy` 注解的树状结构数据的计算，所以我们也不打算自己写一套解析代码（除非你想）。那么我们可以通过中间路线，把树状结构与业务数据的全量对应关系映射表计算好存起来为临时表，那么这样计算的业务数据就不仅仅是发生在叶子节点上的了，还会发生在所有其父及祖先节点上。这样我们只需要按树状结构的所有节点汇总查询就可以了，然后在前端只需要转成树状结构不需要再次计算了。

## Hierarchy 在哪些场景中的应用

* Value Help
* Tree Table
* Tree Map
* Tree Graph
* Sunburst
* Sankey
