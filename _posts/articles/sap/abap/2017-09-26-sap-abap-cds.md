---
layout: post
redirect_from: "/articles/sap-cds"
theme: UbuntuMono
star: true
series:
  url: abap-cds
  title: ABAP CDS
title: SAP ABAP CDS
excerpt: "ABAP CDS View"
modified: 2018-10-08T17:00:00-00:00
categories: articles
tags: [CDS, ABAP, Analytics, SAP]
image:
  vendor: twitter
  feature: /media/DK57HdFUQAEsepr.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "Data filtration options and performance analysis in ABAP CDS views"
    url: "https://blogs.sap.com/2017/09/22/data-filtration-options-and-performance-analysis-in-abap-cds-views/"
---

## CDS

Technically, __CDS__ is an enhancement of _**SQL**_ which provides a Data Definition Language (DDL) for defining semantically rich database tables/views (CDS entities) and user-defined types in the database. 有这些增强

* __Expressions__ used for calculations and queries in the data model
* __Associations__ on a conceptual level, replacing joins with simple path expressions in queries
* __Annotations__ to enrich the data models with additional (domain specific) metadata

CDS 分为 ABAP 和 SAP HANA 两个版本。ABAP CDS 可以被 ABAP 程序通过 Open SQL statements 访问。

[CDS Views: Tools and Tables](https://wiki.scn.sap.com/wiki/display/BI/CDS+Views%3A+Tools+and+Tables)

## Annotations

* Convey 传达 某种信息

[SAP CDS annotations list](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.5.14/en-US/630ce9b386b84e80bfade96779fbaeec.html)

### Consumption

Via these annotations, the specific behavior is defined which is related to the consumption of CDS content. This metadata makes no assumptions about the concrete consumption technology/infrastructure, but it is applicable across multiple consumption technologies (e.g. Analytics or OData).

* `Consumption.derivation`: This annotation enables derivation of the value for a parameter or a filter automatically at runtime by selecting a row from a given entity(table).

[How to create ABAP CDS View with enabling derivation of the value for parameters](https://blogs.sap.com/2017/08/04/how-to-create-abap-cds-view-with-enabling-derivation-of-the-value-for-parameters/)

## Functions

### Date Functions

[ABAP CDS - Date Functions and Time Functions](https://help.sap.com/doc/abapdocu_752_index_htm/7.52/en-US/abencds_f1_date_functions.htm)

## CRUD

通过 CDS View 创建 OData service 有三种途径：
* __`@OData.publish` annotation__ 通过 CDS View 的注解 `@OData.publish` 自动生成 OData service
* __Reference Data Source__ 通过 OData project 里 Reference Data Source 功能链接到 CDS View
* __Import DDIC Structure__ 通过 OData project 里 Import  DDIC Structure 功能引入 CDS View 结构

那么以上只有 Import DDIC Structure 是属于手动创建 OData entityset，所以只有这种可以设置 CRUD 自定义逻辑。

Creatable, Updatable, Deletable, Pageable, Addr.able, Searchable, Subscr.able

[update, D-delete OData Services Creation Using ABAP CDS Views](https://www.skybuffer.com/c-create-r-read-u-update-d-delete-odata-services-creation-using-abap-cds-views/)

## CDS Test Double Framework

CDS Test Double Framework 会切断要测试的 CDS View 的依赖组件（depended-on components (DOC)）替换成框架复制的一份依赖组件，避免对原有 ABAP Runtime 对象操作造成数据影响的问题。

![Image: CDS Test Double Framework](https://help.sap.com/doc/PRODUCTION/f2e545608079437ab165c105649b89db/7.51.3/en-US/loio723f26031a644fd2b71f6ce3b142645c_LowRes.png)
{: .center}

![Image: CDS Test Double Framework](https://help.sap.com/doc/PRODUCTION/f2e545608079437ab165c105649b89db/7.51.3/en-US/loiod09113fd0ceb44668d21a65996a416de_LowRes.png)
{: .center}

![Image: CDS Test Double Framework](https://help.sap.com/doc/PRODUCTION/f2e545608079437ab165c105649b89db/7.51.3/en-US/loio43c36ef4597f400ca642fd2d3c6f5278_LowRes.png)
{: .center}

SAP ABAP 的包 **SABP_UNIT_DOUBLE_CDS** 里就是对 ABAP CDS 做测试的框架，里面还有 demo 程序。

[Writing Unit Tests Using CDS Test Double Framework](https://help.sap.com/viewer/f2e545608079437ab165c105649b89db/7.51.3/en-US/4f39ef2a0cfa45538681e900accb6ca8.html)

ABAP CDS Unit Test 代码就是普通的 ABAP Unit Test class 代码，只不过其中使用了一些专门的类协助测试环境创建和数据 Mock ，例如类 `cl_cds_test_environment` 可以用来创建 ABAP CDS 测试环境即 Double 其依赖组件和插入 Mock 数据。

以测试类 `CL_CDS_WITH_AGGREGATION` 为例，首先设置的是 CDS 测试环境的创建和销毁方法

```java
METHOD class_setup.
  environment = cl_cds_test_environment=>create( i_for_entity = 'CdsFrwk_So_Items_By_TaxRate' ).
ENDMETHOD.

METHOD class_teardown.
  environment->destroy( ).
ENDMETHOD.

METHOD setup.
  environment->clear_doubles( ).
ENDMETHOD.
```

然后在测试前要为测试环境准备和插入 Mock 数据，使用依赖组件（depended-on components (DOC)）类型的内表准备 Mock 数据，使用方法 `environment->insert_test_data` 向测试环境插入 Mock 数据。

```java
METHOD cuco_1_taxrate_1_item_2_ok.

  "Given
  "Sales Orders
  sales_orders = VALUE #(  ( client = sy-mandt node_key = '01' so_id = 'ID' ) ).
  environment->insert_test_data( i_data = sales_orders ).

  "Given
  "Sales Order Items
  sales_order_items = VALUE #( ( mandt = sy-mandt so_guid = '01' currency_code = 'EUR' gross_amount = '1' tax_rate = '19.00' )
                                ( mandt = sy-mandt so_guid = '01' currency_code = 'EUR' gross_amount = '2' tax_rate = '19.00' ) ).
  environment->insert_test_data( i_data = sales_order_items ).

  " Test
  SELECT * FROM cdsfrwk_so_items_by_taxrate INTO TABLE @act_results.
  
  " Verify
  exp_results = VALUE #( ( so_id = 'ID' currency_code = 'EUR' sum_gross_amount = '3' tax_rate = '19.00' ) ).
  assert_so_items_by_taxrate( exp_results = exp_results ).

ENDMETHOD.
```

注意这里 Mock 数据内表的类型要使用 ABAP CDS 依赖组件的数据类型，因为 `environment->insert_test_data` 方法会根据其类型找到相应的依赖组件 Double 出来的对象并插入 Mock 数据。

插入 Mock 数据之后便可以运行 Open SQL 进行实际测试了，使用 Open SQL 读取 ABAP CDS 视图得到想要的结果。这里读取真实的 ABAP CDS View 是怎么得到 Mock 数据的呐？这因为 CDS Test Double Framework 使用了 Open SQL 的一项新功能 [Replacement Service][abennews-752-open_sql], 类 [CL_OSQL_REPLACE][CL_OSQL_REPLACE] 可以在 ABAP Unit 单元测试中将数据库访问重定向至访问其它数据库的 Open SQL。如何应用可以参考示例程序 `demo_cl_osql_replace`。

## Performance Optimization

我觉得关于 CDS Performance 优化的问题可以从两个方面考虑：
* CDS 本身的优化
* HANA View 的优化，因为最终 CDS View 都会转成 HANA View 的

https://blogs.sap.com/2018/07/03/performance-optimization-for-abap-cds-view/

https://blogs.sap.com/2018/11/15/safeguard-performance-of-abap-cds-views-part-1-cds-view-complexity/

General Architecture for SAP S/4HANA:

![](https://blogs.sap.com/wp-content/uploads/2018/07/S1.jpg)

SQL Processing Steps :

![](https://blogs.sap.com/wp-content/uploads/2018/07/s2.jpg)

### CDS Optimazation

#### performance annotations

* `@ObjectModel.usageType.serviceQuality` quality of service with respect to the expected performance of the CDS view
* `@ObjectModel.usageType.dataClass` type of data in CDS view (transactional data, master data, …)
* `@ObjectModel.usageType.sizeCategory` set of data whichhas to be searched through in order to compute the result set

### HANA View Optimazation

从 HANA 数据库角度出发进行优化 View

https://blogs.sap.com/2013/06/05/abap-on-hana-from-analysis-to-optimization/

### PUSH DOWN

Limit push down and aggregation push down

### Calculation PUSH UP

## Evaluation of Annotations

CL_DD_DDL_ANNOTATION_SERVICE

## for Embedded Analytics

[abennews-752-open_sql]:https://help.sap.com/doc/abapdocu_752_index_htm/7.52/en-US/abennews-752-open_sql.htm#!ABAP_MODIFICATION_11@11@
[CL_OSQL_REPLACE]:https://help.sap.com/doc/abapdocu_752_index_htm/7.52/en-US/abencl_osql_replace.htm
