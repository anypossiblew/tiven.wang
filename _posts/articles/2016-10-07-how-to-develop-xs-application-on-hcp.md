---
layout: post
title: How to develop an XS application on the SAP HANA Cloud Platform
excerpt: "SAP HANA Cloud Platform 提供了本地开发的能力，使你可以在本地创建开发XS应用程序，并运行在HANA Cloud上。"
modified: 2016-10-07T12:00:00-00:00
categories: articles
tags: [HCP, XS, CDS, HANA, Cloud, HTML5, UI5]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "Help Portal - Create a Delivery Unit"
    url: "https://help.sap.com/saphelp_hanaplatform/helpdata/en/d5/ca92aba6b4445aba17ca3f8d671217/content.htm"
---

SAP HANA Cloud Platform 提供了本地开发的能力，使你可以在本地创建开发XS应用程序，并运行在HANA Cloud上。
本文项目完整代码可以参见[Github][2]

## Prerequisites

1. 有一个[SAP HANA Cloud trial landscape][1]账号

## Procedure

### Create Database

进入到 **Databses & Schemas** 面板
![Databases and Schemas](/images/cloud/hcp/databases-and-schemas.jpg)

创建一个新的Database，Database System选择**HANA MDC(&lt;trial&gt;)**
![Create Database](/images/cloud/hcp/databases-and-schemas-create.jpg)

> 解释一下HANA MDC

创建成功后进入BD界面，显示此Database的一些重要信息
![Database Overview](/images/cloud/hcp/database-mdc-overview.jpg)

### Open Development Tools

打开链接 Development Tools: **_SAP HANA Web-based Development Workbench_** 使用创建Database设置的用户登录
里面有四个工具：

* __Editor__ : Create, edit, execute, debug and manage HANA Respository artifacts

* __Catalog__ : Create, edit, execute and manage HANA DB SQL catalog artifacts

* __Security__ : Create users, create roles, assign objects and manage security

* __Traces__ : View, download traces for HANA applications, set trace levels


> 在执行过程中可能遇到权限问题，可以打开Security为用户添加相应Roles, e.g. **_sap.hana.ide.roles::Developer_**
> 链接格式为 https://&lt;DBName&gt;&lt;AccountName&gt;.hanatrial.ondemand.com/sap/hana/ide/security/

### Create Package

打开 **_SAP HANA Web-based Development Workbench： Editor_** 工具， 可以看到根目录为Content，即HANA Respository。 

创建一个新的Package "**_digital-account_**"， 我们的项目代码就放在此package下面。

### Assign Delivery Unit (Optional)

为了方便代码传输管理，为此package分配一个delivery unit。

#### Open Application Lifecycle Management

HANA Application Lifecycle Management路径为 **_/sap/hana/xs/lm_**

> 需要权限用户角色为 **sap.hana.xs.lm.roles::Administrator** 

#### Create Delivery Unit

![Create Delivery Unit](/images/cloud/hcp/create-delivery-unit.jpg)

> 创建之前需要在 **SETTINGS** 设置 **_Vendor_**

#### Assign Delivery Unit

可以在这里分配package给Delivery Unit，也可以在Editor里Assign package to Delivery Unit。

![Assign Delivery Unit](/images/cloud/hcp/delivery-unit-assign-package.jpg)

Delivery Unit管理的详细教程可以参见[附录1][3]

### Synchronize with Github (Optional)

可能是为了向现代化的代码管理工具上靠拢，Editor里增加了与Github库同步的功能。

在需要同步的Package上右键菜单中**_Synchronize with Github_**开打Git Pane。
输入Github用户信息，确定后并设置respository和branch，然后就可以双向同步代码了。
![Synchronize with Github](/images/cloud/hcp/package-git-connection.jpg)

### Create Application

#### Set Application

#### Create Schema

#### Create Data Models

#### Create XS Odata service

### Create UI5



[1]:https://account.hanatrial.ondemand.com/cockpit
[2]:https://github.com/anypossiblew/hcp-digital-account
[3]:https://help.sap.com/saphelp_hanaplatform/helpdata/en/d5/ca92aba6b4445aba17ca3f8d671217/content.htm