---
layout: post
theme: UbuntuMono
star: true
series:
  url: abap-cds
  title: ABAP CDS
title: Table Function
excerpt: "Use Table Function in ABAP CDS."
modified: 2020-03-04T12:00:00-00:00
categories: articles
tags: [CDS, HANA, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1788.jpg
  credit: Google Earth
  creditlink: https://www.gstatic.com/prettyearth/assets/full/1788.jpg
comments: true
share: true
---

* TOC
{:toc}

https://help.sap.com/viewer/6811c09434084fd1bc4f40e66913ce11/201809.000/en-US/34dfb3083df34453beb5eb8ade7bd4ed.html

默认 Core data services (CDS) views 是通过 SQL 来访问 SAP HANA 数据库的, 这样以来 SAP HANA 的一些高级能力就没办法访问了. 但是 CDS views 可以通过 table functions 来执行 SAP HANA SQLScript 也就能直接使用 native SAP HANA functionality 了.

SAP HANA 除了拥有关系型数据库的功能外, 它还提供了一些额外的功能组件例如 预测分析(predictive analytics), 金融数学(financial mathematics), 数据挖掘(data mining), 地理信息(HANA Spatial), 全文搜索(full text search), 关系数据处理(graph progressing)等. 这些功能需要通过 SAP HANA-specific language SQLScript 来访问.

在 ABAP 编程里可以通过 ABAP Managed Database Procedures (AMDP) 来执行 SAP HANA SQLScript, 传入参数接收结果, CDS Table functions 就使用此项能力.

下面我们通过一个列转行的实际例子看一下.

## Implementation of a CDS Table Function

新建一个 CDS View 并选择 Table Function 模板来生成代码. 在 View 这里需要设定此 View 最终返回的结构, 并指定一个 ABAP Class 和相应的 Method 来实现具体逻辑

```typescript
@EndUserText.label: '人员部门映射表'
@ClientDependent: false
define table function Z_P_UserToDepartment
returns {
  EmployeeID : abap.char(50);
  Department : abap.char(10);
}
implemented by method ZCL_UserToDepartment=>get_data;
```

### AMDP

接下来要做的就是在 AMDP 里编写 HANA SQLScript 脚本了. 需要注意的是要使用 ABAP 字典里的表需要 Method 头部声明 using 如

`using /BIC/EMPLOEETABLE`

```sql
class ZCL_UserToDepartment definition
  public
  final
  create public .

public section.
    interfaces IF_AMDP_MARKER_HDB.
    CLASS-METHODS get_data for table function Z_P_UserToDepartment.
protected section.
private section.
ENDCLASS.


CLASS ZCL_UserToDepartment IMPLEMENTATION.

  method get_data by database function for hdb
    LANGUAGE SQLSCRIPT
                OPTIONS READ-ONLY
    using /BIC/EMPLOEETABLE .

    return
    select EmployeeID, DepartmentL1 AS Department from "/BIC/EMPLOEETABLE"
      UNION select EmployeeID, DepartmentL2 AS Department from "/BIC/EMPLOEETABLE"
      UNION select EmployeeID, DepartmentL3 AS Department from "/BIC/EMPLOEETABLE"
      UNION select EmployeeID, DepartmentL4 AS Department from "/BIC/EMPLOEETABLE"
      UNION select EmployeeID, DepartmentL5 AS Department from "/BIC/EMPLOEETABLE";
  endmethod.
ENDCLASS.
```

剩下的就是编写 HANA SQLScript 代码并返回 CDS Table Function View 中定义的数据结构的结果.

### Client Handling

这里我们设置为不依赖 SAP Client 即 Cross Client 的数据表, 不然就要指定一个 Client 的 parameter 给 Table Function.

```typescript
@EndUserText.label: '人员部门映射表'
define table function Z_P_UserToDepartment
  with parameters
    @Environment.systemField: #CLIENT
    P_SAPClient: abap.clnt
returns {
  mandt      : abap.clnt;
  EmployeeID : abap.char(50);
  Department : abap.char(10);
}
implemented by method ZCL_UserToDepartment=>get_data;
```

在 ADMP 里就要用输入的 client parameter 去过滤数据

```sql
class ZCL_UserToDepartment definition
  public
  final
  create public .

public section.
    interfaces IF_AMDP_MARKER_HDB.
    CLASS-METHODS get_data for table function Z_P_UserToDepartment.
protected section.
private section.
ENDCLASS.


CLASS ZCL_UserToDepartment IMPLEMENTATION.

  method get_data by database function for hdb
    LANGUAGE SQLSCRIPT
                OPTIONS READ-ONLY
    using /BIC/EMPLOEETABLE .

    return select :P_SAPClient as mandt, EmployeeID, Department from (
      select EmployeeID, DepartmentL1 AS Department from "/BIC/EMPLOEETABLE"
        UNION select EmployeeID, DepartmentL2 AS Department from "/BIC/EMPLOEETABLE"
        UNION select EmployeeID, DepartmentL3 AS Department from "/BIC/EMPLOEETABLE"
        UNION select EmployeeID, DepartmentL4 AS Department from "/BIC/EMPLOEETABLE"
        UNION select EmployeeID, DepartmentL5 AS Department from "/BIC/EMPLOEETABLE"
      );
  endmethod.
ENDCLASS.
```

## 实际应用场景

简单的应用场景有

* 做一些 CDS Functions 没有的复杂函数对字段的转换, 如正则表达式替换函数 (`REPLACE_REGEXPR`, etc), 从多行拼接字符串函数 (STRING_AGG)
* 一些时间日期函数 (ADD_WORKDAYS, WORKDAYS_BWTWEEN)
* 全文本搜索 (CONTAINS)
* Hierarchy 函数

复杂的应用场景就是用 SQLScript 写程序了.
