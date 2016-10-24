---
layout: post
title: Introduction to CDS on HANA and ABAP
excerpt: "本文旨在介绍CDS的基础知识"
modified: 2016-10-21T17:00:00-00:00
categories: articles
tags: [HANA, ABAP, CDS]
image:
  feature: hana/masthead-abap-for-hana.jpg
comments: true
share: true
references:
  - title: "SAP Wiki - CDS - Core Data Services"
    url: "https://wiki.scn.sap.com/wiki/display/ABAP/CDS+-+Core+Data+Services"
  - title: "SAP Help - ABAP CDS in ABAP Dictionary"
    url: "https://help.sap.com/abapdocu_750/en/abencds.htm"
  - title: "SAP Blog - CDS – One Concept, Two Flavors"
    url: "https://blogs.sap.com/2015/07/20/cds-one-model-two-flavors/#comment-344403"
  - title: "SAP Blog - Creating Odata services out of CDS views"
    url: "https://blogs.sap.com/2015/04/20/creating-odata-services-out-of-cds-views/"
---

* TOC
{:toc}

关于SAP's Core Data Services (CDS) 我们先来看一下它的官方解释 “Core data services (CDS) is an infrastructure for defining and consuming semantically rich data models in SAP HANA.” 它诞生于SAP HANA数据库的出现，后来又被应用到ABAP Dictionary上。接下来让我们来看一下他们有什么联系和区别以及一些基础应用。

## Background 

### ABAP Dictionary

众所周知，要在ABAP应用服务器上开发程序，你需要在ABAP Dictionary中定义数据模型，例如表、视图等。ABAP Dictionary是平台独立的，也就是说它不依赖于任何一种数据库。ABAP字典对象在激活时会通过DBI (Database Interface)产生数据定义语言DDL并在数据库中生成运行时数据库对象。而ABAP Dictionary对象在ABAP服务器中是全局性的，可以被ABAP程序中的[Open SQL][7]所使用。

### HANA CDS

伴随着SAP HANA的诞生，我们可以不再使用其他应用服务器便可以在HANA上开发应用程序，因为HANA自带应用服务器程序(SAP HANA Extended Application Services)。如何在HANA中创建数据模型，我们首先想到的是[HANA View Modeling][8]包括Attribute Views,Analytic Views,Calculation Views以及.hdbtable文件类型的表定义等。对于HANA Views的可视化编辑工具来说，它自然是方便使用，但它终究还只是个工具而已，对于繁琐的代码版本管理来说它显得有些捉襟见肘。所以一种真正意义上的DDL应运而生，这就是Core Data Services。Core Data Services提供了一种基于SQL-based DDL并增加了注解([annotations][9])和关联([associations][10])等功能的规范，这种规范可以在不同的平台上实现。CDS在HANA上的实现就是HANA CDS，它可以定义数据库表、视图及数据类型。

### ABAP CDS

CDS规范在ABAP上的实现自然就需要适应ABAP服务器的功能，比如CDS所以定义的对象可以在ABAP Dictionary里查看，可以被Open SQL使用，它也可以使用ABAP Dictionary对象，源代码可以使用[ADT(ABAP Development Tools)][6]编辑等，但远不是如此而已。ABAP CDS提供了更先进的功能，如基于角色定义(DCL)的新的授权概念，还增加了注解的能力。注解不仅能定义ABAP数据字典的语义还能指定各种框架的规范说明，比如[CDS Model自动生成OData service][11](@OData)，UI5的自动适配(@UI)，Enterprise Search(@Search)等。通过添加注解达到功能地灵活扩展，CDS的强大之处就在于可以灵活地扩展注解来达到功能的扩展。

### ABAP CDS vs. HANA CDS

ABAP CDS和HANA CDS是同一种规范的不同平台实现而已。核心功能几乎相同，但不同平台实现不同功能需要不同的注解，所以两种的源代码并不能直接copy迁移。

对于开发者来说该如何选择CDS两种不同的实现，是个需要斟酌的问题。这里给出一些建议

* 如果你的HANA是独立运行的或者说并不是作为ABAP服务器的主数据库运行的，那么自然使用不了ABAP CDS，必须使用HANA CDS
* 如果你运行的是ABAP on HANA（也就是说HANA数据库作为AS ABAP的主数据库存在）	
	* 如果你想在全局环境或者Open SQL中使用CDS实体对象，或者需要一些具有ABAP关联性的注解，那么必须使用ABAP CDS
	* 如果你需要在ABAP中使用CDS实体对象，但想要像ABAP存储库对象一样地传输和升级它的话，可以使用ABAP CDS
	* 如果以上都不需要，你可以使用HANA CDS，它跟HANA有更好的集成。同时你仍然可以在ABAP中使用[Native SQL（ADBC,AMDP）访问HANA CDS][5]

有关CDS一些详细注解技术文档请参考[SAP Blog - Annotations in ABAP CDS][2]， [SAP Help - ABAP CDS - SAP Annotations][3]


## ABAP CDS Step by Step

最好的学习方式是拿一个实际的例子来一步步写代码，下面就是一个实际产品中的应用场景

### New DDL Source

在ADT中新建一个DDL Source文件**_Z\_MKT\_DIGACC_**，向导中可以选择模板生成不同的CDS基本结构

<figure class="center">
	<img src="/images/abap/new-cds-template.jpg" alt="Create CDS by Templates">
	<figcaption>Create CDS by Templates</figcaption>
</figure>

生成的Source code<br/>
`@AbapCatalog.sqlViewName: 'ZMKT_DIGACC'`定义ABAP View Name的注解<br/>
`@EndUserText.label: 'Marketing Digital Account'`定义ABAP View Description的注解


```sql
@AbapCatalog.sqlViewName: 'ZMKT_DIGACC'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Marketing Digital Account'
define view Z_Mkt_Digacc as select from cuand_da_root
association [0..*] to cuand_ce_mp_root as _MarketingPermission
    on cuand_da_root.comm_cat_key = _MarketingPermission.comm_cat_key {
    key cuand_da_root.db_key as DigitalAccount,
    cuand_da_root.comm_cat_key as CommCatKey,
    _MarketingPermission.contact_key as ContactKey,
    _MarketingPermission // Make association public
}
```

### Check Views

激活后便可以在SAP系统中查看到CDS运行时对象，ABAP中使用`SE11` View查看`ZMKT_DIGACC`。
HANA数据库在相应的Schema中查找View `ZMKT_DIGACC`。

### Generate OData Service

想要把一个View暴露成OData service尤其简单。

#### Generate Service Artifacts From a CDS View

只需要一个注解`@OData.publish: true`即可生成OData所需Class代码

```sql
@AbapCatalog.sqlViewName: 'ZMKT_DIGACC'
...
@OData.publish: true
define view Z_Mkt_Digacc as select from cuand_da_root
association [0..*] to cuand_ce_mp_root as _MarketingPermission
    on cuand_da_root.comm_cat_key = _MarketingPermission.comm_cat_key {
    ...
}
```

激活则生成以下Gateway所需部件

* The actual service artifact with the technical name **_\<CDS_VIEW\>_CDS_**. You can find it as SAP Gateway Business Suite Enablement - Service object (object type: R3TR IWSV)
* An SAP Gateway model (object type: R3TR IWMO) with the name **_\<CDS_VIEW\>_CDS_**
* An ABAP class **_CL\_\<CDS_VIEW\>_** that is used to provide model metadata to the SAP Gateway service.

#### Activate OData Service in the SAP Gateway Hub

生成的Gateway部件需要手动激活才能产生OData服务。

打开transaction **_/IWFND/MAINT_SERVICE_**，`Add Service` -> `Get Services` -> 选择Technical Service Name **_\<CDS_VIEW\>_CDS_** 我们的是 *Z_MKT_DIGACC_CDS* -> `Add Selected Services` -> `Specify the package` -> Done

结果会生成SAP Gateway: Service Group Metadata object和An SAP Gateway: Model Metadata object

#### Test the Activated OData Service

使用**_SAP Gateway Client_**或者外部Rest Client工具测试生成的OData service

查看服务的metadata信息

_/sap/opu/odata/sap/Z_MKT_DIGACC_CDS/?$format=json_

选择Z_Mkt_Digacc的头10条数据

_/sap/opu/odata/sap/Z_MKT_DIGACC_CDS/Z_Mkt_Digacc?$format=json&$top=10_

详细参考[SAP Help - Expose CDS View as an OData Service][4]



[1]:https://blogs.sap.com/2015/07/20/cds-one-model-two-flavors/#comment-344403
[2]:https://blogs.sap.com/2015/11/13/abap-news-for-release-750-annotations-in-abap-cds/
[3]:http://help.sap.com/abapdocu_750/en/index.htm?file=abencds_annotations_sap.htm
[4]:http://help.sap.com/saphelp_nw75/helpdata/en/79/cb3bf4eafd4af9b39bc6842e5be8bd/content.htm
[5]:/articles/abap-development-for-sap-hana/
[6]:https://tools.hana.ondemand.com/#abap
[7]:https://help.sap.com/saphelp_nw70/helpdata/en/fc/eb3969358411d1829f0000e829fbfe/content.htm
[8]:http://help.sap.com/hana/SAP_HANA_Modeling_Guide_for_SAP_HANA_Studio_en.pdf
[9]:https://help.sap.com/saphelp_hanaplatform/helpdata/en/82/17aac86d9748d8b034797ecc8065b6/content.htm
[10]:https://help.sap.com/saphelp_hanaplatform/helpdata/en/10/fadeb42a7a4717982de96eee0e26be/content.htm
[11]:https://help.sap.com/saphelp_nw75/helpdata/en/79/cb3bf4eafd4af9b39bc6842e5be8bd/content.htm
[12]:https://blogs.sap.com/2015/04/20/creating-odata-services-out-of-cds-views/
