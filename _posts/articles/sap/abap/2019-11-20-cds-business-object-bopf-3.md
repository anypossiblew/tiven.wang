---
layout: post
theme: UbuntuMono
star: true
series:
  url: abap-cds
  title: ABAP CDS
title: Developing New Transactional Apps using CDS part 3 - Admin Data Determination
excerpt: "Add Admin Data Determination for Business Object using CDS Annotations."
modified: 2019-11-20T12:00:00-00:00
categories: articles
tags: [CDS, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6135.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/kailua-kona-united-states-6135
comments: true
share: true
---

* TOC
{:toc}

接上一篇 [ABAP CDS - Developing New Transactional Apps using CDS part 2](/articles/cds-business-object-bopf-2/) 我们创建一个基本 CRUD 功能的 Business Object 和 Fiori App 并添加了自定义的 Action 做对 Business Object 的某种操作. 我们在第一篇里在表里加了加 Admin 字段的结构 `/BOBF/S_LIB_ADMIN_DATA` 但是在创建记录时并没有相应的数据写入, 这是为什么呐. 本篇我们将介绍需要为 Business Object CDS 增加一些 Annotations 来标记哪些字段是 Semantics Admin 相关的, 这样系统在创建 Business Object 时会自动生成相应的 Determination 来写入系统数据.

## 什么是 Determination

* [Understanding the Determination API](https://help.sap.com/viewer/aa7fc5c3c1524844b811735b9373252a/7.52.4/en-US/ae9377d62db442e8a4b08d24068df3cc.html)
* [Determinations for CDS-Based Business Objects](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.52.4/en-US/ca87857d0e4042ed88384edbb89b6e70.html)

## 为 Business Object CDS 添加相关 Annotations

修改 Business Object 对应的 CDS 增加四个 Admin 相关的字段, 并为其添加注解

```typescript
define view ZDEMO_I_SalesOrder_TX
  as select from ztab_so as SalesOrder {

  ...

  @Semantics.systemDateTime.createdAt: true
  @ObjectModel.readOnly: true
  crea_date_time,

  @Semantics.user.createdBy: true
  @ObjectModel.readOnly: true
  crea_uname,

  @Semantics.systemDateTime.lastChangedAt: true
  @ObjectModel.readOnly: true
  lchg_date_time,

  @Semantics.user.lastChangedBy: true
  @ObjectModel.readOnly: true
  lchg_uname,

  ...
}
```

这四个字段是来自于表 `ztab_so` 的 Admin 结构 `/BOBF/S_LIB_ADMIN_DATA`, 为其添加 CDS Annotations `@Semantics`

* `@Semantics.systemDateTime.createdAt` 创建时间
* `@Semantics.user.createdBy` 创建用户
* `@Semantics.systemDateTime.lastChangedAt` 最后更改时间
* `@Semantics.user.lastChangedBy` 最后更改用户

激活后其对应的 Busiess Object `ZDEMO_I_SALESORDER_TX` 的 Determinations 中会增加一个名为 **ADMINISTRATIVE_DATA** 的 Determination, 它使用了一个系统类 `/BOBF/CL_LIB_D_ADMIN_DATA_AI` 来实现 Admin 字段的写入逻辑. 可以看到此 Determination 的 Trigger Conditions 是节点的*创建*和*更新*, 执行的时间点是 **During Save (Before Writing Data)**.

我们来分析一下此 Determination 的类 `/BOBF/CL_LIB_D_ADMIN_DATA_AI` 的逻辑, 它里面有这样一段代码

```typescript
  " get node model of the assigned of the determination
  DATA(lo_conf) = /bobf/cl_frw_factory=>get_configuration( iv_bo_key = is_ctx-bo_key ).
  lo_conf->get_node(
    EXPORTING iv_node_key = is_ctx-node_key
    IMPORTING es_node     = DATA(ls_node) ).
```

此段会根据 Business Object 节点 Key 获取其 Node 配置信息, ABAP 类型为 `/BOBF/S_CONFRO_NODE`, 此类型里面有 `SEMANTICS_CREATED_AT` 这样的一些字段, 系统接口 `/BOBF/IF_FRW_CONFIGURATION` 已经封装好了将 CDS Annotations 转换到此结构字段上的逻辑, 所以我们可以通过 `SEMANTICS_CREATED_AT` 得到对应的 Business Object
 字段.

> 这里需要注意在 Business Object 的 CDS 里设置 Semantics 字段时不能为字段起别名(如下错误写法), 因为如果这样系统就会拿到字段别名而与物理表对应不起来了
```typescript
@Semantics.systemDateTime.createdAt: true
@ObjectModel.readOnly: true
crea_date_time as CreationDateTime,
```
{: .Warning}

## 输出到 OData Service

还可以继续将此四个 Admin 字段输出到 OData Service 的 CDS View, 这里就可以为 Admin 字段起别名了.

```typescript
@OData.publish: true
define view ZDEMO_C_SalesOrder_TX
  as select from ZDEMO_I_SalesOrder_TX as Document
{
  ...

  Document.crea_date_time as CreationDateTime,

  Document.crea_uname as CreatedByUser,

  Document.lchg_date_time as LastChangedDateTime,

  Document.lchg_uname as LastChangedByUser,

  ...
}
```

## 测试

Post 到 */sap/opu/odata/sap/ZDEMO_C_SALESORDER_TX_CDS/ZDEMO_C_SalesOrder_TX*

```json
{
  "SalesOrder": "2000018"
}
```

可以得到如下返回结果

```json
{
    "d": {
        "__metadata": {
            "id": "https://example:8000/sap/opu/odata/sap/ZDEMO_C_SALESORDER_TX_CDS/ZDEMO_C_SalesOrder_TX('2000018')",
            "uri": "https://example:8000/sap/opu/odata/sap/ZDEMO_C_SALESORDER_TX_CDS/ZDEMO_C_SalesOrder_TX('2000018')",
            "type": "ZDEMO_C_SALESORDER_TX_CDS.ZDEMO_C_SalesOrder_TXType"
        },
        "Set_to_paid_ac": true,
        "SalesOrder": "2000018",
        "BusinessPartner": "",
        "CurrencyCode": "",
        "GrossAmount": "0.00",
        "NetAmount": "0.00",
        "BillingStatus": "",
        "OverallStatus": "",
        "CreationDateTime": "/Date(1574254108303+0000)/",
        "CreatedByUser": "MO004466",
        "LastChangedDateTime": "/Date(1574254108303+0000)/",
        "LastChangedByUser": "MO004466",
        "to_BillingStatus": {
            "__deferred": {
                "uri": "https://example:8000/sap/opu/odata/sap/ZDEMO_C_SALESORDER_TX_CDS/ZDEMO_C_SalesOrder_TX('2000018')/to_BillingStatus"
            }
        },
        "to_BusinessPartner": {
            "__deferred": {
                "uri": "https://example:8000/sap/opu/odata/sap/ZDEMO_C_SALESORDER_TX_CDS/ZDEMO_C_SalesOrder_TX('2000018')/to_BusinessPartner"
            }
        },
        "to_Currency": {
            "__deferred": {
                "uri": "https://example:8000/sap/opu/odata/sap/ZDEMO_C_SALESORDER_TX_CDS/ZDEMO_C_SalesOrder_TX('2000018')/to_Currency"
            }
        },
        "to_OverallStatus": {
            "__deferred": {
                "uri": "https://example:8000/sap/opu/odata/sap/ZDEMO_C_SALESORDER_TX_CDS/ZDEMO_C_SalesOrder_TX('2000018')/to_OverallStatus"
            }
        }
    }
}
```
