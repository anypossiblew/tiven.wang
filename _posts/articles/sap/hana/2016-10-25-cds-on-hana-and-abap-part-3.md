---
layout: post
title: Introduction to CDS on HANA and ABAP Part 3 - Unit Test
excerpt: "“Core data services (CDS) is an infrastructure for defining and consuming semantically rich data models in SAP HANA.” 单元测试(Unit Test)在ABAP程序开发中已经非常重要，通常的ABAP Unit Test我们并不陌生。但是在代码重心下移至数据库层的模式下我们该如何对ABAP CDS Entities单元测试？本文简要介绍在ABAP中如何使用CDS Test Double Framework进行CDS Entities单元测试的"
modified: 2016-10-24T17:00:00-00:00
categories: articles
tags: [HANA, ABAP, CDS, Unit Test]
image:
  feature: /images/hana/masthead-abap-for-hana.jpg
comments: true
share: true
references:
  - title: "SAP Blog - Introduction to CDS Test Double Framework – How to write unit tests for ABAP CDS Entities?"
    url: "https://blogs.sap.com/2016/10/19/introduction-cds-test-double-framework-write-unit-tests-abap-cds-entities/"
---

* TOC
{:toc}

单元测试(Unit Test)在ABAP程序开发中已经非常重要，通常的ABAP Unit Test我们并不陌生。但是在代码重心下移至数据库层的模式下我们该如何对ABAP CDS Entities单元测试？本文简要介绍在ABAP中如何使用CDS Test Double Framework进行CDS Entities单元测试的。

## Series

1. [Introduction to CDS on HANA and ABAP part 1](/articles/cds-on-hana-and-abap/)
2. [Introduction to CDS on HANA and ABAP part 2 - Authorization Check](/articles/cds-on-hana-and-abap-part-2/)
3. Introduction to CDS on HANA and ABAP part 3 - Unit Test
{: .entry-series}

## CDS Test Double Framework

<figure class="center">
  <img src="/images/abap/CDS_Under_Test.jpg" alt="CDS Test Double Framework">
  <figcaption>CDS Test Double Framework</figcaption>
</figure>

## Unit tests using CDS Test Double Framework

### CDS Entity

接着上一篇对创建的CDS Entity进行单元测试

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
    cuand_da_root.mkt_area_id as MarketingArea,
    _MarketingPermission.contact_key as ContactKey,
    _MarketingPermission // Make association public
}
```

### Create an ABAP Test class

创建一个ABAP Test Class **_z\_mkt\_digacc\_test_** 来测试CDS View，Class名称最好使用*\<CDS\_NAME\>\_Test*这样的模式便于查找。


```sql
CLASS z_mkt_digacc_test DEFINITION
  PUBLIC
  FINAL
  FOR TESTING
  CREATE PUBLIC .

PUBLIC SECTION.
PROTECTED SECTION.
PRIVATE SECTION.
  ...
ENDCLASS.

CLASS z_mkt_digacc_test IMPLEMENTATION.

ENDCLASS.
```

### Define Fixture Methods

Define the following setup and teardown methods.

```sql
  METHOD class_setup.
    environment = cl_avalon_cds_test_environment=>create( i_for_entity = 'Z_Mkt_Digacc' ).
  ENDMETHOD.

  METHOD class_teardown.
    environment->destroy( ).
  ENDMETHOD.

  METHOD setup.
    environment->clear_doubles( ).
  ENDMETHOD.
```

### Define a unit test method

```sql
METHOD check_mkt_digacc.
  ...
ENDMETHOD.
```

#### Prepare Inputs – Insert Test Data in doubles

```sql
METHOD check_mkt_digacc.
  "Step 1 : Insert testdata into the doubles
  "Step 1.1 : create an instance of type cuand_da_root. Note : CDS view Z_Mkt_Digacc depends on cuand_da_root.
  table_digital_account = VALUE #( ( mandt = sy-mandt db_key = '1' comm_cat_key = '2' ) ).
  "Step 1.2 : Use the framework method cl_avalon_cds_test_data=>create(..) to create the test_data object
  test_data = cl_avalon_cds_test_data=>create( i_data = table_digital_account ).
  "Step 1.3 : Use the framework method environment->get_stub(..) to create the instance of the double 'CUAND_DA_ROOT'
  DATA(table_digital_account_stub) = environment->get_stub( i_name = 'CUAND_DA_ROOT' ).
  "Step 1.4 : Insert the testdata into the double depended-on component object
  table_digital_account_stub->insert( test_data ).

  "Step 2 : Repeat Step 1 for all the depended-on component doubles
  table_marketing_permission = VALUE #( ( mandt = sy-mandt contact_key = '3' comm_cat_key = '2' )  ( mandt = sy-mandt contact_key = '4' comm_cat_key = '2'  ) ).
  test_data = cl_avalon_cds_test_data=>create( i_data = table_marketing_permission ).
  DATA(table_marketing_perm_stub) = environment->get_stub( i_name = 'CUAND_CE_MP_ROOT' ).
  table_marketing_perm_stub->insert( test_data ).
ENDMETHOD.
```

#### Execute CDS

```sql
SELECT * FROM z_mkt_digacc INTO TABLE @act_results CONNECTION (environment->connection_name).
```

#### Verify output – Assert using ABAP Unit Test APIs

```sql
cl_abap_unit_assert=>assert_equals( act = lines( act_results ) exp = 2 ).
```

完整代码

```sql
CLASS z_mkt_digacc_test DEFINITION
  PUBLIC
  FINAL
  FOR TESTING
  CREATE PUBLIC .

PUBLIC SECTION.
PROTECTED SECTION.
PRIVATE SECTION.
  CLASS-DATA:
        environment TYPE REF TO if_avalon_cds_test_environment.
  CLASS-METHODS:
    class_setup
      RAISING
        cx_static_check,
    class_teardown.
  DATA:
     act_results                    TYPE STANDARD TABLE OF z_mkt_digacc WITH EMPTY KEY,
     test_data                      TYPE REF TO if_avalon_cds_test_data,
     table_digital_account          TYPE STANDARD TABLE OF cuand_da_root,
     table_marketing_permission     TYPE STANDARD TABLE OF cuand_ce_mp_root.

  METHODS:
      setup RAISING cx_static_check,
      check_mkt_digacc FOR TESTING RAISING cx_static_check.
ENDCLASS.

CLASS z_mkt_digacc_test IMPLEMENTATION.
  METHOD class_setup.
    environment = cl_avalon_cds_test_environment=>create( i_for_entity = 'Z_Mkt_Digacc' ).
  ENDMETHOD.

  METHOD class_teardown.
    environment->destroy( ).
  ENDMETHOD.

  METHOD setup.
    environment->clear_doubles( ).
  ENDMETHOD.

  METHOD check_mkt_digacc.
    "Step 1 : Insert testdata into the doubles
    "Step 1.1 : create an instance of type cuand_da_root. Note : CDS view Z_Mkt_Digacc depends on cuand_da_root.
    table_digital_account = VALUE #( ( mandt = sy-mandt db_key = '1' comm_cat_key = '2' ) ).
    "Step 1.2 : Use the framework method cl_avalon_cds_test_data=>create(..) to create the test_data object
    test_data = cl_avalon_cds_test_data=>create( i_data = table_digital_account ).
    "Step 1.3 : Use the framework method environment->get_stub(..) to create the instance of the double 'CUAND_DA_ROOT'
    DATA(table_digital_account_stub) = environment->get_stub( i_name = 'CUAND_DA_ROOT' ).
    "Step 1.4 : Insert the testdata into the double depended-on component object
    table_digital_account_stub->insert( test_data ).

    "Step 2 : Repeat Step 1 for all the depended-on component doubles
    table_marketing_permission = VALUE #( ( mandt = sy-mandt contact_key = '3' comm_cat_key = '2' )  ( mandt = sy-mandt contact_key = '4' comm_cat_key = '2'  ) ).
    test_data = cl_avalon_cds_test_data=>create( i_data = table_marketing_permission ).
    DATA(table_marketing_perm_stub) = environment->get_stub( i_name = 'CUAND_CE_MP_ROOT' ).
    table_marketing_perm_stub->insert( test_data ).

    "Test
    SELECT * FROM z_mkt_digacc INTO TABLE @act_results CONNECTION (environment->connection_name).

    "Verify
    cl_abap_unit_assert=>assert_equals( act = lines( act_results ) exp = 2 ).

  ENDMETHOD.

ENDCLASS.
```

#### Running Unit tests for CDS

在ADT工具里选中要测试的 Class Method 右键`Run As` -> `ABAP Unit Test`

### Supported Test scenarios

CDS Test Double framework supports 支持以下 depended-on components (DOCs) for a given CDS View under test (CUT) 的 test doubles 的创建:

* DDIC tables
* DDIC views
* CDS views
* CDS views with Parameters
* External Views
* Table Functions
* CDS special functions. CURRENCY_CONVERSION and UNIT_CONVERSION

## Conclusions

跟着本篇动手写一遍CDS View的Unit Test Class之后，你现在应该能够使用CDS Test Double Framework方便得自动化测试你的ABAP CDS Entities code-pushdown逻辑了。
