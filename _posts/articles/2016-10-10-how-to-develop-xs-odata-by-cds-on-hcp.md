---
layout: post
title: How to develop an XS Odata Service by CDS on the HCP
excerpt: "本文介绍HANA CDS在实际中的应用及如何在SAP HANA Cloud Platform上利用CDS开发OData Service"
modified: 2016-10-11T12:00:00-00:00
categories: articles
tags: [HCP, OData, CDS, HANA, Cloud]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "SAP HANA Doc - SAP HANA Core Data Services CDS Reference en.pdf"
    url: "http://help.sap.com/hana/SAP_HANA_Core_Data_Services_CDS_Reference_en.pdf"
  - title: "SAP HANA Doc - SAP HANA Developer Guide for SAP HANA Web Workbench en.pdf"
    url: "http://help.sap.com/hana/SAP_HANA_Developer_Guide_for_SAP_HANA_Web_Workbench_en.pdf"
---

* TOC
{:toc}

上一篇[How to develop an XS application on the SAP HANA Cloud Platform][3]中介绍了如何在[HCP][1]上创建一个XS应用程序，本篇在之前的基础上接着介绍[Core Data Services (CDS)][4]在HANA建模中的使用及如何创建[XS Odata service][5]。

理解和使用一项技术最好的方式是用到实际应用中去解决实际的问题，本文就是通过创建能够接受和处理数字账号(e.g. Line, Wechat)请求的程序来介绍这些技术知识。
本文项目完整代码可以查看[Github][2]

## Prerequisites

1. 已经在HCP上创建了一个XS应用程序
2. 有一定的OData和SQL基础知识

## CDS

Core Data Services简称CDS，一种声明式的数据库建模语言，它利用注解的方式简化的了建模繁琐过程。

### Create Context

CDS文件后缀名为**_.hdbdd_**， 继续上一篇编写的创建Table的CDS。

`namespace "digital-account".data` 指定context所在的package。

`@Schema: 'DigAcc'` 注解指定context里的所有artifacts都创建在此schema下。

```sql
namespace "digital-account".data;

@Schema: 'DigAcc'
context DigAccMessage {
	// ...
};
```

### Create Entity

Context里可以创建用户自定义的数据结构，实体，视图。

这里的亮点在Association的创建，它建立的表或视图直接的关联关系，方便了视图的定义。

```sql
	/**
	 * User-Defined Structured Type for Message Content
	 */
	type Content : String(5000);
	// Event ID Type
	type EventID : String(20);
	// User ID Type
	type UserID : String(40);
	
	/**
	 * Table definition for Inbound Message
	 */
	entity Message {
		key id : Integer;
		createdTime: UTCTimestamp;
		events : Association[*] to Event on events.message = id;
		content: Content;
	};
	
	/**
	 * Table definition for Events in a Message
	 */
	entity Event {
		key message: Integer;
		key id: EventID;
		createdTime: UTCTimestamp;
		eventType: String(20);
		fromUser: Association to User;
		toUser: Association to User;
		subscribers: Association[*] to Subscriber on subscribers.event = id;
		content : Content;
	};
	
	/**
	 * Table definition for the Users in an Event
	 */
	entity Subscriber{
		key event: EventID;
		key user: Association to User;
	}
	
	/**
	 * Table definition for User info
	 */
	entity User {
		key id: UserID;
		@SearchIndex.fuzzy: { enabled: true }
		displayName: String(100);
		pictureUrl: String(100);
		statusMessage: String(100);
	};
```

### Create View

由于Association在entity之间明确的定义，这里创建view则显得尤为方便。这种特性应该是来源于HANA View的思路。

```sql
	/**
	 * View definition for Messages
	 */
	view MessageView AS SELECT FROM Message {
		id,
		createdTime,
		events.id as eventID,
		events.eventType as eventType,
		events.toUser.id as toUserID,
		events.toUser.displayName as toUserName,
		events.subscribers.user.id as userID,
		events.subscribers.user.displayName as userName
	};
```

保存文件后如果没有错误，则会自动激活artifacts。在Catalog查看Schema DigAcc下有相应Tables和View创建成功。

## Modify xsjs

更改过数据模型之后比原来多了几个表，所以我们还需要更新xsjs文件以保存相应的数据。

### Save Post Message

现在保存Message的时候还要同时创建Event，Subscriber，User。

```javascript
function saveMessage(content) {
	var body;

	var id = 0;
	var conn = $.db.getConnection(conSQLConnection);
	conn.prepareStatement("SET SCHEMA " + conSchema).execute(); // Setting the SCHEMA
	
	var pStmt = conn.prepareStatement('select max( "id" ) from "' + conMessageTable + '"');
	var rs = pStmt.executeQuery();
	if (rs.next()) {
		id = Number(rs.getNString(1)) + 1;
	}
	rs.close();
	
	pStmt = conn.prepareStatement('insert INTO "'+conMessageTable+'"("id", "createdTime", "content") values(?, now(), ?)');
	pStmt.setInteger(1, id);
	pStmt.setNString(2, JSON.stringify(content));
	pStmt.executeUpdate();
	pStmt.close();
	
	var i = 0;
	if(content.result && content.result.length > 0) {
		for(i = 0; i < content.result.length; i++) {
			createEvent(conn, id, content.result[i]);
		}
	}

	// All database changes must be explicitly commited
	conn.commit();

	$.response.status = $.net.http.OK;
	body = {
			id: id,
			info: "Success!"
		};
	
	if (conn) {
		conn.close();
	}
	return body;
}

function createEvent(conn, id, event) {
    
	var pStmt, mid, toMid, j, persons;
    
	toMid = event.to[0];
						
	pStmt = conn.prepareStatement('INSERT INTO "'+conEventTable+'"("message", "id", "createdTime", "eventType", "fromUser.id", "toUser.id", "content") values(?, ?, ?, ?, ?, ?, ?)');
	pStmt.setInteger(1, id);
	pStmt.setNString(2, event.id);
	if(event.createdTime) {
		pStmt.setTimestamp(3, new Date(event.createdTime) );
	}else {
		pStmt.setNull(3);
	}
	pStmt.setNString(4, event.eventType);
	pStmt.setNString(5, event.from);
	pStmt.setNString(6, toMid);
	pStmt.setNString(7, JSON.stringify(event));

	pStmt.executeUpdate();
	pStmt.close();
	
	if(event.content.params) {
		for(j = 0; j < event.content.params.length; j++) {
			mid = event.content.params[j];
			if(!mid) {
				continue;
			}
			createSubscriber(conn, event.id, mid);
		}
	}
	
	if(event.content.from) {
		createSubscriber(conn, event.id, event.content.from);
	}
	
	if(event.to && event.to.length) {
	    createUser(conn, event, event.to[0]);
	}
}

function createSubscriber(conn, event, mid) {
	var pStmt = conn.prepareStatement('INSERT INTO "'+conSubscriberTable+'"("event", "user.id") values(?, ?)');
	pStmt.setNString(1, event);
	pStmt.setNString(2, mid);
	pStmt.executeUpdate();
	pStmt.close();
	
	createUser(conn, event, mid);
}

function createUser(conn, event, mid) {
	var pStmt;
	pStmt = conn.prepareStatement('UPDATE "' + conUserTable + '" set "displayName" = ?, "pictureUrl" = ?, "statusMessage" = ? where "id" = ?');
	pStmt.setNString(1, 'tiven');
	pStmt.setNString(2, 'http://tiven.wang');
	pStmt.setNString(3, '');
	pStmt.setNString(4, mid);
	var update = pStmt.executeUpdate();
	pStmt.close();
	
	if(!update) {
		pStmt = conn.prepareStatement('INSERT INTO "'+conUserTable+'"("id", "displayName", "pictureUrl", "statusMessage") values(?, ?, ?, ?)');
		pStmt.setNString(1, mid);
		pStmt.setNString(2, 'tiven');
		pStmt.setNString(3, 'http://tiven.wang');
		pStmt.setNString(4, '');
		update = pStmt.executeUpdate();
		pStmt.close();
	}
}
```

### Check Table Content

**Post** _/digital-account/line-receiver.xsjs_

发送测试数据

```javascript
{
  "result": [
    {
      "from": "u206d25c2ea6bd87c17655609a1c47cb8",
      "fromChannel": 1341301815,
      "to": [
        "u93892c0a44ffce86e7b5cb67ecc55677"
      ],
      "toChannel": 1480700431,
      "eventType": "138311609000106303",
      "id": "ABCDEF-12345678903",
      "content": {
        "id": "1234567890123",
        "contentType": 1,
        "from": "Line",
        "createdTime": 1476083982493,
        "to": [
          "u93892c3a44ffce86e7b5cb67edc55677"
        ],
        "toType": 1,
        "contentMetadata": null,
        "text": "Hello,world!",
        "location": null
      }
    }
  ]
}
```

然后打开Catalog工具，打开schema **_DigAcc_**下的view **_digital-account.data::DigAccMessage.MessageView_**， 点击**_Open Content_**即可看到相应内容。

## XS OData service

新建Odata文件 **_services/DigAccMessage.xsodata_**

### Create OData service

根据数据库对象创建Odata service语法有两种引用方式

* __Repository objects__ design-time name

* __Database objects__ runtime name

Objects可以是Table，View或者Procedure，在有design-time name的情况下建议使用design-time name。

```sql
service namespace "digital-account.services" {
	"digital-account.data::DigAccMessage.MessageView" as "Messages" keys("id", "eventID");
	"digital-account.data::DigAccMessage.Message" as "Message";
}
```

访问下面链接可以得到此OData service信息，关于OData基础知识我们不做过多介绍，有需要可以阅读相关文章。


_/digital-account/services/**DigAccMessage.xsodata**_

_/digital-account/services/DigAccMessage.xsodata/**$metadata**_

_/digital-account/services/DigAccMessage.xsodata/**Messages?$format=json**_

### Create OData Association

你还可以创建Entities之间的关联，通过创建Associations做到Navigation的效果。

```sql
"digital-account.data::DigAccMessage.Message" as "Message" navigates ("Message_Events" as "events");
"digital-account.data::DigAccMessage.Event" as "Event";
	
association "Message_Events" with referential constraint principal 
	"Message"("id") multiplicity "1" 
	dependent "Event"("message") multiplicity "*";
```

访问下面链接可以查看Navigation效果

_/digital-account/services/DigAccMessage.xsodata/Message_

_/digital-account/services/DigAccMessage.xsodata/Message?**$expand=events**_

### Writeable OData service

默认情况下所有EntitySets都可以有创建修改操作即可以接受post put请求，你可以使用下面定义修改可写功能。

```sql
"digital-account.data::DigAccMessage.Message" as "Message" navigates ("Message_Events" as "events") delete forbidden;
"digital-account.data::DigAccMessage.Event" as "Event" delete forbidden;

association "Message_Events" with referential constraint principal 
	"Message"("id") multiplicity "1" 
	dependent "Event"("message") multiplicity "*";
```

正常情况下每次接受一条数据的创建，如果想要以此请求创建或修改多条记录可以使用Batch Requests。

如果想要自定义创建修改或者删除逻辑，可以自定义出口程序xsjslib或者sqlscript procedure

```sql
"digital-account.data::DigAccMessage.Message" as "Message" navigates ("Message_Events" as "events") delete forbidden
	create using "digital-account:message.xsjslib::createMessage";
```

message.xsjslib文件内容为

```javascript

let	conSchema = "DigAcc",
	conMessageTable = "digital-account.data::DigAccMessage.Message";
	
function createMessage(param) {

	let before = param.beforeTableName;
	let after = param.afterTableName;

	let content = "";
	let pStmt = param.connection.prepareStatement('select "content" from "' + after +'"');
	var rs = pStmt.executeQuery();
	if (rs.next()) {
		content = rs.getNString(1);
		$.trace.error(JSON.stringify(content));
	}
	rs.close();
	pStmt.close();

	let id = 0;
	pStmt = param.connection.prepareStatement('select max( "id" ) from "'+conSchema+'"."'+ conMessageTable + '"');
	rs = pStmt.executeQuery();
	if (rs.next()) {
		id = Number(rs.getNString(1)) + 1;
	}
	rs.close();
	pStmt.close();
	
	pStmt = param.connection.prepareStatement('insert into "'+conMessageTable+'"("id", "createdTime", "content") values(?, now(), ?)');
	pStmt.setInteger(1, id);
	pStmt.setNString(2, content);
	pStmt.executeUpdate();
	pStmt.close();
}
```

## Next Steps

本篇我们简要介绍了CDS在HANA建模中的使用，及由CDS定义OData service的过程。接下来我们接着本篇往下介绍在XS application和Odata service的基础上，如何创建SAPUI5程序去展现服务端视图数据及管理

* [How to Create a Fiori app Using OData service on the HCP][6]。


[1]:https://account.hanatrial.ondemand.com/cockpit
[2]:https://github.com/anypossiblew/hcp-digital-account/tree/xs-odata
[3]:/articles/how-to-develop-xs-application-on-hcp/
[4]:http://help.sap.com/hana/SAP_HANA_Core_Data_Services_CDS_Reference_en.pdf
[5]:http://help.sap.com/hana/SAP_HANA_Developer_Guide_for_SAP_HANA_Web_Workbench_en.pdf
[6]:/articles/how-to-develop-ui5-app-using-odata-on-hcp/