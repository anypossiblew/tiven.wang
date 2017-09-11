---
layout: post
title: Aliyun - API Signature
excerpt: "DirectMail 服务会对每个访问请求进行身份验证，所以无论使用 HTTP 还是 HTTPS 协议提交请求，都需要在请求中包含签名（Signature）信息。DirectMail 通过使用 Access Key ID 和 Access Key Secret 进行对称加密的方法来验证请求的发送者身份。Access Key ID 和 Access Key Secret 由阿里云官方颁发给访问者（可以通过阿里云官方网站申请和管理），其中 Access Key ID 用于标识访问者的身份；Access Key Secret 是用于加密签名字符串和服务器端验证签名字符串的密钥，必须严格保密，只有阿里云和用户知道。"
modified: 2017-09-08T11:51:25-04:00
categories: articles
tags: [Signature, Aliyun]
image:
  vendor: unsplash
  feature: /photo-1503301360699-4f60cf292ec8?dpr=1.5&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
  credit: Simon Matzinger
  creditlink: https://unsplash.com/@8moments
comments: true
share: true
references:
  - title: "Node.js v8.4.0 Documentation - Crypto"
    url: "https://nodejs.org/api/crypto.html"
  - title: "阿里云短信发送接口nodejs版本 aliyun-nodejs-sdk-smsV1"
    url: "http://ian.wang/296.htm"

---

* TOC
{:toc}

[阿里云 开发API参考 签名机制](https://help.aliyun.com/document_detail/29442.html?spm=5176.doc29440.2.1.qR6fIY)

```javascript
const crypto = require('crypto');
```


3 按照 RFC2104 的定义，使用上面的用于签名的字符串计算签名 HMAC 值。注意：计算签名时使用的 Key 就是用户持有的 Access Key Secret 并加上一个 “&” 字符(ASCII:38)，使用的哈希算法是 SHA1。<br>
4 按照 Base64 编码规则把上面的 HMAC 值编码成字符串，即得到签名值（Signature）。

```javascript
let signature = crypto.createHmac('sha1', AccessKeySecret).update(new Buffer(StringToSign, 'utf-8')).digest('base64');
```
