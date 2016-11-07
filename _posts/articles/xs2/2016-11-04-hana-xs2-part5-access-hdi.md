---
layout: post
title: HANA XS2 On-Premise part 5 - Access artifacts in HDI from Nodejs
excerpt: "HANA XS2 On-Premise part 5 - Access artifacts in HDI from Nodejs"
modified: 2016-11-03T17:00:00-00:00
categories: articles
tags: [XS2, XS, HANA]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
references:
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features; HDI"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features-hdi/"
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features; Node.js"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features-nodejs/"
---

* TOC
{:toc}

接着上一篇[HANA XS2 On-Premise part 4 - Nodejs with HDI][1]创建的HDI，本篇介绍如何在Nodejs程序里调用HDI组件来操作HANA数据库。完整代码可以下载自[Github][2]

## Setup New Module

[Express][3] is a fast, unopinionated, minimalist web framework for Node.js.

### New Module js

Create a new folder **js**, the `cd js` and initialize it by `npm init`, the content of file `package.json` is

```
{
  "name": "xs2-node-hw-backend",
  "version": "1.0.0",
  "description": "The backend module in XS2 Nodejs Application",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "tiven.wang",
  "license": "ISC"
}
```

### Install Express

`$ npm install express --save`

> Before installing the express, please check your npm registry by `npm config get registry`. If it is not registry of npmjs, set the registry using `npm config set registry https://registry.npmjs.org/`

## Basic Access

### Index.js

### Express Routes

Because we want to access the HANA HDI artifacts from express routes, we need the `sap-hdbext` module to utilize accessing approach.

#### Install the sap-hdbext

`$ npm install sap-hdbext --save`

> Before installing the sap-hdbext, please check your npm registry by `npm config get registry`. If it is not registry of sap, set the registry using `npm config set registry http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.milestones.npm/`

#### Get User Info






## Next

[1]:/articles/hana-xs2-part4-nodejs-hdi/
[2]:https://github.com/anypossiblew/hana-xs2-samples/tree/access-hdi
[3]:http://expressjs.com/
