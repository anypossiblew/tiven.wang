---
layout: post
theme: XiuKai
title: "Develop a Fiori App Using the ABAP RESTful Programming Model"
excerpt: "Develop a travel booking SAP Fiori application by using the managed approach of the ABAP RESTful Programming Model."
modified: 2019-10-06T12:00:00-00:00
categories: articles
tags: [Fiori, ABAP, CDS, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2083.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/yellowstone-national-park-united-states-2083
comments: true
share: true
references:
  - title: "SAP Tutorial - Develop an SAP Fiori App Using ABAP"
    url: "https://developers.sap.com/mission.cp-starter-extensions-abap.html"

---

* TOC
{:toc}

本文我们将使用 SAP Cloud Platform ABAP Environment Trial User 开发一套基于 SAP 云 ABAP 服务的 Fiori 应用.

## Step 1. Create an SAP Cloud Platform ABAP Environment Trial User

详细步骤, 略, 参考 [SAP Tutorial - Create an SAP Cloud Platform ABAP Environment Trial User](https://developers.sap.com/tutorials/abap-environment-trial-onboarding.html)

最后的结果是你可以使用 ADT 访问到 ABAP Package 就可以开发了.

## Step 2. ABAP RESTful Programming Model

The ABAP RESTful Programming Model consists of three main layers:

* Data Modeling & Behavior
* Business Services Provisioning
* Service Consumption

The data modeling and behavior layer contains domain-specific business objects, that are defined with Core Data Services (CDS) and transactional behavior.

The business service provisioning layer consists of projection views with their projection behavior to focus on a particular aspect of the data model which is exposed as business services through the OData protocol.

The service consumption layer allows you to consume all types of OData services as well as OData Web APIs.

![](https://developers.sap.com/tutorials/abap-environment-restful-programming-model/_jcr_content.github-proxy.1569133814.file/overview.png)

The database layer is defined by the definition of dictionary tables.

![](https://developers.sap.com/tutorials/abap-environment-restful-programming-model/_jcr_content.github-proxy.1569133814.file/layer.png)

Our semantic data model is defined by Core Data Services (CDS). Core Data Services are views on top of the dictionary tables.

In the CDS layer you can use and manipulate data that is persisted in the database.

The projection is a subset of the fields of the underlying data model, that are relevant for the application. For example UI annotations would be part of a projection view.

With the service definition you are able to define which data is exposed as a business service.

Service bindings allow you to bind service definitions to a client-server communication protocol such as OData. The service binding is used to start the SAP Fiori Elements App Preview, which makes the application visible on the UI.

To develop a read-only application you need to carry out the steps contain in the dashed rectangle.

![](https://developers.sap.com/tutorials/abap-environment-restful-programming-model/_jcr_content.github-proxy.1569133814.file/layer2.png)

The behavior definition determines the create, update and delete functionality.

The behavior implementation provides the implementation of a behavior. In the managed approach (Greenfield implementation), the implementation of create, update and delete is done automatically.

To develop a full transactional application the steps in the dashed rectangle are required in addition.

![](https://developers.sap.com/tutorials/abap-environment-restful-programming-model/_jcr_content.github-proxy.1569133814.file/layer3.png)

You are able to check the data consistency of an existing instance of an entity by adding validations.

Actions can be used as part of the business logic to execute non-standard operations, such as status change.

To develop additional custom logic such as validations and actions the steps in the dashed rectangle need to be carried out.

![](https://developers.sap.com/tutorials/abap-environment-restful-programming-model/_jcr_content.github-proxy.1569133814.file/layer4.png)

## Step 3. Create Table Persistence and Generate Data

### Step 3.1 Create database table

在 ADT 里你的 ABAP Package 里创建 Database Table 如我的是 **ztravel_tiven**. ADT 会自动打开 Database Table 的代码编辑器, 这样就可以使用有别于以前的 SE11 如现在的 ABAP CDS 代码编辑一样的方式来编辑表定义了. 增加以下字段

```typescript
@EndUserText.label : 'Database table for travel data Tiven'
@AbapCatalog.enhancementCategory : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #LIMITED
define table ztravel_tiven {
  key client      : abap.clnt not null;
  key travel_id   : /dmo/travel_id not null;
  agency_id       : /dmo/agency_id;
  customer_id     : /dmo/customer_id;
  begin_date      : /dmo/begin_date;
  end_date        : /dmo/end_date;
  @Semantics.amount.currencyCode : 'ztravel_tiven.currency_code'
  booking_fee     : /dmo/booking_fee;
  @Semantics.amount.currencyCode : 'ztravel_tiven.currency_code'
  total_price     : /dmo/total_price;
  currency_code   : /dmo/currency_code;
  description     : /dmo/description;
  overall_status  : /dmo/overall_status;
  created_by      : syuname;
  created_at      : timestampl;
  last_changed_by : syuname;
  last_changed_at : timestampl;
}
```

保存并激活就会生成表.

### Step 3.2 Create ABAP class

再创建 ABAP Class 如我的是 **ZCL_GENERATE_TRAVEL_DATA_TIVEN**, 写入以下插入数据的逻辑

```sql
class ZCL_GENERATE_TRAVEL_DATA_TIVEN definition
  public
  final
  create public .

  public section.
    interfaces IF_OO_ADT_CLASSRUN.
  protected section.
  private section.
endclass.



class ZCL_GENERATE_TRAVEL_DATA_TIVEN implementation.
  method IF_OO_ADT_CLASSRUN~MAIN.
    data:ITAB type table of ZTRAVEL_TIVEN.

*   read current timestamp
    get time stamp field data(ZV_TSL).

*   fill internal travel table (itab)
    ITAB = value #(
      ( TRAVEL_ID = '00000022' AGENCY_ID = '070001' CUSTOMER_ID = '000077' BEGIN_DATE = '20190624' END_DATE = '20190628' BOOKING_FEE = '60.00' TOTAL_PRICE =  '750.00' CURRENCY_CODE = 'USD'
        DESCRIPTION = 'mv' OVERALL_STATUS = 'A' CREATED_BY = 'MUSTERMANN' CREATED_AT = '20190612133945.5960060' LAST_CHANGED_BY = 'MUSTERFRAU' LAST_CHANGED_AT = '20190702105400.3647680'  )
      ( TRAVEL_ID = '00000106' AGENCY_ID = '070005' CUSTOMER_ID = '000005' BEGIN_DATE = '20190613' END_DATE = '20190716' BOOKING_FEE = '17.00' TOTAL_PRICE = '650.00' CURRENCY_CODE = 'AFN'
        DESCRIPTION = 'Enter your comments here' OVERALL_STATUS = 'A' CREATED_BY = 'MUSTERMANN' CREATED_AT = '20190613111129.2391370' LAST_CHANGED_BY = 'MUSTERMANN' LAST_CHANGED_AT = '20190711140753.1472620' )
      ( TRAVEL_ID = '00000103' AGENCY_ID = '070010' CUSTOMER_ID = '000011' BEGIN_DATE = '20190610' END_DATE = '20190714' BOOKING_FEE = '17.00' TOTAL_PRICE = '800.00' CURRENCY_CODE = 'AFN'
        DESCRIPTION = 'Enter your comments here' OVERALL_STATUS = 'X' CREATED_BY = 'MUSTERFRAU' CREATED_AT = '20190613105654.4296640' LAST_CHANGED_BY = 'MUSTERFRAU' LAST_CHANGED_AT = '20190613111041.2251330' )
    ).

*   delete existing entries in the database table
    delete from ZTRAVEL_TIVEN.

*   insert the new table entries
    insert ZTRAVEL_TIVEN from table @ITAB.

*   check the result
    select * from ZTRAVEL_TIVEN into table @ITAB.
    OUT->WRITE( SY-DBCNT ).
    OUT->WRITE( 'Travel data inserted successfully!').

  endmethod.
endclass.
```

执行代码就会插入数据到上面的表里.

## Step 4. Define and Expose a CDS-Based Travel Data Model

Define CDS-based data model and create projection view.

### Step 4.1 Define CDS-based travel data model

新建 Core Data Services / Data Definition 即 CDS View 如我的是 **ZI_TRAVEL_M_TIVEN**

```typescript
@AbapCatalog.sqlViewName: 'ZVI_TRAVEL_M_TIV'
@AbapCatalog.compiler.compareFilter: true
@AbapCatalog.preserveKey: true
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Travel data - Tiven'
define root view ZI_TRAVEL_M_TIVEN

  as select from ztravel_tiven as Travel 
  
  /* Associations */
 association [0..1] to /DMO/I_Agency   as _Agency   on $projection.agency_id = _Agency.AgencyID
 association [0..1] to /DMO/I_Customer as _Customer on $projection.customer_id = _Customer.CustomerID
 association [0..1] to I_Currency      as _Currency on $projection.currency_code = _Currency.Currency
{
 key travel_id,
     agency_id,
     customer_id,
     begin_date,
     end_date,
     @Semantics.amount.currencyCode: 'currency_code'
     booking_fee,
     @Semantics.amount.currencyCode: 'currency_code'
     total_price,
     @Semantics.currencyCode: true
     currency_code,
     overall_status,
     description,

/*-- Admin data --*/
     @Semantics.user.createdBy: true
     created_by,
     @Semantics.systemDateTime.createdAt: true
     created_at,
     @Semantics.user.lastChangedBy: true
     last_changed_by,
     @Semantics.systemDateTime.lastChangedAt: true
     last_changed_at,

     /* Public associations */
     _Agency,
     _Customer,
     _Currency
}
```

#### Root View

### Step 4.2 Create projection view for travel

再建一个 CDS View 如我的是 **ZC_TRAVEL_M_TIVEN**

```typescript
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Travel projection view - Processor'

@UI: {
 headerInfo: { typeName: 'Travel', typeNamePlural: 'Travels', title: { type: #STANDARD, value: 'TravelID' } } }

@Search.searchable: true

define root view entity ZC_TRAVEL_M_TIVEN as projection on ZI_TRAVEL_M_TIVEN {
 @UI.facet: [ { id:              'Travel',
                purpose:         #STANDARD,
                type:            #IDENTIFICATION_REFERENCE,
                label:           'Travel',
                position:        10 } ]

 @UI: {
     lineItem:       [ { position: 10, importance: #HIGH } ],
     identification: [ { position: 10, label: 'Travel ID [1,...,99999999]' } ] }
 @Search.defaultSearchElement: true
 key travel_id          as TravelID,

 @UI: {
     lineItem:       [ { position: 20, importance: #HIGH } ],
     identification: [ { position: 20 } ],
     selectionField: [ { position: 20 } ] }
 @Consumption.valueHelpDefinition: [{ entity : {name: '/DMO/I_Agency', element: 'AgencyID'  } }]

 @ObjectModel.text.element: ['AgencyName'] ----meaning?
 @Search.defaultSearchElement: true
 agency_id          as AgencyID, _Agency.Name       as AgencyName,

 @UI: {
     lineItem:       [ { position: 30, importance: #HIGH } ],
     identification: [ { position: 30 } ],
     selectionField: [ { position: 30 } ] }
 @Consumption.valueHelpDefinition: [{ entity : {name: '/DMO/I_Customer', element: 'CustomerID'  } }]

 @ObjectModel.text.element: ['CustomerName']
 @Search.defaultSearchElement: true
 customer_id        as CustomerID,

 @UI.hidden: true
 _Customer.LastName as CustomerName,

 @UI: {
     lineItem:       [ { position: 40, importance: #MEDIUM } ],
     identification: [ { position: 40 } ] }
 begin_date         as BeginDate,

 @UI: {
     lineItem:       [ { position: 41, importance: #MEDIUM } ],
     identification: [ { position: 41 } ] }
 end_date           as EndDate,

 @UI: {
     lineItem:       [ { position: 50, importance: #MEDIUM } ],
     identification: [ { position: 50, label: 'Total Price' } ] }
 @Semantics.amount.currencyCode: 'CurrencyCode'
 total_price        as TotalPrice,

 @Consumption.valueHelpDefinition: [{entity: {name: 'I_Currency', element: 'Currency' }}]
 currency_code      as CurrencyCode,

 @UI: {
       lineItem:       [ { position: 60, importance: #HIGH },
                         { type: #FOR_ACTION, dataAction: 'acceptTravel', label: 'Accept Travel' } ],
     identification: [ { position: 60, label: 'Status [O(Open)|A(Accepted)|X(Canceled)]' } ]  }
 overall_status     as TravelStatus,

 @UI.identification: [ { position: 70, label: 'Remarks' } ]
 description as Description,

 @UI.hidden: true
 last_changed_at    as LastChangedAt
}
```

保存并激活. The projection is the subset of the fields of the travel data model, which are relevant for the travel booking application.

### Step 4.3 Create service definition

在 **ZC_TRAVEL_M_TIVEN** 上点击右键, 选择 **New Service Definition**

```typescript
@EndUserText.label: 'Service definition for ZC_TRAVEL_M_TIVEN'
define service ZUI_C_TRAVEL_M_TIVEN {
  expose ZC_TRAVEL_M_TIVEN as TravelProcessor;
  expose /DMO/I_Customer as Passenger;
  expose /DMO/I_Agency as TravelAgency;
  expose /DMO/I_Airport as Airport;
  expose I_Currency as Currency;
  expose I_Country as Country;
}
```

保存并激活. With the service definition you are able to define which data is exposed as a business service in your travel booking application.

### Step 4.4 Create service binding

在 **ZUI_C_TRAVEL_M_TIVEN** 上点击右键, 选择 **New Service Binding**, Binding Type: **ODATA V2 - UI**. 在 Service Binding 界面里点击激活, 激活后可以看到 Service URL 和 Preview 按钮.

选中 entityset **TravelProcessor**, 并点击 Preview 按钮, 登录授权后便可以在 Fiori List report 查看数据了.

## Step 5. Create Behavior Definition for Managed Scenario

Create behavior definition and implementation for managed scenario.

### Step 5.1 Create behavior definition

在 data definition **ZI_TRAVEL_M_TIVEN** 上点击右键, 选择 **New Behavior Definition**

```typescript
managed implementation in class zcl_bp_i_travel_m_tiven unique;

define behavior for ZI_TRAVEL_M_TIVEN alias Travel
persistent table ztravel_tiven
etag last_changed_at
lock master
{
    // administrative fields (read only)
    field ( readonly ) last_changed_at, last_changed_by, created_at, created_by;

    // mandatory fields that are required to create a travel
    field ( mandatory ) agency_id, overall_status, booking_fee, currency_code;

    // dynamic field control
    field (features : instance ) travel_id;

    // standard operations for travel entity
    create;
    update;
    delete;
}
```

### Step 5.2 Create behavior implementation

在 behavior definition **ZI_TRAVEL_M_TIVEN** 上点击右键, 选择 **New Behavior Implementation**, 名称如我的是 **ZCL_BP_I_TRAVEL_M_TIVEN**. Local types 改成以下代码

```sql
CLASS lhc_travel DEFINITION INHERITING FROM cl_abap_behavior_handler.

  PRIVATE SECTION.

    TYPES tt_travel_update TYPE TABLE FOR UPDATE zi_travel_m_xxx.

    METHODS get_features               FOR FEATURES IMPORTING keys REQUEST    requested_features FOR travel    RESULT result.

ENDCLASS.

CLASS lhc_travel IMPLEMENTATION.

  METHOD get_features.
  ENDMETHOD.

ENDCLASS.
```

保存并激活. The behavior implementation is created for travel booking. By using the managed approach, the implementation of create, update and delete is done automatically.

### Step 5.3 Create behavior definition for projection view

在 data definition **ZC_TRAVEL_M_TIVEN** 上点击右键, 选择 **New Behavior Definition**

```typescript
projection;

define behavior for ZC_TRAVEL_M_TIVEN alias TravelProcessor
use etag
{
    // scenario specific field control
    field ( mandatory ) BeginDate, EndDate, CustomerID;

    use create;
    use update;
    use delete;
}
```

保存并激活.

转到 service binding 里重新 Preview TravelProcessor 便会看到不一样的 List report: The create and delete button appears on the UI because of the managed scenario. You can create and edit travel bookings or you’ re able to delete existing ones.

## Step 6. Enhance Behavior With Action and Validation

Enhance behavior definition and implementation with action and validation.

### Step 6.1 Enhance behavior definition

...