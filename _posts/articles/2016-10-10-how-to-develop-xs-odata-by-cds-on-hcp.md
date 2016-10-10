---
layout: post
title: How to develop an XS Odata Service by CDS on the HCP
excerpt: "SAP HANA Cloud Platform 提供了本地开发的能力，使你可以在本地创建开发XS应用程序，并运行在HANA Cloud上。"
modified: 2016-10-10T15:00:00-00:00
categories: articles
tags: [HCP, Odata, CDS, HANA, Cloud]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "SAP HANA Doc - SAP_HANA_Core_Data_Services_CDS_Reference_en.pdf"
    url: "http://help.sap.com/hana/SAP_HANA_Core_Data_Services_CDS_Reference_en.pdf"
  - title: "SAP HANA Doc - SAP_HANA_Developer_Guide_for_SAP_HANA_Web_Workbench_en.pdf"
    url: "http://help.sap.com/hana/SAP_HANA_Developer_Guide_for_SAP_HANA_Web_Workbench_en.pdf"
---

上一篇[How to develop an XS application on the SAP HANA Cloud Platform][3]中介绍了如何在[HCP][1]上创建一个XS应用程序，本篇在之前的基础上接着介绍[Core Data Services (CDS)][4]在HANA建模中的使用及如何创建[XS Odata service][5]。

理解和使用一项技术最好的方式是用到实际应用中去解决实际的问题，本文就是通过创建能够接受和处理数字账号(e.g. Line, Wechat)请求的程序来介绍这些技术知识。
本文项目完整代码可以查看[Github][2]

## Prerequisites

1. 已经在HCP上创建了一个XS应用程序
2. 有一定的SQL基础知识

## CDS

Core Data Services简称CDS，一种声明式的数据库建模语言，它利用注解的方式简化的了建模繁琐过程。

### Create Context

CDS文件后缀名为**_.hdbdd_**， 继续上一篇编写的创建Table的CDS。

`namespace "digital-account".data` 指定context所在的package。

`@Schema: 'DigAcc'` 注解指定context里的所有artifacts都创建在此schema下。

```javascript
namespace "digital-account".data;

@Schema: 'DigAcc'
context DigAccMessage {
    // ...
};
```

### Create Entity

Context里可以创建用户自定义的数据结构，实体，视图。

这里的亮点在Association的创建，它建立的表或视图直接的关联关系，方便了视图的定义。

```javascript
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

```javascript
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

### Save Post Message

```javascript
function saveMessage(content) {
	var body;

	var id = 0;
	var conn = $.db.getConnection(conSQLConnection);
	conn.prepareStatement("SET SCHEMA " + conSchema).execute(); // Setting the SCHEMA
	
	var pStmt = conn.prepareStatement('select max( \"id\" ) from "' + conMessageTable + '"');
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

Check the view's content

## XS Odata service

新建Odata文件 **_services/DigAccMessage.xsodata_**

### Create Odata service by View

```javascript
service namespace "digital-account.services" {
	"digital-account.data::DigAccMessage.MessageView" as "Messages" keys("id", "eventID");
}
```

&lt;&lt;未完待续&gt;&gt;


[1]:https://account.hanatrial.ondemand.com/cockpit
[2]:https://github.com/anypossiblew/hcp-digital-account/tree/xs-odata
[3]:/articles/how-to-develop-xs-application-on-hcp/
[4]:http://help.sap.com/hana/SAP_HANA_Core_Data_Services_CDS_Reference_en.pdf
[5]:http://help.sap.com/hana/SAP_HANA_Developer_Guide_for_SAP_HANA_Web_Workbench_en.pdf