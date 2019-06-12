---
layout: post
star: true
title: From a CDS View to an OData Service for Analytics
excerpt: "HANA content can be modeled in the HANA database based on the replicated and local data. Basically, HANA content will consumed in the ABAP layer through transient InfoProviders on Operational Data Providers (ODPs). Based on the transient providers, BEx Queries are defined. These Queries serve as a central consumption entity. They are exposed via EasyQuery to allow access via OData for HTML5 UIs and native mobile applications or external access from reports via the BusinessObjects BI Platform."
modified: 2016-12-08T17:00:00-00:00
categories: articles
tags: [VDM, CDS, Analytics, OLAP, BW Query, OData, BICS]
image:
  feature: /images/hana/masthead-abap-for-hana.jpg
comments: true
share: true
references:
  - title: "SAP Help - OLAP Engine"
    url: "http://help.sap.com/saphelp_nw73/helpdata/en/7c/c3e60666cd9147bb6242dc6500cd77/frameset.htm"
  - title: "SAP Help - Generate Service Artifacts From a CDS View"
    url: "http://help.sap.com/saphelp_nw75/helpdata/en/9a/ecb367279e4df3a8608718f6dcea1e/content.htm"
  - title: "SAP Wiki - Easy Query"
    url: "https://wiki.wdf.sap.corp/wiki/display/ABAPBICS/Easy+Query"
  - title: "SAP Blogs - Consumption of CDS in an OData Service"
    url: "https://blogs.sap.com/2016/09/26/consumption-of-cds-in-an-odata-service/"

---

* TOC
{:toc}

## BEx Analyzer
BEx Analyzer is an analytical, reporting and design tool embedded in Microsoft Excel. In BEx Analyzer, you can analyze and plan with selected Info Provider data using the context menu or drag and drop to navigate in queries created in [BEx Query Designer][SAP-BEx-Query-Designer]. You can design the interfaces for your queries by inserting design items (controls) such as analysis grids, dropdown boxes and buttons into your Excel workbook. This allows you to transform your workbook into a query application.

**BICS** means BI Consumer Services and is a SDK developed and used by SAP.

## Virtual Data Models
A virtual data model (VDM) is a structured representation of HANA database views used in SAP HANA Live for SAP Business Suite and follows consistent modeling rules.
It provides direct access to SAP business data using standard SQL or OData requests. Business data is exposed through well-defined database views, operating directly on the tables of the SAP Business Suite systems and transforming them into consistent and easily understandable views. These views can be consumed directly by rich client UIs (such as HTML5, SAP BusinessObjects, and Excel) without any additional software layer (an ABAP application system, for example) in between (two-tier architecture).

VDM View types:

* Interface(I)
* Consumption(C)
* Private(P)

See also:

* [Virtual Data Models in 2016][saphana-blogs-vdm]
* [SAP HANA Live & S/4HANA Embedded Analytics][sap-blogs-hana-live-analytics]

### SAP HANA Live
SAP HANA Live (previously known as SHAF – SAP HANA Analytic Foundation) is solution for real-time reporting on HANA.
It is a separate package that comes with predefined SAP HANA content across the SAP Business Suite.

SAP HANA Live provides SAP-delivered content (similar in concept like SAP BW content), in form of SAP HANA calculation views for real-time operational reporting.  The calculation views spans across majority of ECC modules (FI, CO, MM, PP, SD, PS, CRM, GTS, AM and GRC).

The content is represented as a VDM - virtual data model, which is based on the transactional and master data tables of the SAP Business Suite.

Currently more than 2000 views are delivered in HANA Live Package.

#### Architecture of HANA Live
HANA Live calculation views are designed on top of SAP Business Suite tables. These views are optimized for best performance and analytic purposes. These views form a [Virtual Data Model (VDM)]() that customers and partners can reuse.
Data provided by the virtual data model can be presented through multi-purpose analytical UIs, such as SAP BusinessObjects BI Suite UIs, and domain-specific web applications.

[![HANA Live Architecture](/images/hana/olap/hana-live-arch.jpg)](/images/hana/olap/hana-live-arch.jpg)


## From a HANA Model to an OData Service
The data must be transferred through four different object layers:

1. HANA View ( Analytical or Calculation or CDS )
2. Transient InfoProvider
3. Easy Query
4. OData Service

[![Analytics Architecture](/images/hana/olap/Analytics_Architecture_Pattern.png)](/images/hana/olap/Analytics_Architecture_Pattern.png)

These are the steps to get data from HANA views via an OData Service:

### Enable CDS View for Analytic Manager

[Analytics Annotations][CDS-Analytics-Annotations] enable the [analytic manager][SAP-Analytic-Manager] for multidimensional data consumption, performing data aggregation, and slicing and dicing data. BI frontends like Design Studio and Analysis Office can consume the data via the analytic manager.

**@Analytics.dataCategory**:

* **_#DIMENSION_** master data
* **_#FACT_** transactional data (center of star schema) without redundancy
* **_#CUBE_** factual data used for queries
* **_#AGGREGATIONLEVEL_** a projection of cube view

[VDM Annotations][CDS-VDM-Annotations] allow classifying views of the virtual data model in terms of their admissible reuse options and provisioned content. VDM is intended to be interpreted by view browsers and other functionality which is based on the virtual data model.
This classification is used only for SAP internal structuring and interpretation of the CDS views. Releasing CDS views for customers and partners is controlled by additional internal classification of the views.

**@VDM.viewType**:

* **_#BASIC_** core data basis without data redundancies
* **_#COMPOSITE_** data derived and/or composed from the BASIC views
* **_#CONSUMPTION_** based upon public interface (for example, BASIC and COMPOSITE) views

**@VDM.private**:

* **_true_** technical helper views which may only be used by their defining responsibles

#### Create Basic View
Create two basic CDS views, set the views as VDM basic view type by `@VDM.viewType: #BASIC`.

* view for contacts of digital account

```sql
@AbapCatalog.sqlViewName: 'ZIMKT_DIGACC'
@VDM.viewType: #BASIC
@EndUserText.label: 'Contacts of Digital Account'
define view ZI_Mkt_DigAcc as select from cuand_da_root
association [0..*] to cuand_ce_mp_root as _MarketingPermission
  on cuand_da_root.comm_cat_key = _MarketingPermission.comm_cat_key
{
    @EndUserText.label: 'Digital Account'
    key cuand_da_root.digacc_id as DigitalAccount,
    @EndUserText.label: 'Communicate Category'
    cuand_da_root.comm_cat_key as CommCatKey,
    @EndUserText.label: 'Marketing Area'
    cuand_da_root.mkt_area_id as MarketingArea,
    @EndUserText.label: 'Contact'
    _MarketingPermission.contact_key as Contact
}
```
* view for contact interactions

```sql
@AbapCatalog.sqlViewName: 'ZIMKT_IA'
@VDM.viewType: #BASIC
@EndUserText.label: 'Interaction'
define view ZI_Mkt_Interaction as select from cuand_ce_ic_root
association [0..*] to cuand_ce_ia_rt as _interaction
  on $projection.Contact = _interaction.contact_key
{
  @EndUserText.label: 'Contact'
  key cuand_ce_ic_root.db_key as Contact,
  @EndUserText.label: 'Interaction'
  _interaction.db_key as Interaction,
  _interaction // Make association public
}
```

#### Create Cube View
Create a view for analytic manager using annotation `@Analytics.dataCategory: #CUBE` and set the VDM view type as *#COMPOSITE*

```sql
@AbapCatalog.sqlViewName: 'ZIMKT_DIGACC_C'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #CHECK
@Analytics.dataCategory: #CUBE
@VDM.viewType: #COMPOSITE
@EndUserText.label: 'Cube for Contacts of Digital Account'
define view ZI_Mkt_DigAcc_C as select from ZI_Mkt_DigAcc as digitalAccount
association [1] to ZI_Mkt_Interaction as _interaction
  on $projection.Contact = _interaction.Contact
{
  key digitalAccount.DigitalAccount,
  key digitalAccount.MarketingArea,
  @EndUserText.label: 'Contact'
  key digitalAccount.Contact,
  @EndUserText.label: 'Interactions'
  @DefaultAggregation: #SUM
  count( distinct _interaction.Interaction ) as Interactions,  
  _interaction // Make association public
}
group by
  digitalAccount.DigitalAccount,
  digitalAccount.MarketingArea,
  digitalAccount.Contact
```

The cube view will be published as a transient provider for the [analytic manager][SAP-Analytic-Manager].

### Preview Transient Info Provider
Start TX **RSRTS_ODP_DIS** ( Display Transient InfoProvider ) to select a SAP HANA View.

[![Display Transient InfoProvider](/images/hana/olap/DisplayTransientInfoProvider.jpg)](/images/hana/olap/DisplayTransientInfoProvider.jpg)

The details of Transient Provider:
[![Display Transient InfoProvider](/images/hana/olap/TransientInfoProvider-Display.jpg)](/images/hana/olap/TransientInfoProvider-Display.jpg)

`Goto`->`Standard Query`

[![Display Transient InfoProvider](/images/hana/olap/TransientInfoProvider-StandardQuery.jpg)](/images/hana/olap/TransientInfoProvider-StandardQuery.jpg)

Start [**_Query Designer_**][SAP-BEx-Query-Designer] to create a new query with a special type, named EasyQuery (EQ).

### Create BExQuery ( EQ )
Create a new Query based on the Transient InfoProvider of *ZIMKT_DIGACC_C*.

[![Create New Query](/images/hana/olap/CreateNewQuery.jpg)](/images/hana/olap/CreateNewQuery.jpg)

All characteristics that shall be included in the EasyQuery have to be in Rows. Add Dimensions and Key Figures to the Query Columns. In the extended query properties choose "Lightweight consumption by Easy Query". Currently please do not use "By OData". When saving the query, write it to a transportable package and include it in a transport request.

![Add Dimension And Key Figures](/images/hana/olap/AddDimensionAndKeyFigures.jpg)

Check if Easy Query is successful generated. Start transaction **EQManager** in BW/ODP client( e.g. ANA(333)). The query should appear in the list. A generated function module /BIC/NF_xx indicates indicates a sucessful generation. Field Easy Query and FUnction Module must be filled. If not, try to regenerate the Easy Query with the appropriate button.

![Check Easy Query](/images/hana/olap/EQCheck.jpg)

> It is required to have sufficient authorization and appropriate system settings to create/modify objects in packages $TMP and $EQ_GEN.

Or check it by transaction [**RSRT**][notes-1591837] Query Monitor

See also: [Introduction To BEX Query Designer and Query Elements][introduction-to-bex-query-designer]

### Include Query in BI Content Bundle (TBD)
The BEx query will not be activated automatically in test or customer landscapes. The content that shall be activated in test or customer system needs to be included in a BI content bundle. These bundles have to be activated manually in test systems after transport of the query. They will be activated in customer systems automatically when running the technical configuration. To include a query to a BI content bundle, call transaction **BSANLY_BI_ACTIVATION** in the development system. Choose a proper bundle and edit it. Add the query below. To do that, choose object type = Query element, Object Technical Name = Query Enterprise ID (obtained from extended properties in Query Designer), Grouping = Only neccessary Objects). Save. Press Check Consitency, The query description should apear.

![Content bundle](/images/hana/olap/Content_bundle.PNG)

### Generate OData Service
Generate an analytical OData Service: Use Transaction **/IWBEP/ANA_SRV_GEN**:

* Access Type: Controller for Easy Queries (SAP BW)
* SAP BW: RFC Destination: NONE
* Query Name: Select the Easy Query
* Target Package: your package
* Model Provider Class: `CL_<provider name>_MPC`
* Data Provider Class: `CL_<provider name>_DPC`
* Configure Gateway Model and Service: X
* Model Name and Version: `<EQ name>_MODEL`
* Service Name and Version: `<EQ name>_SRV`

[![SAP Gateway Analytics Service Generator ](/images/hana/olap/gateway-analytics-service-generator.jpg)](/images/hana/olap/gateway-analytics-service-generator.jpg)

Check the generated gateway service using transaction **/IWBEP/REG_SERVICE**, you can also find the entity set external name (e.g. ZQ_DIGACC_CONTACTSResults) in the *Configuration* menu.

[![SAP Gateway Display Service](/images/hana/olap/gateway-display-service.jpg)](/images/hana/olap/gateway-display-service.jpg)

#### Activate Gateway Service

Start transaction **/IWFND/MAINT_SERVICE** to add the gateway service in the service catalog, ensure the ICF nodes for OData and system aliases configuration are ok.

[![SAP Gateway Add Service](/images/hana/olap/gateway-add-selected-services.jpg)](/images/hana/olap/gateway-add-selected-services.jpg)

#### Include Service in Project Data Model
Start transaction **SEGW**, open a project (or create a new one). Under "Data Model" choose include or redefine "OData Service (SAP GW)". Click next, set *Technical Service Name*. Click on next and Finish the wizard.

[![SAP Gateway Redefine Service](/images/hana/olap/gatway-redefine-service.jpg)](/images/hana/olap/gatway-redefine-service.jpg)

The fieldnames in the generated service look like GUIDs. in order to expose the service with nicer field names (e.g. for consumption in Lumira), beautifaction of the fieldnames can be done.
In a next step you can redefine the attribute names of the entity to give thema a speaking name. Select the attribute in your entity type, press redefine and type a new property name:

![Content bundle](/images/hana/olap/segw_renameattr.PNG)

Generate the service and select option *Overwrite Base/Extended Service*.

Save the service. The usual steps for OData services apply: Activation, transport, **PFCG** role assignment, including in TC is like for the standard OData services.

> Queries may not be changed in an incompatible way. Thay means, existing fields from already delivered queries may not be deleted.<br>
Fields from delivered OData services my not be removed or renamed, as this would also be an imcompatible change

> May be get an error from accessing the OData service when you includes the gateway service in exist gateway project, then you can click the button 'Load Metadata' in transaction **/IWFND/MAINT_SERVICE** to refresh the metadata of the OData service.

## Use CDS Annotations for OData Service
Use another approach to expose CDS view as an OData service.

### Create CDS View for Analytics Query
Create a CDS View used for Analytics Query by annotation `@Analytics.query: true`, which select data from Cube CDS view. And add annotation `@OData.publish: true` onto the view to publish it to an OData service.

```sql
@AbapCatalog.sqlViewName: 'ZMKT_DIGACC_Q'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Query view of Digital Account'
@VDM.viewType: #CONSUMPTION
@Analytics.query: true
@OData.publish: true
define view ZC_Mkt_DigAcc_Q as select from ZI_Mkt_DigAcc_C
{
  ZI_Mkt_DigAcc_C.DigitalAccount,
  ZI_Mkt_DigAcc_C.MarketingArea,
  ZI_Mkt_DigAcc_C.Contact,
  ZI_Mkt_DigAcc_C.Interactions
}
```

The Query can be check in transaction **RSRT** (format `2C<CUBE_SQL_VIEW>/2C<QUERY_SQL_VIEW>`), the result is similar to 'Easy Query'.
And you can also check the generated OData technical service named `<QUERY_VIEW>_CDS` in transaction **/IWBEP/REG_SERVICE**.

### Activate the Service
Activate the service in transaction **/IWFND/MAINT_SERVICE** manually. Now, you can access the OData service

*/sap/opu/odata/SAP/ZC_MKT_DIGACC_Q_CDS/ZC_MKT_DIGACC_Q*

## OData Client Call
When you call the OData service in client, you can filter data by

`$filter=dimension1 eq 'value1'`

or/and select dimensions and key figures by

`$select=dimension1,dimension2,figure1,figure2`

e.g.

*https://{{host}}/sap/opu/odata/sap/ZQ_DIGACC_CONTACTS_SRV/ZQ_DIGACC_CONTACTSResults?$filter=A2CKQH731XOYIUNQD11RXSEL87ON eq '@uap4797x'&$select=A2CKQH731XOYIUNQD11RXSEL87ON,A2CNTOY6TG213INT1FU3OEG9467Y,A2CZIMKT_DIGACC_CCONTACT,A00O2SOLU7ADPK7EF25PQKBUOL_F*

[CDS-Analytics-Annotations]:http://help.sap.com/saphelp_nw75/helpdata/en/c2/dd92fb83784c4a87e16e66abeeacbd/content.htm
[CDS-VDM-Annotations]:https://help.sap.com/saphelp_nw75/helpdata/en/ef/e9c80fc6ba4db692e08340c9151a17/content.htm
[SAP-Analytic-Manager]:https://help.sap.com/saphelp_nw75/helpdata/en/f7/8e93e8850b244085f2c4a39a7d73d5/frameset.htm
[SAP-Modeling]:https://help.sap.com/saphelp_nw75/helpdata/en/4a/3739a65e291c67e10000000a42189c/content.htm
[SAP-BEx-Query-Designer]:https://help.sap.com/saphelp_nw75/helpdata/en/9d/76563cc368b60fe10000000a114084/content.htm
[SAP-ABAP-SADL]:http://help.sap.com/saphelp_nw75/helpdata/en/13/d9849973dd4174adaa375f568984bf/content.htm

[introduction-to-bex-query-designer]:http://www.guru99.com/introduction-to-bex-query-designer-and-query-elements.html
[saphana-blogs-vdm]:https://blogs.saphana.com/2016/04/06/virtual-data-models-2016/
[sap-blogs-hana-live-analytics]:https://blogs.sap.com/2013/01/02/sap-hana-live-s4hana-embedded-analytics/

[notes-1508237]:https://launchpad.support.sap.com/#/notes/0001508237
[notes-1591837]:https://launchpad.support.sap.com/#/notes/0001591837

[OLAP-Technology]:https://wiki.scn.sap.com/wiki/display/BI/OLAP+Technology

[kramdown]:http://kramdown.gettalong.org/index.html
