---
layout: post
title: HANA Default Client
excerpt: "When accessing the HANA views directly (or via analytical tools like Lumira or BOC), a proper client needs to be maintained at the HANA database user."
modified: 2016-11-30T17:00:00-00:00
categories: articles
tags: [HANA]
image:
  feature: /images/hana/masthead-abap-for-hana.jpg
comments: true
share: true
---

* TOC
{:toc}


When accessing the HANA views directly (or via analytical tools like Lumira or BOC), a proper client needs to be maintained at the HANA database user.

It can be maintained in the HANA studio (Navigator -> Systems -> <SID> -> Security -> Users -> <UserID>)

![HANA Session Client](/images/hana/hana/session-client.png)

Assign a default client to an calculation view and filter data at runtime based on the default client value. The table below lists the default client value types you can assign and their description.

|----------------------+--------------|
| Default Client Value | Description  |
|:--------------------:|:-------------|
| Session Client | If you use session client as the default client value, then at run time, modeler filters the table data according to the value you specify as the session client in the user profile. |
| Cross Client | If you use cross client as the default client value, then modeler does not filter the table data against any client and you see values relevant to all clients. But the explicit filter with input parameter `MANDT=$$client$$` can filter the table data in sql from ABAP. |
| Fixed Client | If you want to use a fixed client value, for example, 001, then modeler the table data for this client value. |

## ABAP-Specific Session Variables in SAP HANA
Session variables are global variables in the SAP HANA database that can be accessed there using the predefined function **SESSION_CONTEXT**. Session variables contain global information about the current context and are hence similar to *ABAP system fields*.

When a SAP HANA database is used as the central AS ABAP database, the following session variables are filled with ABAP-specific values in ABAP reads:

* **CLIENT** contains the current *client* in accordance with the nominal value of the ABAP system field `sy-mandt`.
* **APPLICATIONUSER** contains the current *client* in accordance with the nominal value of the ABAP system field `sy-uname`.
* **LOCALE_SAP** contains the language of the current *text environment* in accordance with the nominal value of the ABAP system field `sy-langu`.

> * The ABAP-specific session variables can be used, for example, in [**AMDP methods**][abenamdp_method_glosry] and make the associated input parameters superfluous. A method of this type should only be called from ABAP programs in this cases, since it cannot otherwise be guaranteed that the variables are given the correct values.
> * In the [**ABAP CDS**][abenabap_cds_glosry] DDL, the syntax [`$session.vname`][abencds_f1_session_variable] can be used in the definition of a CDS view to access the ABAP-specific session variables. The name vname is then different from the name shown here. When a CDS view is accessed using [Open SQL][abenopen_sql_glosry], the session variables are available on all supported database platforms and not just on the SAP HANA database.


### Get the details of your session context

```sql
SELECT
	 *
FROM M_SESSION_CONTEXT
WHERE connection_id = ( SELECT
	 connection_id
	FROM M_CONNECTIONS
	WHERE own = 'TRUE' )
;
```

### Example

The example [SAP HANA, ABAP-Specific Session Variables][abenhana_session_variables_abexa] shows various ways of accessing the session variables specified here.



[abenhana_session_variables_abexa]:https://help.sap.com/abapdocu_750/en/abenhana_session_variables_abexa.htm
[abenamdp_method_glosry]:https://help.sap.com/abapdocu_750/en/abenamdp_method_glosry.htm
[abenabap_cds_glosry]:https://help.sap.com/abapdocu_750/en/abenabap_cds_glosry.htm
[abencds_f1_session_variable]:https://help.sap.com/abapdocu_750/en/abencds_f1_session_variable.htm
[abenopen_sql_glosry]:https://help.sap.com/abapdocu_750/en/abenopen_sql_glosry.htm

[kramdown]:http://kramdown.gettalong.org/index.html
