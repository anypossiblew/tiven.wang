---
layout: post
title: Introduction to CDS on HANA and ABAP Part 2 - Authorization Check
excerpt: "“Core data services (CDS) is an infrastructure for defining and consuming semantically rich data models in SAP HANA.” 相较于ABAP的authorization check，CDS Views增加了隐式的数据级别的权限定义：Data Control Language (DCL)。本文简要介绍如何使用DCL控制用户从CDS View中访问限定数据"
modified: 2016-10-24T17:00:00-00:00
categories: articles
tags: [HANA, ABAP, CDS, Role, Authorization]
image:
  feature: /images/hana/masthead-abap-for-hana.jpg
comments: true
share: true
references:
  - title: "SAP Blog - Wonder how Data Control Language (DCL) works with ABAP Core Data Services (CDS)?"
    url: "https://blogs.sap.com/2016/09/20/wonder-how-data-control-language-dcl-works-with-abap-core-data-services-cds/"
  - title: "SAP Blog - CDS View via Fiori and WD4A SALV application"
    url: "https://blogs.sap.com/2016/10/18/cds-view-via-fiori-wd4a-salv-application/"
  - title: "SAP Blog - Calling all ABAPers – how to up-skill for SoH and S/4HANA – Part 1 – Data Access using CDS"
    url: "https://blogs.sap.com/2016/10/15/calling-abapers-skill-soh-s4hana-part-1-data-access-using-cds/"
  - title: "ABAP CDS Views and Reporting Tools"
    url: "https://blogs.sap.com/2016/10/12/abap-cds-views-reporting-tools/"
  - title: "Trouble Shooting for CDS Views"
    url: "https://blogs.sap.com/2016/10/19/trouble-shooting-cds-views/"
  - title: "CDS ALV report in seconds with 7.5 SP 03"
    url: "https://blogs.sap.com/2016/10/11/cds-alv-report-seconds-7.5-sp-03/"
  - title: "Create Fiori app using CDS with BOPF- For beginners Part 1"
    url: "https://blogs.sap.com/2016/09/20/fioriui5-cds-bopf-for-beginners/"
  - title: "Create Fiori app using CDS with BOPF- For beginners Part 2"
    url: "https://blogs.sap.com/2016/09/20/fioriui5-cds-bopf-for-beginners-part-2/"
  - title: "The Semantically Rich Data Model – An ABAP based CDS Views example"
    url: "https://blogs.sap.com/2016/08/30/the-semantically-rich-data-model-an-abap-based-cds-views-example/"
  - title: "The Semantically Rich Data Model – An ABAP based CDS Views example Part 2"
    url: "https://blogs.sap.com/2016/09/07/the-semantically-rich-data-model-an-abap-based-cds-views-example-part-2/"
  - title: "The Semantically Rich Data Model – An ABAP based CDS Views example Part 3"
    url: "https://blogs.sap.com/2016/09/07/the-semantically-rich-data-model-an-abap-based-cds-views-example-part-3/"
  - title: "How to Create Custom CDS Views for SAP S/4HANA Marketing Cloud"
    url: "https://blogs.sap.com/2016/09/02/how-to-create-custom-cds-views-for-sap-s4hana-marketing-cloud/"
  - title: "Creating a Fiori OVP Application with CDS view annotations – Part 1"
    url: "https://blogs.sap.com/2016/07/05/creating-a-fiori-ovp-application-with-cds-view-annotations-part-2/"
  - title: "Creating a Fiori OVP Application with CDS view annotations – Part 2"
    url: "https://blogs.sap.com/2016/07/05/creating-a-fiori-ovp-application-with-cds-view-annotations-part-2/"
  - title: "Creating a Fiori OVP Application with CDS view annotations – Part 3"
    url: "https://blogs.sap.com/2016/07/05/creating-a-fiori-ovp-application-with-cds-view-annotations-part-3/"
  - title: "My CDS view self study tutorial – Part 9 cube view and query view"
    url: "https://blogs.sap.com/2016/05/21/my-cds-view-self-study-tutorial-part-9-cube-view-and-query-view/"
  - title: "How to create Smart Templates annotations within CDS views – part 2"
    url: "https://blogs.sap.com/2016/05/09/how-to-create-smart-templates-annotations-within-cds-views-part-2/"
  - title: "Tcode SACM(Access Control Management) to check authorization issues of CDS Views"
    url: "https://blogs.sap.com/2016/03/11/tcode-sacmaccess-control-management-to-check-authorization-issues-of-cds-views/"
  - title: "Real life examples & use cases for ABAP 740 and CDS views"
    url: "https://blogs.sap.com/2015/09/16/real-life-examples-use-cases-for-abap-740-and-cds-views/"
  - title: "ABAP News for Release 7.50 – Environment Information in ABAP CDS"
    url: "https://blogs.sap.com/2015/11/25/abap-news-for-release-750-environment-information-in-abap-cds/"
  - title: "A kill to an ABAP CDS View?"
    url: "https://blogs.sap.com/2016/02/08/a-kill-to-an-abap-cds-view/"
---

* TOC
{:toc}

## Series

1. [Introduction to CDS on HANA and ABAP part 1](/articles/cds-on-hana-and-abap/)
2. Introduction to CDS on HANA and ABAP part 2 - Authorization Check
3. [Introduction to CDS on HANA and ABAP part 3 - Unit Test](/articles/cds-on-hana-and-abap-part-3/)
{: .entry-series}

## Data Control Language (DCL)

相较于ABAP的authorization check，CDS Views增加了隐式的数据级别的权限定义：Data Control Language (DCL)。
当你使用Open SQL查询CDS View时，此View相关联的DCL权限检查会被隐式地执行。

### Data Control Fields

为了能在数据级别进行权限检查，我们需要把权限检查所使用的字段暴露在CDS View里。在上一篇创建的View基础上新增字段MarketingArea（代表Digital Account所述的营销区域）以此来控制用户的访问数据权限。

```sql
@AbapCatalog.sqlViewName: 'ZMKT_DIGACC'
...
@AccessControl.authorizationCheck: #CHECK
define view Z_Mkt_Digacc as select from cuand_da_root
association [0..*] to cuand_ce_mp_root as _MarketingPermission
    on cuand_da_root.comm_cat_key = _MarketingPermission.comm_cat_key {
  key cuand_da_root.db_key as DigitalAccount,
  ...
  cuand_da_root.mkt_area_id as MarketingArea,
  ...
}
```

`@AccessControl.authorizationCheck: #CHECK ` 定义使用Open SQL访问此View时的隐式授权检查，[详细Syntax][2]

### DCL Source

在 Core Data Services 文件夹下新建 DCL Source 文件，文件名使用与View一样的 **_Z\_Mkt\_Digacc_**

```sql
@EndUserText.label: 'Mapping role for Z_MKT_Digacc'
@MappingRole: true
define role Z_Mkt_Digacc {
  grant select on Z_Mkt_Digacc
  where ( MarketingArea ) =
  aspect pfcg_auth (  hpa_mkt_ar,
                      MKTAREA_ID,
                      HPA_OBJ = 'CUAN_DIGACC',
                      actvt = '03' );
}
```

`@MappingRole: true` 为固定值，目前已经不支持false。这里是指此role自动分配给所有用户。<br/>
`where ( MarketingArea ) ` where 条件定义，这里使用的是PFCG conditions，也可以用 literal conditions，也支持多个字段条件。<br/>
`aspect pfcg_auth` [pfcg_condition][1] 通过授权对象限制字段值

### Create Role using PFCG

创建一个新的Role，然后添加授权对象 hpa_mkt_ar 给这个Role，并设置授权对象的 HPA_OBJ='CUAN_DIGACC' 和 MKTAREA_ID 的值（实际中此用户需要能够看到的值）。然后把此Role分配给用户，那么用户则有权限查看指定数据了。

### Check Authorization using SACM

想要查看CDS View的权限问题，Tcode SACM(Access Control Management) 可以帮助你调试。

打开`Tcode SACM` -> `ACM Runtime Tool(for SELECT)`

<figure class="center">
  <img src="/images/abap/SACM.jpg" alt="ACM Runtime Tool in SACM">
  <figcaption>ACM Runtime Tool in SACM</figcaption>
</figure>



[1]:https://help.sap.com/abapdocu_750/en/abencds_f1_cond_pfcg.htm
[2]:https://help.sap.com/abapdocu_750/en/abencds_f1_view_entity_annotations.htm
