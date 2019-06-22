---
layout: post
theme: UbuntuMono
series:
  url: abap-cds
  title: ABAP CDS
title: CDS and OData Extensibility
excerpt: "CDS and OData Extensibility"
modified: 2016-12-08T17:00:00-00:00
categories: articles
tags: [CDS, OData]
image:
  feature: /images/hana/masthead-abap-for-hana.jpg
comments: true
share: true
---

* TOC
{:toc}

### Change Release State
Open transaction **SCLAS_API**, Select Characteristic "Release State" and search for your CDS view. Change your CDS view's release state to **_Released for version '2'_**

### Extensibility registration
Extensibility registration in **SCFD_REGISTRY** (package CUAN_MODEL_S_APPLICATION):

* For Cube views: Retrieval should be done via association to extension include view.

* For query views:

* Query Designer app can be used to create new queries:

* Query Browser can be used for multidimensional analysis of standard and custom queries:
