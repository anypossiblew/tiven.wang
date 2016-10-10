---
layout: post
title: How to develop an XS application on the SAP HANA Cloud Platform
excerpt: "SAP HANA Cloud Platform 提供了本地开发的能力，使你可以在本地创建开发XS应用程序，并运行在HANA Cloud上。"
modified: 2016-10-07T12:00:00-00:00
categories: articles
tags: [HCP, XS, CDS, HANA, Cloud]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "Help Portal - Create a Delivery Unit"
    url: "https://help.sap.com/saphelp_hanaplatform/helpdata/en/d5/ca92aba6b4445aba17ca3f8d671217/content.htm"
---

SAP HANA Cloud Platform 提供了本地开发的能力，使你可以在本地创建开发XS应用程序，并运行在HANA Cloud上。
本文项目完整代码可以参见[Github][2]

## Prerequisites

1. 有一个[SAP HANA Cloud trial landscape][1]账号
2. 有一定的HANA基础知识

## Procedure

### Login HCP Cockpit

登录[https://account.hanatrial.ondemand.com/cockpit][1]

### Create Database

进入到 **Databses & Schemas** 面板
<figure class="center">
	<img src="/images/cloud/hcp/databases-and-schemas.jpg" alt="Databases and Schemas">
	<figcaption>Databases and Schemas</figcaption>
</figure>

创建一个新的Database，Database System选择**HANA MDC(&lt;trial&gt;)**

<figure class="center">
	<img src="/images/cloud/hcp/databases-and-schemas-create.jpg" alt="Create Database">
	<figcaption>Create Database</figcaption>
</figure>

> The SAP HANA Multitenant Database Containers (MDC) feature enables hosting multiple SAP HANA databases on a single SAP HANA system. All tenant databases in the same system share the same system resources (memory and CPU cores) but each tenant database is fully isolated with its own database users, catalog, repository, persistence (data files and log files) and services. And now you can use all this on a trial landscape.
> 
> You can have only one tenant database per account.

创建成功后进入BD界面，显示此Database的一些重要信息
<figure class="center">
	<img src="/images/cloud/hcp/database-mdc-overview.jpg" alt="Database Overview">
	<figcaption>Database Overview</figcaption>
</figure>

> 之后我们访问此DB的host地址均为 https://&lt;DBName&gt;&lt;AccountName&gt;.hanatrial.ondemand.com

### Open Development Tools

打开链接 Development Tools: **_SAP HANA Web-based Development Workbench_** 使用创建Database设置的用户登录
里面有四个工具：

* __Editor__ : Create, edit, execute, debug and manage HANA Respository artifacts

* __Catalog__ : Create, edit, execute and manage HANA DB SQL catalog artifacts

* __Security__ : Create users, create roles, assign objects and manage security

* __Traces__ : View, download traces for HANA applications, set trace levels


> 在执行过程中可能遇到权限问题，可以打开Security为用户添加相应Roles, e.g. **_sap.hana.ide.roles::Developer_**
> 链接格式为 /sap/hana/ide/security/

### Create Package

打开 **_SAP HANA Web-based Development Workbench： Editor_** 工具， 可以看到根目录为Content，即HANA Respository。 

创建一个新的Package "**_digital-account_**"， 我们的项目代码就放在此package下面。

### Assign Delivery Unit (Optional)

为了方便代码传输管理，为此package分配一个delivery unit。

#### Open Application Lifecycle Management

HANA Application Lifecycle Management路径为 **_/sap/hana/xs/lm_**

> 需要权限用户角色为 **sap.hana.xs.lm.roles::Administrator** 

#### Create Delivery Unit

<figure class="center">
	<img src="/images/cloud/hcp/create-delivery-unit.jpg" alt="Create Delivery Unit">
	<figcaption>Create Delivery Unit</figcaption>
</figure>

> 创建之前需要在 **SETTINGS** 设置 **_Vendor_**

#### Assign Delivery Unit

可以在这里分配package给Delivery Unit，也可以在Editor里Assign package to Delivery Unit。

<figure class="center">
	<img src="/images/cloud/hcp/delivery-unit-assign-package.jpg" alt="Assign Delivery Unit">
	<figcaption>Assign Delivery Unit</figcaption>
</figure>

Delivery Unit管理的详细教程可以参见[附录1][3]

### Synchronize with Github (Optional)

可能是为了向现代化的代码管理工具上靠拢，Editor里增加了与Github库同步的功能。

在需要同步的Package上右键菜单中**_Synchronize with Github_**开打Git Pane。
输入Github用户信息，确定后并设置respository和branch，然后就可以双向同步代码了。

<figure class="center">
	<img src="/images/cloud/hcp/package-git-connection.jpg" alt="Synchronize with Github">
	<figcaption>Synchronize with Github</figcaption>
</figure>

### Create Application

在package上右键 _Create Application_ ， 或者手动创建以下几个文件

* __.xsapp__ : 标志此package是一个application, 可以被http访问, 文件内容为空

* __.xsaccess__ : 控制此application的访问属性

* __index.html__ : applicaton的主页面，可选

#### Set Application

这里我们需要更改.xsaccess一些属性。

`"authentication" : null` 为了方便测试及之后的供数字账号事件调用，需要设置匿名访问权限，所以这里授权方式为空。

`"anonymous_connection": "digital-account::DigAccMessage"` 在匿名用户访问系统的情况下这里需要提供一个[数据库连接设置](#create-xs-sql-connection)，以便授予匿名用户访问数据库的权限。

`"cors" : {"enabled" : true}` 显然如果使数字账号可以调用此API的话，需要设置跨域访问。

`"force_ssl" : true` 使用ssl连接更安全。

`"prevent_xsrf" : false` : 因为数字账号服务器并不能提供xsrf token,所以我们关闭此功能

.xsaccess文件完整代码

```javascript
{
    "exposed": true,
    "authentication": null,

    "mime_mapping": [{
        "extension": "jpg",
        "mimetype": "image/jpeg"
    }],
    "force_ssl": true,
    "enable_etags": true,
    "prevent_xsrf": true,
    "anonymous_connection": "digital-account::DigAccMessage",
    "cors": [{
        "enabled": true
    }],
    "cache_control": "no-cache, no-store",
    "default_file": "index.html"
}
```

而.xsapp文件内容为空

#### Access Application

激活代码后，访问 /digital-account/index.html 出现相应页面代表application创建成功。

### Create XS SQL Connection (Optional)

如果用户使用账号登录HANA XS application的话，那么程序访问数据库同样是使用此账号。
如果用户匿名登录或者程序要使用不同于登录帐号的凭证去访问数据库的话，则需要创建独立的SQL Connection Config文件。

#### Create DigAccMessage.xssqlcc

在package下创建一个文件**_DigAccMessage.xssqlcc_**

```javascript
{
  "description" : "Admin SQL connection"
}
```

#### Config SQL Connection

选中package，点击toolbar里的Maintain Details，转到XS Runtime Configuration Details页面。路径为**_/sap/hana/xs/admin/index.html_**， 需要用户拥有相关权限。
这里可以维护XS运行时的一些配置，包括这里的SQL Connection Configurations。
在package下可以看到名为**_DigAccMessage.xssqlcc_**的SQL Connection Configuration，点击并维护其所用User。

<figure class="center">
	<img src="/images/cloud/hcp/maintain-sql-connection.jpg" alt="Maintain SQL Connection Configuration">
	<figcaption>Maintain SQL Connection Configuration</figcaption>
</figure>

> 这里为了简单起见我们使用创建DB时创建的账号SYSTEM，正式开发中我们可能需要赋予其权限更小一些的账号，
> 或者使用参数**role_for_auto_user**的方式只分配指定角色给自动账号。关于HANA权限的管理我们希望后续篇章能介绍。


### Create Data Model

#### Create Schema

创建subpackage **_data_**
创建文件 **_DigAcc.hdbschema_** ， schema name = "database schema name"

```javascript
schema_name = "DigAcc";
```

#### Create Data Models

定义数据模型我们使用新式的CDS方式，文件后缀名为**.hdbdd**， 关于CDS技术信息我们会在后续篇章做更详细介绍。

创建文件 **_data/DigAccMessage.hdbdd_**

```javascript
namespace "digital-account".data;

@Schema: 'DigAcc'
context DigAccMessage {

	type Content : String(5000);
	
	entity Message {
		key id : Integer;
		createdTime: UTCTimestamp;
		content: Content;
	};
};
```

#### Grant Object Privileges to User

为了使相关用户能维护此Schema，需要赋予用户Object Privileges of **_DigAcc_**


### Create xsjs

**.xsjs**文件类型即是**_XS engine_**的http server运行时文件。

#### Create xsjs file

为了能接受数字账号发来的请求，我们要创建一个http server运行时文件 **_line-receiver.xsjs_**。

http请求处理入口逻辑程序为

```javascript
var contentType;

// Check Content type headers and parameters
function validateInput() {

	// Check content-type is application/json
	contentType = $.request.contentType;

	if ( contentType === null || contentType.startsWith("application/json") === false){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 $.response.setBody("Wrong content type request use application/json");
		return false;
	}
	
	return true;
}
	
// Request process 
function processRequest(){
    if (validateInput()){
		try {
		    switch ( $.request.method ) {
		        //Handle your GET calls here
		        case $.net.http.GET:
		            $.response.setBody(JSON.stringify(handleGet()));
		            break;
		            //Handle your POST calls here
		        case $.net.http.POST:
		            $.response.setBody(JSON.stringify(handlePost()));
		            break; 
		        case $.net.http.DEL:
		            //
		            break; 
		        //Handle your other methods: PUT, DELETE
		        default:
		            $.response.status = $.net.http.METHOD_NOT_ALLOWED;
		            $.response.setBody("Wrong request method");		        
		            break;
		    }
		    $.response.contentType = "application/json";	    
		} catch (e) {
		    $.response.setBody("Failed to execute action: " + e.toString());
		}
	}
}

// Call request processing  
processRequest();
```

#### Save Post Message

当数字账号服务器发来post请求时，我们需要保存它的message，这时则需要连接数据库并执行SQL创建记录。
因为我们使用匿名请求，所以在创建DB Connection时需要指定SQL Connection Configuration，这里则是指定之前创建的.xssqlcc。

> 如果使用默认用户登录账号连接数据库，则参数置空`$.db.getConnection();`

```javascript

// Global constant variables
var conSQLConnection = "digital-account::DigAccMessage",
	conSchema = "\"DigAcc\"",
	conMessageTable = "\"digital-account.data::DigAccMessage.Message\"";

function saveMessage(content) {
	var body;

	var id = 0;
	var conn = $.db.getConnection(conSQLConnection); // Create Connection used SQL Connection
	conn.prepareStatement("SET SCHEMA " + conSchema).execute(); // Setting the SCHEMA
	
	var pStmt = conn.prepareStatement("select max( \"id\" ) from " + conMessageTable);
	var rs = pStmt.executeQuery();
	if (rs.next()) {
		id = Number(rs.getNString(1)) + 1;
	}
	rs.close();
	
	pStmt = conn.prepareStatement("insert INTO "+conMessageTable+'("id", "createdTime", "content") values(?, now(), ?)');
	pStmt.setInteger(1, id);
	pStmt.setNString(2, JSON.stringify(content));
	pStmt.executeUpdate();
	pStmt.close();

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

//Implementation of POST call
function handlePost() {
	var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}
	return saveMessage(JSON.parse(bodyStr));
}
```

#### Query Saved Messages

最后创建Get请求的逻辑来查询保存下来的全部Messages

```javascript
//Implementation of GET call
function handleGet() {
    var messages = [];
	var conn = $.db.getConnection(conSQLConnection);
	conn.prepareStatement("SET SCHEMA " + conSchema).execute(); // Setting the SCHEMA
	var pStmt = conn.prepareStatement('select "id", "createdTime", "content" from ' + conMessageTable);
	var rs = pStmt.executeQuery();
	while (rs.next()) {
		messages.push({
			id: rs.getInteger(1),
			createdTime: rs.getTimestamp(2),
			content: rs.getNString(3)
		});
	}
	rs.close();
	
	if (conn) {
		conn.close();
	}
	
	// Retrieve data here and return results in JSON/other format 
	$.response.status = $.net.http.OK;
	return {"result": messages};
}
```

## Local Test

### Test Post

使用下面body内容**post** _/digital-account/line-receiver.xsjs_ ， 会得到成功信息

```javascript
{
  "result": [
    {
      "content":{
        "text":"Hello world!"
      },
      "createdTime":1475033537220,
      "eventType":"138311609000106303",
      "id":"WB1519-3872640834"
    }
  ]
}
```

> 别忘记添加`Content-Type=application/json`在http header

### Test Get Messages

**get** _/digital-account/line-receiver.xsjs_

```javascript
{
  "result": [
    {
      "id": 1,
      "createdTime": "2016-10-10T06:08:33.066Z",
      "content": "{\"result\":[{\"content\":{\"text\":\"Hello world!\"},\"createdTime\":1475033537220,\"eventType\":\"138311609000106303\",\"id\":\"WB1519-3872640834\"}]}"
    }
  ]
}
```

## 总结

本篇我们介绍了初学者如何一步步在HANA Cloud Platform上创建XS application的过程，及简单配置。接下来我们会介绍[How to develop an XS Odata Service by CDS on the HCP](/how-to-develop-xs-odata-by-cds-on-hcp/)



[1]:https://account.hanatrial.ondemand.com/cockpit
[2]:https://github.com/anypossiblew/hcp-digital-account/tree/xs-app
[3]:https://help.sap.com/saphelp_hanaplatform/helpdata/en/d5/ca92aba6b4445aba17ca3f8d671217/content.htm