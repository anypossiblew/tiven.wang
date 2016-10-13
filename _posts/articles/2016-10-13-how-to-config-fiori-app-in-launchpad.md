---
layout: post
title: How to config Fiori App in Launchpad
excerpt: "本文介绍如何将Fiori应用配置到Launchpad上去，其中包括HANA Cloud Platform版，HANA Respository版及ABAP版"
modified: 2016-10-13T17:00:00-00:00
categories: articles
tags: [HCP, UI5, Fiori, HANA, Cloud, ABAP]
image:
  feature: fiori/mashheader-fiori.png
comments: true
share: true
references:

---

接着上一篇[How to Create a Fiori app Using OData service on the HCP][3]，本篇介绍如何将创建好的Fiori应用配置到Launchpad上去，HANA部分的完整项目代码可以在[Github][2]上下载。

对于Fiori Launchpad配置有三种环境

* _**HCP**_ Cloud版的Fiori Launchpad配置起来最方便快捷

* _**HANA**_ 版的Fiori Launchpad需要编写一些配置文件

* _**ABAP**_ 版则比较麻烦

## HCP

### Create Site in Portal Service

首先介绍HCP版的Fiori Launchpad配置，登录[**HCP**][1]，在**_services_**面板里启用**_Portal Service_**，
然后`Go to Service` -> `Create New Site`

<figure class="center">
	<img src="/images/cloud/hcp/portal-service-create-site.jpg" alt="Create Site">
	<figcaption>Create Site</figcaption>
</figure>

然后在**_Content Management_**页面新增你的**_Catalog_**和**_Group_**。

### Deploy Fiori to HCP

Webide中的Fiori App代码在配置到Launchpad之前需要部署到HCP。

执行步骤 `Deploy` -> `Deploy to SAP HANA Cloud Platform` 然后填写相应配置即可。

### Register to Fiori Launchpad

部署到HCP后即可执行 `Register to SAP Fiori Launchpad` ， 按步骤填写相应配置即可。

## HANA

* sap.hana.uis.db::SITE\_DESIGNER

* sap.hana.uis.db::SITE\_USER


## ABAP


&lt;&lt;未完待续&gt;&gt;


[1]:https://account.hanatrial.ondemand.com/cockpit
[2]:https://github.com/anypossiblew/hcp-digital-account/tree/fiori-flp
[3]:/articles/how-to-develop-ui5-app-using-odata-on-hcp/