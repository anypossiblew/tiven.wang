---
layout: post
theme: UbuntuMono
series: 
  url: fiori
  title: SAP Fiori
title: "List Reporting Apps"
excerpt: ""
modified: 2019-09-26T12:00:00-00:00
categories: articles
tags: [Fiori, CDS, SAP]
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

https://sapui5.hana.ondemand.com/#/topic/1cf5c7f5b81c4cb3ba98fd14314d4504

https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.52.4/en-US/a1243bff462b4ee3a03e2bb6fc30e015.html

> This is implemented using specific CDS annotations, which you – as a **Fiori app developer** – add to the source code of the respective CDS view.

> A CDS annotation (in short: annotation) adds metadata to the view that expands the syntax options of SQL.

In this development scenario, you will use different types of CDS annotations:

* **Core annotations** - can be specified in the source code of any ABAP CDS object and are evaluated by ABAP runtime environment.

* **UI annotations** - allow you to focus OData UI vocabulary on usage patterns of data in UIs representing certain semantic views of business data. The UI annotations used are evaluated by the SADL framework, which means that SADL translates CDS annotations into the corresponding OData annotations.

* **Search annotations** - allow you to define search fields as filters or . The annotations used are also evaluated by the SADL framework.

* **Analytics annotations** - provide data elements with aggregation behaviour in analytical scenarios.

## Enabling Variant Management

Variants allow you to store settings that users create for the smart filter bar, such as selection fields and layout, and for the smart table, such as sorting and visible columns.

```json
"sap.ui.generic.app": {
  "_version":"1.1.0",
  "pages": [
    {
      "entitySet": "XXXXXX_Product",
      "component": {
        "name": "sap.suite.ui.generic.template.ListReport",
        "list": true,
        "settings" : {
          "gridTable" : false,
          "multiSelect": false,
          "smartVariantManagement": true
```

## Smart Filter Bar

使用 [Selection Fields](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.52.4/en-US/17d5ee74dd4e4e8f802aaf4fdd51fbc6.html) 注解为 `com.sap.vocabularies.UI.v1.SelectionFields` 为 Smart Filter Bar 增加 Filter 字段。

[Smart Filter Bar](https://sapui5.hana.ondemand.com/#/topic/7bcdffc056a94731b4341db73251e32b.html)

[ABAP CDS - Consumption Annotations](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.5.3/en-US/d60c0bf6798a481fb7412bc89934cb8a.html)

### Value Help as a Dropdown List

If your value help contains a fixed number of values, a dropdown list will be rendered.

可以通过 metadata 里的 Property 的 `sap:semantics='fixed-values'` 来控制。

#### Value Help Multiple Selections

多选和单选可以通过 metadata 里的 Property 的 `sap:filter-restriction="single-value"` 来控制。

涉及到 ABAP CDS Annotations `@Consumption.filter.multipleSelections` 和 `@Consumption.filter.selectionType`

## Settings for List Report Tables

如果要决定 EntitySet 的字段有哪些需要在 List Report 的 Table 上显示, 可以用 Annotation `com.sap.vocabularies.UI.v1.LineItem` 来定义.

```xml
<Annotation Term="UI.LineItem">
  <Collection>
    <RecordType="UI.DataField">
      <PropertyValue Property="Value" Path="Product"/>
      <Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
    </Record>
    <RecordType="UI.DataField">
      <PropertyValue Property="Value" Path="ProductCategory"/>
      <Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
    </Record>
    <RecordType="UI.DataField">
      <PropertyValue Property="Value" Path="Supplier"/>
      <Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
    </Record>
  </Collection>
</Annotation>
```

[CDS Annotation - @UI.lineItem](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.52.4/en-US/f8af07bb0770414bb38a25cae29a12e9.html#loiof8af07bb0770414bb38a25cae29a12e9__UI_lineItem)

[Columns - Defining CDS Annotations for Metadata-Driven UIs](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.52.4/en-US/df2525ef4ca548cf873ff14e00e4372d.html)