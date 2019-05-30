---
layout: post
theme: UbuntuMono
series: 
  url: s/4hana-cloud
  title: S/4HANA Cloud
title: "Developing Apps with SAP Fiori Elements"
excerpt: "How to do developing Fiori Apps with SAP Fiori Elements"
modified: 2019-04-18T11:51:25-04:00
categories: articles
tags: [Fiori, Web IDE, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2083.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/yellowstone-national-park-united-states-2083
comments: true
share: true
---

* TOC
{:toc}

> App developers can use SAP Fiori elements to create SAP Fiori applications based on **OData services** and **annotations** that _**don't need JavaScript UI coding**_ . The resulting app uses predefined views and controllers that are provided centrally. This means no application-specific view instances are required. The SAPUI5 runtime interprets metadata and annotations of the underlying OData service and uses the corresponding views for the SAP Fiori app at startup.

> 本文所使用的 SAP UI5 Version 是 `1.52`

> 本文中的 Annotations 的 namespace `UI` 皆为缩写，在 Fiori App 的 Annotation 文件中配置别名如下
```xml
<edmx:Reference Uri="/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/factsheet/vocabularies/UI.xml">
  <edmx:Include Alias="UI" Namespace="com.sap.vocabularies.UI.v1"/>
</edmx:Reference>
```

## Filter Field Selection

`UI.SelectionFields` Annotation 表示哪些字段可以用作 Select Filters

```xml
<Annotation Term="UI.SelectionFields">
  <Collection>
    <PropertyPath>DeliveryCalendarYear</PropertyPath>
    <PropertyPath>SoldToParty</PropertyPath>
    <PropertyPath>Product</PropertyPath>
    <PropertyPath>MainProductCategory</PropertyPath>
    <PropertyPath>DeliveryCalendarQuarter</PropertyPath>
    <PropertyPath>SalesOrderOverallStatus</PropertyPath>
  </Collection>
</Annotation>
```

至于字段各种搜索帮助怎么配置，可以参见 SmartFilterBar 的 Annotation 配置。

### Visual Filter

除了使用标准的 Smart Filter Bar 之外，SAP Fiori Element 的 Analytical List Page 为了增加分析界面的既视性，还增加了 Visual Filter 即各种交互式图表。

![](https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2018/03/Visual-Filter-Bar-Expanded-2-1100x210-1100x210.png)

配置 Visual Filter 费了一番周折。

#### Analytic Cards

[Analytic Cards](https://sapui5.hana.ondemand.com/1.52.13/#/topic/d7b0b420eccf4d50bfd1b8a75e7a0fed)

#### Semantic Coloring

Criticality 临界
Thresholds 阈值

## Smart Controls

### SmartChart setup

> Controls in the `sap.ui.comp` library (smart controls) focus strongly on SAP Fiori elements.

如果要对一个 SmartChart 的 Model 增加额外的 Filter 的话可以在事件 `beforeRebindChart` 的监听函数里

```javascript
onBeforeRebindChart: function(oEvent) {
  oEvent.getParameters().bindingParams.filters.push(new sap.ui.model.Filter("SoldToParty", sap.ui.model.FilterOperator.EQ, "100000005"));
}
```

### SmartVariantManagement

### Personalization Dialog


https://sapui5.hana.ondemand.com/#/topic/03265b0408e2432c9571d6b3feb6b1fd.html
