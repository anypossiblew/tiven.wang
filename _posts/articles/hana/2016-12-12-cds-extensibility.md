---
layout: post
title: From a CDS View to an OData Service
excerpt: "HANA content can be modeled in the HANA database based on the replicated and local data. Basically, HANA content will consumed in the ABAP layer through transient InfoProviders on Operational Data Providers (ODPs). Based on the transient providers, BEx Queries are defined. These Queries serve as a central consumption entity. They are exposed via EasyQuery to allow access via OData for HTML5 UIs and native mobile applications or external access from reports via the BusinessObjects BI Platform."
modified: 2016-12-08T17:00:00-00:00
categories: articles
tags: [VDM, CDS, OLAP, BW Query, OData, BICS]
image:
  feature: hana/masthead-abap-for-hana.jpg
comments: true
share: true
---

* TOC
{:toc}

### Change Release State
Open transaction **SCLAS_API**, Select Characteristic "Release State" and search for your CDS view. Change your CDS view's release state to **_Released for version '2'_**

### Extensibility registration
Extensibility registration in **SCFD_REGISTRY** (in ER3, package CUAN_MODEL_S_APPLICATION):

* For Cube views: Retrieval should be done via association to extension include view.

* For query views:

* Query Designer app can be used to create new queries:

* Query Browser can be used for multidimensional analysis of standard and custom queries:
