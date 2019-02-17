---
layout: post
theme: UbuntuMono
series: 
  url: s/4hana-cloud
  title: S/4HANA Cloud
title: "Custom CDS Views"
excerpt: "Custom CDS Views in S/4HANA Cloud"
modified: 2018-11-09T11:51:25-04:00
categories: articles
tags: [S/4HANA Cloud, S/4HANA, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5666.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/sierra-county-united-states-5666
comments: true
share: true
---

* TOC
{:toc}

https://help.sap.com/doc/saphelp_nw751abap/7.51.0/en-US/1d/77c396e7fc43bc94c46947305f5f71/frameset.htm

首先你的用户账号要有权限

* Business Role ID: **SAP_BR_ADMINISTRATOR**
* Business Catalog ID: **SAP_CORE_BC_EXT**

然后打开 App

* Extensibility / Custom CDS Views

在 [Applications for General Functions for Key Users](https://help.sap.com/viewer/f544846954f24b9183eddadcc41bdc3b/1811.500/en-US/e51ed7523f0744cba10877b6667216ee.html) 页面可以查到所有 S/4HANA Cloud 通用功能的应用程序，可以看到其 Business Role ID 和 Business Catalog ID。

### 自定义 CDS Views 基本步骤

![Image: How to create custom CDS Views](/images/s4hana/extensibility/how-to-create-custom-cds-views.png)
{: .center.middle}

General
Field Selection
Field Properties
Parameters
Filters


### 基本信息
![Image: S/4HANA Cloud Custom CDS Views 1](/images/s4hana/extensibility/s4hana-cloud-custom-cds-create.png)

* 在 S/4HANA Cloud 中自定义 CDS Views 名称是以 ‘YY1_’ 开头, 在 S/4HANA (OP) 中则是以 ‘ZZ1_’ 开头
* OData checkbox

* For Analytical scenario: Dimension and Cube

### 添加主 Data Source View

我们在 Data Source 里添加 Primary Data Source 为 Interface View：**I_SalesOrderItemCube**

![Image: S/4HANA Cloud Custom CDS Views 2](/images/s4hana/extensibility/s4hana-cloud-custom-cds-add-primary-data-source.png)

### 添加关联的 Data Source View

在关联的 Data Source Views 里添加这个视图:
Interface View: I_SalesDocumentItem (Use table VBAK, VBAP, VBKD, VEDA as sources)

> Do you really want to add an access-protected data source? <br>
When associating an access-protected data source to a custom CDS view, the access protection of the associated data source will not be considered for the access protection of the custom CDS view. For further information, see SAP Note 2540696.
{: .Warning}

![Image: S/4HANA Cloud Custom CDS Views 3](/images/s4hana/extensibility/s4hana-cloud-custom-cds-add-data-source.png)

保存草稿后进入下一步选择要显示的字段们.

### 选择显示字段

然后 Publish: OData service YY1_TEST_CDS was generated.

产生的 OData 服务就可以用在 FIORI App 里调用，或者用在 Communication Scenario 里供外部系统调用。

Configure report:
* 什么是 drill down?

* C_* Consumption View: The view consumed by application (Tech name: C_*). e.g. Journal Entry Analyzer (C_GLLINEITEMSQ0001). It is created from Interface View in general.
* I_* interface view: The view as the foundation (Tech name: I_*).. The view as the general foundation for Consumption view. Interface View for business entities in S/4HANA is called Basic View, e.g. GL Account Line Item (I_GLAccountLineItem), Profit Center (I_ProfitCenter). Interface view created from Basic View is called Composite View, e.g. G/L Account Balance Cube (I_GLAcctBalanceCube).
* P_* Private View: The view used as a part to create Interface View or Consumption View (Tech name: P_*). It is not mandatory to create.
* E_* Extend View: Extend View is used to add fields to predefined VDM without changing predefined VDM itself. It is possible to associate the view and add it in the source view, and it is also possible to use the association for foreign key association on the added field. It is like APPEND for table in ABAP Dictionary. 

In BW context, Consumption View is like BW Query and Interface View is like InfoProvider or InfoObject.

https://www.youtube.com/watch?v=2_5kYnQzBO8

https://blogs.sap.com/2017/12/21/sap-s4hana-extensibility-custom-cds-views-in-sap-s4hana-cloud/

http://sapabapcentral.blogspot.com/2018/09/sample-custom-cds-view-using-predefined.html