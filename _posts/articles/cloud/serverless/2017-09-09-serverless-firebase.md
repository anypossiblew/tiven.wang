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

## Setup Project

在 Google firebase console 上创建项目 `try-serverless-firebase`，或者使用 *Firebase CLI* 工具在客户端创建项目。

跟随 Firebase 文档 https://firebase.google.com/docs/functions/get-started 练习以下操作。[Firebase CLI][firebase-tools] 是管理、查看和部署 Firebase 项目的客户端命令行工具，安装 Firebase CLI ：

`npm install -g firebase-tools`

登录 firebase 账号，firebase 使用 Ouath2 授权方式登录 Google 账号

`firebase login`

创建项目并初始化 Google Cloud functions 功能，根据提醒选择 Project setup, JavaScript/TypeScript, ESLint, Install Dependencies 。

```
$ mkdir try-serverless-firebase
$ cd try-serverless-firebase
$ firebase init functions
```
生成的项目目录结构如下
```
try-serverless-firebase
 +- .firebaserc    # Hidden file that helps you quickly switch between
 |                 # projects with `firebase use`
 |
 +- firebase.json  # Describes properties for your project
 |
 +- functions/     # Directory containing all your functions code
      |
      +- .eslintrc.json  # Optional file containing rules for JavaScript linting.
      |
      +- package.json  # npm package file describing your Cloud Functions code
      |
      +- index.js      # main source file for your Cloud Functions code
      |
      +- node_modules/ # directory where your dependencies (declared in
                       # package.json) are installed
```

如果在 `firebase init` 步骤中没有选择项目，那么可以使用 Firebase CLI 重新设置:

1. `firebase list` 列出所有可用的项目，如果没有可以到 [Firebase console][firebase-console] 中新建
2. `firebase use <Project ID>` 指定当前目录要对应的项目

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
  admin.database().ref('/messages').push({original: original}).then(snapshot =>
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref)
  ).catch(err => {
    if (err) console.log(err);
    return res.send("ok");
  });
});
```

部署此 Function 到 Firebase 上:

`firebase deploy --only functions` or `firebase deploy --only functions:addMessage`

在 Firebase console functions 栏里会出现这一条记录

Function | Event | Executions | Median run time
--- | --- | --- | ---
addMessage | HTTP Request https://us-central1-try-serverless-firebase.cloudfunctions.net/addMessage | - | -
{: .table}

在浏览器打开链接
https://us-central1-try-serverless-firebase.cloudfunctions.net/addMessage?text=Hello world!
 它会跳转到 Firebase Realtime Database 里此条 Message 页面，因为我们在程序里指定了这样的返回：

 `res.redirect(303, snapshot.ref);`

### Event-driven Functions

Serverless 架构实现的核心概念就是事件驱动的函数. 想要实现自己的逻辑, 只需要编写当某个事件发生时所要执行的函数即可. 例如接下来我们要实现把保存的text转换成大写字母, 可以编写一个 `on write original` 事件所要执行的函数:

```javascript
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
// [START makeUppercaseTrigger]
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onWrite(event => {
// [END makeUppercaseTrigger]
  // [START makeUppercaseBody]
  // Grab the current value of what was written to the Realtime Database.
  const original = event.data.val();
  console.log('Uppercasing', event.params.pushId, original);
  const uppercase = original.toUpperCase();
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to the Firebase Realtime Database.
  // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
  return event.data.ref.parent.child('uppercase').set(uppercase);
  // [END makeUppercaseBody]
});
```

使用Firebase封装好的函数来为数据库的某个消息字段保存时指定函数逻辑:
`functions.database.ref('/messages/{pushId}/original').onWrite(event => { ... });`

重新部署之后, 再次调用`addMessage` url 可以看到消息如下:

```
-KtttKs7lWKs_CgO2PqK
|--- original: "Hello world!"
|--- uppercase: "HELLO WORLD!"
```


[firebase-tools]:https://github.com/firebase/firebase-tools
[firebase-console]:https://console.firebase.google.com
