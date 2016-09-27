---
layout: post
title: How to handle Timezone in SAP HANA, ABAP OData and UI5
excerpt: "本文主要介绍如何在SAP的系列软件中包括Fiori UI5， ABAP， OData， HANA，如何处理不同时区UTC用户使用统一时间timestamp数据。How to handle Timezone in SAP HANA, ABAP OData and UI5"
modified: 2016-09-27T15:51:25-04:00
categories: articles
tags: [Timezone, Timestamp, SAP, HANA, ABAP, OData, UI5]
image:
  feature: fiori/mashheader-fiori.png
comments: true
share: true
references:
  - title: "Wikipedia - 时区"
    url: "https://zh.wikipedia.org/wiki/时区"

---

本文主要介绍如何在SAP的系列软件中如何处理不同时区用户使用统一时间数据。

## background

时区是指地球上使用同一个时间定义的区域。以前，人们通过观察太阳的位置（时角）决定时间，这就使得不同经度地方的时间有所不同（地方时）。1863年，首次使用时区的概念。时区通过设立一个区域的标准时间，部分地解决了这个问题。

![Standard World TimeZones](https://upload.wikimedia.org/wikipedia/commons/e/e8/Standard_World_Time_Zones.png)

作为一个国际性公司，当其在使用SAP软件时也会遇到不同时区的用户使用统一系统时间数据所带来的差异性问题。例如存储在SAP系统数据库中的业务数据时间是0时区时间，记一笔业务发生的时间是2016/09/26 20：00：00， 如果东8区的中国用户在查看系统时选择的时间范围是UTC+8 2016/09/27到2016/09/28，转换为0时区的时间应该是UTC+0 2016/09/26 16:00:00到2016/09/28 15：59：59，则这笔业务会被统计在UTC+8 2016/09/27这一天内。而如果是0时区英国用户查看则这笔会统计在2016/09/26。

本文介绍在SAP程序中如何处理这种情况。

## UI5

如果要在SAP UI5界面做基于日期/月/年这种数据分析，我们可以使用类似下面的Analysis Table和Date Bar。

![Analysis by Dates Image](/images/fiori/Analysis-by-Dates.png)

当用户选择如2016/09/17 - 2016/09/23时，这个日期是指用户所在时区的日期，在发送服务器请求前转换为UTC+0的timestamp，以便服务器统一处理时间。

![Date Time Bar Image](/images/fiori/Date-Time-Bar.png)

### Get User Timezone

UI获取当前时区的代码可以参考如下

```javascript
function getUserTimezone() {
	var userTimsezone = "UTC+0000";
	var now = new Date();
	var offset = now.getTimezoneOffset() / 60;
	if(offset === 0){
	  userTimsezone = "UTC";
	}else{
	  var iMod = offset % 1;
	  var sMinutes = "";

	  if(Math.abs(iMod) === 0.5){
	    sMinutes = "3";
	  }

	  var iUserTimezone = - offset; //add minus to offset

	  //if user time zone is negative use the sign else add a plus
	  if(iUserTimezone < 0){
	    userTimsezone = "UTC" + parseInt(iUserTimezone) + sMinutes;
	  }else{
	    userTimsezone = "UTC+" + parseInt(iUserTimezone) + sMinutes;
	  }

	  if(userTimsezone === "UTC+1"){
	    userTimsezone = "CET";
	  }
	}
	return userTimsezone;
}
```

### Add to OData parameters

UI5通过OData Model与后台交互，在OData请求参数里添加两个参数Timezone和Timestamp。

(Filter/Timezone eq 'UTC+8') and (Filter/Timestamp ge datetime'2016-09-16T16:00:00' and Filter/Timestamp le datetime'2016-09-23T15:59:59')

## OData ABAP

### ABAP Timestamp type
当ABAP服务端的OData收到请求时，前端UTC的timestamp时间戳会被转换成`TIMESTAMPL`类型。

ABAP提供两个built-in types和两个Dictionary types，如下表：

|Data Type	| Description |
| --------- |:----------- |
|**D**		| A built-in fixed-length date type of the form `YYYYMMDD`. For example, the value 20100913 represents the date September 13, 2010.|
|**T**		| A built-in fixed-length time type of the form `HHMMSS`. For example, the value 102305 represents the time 10:23:05 AM. |
|**TIMESTAMP** (Type P – Length 8 No decimals)	| An ABAP Dictionary type used to represent short timestamps in the form `YYYYMMDDhhmmss`. For example, the value 20100913102305 represents the date September 13, 2010 at 10:23:05 AM. |
|**TIMESTAMPL** (Type P - Length 11 Decimals 7)	| An ABAP Dictionary type used to represent long timestamps in the form `YYYYMMDDhhmmssmmmuuun`. The additional digits *mmmuuun* represent fractions of a second. |
{: .table}

### Convert to locale timestamp
ABAP收到的是timestamp in UTC+0和时区（e.g. UTC+8），需要把timestamp转换成locale的如2016-09-16T16:00:00 -> 2016-09-17T00:00:00

```sql
CONVERT TIME STAMP lv_ts_dummy TIME ZONE lv_timezone INTO DATE lv_date_dummy.
```

## HANA

### Table
加入HANA数据库有下面这个结构的数据表, 时间字段类型是`TIMESTAMPL`， 要根据之前的选择日期进行统计每天销售总量。

#### Sales_Order

| ID | TIMESTAMP 	         | SALES  |
| -- | --------------------- | ------ |
| 1  | 20160901050837        | 5      |
| 2  | 20160916202313.577781 | 2      |
| 3  | 20160922151022        | 10     |
{: .table}

### HANA SQL

那么我们需要的SQL如下, `TO_TIMESTAMP`转换ABAP TIMESTAMP成UTC timestamp，`UTCTOLOCAL`转换UTC timestamp成Local日期时间，`TO_DATS`截取日期。

```sql
SELECT TO_DATS(UTCTOLOCAL(TO_TIMESTAMP(TIMESTAMP), 'UTC+8')) AS DATE_LOCAL, 
		SUM(SALES) AS SALES
  FROM "Sales_Order"
  WHERE (TIMESTAMP BETWEEN '20160916160000.0000000'
           AND '20160923155959.0000000')
    GROUP BY TO_DATS(UTCTOLOCAL(TO_TIMESTAMP(TIMESTAMP), 'UTC+8'))
```

### With Time Dimension
假如某一天没有业务数据，那上面的SQL就没有记录输出。前端UI需要在某天没有销售记录的情况下要输出数量为0的记录，我们可以修改SQL如下，增加M_TIME_DIMENSION的关联，`M_TIME_DIMENSION`是时间维度的全记录表。

```sql
SELECT
      A.DATE_LOCAL,
      A.SALES,
      B.DATE_SAP AS DATE
FROM "_SYS_BI"."M_TIME_DIMENSION" AS B
LEFT OUTER JOIN (
	SELECT TO_DATS(UTCTOLOCAL(TO_TIMESTAMP(TIMESTAMP), 'UTC+8')) AS DATE_LOCAL, 
		SUM(SALES) AS SALES
  FROM "Sales_Order"
  WHERE (TIMESTAMP BETWEEN '20160916160000.0000000'
           AND '20160923155959.0000000')
    GROUP BY TO_DATS(UTCTOLOCAL(TO_TIMESTAMP(TIMESTAMP), 'UTC+8'))
    ) AS A ON A.DATE_LOCAL = B.DATE_SAP
WHERE B.DATETIME_SAP BETWEEN '20160917000000' AND '20160923000000'
GROUP BY B.DATE_SAP,
         A.DATE_LOCAL,
         A.SALES
```

## 总结

本文总结了不同时区用户查看SAP系统时，程序如何处理按时区时间统计数据。希望对读者能有所帮助。
