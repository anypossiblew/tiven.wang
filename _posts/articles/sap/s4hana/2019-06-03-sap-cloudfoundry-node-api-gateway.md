---
layout: post
theme: UbuntuMono
star: true
series: 
  url: sap-cloudfoundry-node
  title: SAP Cloud Foundry Node.js
title: "App Router as API Gateway"
excerpt: "How to develop "
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

本系列文章我们将介绍如何为 SAP S4HANA Cloud 系统开发扩展程序 （Extension App）。本文（项目源代码可下载自 [GitLab sourcecode](https://gitlab.com/i.tiven.wang/s4hana-cloud-sdk-demo/tree/app-router)）将介绍使用 App Router 组件映射后端所有的 App。

## Step 1. Add UI5 in App Router

在 App Router 里的 *xs-app.json* 配置里增加一个路由

```json
{
  "source": "/ui5/myUI5App/(.*)",
  "target": "$1",
  "destination": "myUI5App",
  "authenticationType": "xsuaa"
}
```

然后在 *manifest.yml* 配置里的 web 环境变量里增加一个 Destination *myUI5App*，地址指向上一篇发布的 UI5 App 的地址

```json
{
  "name":"myUI5App",
  "url":"https://ui5-app-chatty-waterbuck.cfapps.eu10.hana.ondemand.com/",
  "forwardAuthToken": true
}
```

## Step 2. Remove Destination in UI5 App

那么对于 UI5 App 访问 xsjs 的 odata 就不再需要 Destination 进行转了。

* 删除 *wang.tiven.myUI5App/cf_deployment_resources/xs-app.json* 配置中的 Destination _**xs-backend**_，并且要把剩下这个的 authenticationType 改为 `none`，因为我们将在 App Router 进行授权，如果这里还要设置授权的话就会出错，XSUAA 还不能做到识别从前端带来的 Token

```json
{
  "welcomeFile": "/index.html",
  "authenticationMethod": "route",
  "logout": {
    "logoutEndpoint": "/do/logout"
  },
  "routes": [
    {
      "source": "^/(.*)$",
      "target": "$1",
      "localDir": ".",
      "authenticationType": "none"
    }
  ]
}
```

* 在 *manifest.yml* 中删除 *ui5-app* 的环境变量配置 `destinations`

重新部署 *web* 和 *ui5-app* 两个应用后，打开链接 *&lt;web-host&gt;/ui5/myUI5App/* 便能访问 UI5 App 了。

## Step 3. Web Enter

最后我们这里一下所有的配置，在 web App 的 index 页面加入所有 App 的入口链接如下

```xml
<ul>
  <li>
    <a href="/myapp/">Node.js App</a>
  </li>
  <li>
    <a href="/ui5/myUI5App/">UI5 App</a>
  </li>
  <li>
    <a href="/xs/xsodata/purchaseOrder.xsodata/$metadata">XSOData</a>
  </li>
  <li>
    <a href="/xs/xsjs/hdb.xsjs">XSJS</a>
  </li>
</ul>
```

运行效果

![](/images/s4hana/sap-cf-web-app-router.png)

## Next Steps