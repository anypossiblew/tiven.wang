---
layout: post
theme: UbuntuMono
star: true
series:
  url: abap-cds
  title: ABAP CDS
title: ObjectModel Annotations
excerpt: "ObjectModel CDS Annotations 注解的作用详解"
modified: 2019-12-26T12:00:00-00:00
categories: articles
tags: [CDS, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2095.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/erfurt-germany-2095
comments: true
share: true
---

* TOC
{:toc}

`@ObjectModel` 是对一个 CDS View 的标记，它代表这个 View 可以表示一个 Business Object 。 `@ObjectModel` 作为一个 Business Object 那么它就有可能会被用在这几个引擎中: **BOPF**, **SADL**, **ABQL**, **Analytic Manager**, 那么 `@ObjectModel` 注解会影响这几个引擎。 下面我们分解介绍 `@ObjectModel` 下的各个注解是如何影响不同的引擎的。

## Compositional Hierarchy

对于 Business Object 可以使用以下注解来表示层级结构的属性：

影响： **SADL** 和 **BOPF**

### @ObjectModel.association.type

作为一个具有层次结构的组合视图，那么它就有 association 的定义，相应的就需要定义 association 在 Object Model 语义中的类型。

* `#TO_COMPOSITION_CHILD`: 指定一个直系子视图的 Association
* `#TO_COMPOSITION_PARENT`: 如果此视图不是层级结构的根那么就需要指定一个这样的指向其父视图的 Association
* `#TO_COMPOSITION_ROOT`: 从性能上考虑 (for example: authorization checks (instance restrictions) based of information from root views) 如果此视图不是根视图还可以指定一个指向其根视图的 Association， 此时根视图要有注解 `@ObjectModel.compositionRoot: true`

对于 **BOPF** 引擎如果此视图还指定了 `@ObjectModel.transactionalProcessingEnabled: true` 那么在生成 BO 时此视图层级结构中的所有视图都会包含在同一个 BOPF business object 中。

对于 **SADL** 如果视图使用 OData auto-exposure (`@OData.publish: true`) 时此层级结构中的所有视图都会包含在同一个 OData Service 中。

### @ObjectModel.compositionRoot

指定此视图是层级结构中的根视图。

## Business Logic

### @ObjectModel.createEnabled

`@ObjectModel.createEnabled: true` 的情况下才允许创建 BO 数据记录。

* 使 **SADL** 暴露出 POST 接口。
* 使 **BOPF** 接收创建请求，如果其值是 `@ObjectModel.createEnabled: 'EXTERNAL_CALCULATION'` 那么 TODO

同样逻辑还适用于 `@ObjectModel.deleteEnabled` `@ObjectModel.updateEnabled` `@ObjectModel.draftEnabled`

### @ObjectModel.entityChangeStateId

This annotation is related to a single field that contains the change state of an active document. The change state is always updated as soon as the document is changed. Usually, fields like last changed timestamp, hash values, or version counters are used as `EntityChangeStateIds`.

例如

```typescript
@ObjectModel: {
  modelCategory: #BUSINESS_OBJECT,
  compositionRoot: true,
  transactionalProcessingEnabled: true,
  writeDraftPersistence: 'SEPMRA_PD',
  draftEnabled:  true,
  createEnabled: true,
  updateEnabled: true,
  deleteEnabled: true,
  entityChangeStateId: 'LastChangedDateTime',
}
```

## Data Category

### @ObjectModel.dataCategory

此注解指明此视图的数据类别

* `#TEXT`: **ABQL** 引擎会将没有指明 language key 的 join **Data-** 与 **Text** 表示为 1:(0,1) 的关系，language key 将会是默认登陆语言. **NOTE**: Within the VDM a text view is always language-dependent.
* `#HIERARCHY`: Indicates that the entity represents the hierarchy-related data. This could be a header information or structure information.

## Foreign Key

`@ObjectModel.foreignKey.association`: Defines association to a view that represents a value list/check table of the annotated filed. The annotated field must be valuated as equal to the annotated representative key field of the target view. The maximum target cardinality of the association has to be 1.

**SADL**: Derives a default *value help support* from the foreign key relationship.
