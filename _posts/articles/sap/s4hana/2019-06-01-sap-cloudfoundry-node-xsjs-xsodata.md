---
layout: post
theme: UbuntuMono
star: true
series: 
  url: sap-cloudfoundry-node
  title: SAP Cloud Foundry Node.js
title: "Create XSJS and XSOData Service"
excerpt: "How to develop xsodata service and xsjs api in Node.js Application."
modified: 2019-06-01T11:51:25-04:00
categories: articles
tags: [HANA, SAP Cloud SDK, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5508.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/dronten-netherlands-5508
comments: true
share: true
---

* TOC
{:toc}

本系列文章我们将介绍如何为 SAP S4HANA Cloud 系统开发扩展程序 （Extension App）。本文（项目源代码可下载自 [GitLab sourcecode](https://gitlab.com/i.tiven.wang/s4hana-cloud-sdk-demo/tree/xsjs)）将介绍如何使用 Cloud Foundry 的 Node.js Application 开发 XSODATA 服务部署在 HANA DB Service 上。

首先让我们来看一下 SAP Cloud Foundry 平台上针对 HANA DB Service 的开发架构图

![](/images/s4hana/sap-cf-node-hana-architecture.png)
{: .center.middle}

* HDI Deploy 是我们上一篇 [SAP Cloud Foundry Node.js - HANA DB Service](/sap-cloudfoundry-node-hana-service/) 介绍的如何部署和导入 HANA DB 数据库 Artifacts
* HANA Client 是 SAP 为 Node.js Application 连接 HANA DB 开发的客户端程序包
* XSJS 则是由原来的 HANA XSC 里的 XSJS 迁移到 Node.js 来的一个（多个） Modules，其中包括了 xsjs 程序包和发布 xsodata 的程序包

本篇我们将介绍使用 XSJS 开发应用程序以及访问 HANA DB HDI 的功能。

## Step 1. Import Demo Data

为了更方便的练习，我们需要导入一些数据库 Artifacts 样例，数据文件可下载自 [GitHub repository](https://github.com/SAP/com.sap.openSAP.hana5.templates/raw/hana2_sps01/ex2/core-db/data.zip)

创建文件夹 *db/src/data* 并把数据包解压到此文件夹下，删除其中的 *FLIGHT.hdbcds* 文件。重新部署 *db* 模块 `cf push` 即可导入数据到 HANA DB 服务里。

## Step 2. Setup XSJS Application

这里我们创建 XSJS Application 其实是 XSA 开发模式中的 [XSA # Create Node.js Module](/articles/sap-cloudfoundry-xsa-getting-started/#step-7-create-nodejs-module) 同类程序，只不过是脱离了 SAP Web IDE 的开发。

* 在项目根目录下创建文件夹 *xsjs* 并初始化为 Node.js 项目 `npm init -y`。

* 安装依赖包
```sh
npm i @sap/xsjs --save
npm i @sap/xsenv --save
npm i @sap/xsjs-test --save-dev
```

> 安装 `@sap/xsjs-test` 时需要为 npm 配置 python 程序路径 `npm config set python "D:\dev\programs\python27\python.exe"`
{: .Notes}

* 创建文件夹 *xsjs/lib* 这里面主要存放 xsjs 相关的程序代码。
  * 创建 *index.xsjs* 作为主入口程序
  * 创建文件夹 *xsjs* 作为存放 xsjs 程序代码的位置
  * 创建文件夹 *xsodata* 作为存放 xsodata 代码的位置

* 创建文件 *xsjs/server.js* 作为这个 Application 的入口程序

```javascript
/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var xsjs  = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port  = process.env.PORT || 3000;

var options = {
	anonymous : true, // remove to authenticate calls
	auditLog : { logToConsole: true }, // change to auditlog service for productive scenarios
	redirectUrl : "/index.xsjs"
};

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	options = Object.assign(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
xsjs(options).listen(port);

console.log("Server listening on port %d", port);
```

* 在 *package.json* 里加入启动脚本

```json
"scripts": {
  "start": "node server.js"
}
```

## Step 3. Create XSODATA and XSJS

* 创建 OData Service 程序 *xsjs/lib/xsodata/purchaseOrder.xsodata* 参考 [Maintaining OData Services in XS Advanced](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/78606fc13a6b41e5b654ca5f289351ca.html)

```coffee
service {
    "PurchaseOrder.Header" as "POHeader" navigates ("Items" as "POItem");
    "PurchaseOrder.Item"   as "POItem";

    association "Items" principal "POHeader"("PURCHASEORDERID") multiplicity "1" dependent "POItem"("PURCHASEORDERID") multiplicity "*";
}
```

* 创建 xsjs 程序,详情请参考代码，这里就不再赘述

```javascript
/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0*/
/*eslint-env node, es6 */
"use strict";

var conn = $.hdb.getConnection();
var query = "SELECT FROM PurchaseOrder.Item { " +
	        " PURCHASEORDERID as \"PurchaseOrderItemId\", " +
            " PRODUCT as \"ProductID\", " +
            " GROSSAMOUNT as \"Amount\" " +
            " } ";
var rs = conn.executeQuery(query);

var body = "";
for(var item of rs){
   if(item.Amount >= 500){
	body += item.PurchaseOrderItemId + "\t" +
			item.ProductID + "\t" + item.Amount + "\n";
   }
}

$.response.setBody(body);
$.response.contentType = "application/vnd.ms-excel; charset=utf-16le";
$.response.headers.set("Content-Disposition", "attachment; filename=Excel.xls");
$.response.status = $.net.http.OK;
```

## Step 4. Push

编辑项目根目录 CF 配置文件 *manifest.yml*, 加入 xsjs Application 的配置并附上 Service `hdi_db`，如果你没有把握简单起见其他的几个 Applications 都先注释掉

```yaml
applications:
  - name: xsjs
    path: xsjs/
    memory: 256M
    disk_quota: 500M
    random-route: true
    services:
      - hdi_db
```

部署应用 `cf push`，成功后你便可以访问 *&lt;xsjs-host&gt;/xsodata/purchaseOrder.xsodata/$metadata* 即 xsodata 服务，和 */xsjs/hdb.xsjs*

## Step 5. Enable UAA

* 把 *xsjs/server.js* 中的 `anonymous : true` 注释掉，并增加配置 `xsApplicationUser: false` 防止 Application Session User 设置给 XS User 带给 HANA DB Connect

```javascript
var options = {
    // anonymous : true, // remove to authenticate calls
    auditLog : { logToConsole: true }, // change to auditlog service for productive scenarios
    redirectUrl : "/index.xsjs",
    xsApplicationUser: false
};
```

* 然后在 *manifest.yml* 配置中绑定之前创建的 XSUAA 服务实例（可以回顾一下之前的文章 [SAP Cloud Foundry Node.js - Authentication Checks in Node.js Applications](/articles/sap-cloudfoundry-node-authrozation/#step-3-create-uaa-service)）

```yaml
services:
    - hdi_db
    - my-xsuaa
```

* 重新部署则不能访问应用，会显示未授权。如果要访问的话还得用 [Application Router](/articles/sap-cloudfoundry-node-authrozation/#step-1-setup-approuter-application)

* 在 *web* Module 中 *xs-app.json* 配置中增加

```json
{
  "routes": [
//...
    {
      "source": "/xs/(.*)",
      "target": "$1",
      "destination": "xsjs",
      "authenticationType": "xsuaa",
      "csrfProtection": true
    }
  ]
}
```

* 在 *manifest.yml* 中启用 *web* Application 并为其配置，其中 `url` 要配置你的 xsjs Application 实际的 url

```yaml
  env:
    destinations: >
      [
        ...
        {
          "name":"xsjs",
          "url":"https://<your-xsjs-app>.cfapps.eu10.hana.ondemand.com/",
          "forwardAuthToken": true
        }
      ]
```

* 再重新部署 `cf push`; 成功后用 web App 的链接访问 *&lt;web-host&gt;/xs/xsodata/purchaseOrder.xsodata/$metadata*

## Next Steps