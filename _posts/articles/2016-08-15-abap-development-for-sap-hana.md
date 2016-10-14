---
layout: post
title: ABAP Development for SAP HANA
excerpt: "SAP HANA内存数据库作为SAP未来很长一段时间内新产品的基石被广泛应用在各种新产品中，ABAP作为SAP传统产品的技术基础有着其成熟的开发模式和应用架构，两者相结合（AMDP,CDS,ADBC）也成为SAP很多产品的技术架构。本文以循序渐进的方式介绍ABAP开发针对HANA数据库有哪些特性，以及各自在应用程序中扮演的角色。"
modified: 2016-08-18T11:27:25-04:00
categories: articles
tags: [SAP, HANA, ABAP, ADBC, AMDP, CDS, OLTP, OLAP, BOPF]
image:
  feature: hana/masthead-abap-for-hana.jpg
comments: true
share: true
references:
  - title: "ABAP for SAP HANA Reference Scenario - Tutorials"
    url: "http://scn.sap.com/docs/DOC-59038"
  - title: "ABAP for SAP HANA Reference Scenario - Video Tutorials"
    url: "http://scn.sap.com/docs/DOC-47994"
  - title: "SCN SAP: ABAP/HANA Connectivity via Secondary Database Connection"
    url: "http://scn.sap.com/community/hana-in-memory/blog/2012/04/11/test"
  - title: "SCN SAP: Consuming HANA Views, Procedures, External Views in ABAP 7.40 Syntax - Part 2"
    url: "http://scn.sap.com/community/abap/hana/blog/2014/01/08/consuming-hana-views-procedures-external-views-in-abap-740-syntax--part-2"
  - title: "SCN SAP: Introduction to Business Object Processing Framework (BOPF)"
    url: "http://scn.sap.com/docs/DOC-45425"

---

* TOC
{:toc}

SAP HANA内存数据库作为SAP未来很长一段时间内新产品的基石被广泛应用在各种新产品中，ABAP作为SAP传统产品的技术基础有着其成熟的开发模式和应用架构，两者相结合也成为SAP很多产品的技术架构。

本文以循序渐进的方式介绍ABAP开发针对HANA数据库有哪些特性，以及各自在应用程序中扮演的角色。

## Evolution
SAP HANA数据库的出现像通常的新软件一样，都是经历一个循序渐进功能逐步完善的过程。我们的介绍也遵循这样的过程，由浅入深。

![Image: Evolution of ABAP for SAP HANA](/images/hana/Evolution-of-ABAP-for-SAP-HANA.jpg)

* 在HANA出现的早期它作为Transactional数据库（OLTP）还不成熟的情况下，我们希望HANA作为Analytical数据库（OLAP）应用到ABAP系统中，这样ABAP仍然使用原有的数据库而同时可以连接HANA进行数据库操作。SAP NetWeaver AS ABAP提供了一种技术可以访问主数据库外的其他数据库叫[Secondary Database Connections](#secondary-database-connections)。

* 当HANA的Transactional Processing（OLTP）比较成熟时，我们可以把HANA应用为ABAP系统的主数据库。对于HANA一般的数据库表不用做大的改变即可用于ABAP Opensql，但对于HANA View和Procedure，ABAP则需要做些增强。ABAP里增强的View定义[External View](#external-view)对应到HANA View可以被ABAP Opensql使用，[Database Procedure Proxy](#database-procedure-proxy)则可以代理HANA Stored Procedure。还有其他的一些技术如ALV on HANA我们不作详细介绍。

* 当ABAP系统成功运行在HANA数据库上时，我们希望ABAP扩展一些功能以充分运用HANA数据库的预算能力。[ABAP-Managed Database Procedures (AMDP)](#abap-managed-database-procedures-amdp)使可以在ABAP class method里书写HANA SQL Script或Native SQL。[ABAP Database Connectivity(ADBC)](#abap-database-connectivity-adbc)技术可以灵活的充分的发挥数据库本身的一些特性。[Core Data Service(CDS)](#core-data-service-cds)可以大大简化数据库模型的设计过程和应用层访问数据库对象复杂逻辑。


### Secondary Database Connections
Secondary Database Connection并不是新技术，ABAP早就可以通过其访问主数据库外的辅助数据库。Secondary Database Connection可以在TCODE:`DBCO`中直接维护数据，或者在TCODE：`DBACOCKPIT` or `ST04`中创建。

![Image: HANA DB as Secondary DB](/images/hana/HANA-DB-as-Secondary-DB.png)

使用Secondary Database Connection有几种方式，*`via Open SQL`* *`via Native SQL`* *`via Native SQL - ADBC`* 详情参见[{{page.references[2].title}}]({{page.references[2].url}})


### External View

基于代理原理的External View和Database Procedure Proxy访问HANA数据对象的方式只是一种过渡阶段，在最新ABAP for HANA开发模式中并不被推荐使用。推荐使用CDS和AMDP等去访问HANA数据库。

![Image: AS ABAP exposing SAP HANA](/images/hana/AS-ABAP-exposing-SAP-HANA.jpg)

> 如果在一些特殊情况下项目中确实需要这种代理的方式，比如已经存在大量的HANA View不作改动得被用在ABAP程序里，那么则可以使用此方式。

如何使用详情参见[{{page.references[3].title}}]({{page.references[3].url}})

### Database Procedure Proxy
和External View一样Database Procedure Proxy并不被推荐。
在创建过之后ABAP中可以用下面的方式调用：

```sql
DATA: lt_bill_rev_days TYPE TABLE OF if_emp_bill_proxy_procedure=>et_last_rev_bill,
        lv_count     TYPE i.
CALL DATABASE PROCEDURE emp_bill_proxy_procedure
  IMPORTING et_last_rev_bill = lt_bill_rev_days.

LOOP AT lt_bill_rev_days ASSIGNING FIELD-SYMBOL(<fs_bill_rev_days>).
  WRITE: / 'Days Since Bill Rate is changed' ,<fs_bill_rev_days>-pernr.
  WRITE: '=', <fs_bill_rev_days>-last_rev_bill , /.
ENDLOOP.
```

### ABAP-Managed Database Procedures AMDP
AMDP是HANA SQL Script与ABAP Class混合的产物，它提供了一种在SQL Script与ABAP两者之间相互无缝调用的可能，大大简化了ABAP调用SQL Script的过程。

ABAP Class就是普通的Class，只要实现接口`IF_AMDP_MARKER_HDB`即可，需要在class实现里把用作SQL Script的method上多加些属性**By Database Procedure for HDB Language SQLScript**，就可以在此method里如同HANA里一样写SQL Script了。

> 目前SAP GUI ABAP编辑器不支持编辑此种SQL Script的method，需要使用[**ABAP Development Tools in eclipse**](http://scn.sap.com/community/abap/eclipse)。

```sql
class CL_DEMO_AMDP definition
  public
  final
  create public .

public section.

  interfaces IF_AMDP_MARKER_HDB .

  methods INCREASE_PRICE
    importing
      value(INC) type SFLIGHT-PRICE
    raising
      CX_AMDP_ERROR .
  methods INCREASE_PRICE_CLNT
    importing
      value(CLNT) type SY-MANDT
      value(INC) type SFLIGHT-PRICE
    raising
      CX_AMDP_ERROR .
ENDCLASS.


CLASS CL_DEMO_AMDP IMPLEMENTATION.

* <SIGNATURE>--------------------------------------------------+
* | Instance Public Method CL_DEMO_AMDP->INCREASE_PRICE
* +------------------------------------------------------------+
* | [--->] INC                            TYPE        SFLIGHT-PRICE
* | [!CX!] CX_AMDP_ERROR
* +----------------------------------------------------</SIGNATURE>
  METHOD increase_price BY DATABASE PROCEDURE FOR HDB
                          LANGUAGE SQLSCRIPT
                          USING sflight.
    update sflight set price = price + :inc
                   where mandt = SESSION_CONTEXT('CLIENT');
  ENDMETHOD.


* <SIGNATURE>--------------------------------------------------+
* | Instance Public Method CL_DEMO_AMDP->INCREASE_PRICE_CLNT
* +------------------------------------------------------------+
* | [--->] CLNT                           TYPE        SY-MANDT
* | [--->] INC                            TYPE        SFLIGHT-PRICE
* | [!CX!] CX_AMDP_ERROR
* +----------------------------------------------------</SIGNATURE>
  METHOD increase_price_clnt BY DATABASE PROCEDURE FOR HDB
                             LANGUAGE SQLSCRIPT
                             USING sflight.
    update sflight set price = price + :inc
                   where mandt = :clnt;
  ENDMETHOD.
ENDCLASS.
```

### ABAP Database Connectivity ADBC
ADBC是ABAP提供的动态访问数据库的一组API Class。如同`JDBC`一样，ADBC提供Class的形式访问数据库并执行指定的SQL语句，但它并不负责如何组装这些SQL语句。

> 如何组装SQL在其他开发语言中都很多成熟的框架，但ABAP似乎并没有比较通用的组装SQL的框架。
> 但SAP的一些产品中实现了相应的组装SQL的Class组件，如[**Hybris Marketing**](https://www.hybris.com/en/marketing)。

```sql
DATA key TYPE string. 
cl_demo_input=>request( CHANGING field = key ). 

TRY. 
    DATA(sql) = NEW cl_sql_statement( ). 
    sql->set_param( REF #( sy-mandt ) ). 
    sql->set_param( REF #( key ) ). 
    DATA(result) = sql->execute_query( 
          `SELECT carrname ` && 
          `FROM scarr ` && 
          `WHERE mandt  = ? AND carrid = ?` ). 
    DATA name TYPE scarr-carrname. 
    result->set_param( REF #( name ) ). 
    result->next( ). 
    cl_demo_output=>display( name ). 
  CATCH cx_sql_exception INTO DATA(err). 
    cl_demo_output=>display( err->get_text( ) ). 
ENDTRY.
```

### Core Data Service CDS
相对于SQL提供语言级别的访问数据库的功能，CDS提供了一种统一的可持续的数据库建模能力。

// TODO

## How to
SAP HANA出现之后，为了应用HANA内存数据库强大的大数据集计算能力，SAP提倡Code Pushdown理念，程序逻辑从应用层下移至数据库层。这并不是说简单地把ABAP程序逻辑迁移到HANA数据库中，这需要划分ABAP和HANA各自的职责，HANA擅长modeling，ABAP擅长programing。得益于HANA高速的实时计算能力，以往需要在ABAP中大量的计算逻辑单元都可以转成HANA Model，而ABAP只需要负责查询聚合这些Model得到结果。

![Image: SAP Code Pushdown](/images/hana/SAP-Code-Pushdown.JPG)

综上文各技术可以看出，ABAP for HANA的开发可以分为两种方式：自上而下[Top-Down Approach](#top-down-approach)和自下而上[Bottom-Up Approach](#bottom-up-approach)。

### Top-Down Approach
推荐使用此方式，使用ABAP Managed Database Procedure(AMDP)和CDS开发属于自上而下的方式。在应用层即ABAP程序中管理数据计算逻辑和建模，激活后会在HANA中创建相应的数据库对象。应用层开发需要灵活的架构能力，由于SQL或者SQL Script数据库语言本身和面向过程的特性，无法像面向对象的ABAP一样做为应用层开发的技术。

### Bottom-Up Approach
以HANA View和Stored Procedure为主的开发属于自下而上的方式。虽然从program performance上来讲这种方式更好一些，但就开发过程来说并不适合作为大型项目的开发模式。只有在特殊的场景应用中使用此种方式。

## Scenario
我们来看一下目前比较成熟的一个ABAP for HANA应用架构。HANA作为主数据库包括Tables、Views、Procedures、Search Models。AS ABAP为应用层使用了[BOPF](http://scn.sap.com/community/abap/bopf)技术作Transactional处理，Odata service提供数据接口给前端页面，还有一些其他Analytical技术作报表分析。前端则使用了SAPUI5开发页面，并结合第三方组件（如D3.js）开发更强大的页面功能。
ABAP是通过灵活动态地组装SQL然后用ADBC调用HANA数据库获取数据的。

可以看出这种架构还没有使用推荐的新技术AMDP和CDS，新技术被用在实际生产产品中还需要一段渐进的过程，不过已经在实验了。

![Image: ABAP for HANA Architecture](/images/hana/ABAP-for-HANA-Architecture.png)

## 总结

AS ABAP作为SAP传统地成熟地开发工具，有很多理由全面适应SAP HANA的开发。SAP也会在很长一段时间内仍然把AS ABAP作为应用层开发的主要工具。但这并不代表SAP没有在发展更新的开发能力，让我们拭目以待。


