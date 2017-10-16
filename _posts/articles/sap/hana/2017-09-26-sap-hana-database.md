---
layout: post
title: SAP HANA Database
excerpt: "SAP HANA is an in-memory, column-oriented, relational database management system developed and marketed by SAP SE. Its primary function as database server is to store and retrieve data as requested by the applications. In addition, it performs advanced analytics (predictive analytics, spatial data processing, text analytics, text search, streaming analytics, graph data processing) and includes ETL capabilities as well as an application server."
modified: 2017-09-26T17:00:00-00:00
categories: articles
tags: [HANA, Bigdata, SAP]
image:
  vendor: unsplash
  feature: /photo-1504461154005-31b435e687ed?dpr=1.5&auto=format&fit=crop&w=1500&h=844&q=80&cs=tinysrgb&crop=
  credit: Austin Neill
  creditlink: https://unsplash.com/@arstyy
comments: true
share: true
references:
  - title: "SAP HANA"
    url: "https://www.sap.com/hk/products/hana.html"
  - title: "SAP HANA Administration Guide"
    url: "https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.02/en-US/"

---

* TOC
{:toc}

## Data Compression in the Column Store

https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.02/en-us/bd9017c8bb571014ae79efaeb46940f3.html

SAP HANA 数据库的列存储数据有两类压缩：

* 字典压缩 (Dictionary compression): This default method of compression is applied to all columns. It involves the mapping of distinct column values to consecutive numbers, so that instead of the actual value being stored, the typically much smaller consecutive number is stored.
* 高级压缩 (Advanced compression): Each column can be further compressed using different compression methods, namely prefix encoding, run length encoding (RLE), cluster encoding, sparse encoding, and indirect encoding. The SAP HANA database uses compression algorithms to determine which type of compression is most appropriate for a column. Columns with the PAGE LOADABLE attribute are compressed with the NBit algorithm only.

https://www.tutorialspoint.com/sap_hana_administration/sap_hana_administration_data_compression.htm

```sql
select SCHEMA_NAME, TABLE_NAME, MEMORY_SIZE_IN_TOTAL from PUBLIC.M_CS_TABLES
  where SCHEMA_NAME='SCHEMA_NAME' and TABLE_NAME='TABLE_NAME';

select compression_type, index_type, implementation_flags, count(*)
  from m_cs_columns where schema_name not like '%SYS%'
  group by compression_type, index_type, implementation_flags
  order by count(*) desc
```
