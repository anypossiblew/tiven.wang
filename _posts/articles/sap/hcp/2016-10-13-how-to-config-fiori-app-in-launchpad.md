---
layout: post
title: How to config Fiori App in Launchpad
excerpt: "本文介绍如何将Fiori应用配置到Launchpad上去，其中包括HANA Cloud Platform版，HANA Respository版及ABAP版"
modified: 2016-10-25T17:00:00-00:00
categories: articles
tags: [HCP, UI5, Fiori, HANA, Cloud, ABAP]
image:
  feature: /images/fiori/mashheader-fiori.png
comments: true
share: true
references:
  - title: "SAP Fiori Launchpad on Cloud"
    url: "https://help.hana.ondemand.com/cloud_portal_flp/frameset.htm"
  - title: "SAP wiki - SAP Fiori launchpad"
    url: "https://wiki.scn.sap.com/wiki/display/Fiori/SAP+Fiori+-+SAP+Fiori+launchpad"
  - title: "User Interface Add-On for SAP NetWeaver - SAP Fiori Launchpad"
    url: "http://help.sap.com/saphelp_uiaddon10/helpdata/en/f9/51b50a07ce41deb08ced62711fe8b5/content.htm"
  - title: "SAP Blogs - How To Setup the SAP Fiori Launchpad"
    url: "https://blogs.sap.com/2014/05/04/how-to-setup-the-sap-fiori-launchpad/"
  - title: "SAP Blogs - Understanding launchpad object relationship with screenshots"
    url: "https://blogs.sap.com/2014/06/16/understanding-launchpad-object-relationship-with-screenshots/"
  - title: "SAP Community - Unable to load xsappsite"
    url: "https://archive.sap.com/discussions/thread/3507049"
---

* TOC
{:toc}

接着上一篇[How to Create a Fiori app Using OData service on the HCP][3]，本篇介绍如何将创建好的Fiori应用配置到Launchpad上去，HANA部分的完整项目代码可以在[Github][2]上下载。

## Series

1. [How to develop an XS application on the SAP HANA Cloud Platform](/articles/how-to-develop-xs-application-on-hcp/)
2. [How to develop an XS Odata Service by CDS on the HCP](/articles/how-to-develop-xs-odata-by-cds-on-hcp/)
3. [How to Create a Fiori app Using OData service on the HCP](/articles/how-to-develop-ui5-app-using-odata-on-hcp/)
4. How to Config Fiori App in Fiori Launchpad
5. [How to use HTTP Destination in HANA and HANA Cloud](/articles/how-to-use-http-dest-in-hana-and-hcp/)
6. [HANA Cloud Connector](/articles/hana-cloud-connector/)
{: .entry-series}

## About SAP Fiori Launchpad

Fiori System就好比是HTML版的手机系统，Launchpad是手机主屏幕，Fiori App是手机应用程序，Intents比如是Android Activity之间的Intent，Tile是手机桌面动态图标带有应用的最新状态，Tile Group就是图标文件夹，Catalog是手机应用程序分类。只不过相对于手机是你一个人在使用，而Fiori要提供给不同角色不同权限的用户使用。

下面列出来的是Fiori Launchpad涉及到的这几个概念

* _**User**_ Users access apps in their SAP Fiori launchpad depending on the role that you assign to them.

* _**Role**_ You create roles in the SAP HANA Cloud Platform Cockpit and assign users to these roles.

* _**Catalog**_ Catalogs are collections of apps that you want to make available for a specific role (or for multiple roles).
You assign roles and apps to a catalog. Users belonging to a particular role have access to the all the apps that are assigned to the same catalog as their role.

* _**App**_ an app represents any SAPUI5 application that users can launch from their SAP Fiori launchpad.

* _**Tile**_ typically apps are represented by tiles. A user clicks a tile to launch an app.

* _**Intents**_ navigation to these apps is done via intents (including optional parameters).So the flow is as follows: When a user clicks a tile in their launchpad, the intent (including optional parameters) navigates to the app and opens it.

* _**Tile Group**_ A tile group conists of tiles representing a subset of apps that is visible to a user on their launchpad if the user is assigned to the same role as the tile group.You assign roles to a tile group so that users with this role can view the tile group in their launchpad. Users will only see those app tiles in the tile group that have been assigned to a catalog with this same role.

### Systems

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

详细过程参见[HCP官方文档][4]

## HANA

// TODO

* sap.hana.uis.db::SITE\_DESIGNER

* sap.hana.uis.db::SITE\_USER


## ABAP

### Deploy to SAPUI5 ABAP Respository

#### Setup Web IDE Connecting Remote Systems

参考[Web IDE - Connecting Remote Systems][5]

<figure class="center">
	<img src="/images/cloud/hcp/hcp-destination-configuration.jpg" alt="HCP Create Destination">
	<figcaption>HCP Create Destination</figcaption>
</figure>

#### Deploy

在Web IDE里的Project上执行 `Deploy` -> `Deploy to SAPUI5 ABAP Respository`， 选择System并填写配置applicaiton name，package及request number，完成即可。

参考[Web IDE - Deploying Applications to the SAPUI5 ABAP Repository][6]

### Create Tiles in FLP

参考[SAP Blogs - How To Setup the SAP Fiori Launchpad][7]

在ABAP系统打开此链接*/sap/bc/ui5_ui5/sap/arsrvc_upb_admn/main.html*维护Catalog Groups等，创建Tile和Target Mappings。

<figure class="center">
	<img src="/images/fiori/flp-create-target-mapping.jpg" alt="Create Target Mapping in FLP">
	<figcaption>Create Target Mapping in FLP</figcaption>
</figure>

### Create Role and Semantic Object

参考[SAP Blogs - Understanding launchpad object relationship with screenshots][8]

配置Semantic Object并创建Role配置就可。

### 效果

Fiori Launchpad在ABAP系统中的链接*/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html*

## Next Steps

* [How to use HTTP Destination in HANA and HANA Cloud][9]

[1]:https://account.hanatrial.ondemand.com/cockpit
[2]:https://github.com/anypossiblew/hcp-digital-account/tree/fiori-flp
[3]:/articles/how-to-develop-ui5-app-using-odata-on-hcp/
[4]:https://help.hana.ondemand.com/cloud_portal_flp/frameset.htm
[5]:https://help.hana.ondemand.com/webide/frameset.htm?5c3debce758a470e8342161457fd6f70.html
[6]:https://help.hana.ondemand.com/webide/frameset.htm?1170ef65b7b3490687021c3132387829.html
[7]:https://blogs.sap.com/2014/05/04/how-to-setup-the-sap-fiori-launchpad/
[8]:https://blogs.sap.com/2014/06/16/understanding-launchpad-object-relationship-with-screenshots/
[9]:/articles/how-to-use-http-dest-in-hana-and-hcp/
