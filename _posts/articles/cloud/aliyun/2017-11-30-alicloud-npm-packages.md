---
layout: post
title: Alicloud npm packages
excerpt: "阿里云部分服务的 Nodejs 语言版的SDK"
modified: 2017-11-30T11:51:25-04:00
categories: articles
tags: [Aliyun]
image:
  vendor: twitter
  feature: /media/DOIBsIUXcAA76uB.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true

---

* TOC
{:toc}

阿里云最新推出了一些 Node.js 语言版本的 SDK ，包括 SMS MNS 等服务功能。你可以在 [npm](https://www.npmjs.com) 上搜索 @alicloud ，在推荐中查看具体有哪些。

## @alicloud/sms-sdk

SMS 是阿里云帮助客户发送短信给用户的服务，查看组件官方页面 [@alicloud/sms-sdk](https://www.npmjs.com/package/@alicloud/sms-sdk)

安装 SMS SDK 组件

`npm i @alicloud/sms-sdk --save`

我们来看一下组件自带的demo代码，这段包含了发送短信和接收短信回执的逻辑，如果想要运行正确阿里云SMS服务后台还得配置正确。

```javascript
/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */

const SMSClient = require('@alicloud/sms-sdk')

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'yourAccessKeyId'
const secretAccessKey = 'yourAccessKeySecret'

//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = 'Alicom-Queue-1092397003988387-'

//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

//短信回执报告
smsClient.receiveMsg(0, queueName).then(function (res) {
    //消息体需要base64解码
    let {code, body}=res
    if (code === 200) {
        //处理消息体,messagebody
        console.log(body)
    }
}, function (err) {
    console.log(err)
})

//短信上行报告
smsClient.receiveMsg(1, queueName).then(function (res) {
    //消息体需要base64解码
    let {code, body}=res
    if (code === 200) {
        //处理消息体,messagebody
        console.log(body)
    }
}, function (err) {
    console.log(err)
})


//查询短信发送详情
smsClient.queryDetail({
    PhoneNumber: '1500000000',
    SendDate: '20170731',
    PageSize: '10',
    CurrentPage: "1"
}).then(function (res) {
    let {Code, SmsSendDetailDTOs}=res
    if (Code === 'OK') {
        //处理发送详情内容
        console.log(SmsSendDetailDTOs)
    }
}, function (err) {
    //处理错误
    console.log(err)
})

//发送短信
smsClient.sendSMS({
    PhoneNumbers: '1500000000',
    SignName: '云通信产品',
    TemplateCode: 'SMS_000000',
    TemplateParam: '{"code":"12345","product":"云通信"}'
}).then(function (res) {
    let {Code}=res
    if (Code === 'OK') {
        //处理返回参数
        console.log(res)
    }
}, function (err) {
    console.log(err)
})
```

## @alicloud/mns
MNS 消息服务是阿里云为客户提供的异步消息处理机制。安装

`npm install @alicloud/mns --save`

其主页有样例代码，样例没有涵盖的方法，可以直接查看其源代码进行解读应用：

```javascript
res = await client.batchReceiveMessage('TestQueue', 16, 2);
```

## @alicloud/fc

Function compute

Serverless

`npm i @alicloud/fc --save`

## @alicloud/fun

`npm i @alicloud/fun --save`
