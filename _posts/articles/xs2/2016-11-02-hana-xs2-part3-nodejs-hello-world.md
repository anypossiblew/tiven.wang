---
layout: post
title: HANA XS2 On-Premise part 3 - Nodejs Hello World
excerpt: "HANA XS2 On-Premise part 3 - Nodejs Hello World"
modified: 2016-11-01T17:00:00-00:00
categories: articles
tags: [XS2, XS, HANA]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
references:
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features/"
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features; XS Advanced"
    url: "https://blogs.sap.com/2015/12/10/sap-hana-sps-11-new-developer-features-tooling-getting-started/"
---

* TOC
{:toc}

我们先来创建一个不涉及 HANA 组件的纯 Nodejs 应用程序，本文完整代码下载[Github][3]。

## Application

### Create App Root

创建应用程序根目录**_xs2-node-hw_**

### App Manifest

在根目录下创建配置文件**_manifest.yml_**

```
---
applications:
- name: xs2-node-hw
  memory: 100M
  path: web
  buildpack: sap_nodejs_buildpack
```

### Web

在根目录**xs2-node-hw**下创建目录**_web_**，`$ cd web`并初始化Nodejs项目配置`npm init`，然后安装NPM依赖包`npm install`

```javascript
{
  "name": "xs2-node-hw-web",
  "version": "1.0.0",
  "description": "Web Application in xs2-node-hw",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "tiven",
  "license": "ISC",
  "dependencies": {
    "express": "^4.14.0"
  }
}
```

### Express

创建文件**_index.js_**，并添加以下逻辑

```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

## Deploy App

因为HANA XS2自带的nodejs buildpack使用的依赖包下载仓库是[SAP内部网站][2]，所以如果HANA XS2架在非SAP内部网络的话，需要在安装Nodejs Application时带上`node_modules`，这样在部署时XS2就不再下载Nodejs依赖包。对于外部客户下载SAP XS2 Nodejs依赖包参见[Github - xs2/XS_JAVASCRIPT][1]

### Push

部署应用程序

`xs push`

成功输出结果

```
Showing status and information about "xs2-node-hw"
  name:              xs2-node-hw
  requested state:   STARTED
  instances:         1
  memory:            100 MB
  disk:              <unlimited>
  buildpack:         sap_nodejs_buildpack
  urls:              http://<your-hana-host>:40010

Instances of droplet 9 created at Nov 2, 2016 9:20:21 AM
index   created                  state      os user
-----------------------------------------------------
0       Nov 2, 2016 9:20:35 AM   STARTING   <not set>
```

### Test

访问Nodejs应用程序的地址

`http://<your-hana-host>:3000/`

成功输出结果

```
Hello World!
```

## Next

[HANA XS2 On-Premise part 4 - Nodejs with HDI](/articles/hana-xs2-part4-nodejs-hdi/)

[1]:https://github.wdf.sap.corp/xs2/XS_JAVASCRIPT
[2]:http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.milestones.npm/
[3]:https://github.com/anypossiblew/hana-xs2-samples/tree/nodejs-hw
