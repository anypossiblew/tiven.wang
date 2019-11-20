---
layout: post
theme: UbuntuMono
series:
  url: sap-bw
  title: SAP Business Warehouse
title: "What's SAP BW"
excerpt: ""
modified: 2019-06-13T11:51:25-04:00
categories: articles
tags: [BW, CDS, HANA]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5620.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/barcelona-spain-5620
comments: true
share: true
---

* TOC
{:toc}

## 基本概念

### What is DSO

A DSO is a two dimensional storage unit which mainly stores consolidated and cleansed transaction data or master data on a lowest granularity. DSO stands for Data Store Object.

* It is a two dimensional Transparent Table.
* Data is stored at detailed level.
* With DSO, it is also possible to overwrite data fields.
* Detailed level reporting can be obtained from a DSO.

### Types of DSO

DSOs can be classified into the following types:

* Standard DSO
* Direct Update DSO
* Write-Optimized DSO

## Standard DSO

A standard DSO has three transparent tables on the database.

* **Activation Queue**: Holds the records that are to be updated, not yet been activated.
* **Active Data**: Table which holds active data.
* **Change Log**: Holds the change history for delta loads.

### Creation Of Standard DSO

#### Step 1.

Go to transaction code **RSA1**

https://blogs.sap.com/2018/01/07/bw-dso-in-native-hana-datawarehouse-with-cds-and-flowgraph/

https://blogs.sap.com/2018/05/03/steps-to-create-corporate-memory-adso-in-bw4-hana/

## BW/4 HANA解决方案的亮点

将传统的虚拟提供者全部切换到Composite Provider和Open ODS View，其中Open ODS View主要基于HANA视图提供数据，Composite Provider通过组合其他虚拟对象对外提供数据。而传统的Cube、DSO等则全部转换为Advanced Data Store Object –ADSO。信息对象的概念得以保留。
