---
layout: post
theme: UbuntuMono
star: true
series:
  url: abap-cds
  title: ABAP CDS
title: Text and Value Help
excerpt: "How to determine and provide texts and value help for a CDS view element in ABAP?"
modified: 2019-06-20T11:51:25-04:00
categories: articles
tags: [CDS, ABAP, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1840.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/paris-france-1840
comments: true
share: true
references:
  - title: "SAP Help - Value Help Based on Foreign Key Relationship"
    url: "https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.52.4/en-US/1b9a9e9d759e4302890c44cf5e10b5b1.html?q=Value%20Help%20Based%20on%20Foreign%20Key%20Relationship"
---

* TOC
{:toc}

怎么给 ABAP CDS 的值字段添加描述字段和帮助字段? 本文以 NW 7.52 上的 `S_ODATA_EPMRA_SO_ANA` 包里的 CDS 为例做讲解.

## Field Labels and Descriptions

ABAP CDS 暴露出来字段的标签和描述是来自其对应的 ABAP Dictionary data elements 标签和描述， 但有时想要重新定义或者本身没有定义 data elements 的字段，则他们的 Labels 和 Descriptions 就需要 Annotations 进行定义了。使用注解 `@EndUserText.label` 定义字段的 label text 和用 `@EndUserText.quickInfo` 定义详细的解释，用于辅助功能提示或者 tooltip 这样的显示内容里。

```typescript
...
  @EndUserText.label: 'List with Sales Orders'  -- Annotation at the view level
  DEFINE VIEW SalesOrderHeader as ... {
  ...
  -- Annotation at the field level
  @EndUserText: { label:  'Sales Order Header', quickinfo: 'Sales Order Header that provides data relevant for all items' }
  SalesOrder as Header;
  ...
```

既然是文本型的就需要支持多语言功能, `@EndUserText` 支持在 **SE63** 传统的 ABAP 系统功能中进行翻译

* 打开 **SE63** 选择 **Short Texts** -> **A5 User Interface Texts** -> **DDLS CDS Views**
* 输入 **CDS name** 和 **Source** and **Target** Language 点击编辑进行翻译

> Unfortunately, translations are not added to TR automatically and need to be added manually.

* 执行 **SLXT**, 如下图说明

![SLXT](/images/abap/cds/slxt-translate.png)

执行后便将翻译保存到了 TR 里

参考阅读

* [CDS Part 14. ABAP Annotations for Translatable Texts in CDS Views](https://sapyard.com/cds-part-14-abap-annotations-for-translatable-texts-in-cds-views/)
* [Adding Field Labels and Descriptions](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.5.15/en-US/9764d0c757be4a5083d0c3b7eaccddd7.html?q=EndUserText)

## Text

### Language-independent

首先看一下语言无关, 就是不区分语言的描述字段, 怎么设置?

[`@ObjectModel.text.element[]`][ObjectModel] 可以定义一个字段的描述字段, 如下面 `Customer` 字段对应的文本字段是 `CompanyName`

```typescript
@AbapCatalog: { sqlViewName: 'SEPMRACALPCUST', compiler.compareFilter: true }
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Customer'
define view SEPMRA_C_ALP_Customer
  as select from SEPM_I_CUSTOMER_E as Customer
{
      @ObjectModel: { text.element:  [ 'CompanyName' ] }
  key cast( Customer as snwd_customer_id preserving type )                      as Customer,

      @Semantics:   { name.fullName: true }
      CompanyName,
      ...
}
```

> SADL - First text field listed in the annotation array will be handled as descriptive text of the annotated field in OData exposure scenarios.
{: .Warning}

之后通过 SADL 暴露出来的 OData Service 的 metadata 就如下, `Customer` 字段的 `sap:text="CompanyName"` 属性就指向了 `CompanyName` 字段

```xml
 <EntityType Name="SEPMRA_C_ALP_CustomerType" sap:label="Customer" sap:content-version="1">
    <Key>
        <PropertyRef Name="Customer"/>
    </Key>
    <Property Name="Customer" Type="Edm.String" Nullable="false" MaxLength="10" sap:display-format="UpperCase" sap:text="CompanyName" sap:label="Customer" sap:quickinfo="EPM: Customer ID"/>
    <Property Name="CompanyName" Type="Edm.String" MaxLength="80" sap:label="Company" sap:quickinfo="EPM: Company Name"/>
</EntityType>
```

这样 Fiori Smart 系列的 Elements 在用到 `Customer` 字段时会自动显示其对应的文本字段 `CompanyName` 的值 ( 或者是合起来的值 `CompanyName(Customer)` )

> NOTE: The usage of this annotation `@ObjectModel.text.element[]` excludes the usage of `@ObjectModel.text.association`.
{: .Notes}

> 旧的 `@Consumption.labelElement: 'CompanyName'` 可以指定文本字段, 但不建议使用了.

### Text Associations

对于与语言相关的文本字段则需要用另外的方式, 使用 `@ObjectModel.dataCategory: #TEXT` 与 `@ObjectModel.text.association: '_Text'` 结合的方式可以做到自动获取语言相关的文本字段值, 如下

```typescript
@EndUserText.label: 'EPM Demo: Country Texts'
@ObjectModel.dataCategory: #TEXT
@ObjectModel.representativeKey: 'Country'

define view SEPM_I_CountryText
as select from t005t

association [0..1] to SEPM_I_Language as _Language
  on $projection.Language = _Language.Language
association [1..1] to SEPM_I_Country  as _Country
  on $projection.Country = _Country.Country

{
  @Semantics.language: true
  key spras     as Language,
  key land1     as Country,
  @Semantics.text: true
  landx50       as CountryName,
  @Semantics.text: true
  natio50       as NationalityName,
  @Semantics.text: true
  landx         as CountryShortName,
  @Semantics.text: true
  natio         as NationalityShortName,

  _Language,
  _Country
}
```

* [`@ObjectModel.dataCategory: #TEXT`][ObjectModel] 注释了此 View 是一个文本视图
* `@Semantics.language: true` 指定一个字段是语言字段, 在 ABQL join Data and Text 时此字段将作为过滤条件默认等于登陆语言, 这样就没必要使用 Session 里的 language 或者输入参数进行语言过滤了
* `@Semantics.text: true` 指示文本字段, SADL 暴露 OData 时将第一个文本字段作为其字段的文本字段

> SAP 推荐的规则
>
* Text views should only be defined for language-dependent texts and are annotated with `@ObjectModel.dataCategory: #TEXT`.
* At least one non-key field has to be defined as a text field in a text view. A text field is annotated with `@Semantics.text: true`
* The language field that is used in the text view must be a key field.
  * The language field is annotated with `@Semantics.language: true`.
  * The language code represents the corresponding ABAP internal format (like `SPRAS`). In particular, do not use external formats/ISO codes!
* The text view defines a representative key field (a field for which the text view provides texts).
* The name of the text view ends either with *...Text* or *...T*.
{: .Notes}

下面就是在其他视图中使用此文本视图, 使用注解 `@ObjectModel.text.association: '<association>'` 来指定字段的文本视图关联

```typescript
@EndUserText.label: 'EPM Demo: Country'

define view SEPM_I_Country
  as select from t005
association [0..*] to SEPM_I_CountryText as _Text
  on $projection.Country = _Text.Country
{
  @ObjectModel.text.association: '_Text'
  key land1  as Country,

  _Text
}
```

* `@ObjectModel.text.association: '_Text'` 注解了 `Country` 字段, `_Text` 是关联的文本视图 `SEPM_I_CountryText`
* `_Text` 并且要将关联暴露出去

然后在生成的 OData metadata 里将会是这样的

```xml
<EntityType Name="SEPMRA_C_ALP_CountryVHType" sap:label="Country" sap:content-version="1">
    <Key>
        <PropertyRef Name="Country"/>
    </Key>
    <Property Name="Country" Type="Edm.String" Nullable="false" MaxLength="3" sap:display-format="UpperCase" sap:text="CountryT" sap:label="国家/地区代码"/>
    <Property Name="CountryT" Type="Edm.String" MaxLength="50" sap:attribute-for="Country" sap:label="Name"/>
</EntityType>
```

* `CountryT` 字段是 SADL 自动会 `Country` 增加的文本字段, 并且有了 `sap:text="CountryT"` 和 `sap:attribute-for="Country"` 两个属性

### Foreign Key Associations

## Value Help

### Based on Foreign Key Relationship

#### Text Provider

![](/images/abap/cds/value-help-foreign-key.png)
首先要建一个 Text provider, 因为我们使 Value Help 可以搜索, 所以除了上面讲到的 Text 相关的注解外还要为 Text View 加上 `@Search.searchable: true` 来表示 View 可以被搜索和 `@Search.defaultSearchElement: true` 来表示字段可以被搜索, 字段还可以加上 `@Search.fuzzinessThreshold: 0.8` 表示搜索的模糊匹配程度
{: .pull-right}

```typescript
@AbapCatalog.sqlViewName: 'ZDEMO_I_T'
@ObjectModel.dataCategory: #TEXT
@ObjectModel.representativeKey: 'UnitOfMeasure'

@Search.searchable: true

define view ZDEMO_I_Text  
    as select from t006a       as TextProvider
{
key TextProvider.msehi          as UnitOfMeasure,
    @Semantics.language: true       // identifies the language  
key TextProvider.spras          as Language,
    @Semantics.text: true           // identifies the text field
    @Search.defaultSearchElement: true
    @Search.fuzzinessThreshold: 0.8
    TextProvider.mseht              as Name
}
```

#### Value Help Provider

还要为 Value Help 建个 View, 此 View 需要 `@Search.searchable: true` 来表示可以被搜索, 然后用 `@ObjectModel.text.association: '_Text'` 和 `@Search.defaultSearchElement: true` 标注一个字段的文本视图和可以被搜索

```typescript
@AbapCatalog.sqlViewName: 'ZDEMO_I_VH'
@Search.searchable: true
@EndUserText.label: 'Unit of Measure Value Help'

define view ZDEMO_I_ValueHelp
as select from t006     as ValueProvider

    association [0..*] to ZDEMO_I_Text as _Text
        on $projection.UnitOfMeasure = _Text.UnitOfMeasure
  {
    @ObjectModel.text.association: '_Text'
    @Search.defaultSearchElement: true
key msehi   as UnitOfMeasure,

    // association
    _Text
  }
```

#### Consumer View

最后在需要加 Value Help 的 View 里把它加上, 关联上 Value provider 视图并用 `@ObjectModel.foreignKey.association: '_QuantityUnitValueHelp'` 把它标注在需要的字段上, 最后别忘了把此 `association` 暴露出去

```typescript
define view ZDEMO_C_ValueHelp_Demo
        as select from SalesOrderItem as Document

/* Association to quantity unit value help provider */
association [0..1] to ZDEMO_I_ValueHelp as _QuantityUnitValueHelp
        on $projection.QuantityUnitCode = _QuantityUnitValueHelp.UnitOfMeasure
...
{
    /* Field list */
    ...
    @Semantics.unitOfMeasure: true
    @ObjectModel.foreignKey.association: '_QuantityUnitValueHelp'
    Document.QuantityUnitCode,
    ...
    /* List of associations */
    ...
    _QuantityUnitValueHelp
}
```

然后在生成的 OData 的 metadata 里便会出现三个新信息

* Value Help 的 EntityType
* Association
* `Common.ValueList` Annotation

如果使用 Fiori Smart 系列的 Elements 便会出来字段的 Value Help 如下图

![](/images/abap/cds/value-help-window.png)

### Modelled View

这种方式就简单一些, 首先创建一个可以被搜索的 Value Provider, 加上 `@Search.searchable: true`, `@Search.defaultSearchElement: true`, `@Search.fuzzinessThreshold: 0.8`

```typescript
@EndUserText.label: 'Business Partner Value Help'
@Search.searchable: true

define view ZDEMO_I_BP_ValueHelp as select from SEPM_I_BusinessPartner_E {

key BusinessPartner,
    BusinessPartnerRole,
    @Search.defaultSearchElement: true
    @Search.fuzzinessThreshold: 0.8
    CompanyName,
    LegalForm,
    EmailAddress
}  
```

然后再用 `@Consumption.valueHelp: '_BusinessPartnerValueHelp'` 使用上就行了, 别忘了暴露出 association

```typescript
define view ZDEMO_C_BP_CONSUMER as select from SEPM_I_SalesOrder_E as SO

// Association to BP value help
association [0..1] to ZDEMO_I_BP_ValueHelp as _BusinessPartnerValueHelp
    on $projection.BusinessPartner = _BusinessPartnerValueHelp.BusinessPartner  
...
{
    /* Field list */
    ...

    @Consumption.valueHelp: '_BusinessPartnerValueHelp'
    SO.BusinessPartner,  
    ...

    /* List of associations */
    ...
    _BusinessPartnerValueHelp
}
```

### SAP Value List

standard or fixed-values

[ObjectModel]:https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.52.4/en-US/896496ecfe4f4f8b857c6d93d4489841.html