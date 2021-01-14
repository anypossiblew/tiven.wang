---
layout: post
theme: UbuntuMono
series:
  url: sap-bw
  title: SAP Business Warehouse
title: "Access SAP BW/4HANA"
excerpt: "如何访问 BW4HANA 系统的 OLAP 数据"
modified: 2020-11-11T11:51:25-04:00
categories: articles
tags: [BW, CDS, HANA]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5620.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/barcelona-spain-5620
comments: true
share: true
---

* TOC
{:toc}

## [Open Analysis Interfaces](https://help.sap.com/doc/PRODUCTION/saphelp_nw74/7.4.16/en-US/d9/ed8c3c59021315e10000000a114084/content.htm?no_cache=true)

SAP NetWeaver Business Intelligence provides an open architecture in many areas: You can extract data from various systems into a BW system and evaluate this data for your reporting using various front-end tools.

SAP Business Explorer, the front-end component of SAP Business Warehouse, provides flexible reporting and analysis tools to support strategic analysis and decision making in your organization.

The following interfaces are available to connect third-party front-end tools to BW:

* OLE DB for OLAP (ODBO)
* OLAP BAPI (Business Application Programming interface)
* XML for Analysis (XML/A)
* Easy Query
* OData
* OData Query


All these interfaces are based on **MDX** (Multi-Dimensional Expressions).

![MDX result](/images/s4hana/bw4hana/h-00100010000_image001.gif)

![OLE OLAP](/images/s4hana/bw4hana/olap - overview of the various interfaces.png)
{: .center.middle}

Third-party front-end tools can send query requests to the MDX processor in the BW system via the available interfaces. This processor sends on the request to the OLAP processor. The OLAP processor accesses InfoProviders. These InfoProviders either contain the data objects themselves (InfoProvider with type data target, such as InfoCube, ODS object and InfoObject), or reporting-relevant views of data objects (MultiProvider, RemoteCube, InfoSet).

##  MDX as Basis for the Interfaces 

MDX (multi-dimensional expressions) is a language developed by Microsoft for queries using multi-dimensional data. An MDX expression returns a multi-dimensional result set (*dataset*) that consists of axis data and cell data.

The syntax of multi-dimensional expressions is defined in the Microsoft specification OLE DB for OLAP.

> Microsoft [**OLE DB**](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms722784(v=vs.85)) is a set of COM-based interfaces that expose data from a variety of sources. OLE DB interfaces provide applications with uniform access to data stored in diverse information sources, or data stores. These interfaces support the amount of DBMS functionality appropriate to the data store, enabling the data store to share its data.

> Microsoft? [**OLE DB for Online Analytical Processing (OLAP)**](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms714903(v=vs.85)) is a set of objects and interfaces that extends the ability of **OLE DB** to provide access to multidimensional data stores. OLAP applications typically handle huge volumes of complexly interrelated data, and OLE DB for OLAP enables users to perform sophisticated data analysis through fast, consistent, interactive access to a variety of possible views of the underlying information. [SalesData Example](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms722730(v=vs.85))

The following example of a MDX request contains the above elements:

```SQL
SELECT
  { [Measures].[CKF_SI_PROFIT],
    [Measures].[0D_DOCUMENT],
    [Measures].[0D_OORVALSC]
  } ON COLUMNS,
  NON EMPTY
    [0D_PLANT].MEMBERS
  ON ROWS
FROM [0D_SD_C03/SAP_DEMO_OLEDB]
WHERE
  ( [0CALMONTH].[200101],
    [0D_COUNTRY].[US] )
```

The following graphic shows this example and the result:

![MDX result](/images/s4hana/bw4hana/h-00100010000_image002.gif)
{: .center.middle}

## OLAP BAPI

OLAP BAPIs (Business Application Programming Interfaces) offer third-parties and customers who program for themselves an industry standard for accessing BW business processes and data, via their own frontend tool.OLAP BAPIs are defined in the BOR (Business Object Repository) as methods belonging to SAP Business object types. They are implemented as RFC-enabled function modules.Applications, regardless of their OLAP architecture, can use the available methods to connect to the BW server.

SAP BW provides direct access via the BAPI library so as to enable a platform-independent access to the OLAP BAPIs.

OLAP BAPIs:

OLAP BAPI | Features | 
--- | --- |
*MDDataProviderBW* | Methods for browsing the BW metadata and master data |
*MDDataSetBW* | Methods for executing multidimensional result sets and fetch data |
 

[OLAP BAPI](https://help.sap.com/doc/PRODUCTION/saphelp_nw74/7.4.16/en-US/64/9b8f3c855f0454e10000000a11405a/content.htm?no_cache=true)

## Access BEx Query

BEx Queries gives us three different ways to expose our data to the reporting tools. In the Remote Access screen area of the General tab, you can view and configure the settings for remote access.

1. By OLE DB for OLAP  

https://visualbi.com/blogs/sap/sap-bw-hana/sap-bw4hana/remote-access-bex-query-b4hana/
