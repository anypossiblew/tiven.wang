---
layout: post
theme: UbuntuMono
star: true
series:
  url: abap-cds
  title: ABAP CDS
title: Abap Annotations
excerpt: "Abap CDS Annotations 注解的作用详解"
modified: 2019-12-11T12:00:00-00:00
categories: articles
tags: [CDS, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2095.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/erfurt-germany-2095
comments: true
share: true
---

* TOC
{:toc}

## Annotations

[ABAP CDS - ABAP Annotations](https://help.sap.com/doc/abapdocu_752_index_htm/7.52/en-US/index.htm?file=abencds_annotations_abap.htm)

### AbapCatalog Annotations

* `@AbapCatalog.buffering`: 参考[SAP Buffering of CDS Views](#sap-buffering-of-cds-views)
* `@AbapCatalog.compiler.compareFilter`: 参考[path expression](#path-expression) specify whether the filter conditions are compared for the path expressions of a view. If the filter condition matches, the associated join expression is created only once, which generally improves performance. Otherwise a separate join expression is created for each filter condition. However, the results sets of both configurations can differ.
* `AbapCatalog.dbHints`
* `AbapCatalog.preserveKey`: 说明 CDS database view 的主键是否与关键字 KEY 定义的一致;
* `AbapCatalog.sqlViewAppendName`
* `AbapCatalog.sqlViewName`
* `AbapCatalog.viewEnhancementCategory[ ]`

### AccessControl Annotations

* `AccessControl.authorizationCheck`: specifies implicit access control, 参考[Access Control](#access-control)
  * `#CHECK`: 做检查
  * `#NOT_ALLOWED`: 不做使用权限检查来过滤数据, 如果有相应的 role 存在则会报警告
  * `#NOT_REQUIRED`: 不要求, 有就检查和过滤没有就不检查, 在运行时的行为和 `#CHECK` 是一样的, 但它可以在书面上告知没有 role 存在
  * `#PRIVILEGED_ONLY`: 只允许有 the addition `WITH PRIVILEGED ACCESS` in the `FROM` clause of an Open SQL query 的访问

### EndUserText Annotations

* `EndUserText.heading`:
* `EndUserText.label`:
* `EndUserText.quickInfo`:

### Environment Annotations

* `Environment.sql.passValue`
* `Environment.systemField`: assigns an ABAP system field to parameter
  * `#CLIENT`
  * `#SYSTEM_DATE`
  * `#SYSTEM_LANGUAGE`
  * `#SYSTEM_TIME`
  * `#USER`

### Metadata Annotations

* `Metadata.allowExtensions`: 允许使用 metadata extensions 扩展 View 的 metadata
* `Metadata.ignorePropagatedAnnotations`: specifies how propagated annotations are evaluated using the class `CL_DD_DDL_ANNOTATION_SERVICE`
* `Metadata.layer`: specfies layer in CDS metadata extension
  * `#CORE`
  * `#CUSTOMER`
  * `#INDUSTRY`
  * `#LOCALIZATION`
  * `#PARTNER`

* `MetadataExtension.usageAllowed`:  specifies the distribution of the annotation in CDS metadata extensions

### Semantics Annotations

* `Semantics.amount.currencyCode`: Currency field
* `Semantics.currencyCode`: Currency key
* `Semantics.quantity.unitOfMeasure`: Quantity field
* `Semantics.unitOfMeasure`: Unit key

## CDS Views

首先我们要理清楚 CDS View 相关的 ABAP 对象. 当一个 CDS view 的 CDS data definition 被激活后, 有两种 ABAP Dictionary objects 会生成:

* `CDS entity`:
  * 代表了实际的 CDS view, 它是基于 **CDS database view** 的并且多了一些属性如权限控制.
  * 它不能在 **SE11** 查看, 但可以在 abap 里用作为一个 data type 和被 Open SQL 读取.
  * 它可以作为其他 CDS Entity 的 data source, 但不能用作为 ABAP Dictionary 中的 classic dictionary objects 的数据类型;
* `CDS database view`:
  * 是 CDS view 在 ABAP Dictionary 中的技术基础, 它实际上是一个**只读**的**传统**的 database view, 它的名字是来自于 `@AbapCatalog.sqlViewName` 注解.
  * 它被激活时相应的 SQL View 同时会被创建.
  * 如果其 CDS view 是 `client-specific` 的, 那么此 CDS database view 总是有一个 client 列, 而 CDS entity 却没有.
  * 可以被当作 any classic structure 来用, such as the type of a substructure, as an include structure, or as the row type of a table type.
  * 但不要用在 ABAP 代码里, 只能用在数据表或者传统数据视图能用在的地方 such as after the **TYPE** addition, 或者 in Open SQL read statements and also in Native SQL. 但是用在 Open SQL 里也已经不再支持了, 最好直接使用 CDS View entity 在 Open SQL 里.

A CDS view has two types of keys:

For CDS entities, KEY can be used to define key elements. This key is the **semantic** key of the CDS view.
The key of the CDS database view is determined **implicitly**, as in a classic view. This key is the technical key of the CDS view.

### Notes

* CDS views are defined as platform-independent views. They can, however, contain components that are not currently supported by all database systems. Before an ABAP read, the class `CL_ABAP_DBFEATURES` can be used to determine whether the feature is supported in the current system, which stops an exception from being raised.

### Client Handling in CDS Views

众所周知 ABAP Table 是分为 Client 相关和 Client 无关(cross-client)的, 所以当使用 CDS View 查询数据表时也会涉及 Client 字段问题.

`@ClientHandling.type` 注解是决定 CDS View 使用哪种 Client 策略:

* `#INHERITED`: Default value. Client 策略依赖于它所查询的数据源们, 如果它依赖的数据源里有一个是 client-specific, 那么它就是 client-specific, 否则就不是(或者称为 cross-client view).
* `#CLIENT_DEPENDENT`: 此视图是 client-specific, 但前提是至少有一个数据源是 client-specific 的, 否则会有语法错误.
* `#CLIENT_INDEPENDENT`: 此视图是 cross-client view, 但前提是没有任何一个数据源是 client-specific 的, 否则会有语法错误.

`@ClientHandling.algorithm` 注解决定了隐式 client handling 怎么执行.

* `#AUTOMATED`: 是当 `@ClientHandling.type` 为 `#INHERITED` and `#CLIENT_DEPENDENT` 时的默认值. 不能和 `#CLIENT_INDEPENDENT` 一起用.
* `#SESSION_VARIABLE`: 不能和 `#CLIENT_INDEPENDENT` 一起用. 它会在 WHERE 条件中加上 Client 列等于 `$session.client` 的值.
* `#NONE`: `#CLIENT_INDEPENDENT` 时的默认值. 此不考虑客户端情况.

`#AUTOMATED` 和 `#SESSION_VARIABLE` 产生的结果是一样的, 但当你只考虑但客户端情况时 `#SESSION_VARIABLE` 有更好的效率.

### SAP Buffering of CDS Views

https://help.sap.com/doc/abapdocu_751_index_htm/7.51/en-us/abencds_sap_puffer.htm

当对 CDS views 使用 SAP buffering 时, 它要满足以下条件:

* 它不能包含任何其他视图(database views 或者 CDS Views)作为数据源;
* 一个 client-specific view 只能使用 session variable 中唯一的一个 `$session.client`, cross-client view 不能使用任何 session variables;
* The required key fields must be listed directly in the SELECT list. Key fields that only occur as arguments of expressions cannot be evaluated;

> 但是有一个问题值得思考, 当 ABAP 应用服务器是基于 HANA DB 时此 SAP Buffering 对于基于 CDS Views 访问的情况还是否有意义,因为 HANA DB 本身数据就是在内存中的?
{: .Warning}

SAP Buffering 涉及到的 CDS Annotations:

* `AbapCatalog.buffering.numberOfKeyFields`: number of key fields when buffering generic areas
* `AbapCatalog.buffering.status`: enables and disables buffering
* `AbapCatalog.buffering.type`: defines the buffering type

## path expression

一种关联和过滤 associations 的[路径条件表达式](https://help.sap.com/doc/abapdocu_751_index_htm/7.51/en-us/abencds_f1_path_expression.htm), 可以对其指定 parameters 或者 attributes 来过滤:

```typescript
... [viewEntity.]_assoc1[parameters][attributes]
               [._assoc2[parameters][attributes] ... ][.element] ...
```

例如:

```typescript
define view invoice as
  select from
         /* Association "sales_order" with filter as data source */
         business_partner.sales_order[lifecycle_status <> 'C' and lifecycle_status <> 'X']
           as bpa_so //alias for data source
         /* Association only used in this view definition */
         association [0..1] to snwd_so_inv_head as _invoice_header
           on bpa_so.node_key = _invoice_header.so_guid
        { key bpa_so.node_key, //Field from ON-condition in _invoice_header
              bpa_so.so_id,
              bpa_so.note_guid, //Field from ON-condition in note_header
              bpa_so.lifecycle_status,
              /* Association is not published, but its element */
              _invoice_header.dunning_level,
              /* Association from data source is published here */
              bpa_so.note_header }
          /* Path expression in WHERE clause */
          where _invoice_header.dunning_level > '0';
```

Path expression 还可以用在 ABAP CDS DCL 的条件中.

### path expression parameters

如果 data source 是一个带输入参数的 CDS View,则需要提供参数 parameters 给它.

### path expression attributes

路径表达式的属性是指以下三种:

* Declaration of monovalency: 声明是对一还是对多.
* Category of the join expression: join 类型 inner join 或者 left outer join
* Specified filter conditions: 指定过滤条件

`[ [1|*:] [INNER|{LEFT OUTER} [WHERE]] [ cond_expr] ] ...`

```typescript
@ObjectModel.text.element:  [ 'SoldToPartyCountryName' ]
SoldToPartyCountry,

@Consumption: {
  groupWithElement: 'SoldToPartyCountry',
  filter.hidden: true
}
@EndUserText: {
    label:     'Customer Country Name',
    quickInfo: 'Customer Country Name'
}
_SoldToPartyCountry._Text[1: Language = $session.system_language].CountryName      as SoldToPartyCountryName,
```

## Access Control

[ABAP CDS - Access Control](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.52.4/en-US/cf2989f6f5944305a0c8bcc0b0080c7c.html)

* CDS access control does not work for cross-client access.

The value `#NOT_REQUIRED` is recommended for entities for which no authorization checks are planned yet, but might be needed by the developer or customer laster. To prohibit roles for the entity, use the value `#NOT_ALLOWED`.

* `AccessControl.privilegedAssociations`
* `AccessControl.personalData.blocking`