---
layout: post
title: How to use HTTP Destination in HANA and HANA Cloud
excerpt: "如何在HANA或者HANA Cloud服务器上的XS应用程序里访问公网HTTP API或者On-Premise的API，本文介绍通过XS application里创建HTTP Destination来实现"
modified: 2016-10-25T17:00:00-00:00
categories: articles
tags: [HCP, HANA, Cloud, XS, HTTP]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "SAP Help - Maintaining HTTP Destinations"
    url: "https://help.sap.com/saphelp_hanaplatform/helpdata/en/ca/340c09551c40b7837e773b9d051821/content.htm"
  - title: "SAP HANA Cloud Documentation - Consuming the Connectivity Service (HANA XS)"
    url: "https://help.hana.ondemand.com/help/frameset.htm?5c0c9c90b1b546bcba8de180f14f0722.html"

---

* TOC
{:toc}

本文我们在前面一篇[How to develop XS Application on the SAP HANA Cloud Platform][3]的基础上介绍在HANA和HANA Cloud上如何创建和使用HTTP Destination来访问Internet http api或者On-Premise系统的api。为了更贴近现实应用场景，我们仍然使用HANA XS Application与Line服务器的集成场景。本文完整项目代码可以在[Github][2]下载。

## Series

1. [How to develop an XS application on the SAP HANA Cloud Platform](/articles/how-to-develop-xs-application-on-hcp/)
2. [How to develop an XS Odata Service by CDS on the HCP](/articles/how-to-develop-xs-odata-by-cds-on-hcp/)
3. [How to Create a Fiori app Using OData service on the HCP](/articles/how-to-develop-ui5-app-using-odata-on-hcp/)
4. [How to Config Fiori App in Fiori Launchpad](/articles/how-to-config-fiori-app-in-launchpad/)
5. How to use HTTP Destination in HANA and HANA Cloud
6. [HANA Cloud Connector](/articles/hana-cloud-connector/)
{: .entry-series}

## HANA

### Create file .xshttpdest

在Project Package下创建文件**_LineProfiles.xshttpdest_**

```javascript
description = "Trialbot Profiles of Line";
host = "trialbot-api.line.me";
port = 443;
pathPrefix = "/v1/profiles";
proxyType = none;
authType = none;
useSSL = true;
timeout = 0;
```

这个HTTP Destination使用了SSL连接，所以需要添加SSL证书

### XS Admin Trust Manager

下载line.me网站的证书，并在XS Admin管理界面(https://<your-hana-host>/sap/hana/xs/admin/)中的Trust Manager中创建一个Line的Trust Store，导入此证书

<figure class="center">
	<img src="/images/cloud/hana/hana-trust-manager.jpg" alt="HANA XS Admin Trust Manager">
	<figcaption>HANA XS Admin Trust Manager</figcaption>
</figure>

### Assign Trust Store

把创建好的Trust Store of line分配给LineProfiles Destination

<figure class="center">
	<img src="/images/cloud/hana/http-destination-details.jpg" alt="HANA XS Admin HTTP Destination Details">
	<figcaption>HTTP Destination Details</figcaption>
</figure>

### Use Destination in XSJS

在XSJS程序里使用http destination的文件名来获取destination并用在http client发送请求里

```javascript
var conDestPackage = "digital-account",
    conLineDestName = "LineProfiles";

function getUserProfiles( persons ) {
	var mids = persons.join(",");

   var dest = $.net.http.readDestination(conDestPackage, conLineDestName);
   var client = new $.net.http.Client();
   var req = new $.web.WebRequest($.net.http.GET, "?mids="+mids);
   req.headers.set("X-Line-ChannelID", "<your line channel id>");
   req.headers.set("X-Line-ChannelSecret", "<your line channel secret>");
   req.headers.set("X-Line-Trusted-User-With-ACL", "<your line mid");
   client.request(req, dest);
   var response = client.getResponse();  
   var contacts = JSON.parse(response.body.asString()).contacts;

   var i = 0;
   for(i = 0; i < contacts.length; i++) {
	    $.trace.info(contacts[i]);
   }
}
```

> 需要注意的是当访问On-Premise的Gateway service时，Authorization x-csrf-token等http headers需要考虑

## HANA Cloud Platform

### MDC Database

对于HCP的MDC类型的HANA数据库，HTTP Destination文件内容里需要添加proxy才能访问Internet网络服务。Internet 和 On-Premise连接的代理配置列表如下

#### Internet Connectivity

|XS parameter |hana.ondemand.com |us1.hana.ondemand.com |ap1.hana.ondemand.com|hanatrial.ondemand.com|
|--|--|--|--|
|useProxy|	true|	true|	false| true|
|proxyHost|	proxy|	proxy|	N/A| proxy-trial|
|proxyPort|	8080|	8080|	N/A| 8080|
|useSSL|	true / false|	true / false|	true / false| true / false|
{: .table}

#### On-Premise Connectivity

|XS parameter |hana.ondemand.com |us1.hana.ondemand.com |ap1.hana.ondemand.com|hanatrial.ondemand.com|
|--|--|--|--|--|
|useProxy	|true		|true		|true		|	|
|proxyHost	|localhost	|localhost	|localhost	|	|
|proxyPort	|20003		|20003		|20003		|	|
|useSSL		|false		|false		|false		|	|
{: .table}


> trial账号应该是没有权限访问On-Premise连接

关于Cloud访问Internet Connectivity和On-Premise Connectivity参见[SAP SAP HANA Cloud Documentation - Consuming the Connectivity Service (HANA XS)][4]

### Schema of HANA (\<shared\>) DB

// TODO

## Next Steps

* [How to use HANA Cloud Connector][5]

[1]:https://account.hanatrial.ondemand.com/cockpit
[2]:https://github.com/anypossiblew/hcp-digital-account/tree/xs-dest
[3]:/articles/how-to-develop-xs-application-on-hcp/
[4]:https://help.hana.ondemand.com/help/frameset.htm?5c0c9c90b1b546bcba8de180f14f0722.html
[5]:/articles/hana-cloud-connector/
