---
layout: post
title: Firebase - Hello world
excerpt: ""
modified: 2017-09-09T11:51:25-04:00
categories: articles
tags: [Firebase, Serverless, Cloud]
image:
  vendor: unsplash
  feature: /photo-1482211317141-14c8a4e628fd?dpr=1.5&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=
  credit: Irina Blok
  creditlink: https://unsplash.com/@irinablok
comments: true
share: true
references:
  - title: "Firebase Documentation"
    url: "https://firebase.google.com/docs/"
  - title: "Serverless Showdown: AWS Lambda vs Firebase Google Cloud Functions"
    url: "https://medium.com/@ste.grider/serverless-showdown-aws-lambda-vs-firebase-google-cloud-functions-cc7529bcfa7d"
  - title: "Adventures in Serverless Architecture with Firebase, Zapier & Cloud Functions"
    url: "https://medium.com/@james.morgan/adventures-in-serverless-architecture-with-firebase-zapier-cloud-functions-71281900f2b"
---

* TOC
{:toc}

## Setup

在 Google firebase console 上创建项目 `try-serverless-firebase`，或者在 *firebase cli* 工具里创建项目。

安装 firebase cli 工具：

`npm install -g firebase-tools`

登录 firebase 账号

`firebase login`

初始化 Google Cloud functions 功能

`firebase init functions`

## Hello world

在 *./functions/index.js* 里编写程序如下：

```javascript
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/messages').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});
```

部署此 function 到 firebase 上:

`firebase deploy --only functions` or `firebase deploy --only functions:addMessage`

在 firebase console functions 栏里会出现这一条记录

Function | Event | Executions | Median run time
--- | --- | --- | ---
addMessage | HTTP Request https://us-central1-try-serverless-firebase.cloudfunctions.net/addMessage | - | -
{: .table}

在浏览器打开链接
https://us-central1-try-serverless-firebase.cloudfunctions.net/addMessage?text=Hello world!
 它会跳转到 Firebase Realtime Database 里此条 Message 页面，因为我们在程序里指定了这样的返回：

 `res.redirect(303, snapshot.ref);`
