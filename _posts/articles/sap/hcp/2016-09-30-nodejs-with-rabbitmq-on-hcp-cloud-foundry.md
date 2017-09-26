---
layout: post
title: SCP Cloud Foundry 3 - How to develop a Node.js application with RabbitMQ service
excerpt: "本文介绍了在HCP Cloud Foundry上创建Node.js应用程序，并使用RabbitMQ service接受分发消息的功能。使用到了一些Cloud Foundry的基础命令"
modified: 2016-10-25T16:13:00-00:00
categories: articles
tags: [Cloud Foundry, RabbitMQ, Event-Driven, Node.js, HCP]
image:
  feature: /images/cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "Advanced Message Queuing Protocol"
    url: "https://www.amqp.org/"
  - title: "The Application Source code"
    url: "https://github.com/anypossiblew/hcp-cf-digital-account/"
---

* TOC
{:toc}

上一篇[Node.js with MongoDB service on HCP Cloud Foundry](/articles/nodejs-with-mongodb-on-hcp-cloud-foundry/)我们介绍了在[HCP Cloud Foundry][2]服务上如何创建Node.js Application，并且使用了MongoDB数据库服务存储数据。本篇介绍HCP CF的另外一项服务 - [RabbitMQ][4]，此功能可以让你搭建高性能可扩展的应用程序。本篇带你一步步创建RabbitMQ消息队列服务和其与Node.js应用程序的集成。

## Series

1. [Getting Started with HCP Cloud Foundry](/articles/getting-started-with-hcp-cloud-foundry/)
2. [How to develop a Node.js application with MongoDB service on HCP Cloud Foundry](/articles/nodejs-with-mongodb-on-hcp-cloud-foundry/)
3. How to develop a Node.js applicaiton with RabbitMQ service on HCP Cloud Foundry
{: .entry-series}

## Prerequisites

[Message queue][6]提供了一种异步通讯机制，这对于网络时代大量请求并发的情况及其重要。例如服务器B在响应服务器A的每个请求时会消耗CPU比较长的时间，而服务器A有可能短时间内爆发出大量的请求，那么显然服务器B在短时间内处理不了这么大量请求，进而在一定时间内服务器A得不到B的响应则会出现异常。在服务器A并不需要得到B实质性的response的情况下（例如只需要得到**_"receive successful!"_**这样的答复），我们可以使用Message queue作为中间件应用程序，暂时接收下A的请求，再一个个发往B。

> 像这种既不属于B方主要功能又不属于A方需要负责的功能，使用Cloud Foundry应用程序去实现最好不过了，既解耦了双方程序，又可以进行灵活扩展。

[Advanced Message Queuing Protocol][7]是一个[面向消息中间件的开发标准应用层协议][8]，它规范了消息队列模式的各种特性如queuing, routing (包含 point-to-point and publish-and-subscribe), reliability 和 security.

AMQP有很多的不同语言的实现产品，其中[RabbitMQ][4]是其比较常用的一种实现。

接下来我们接着上一篇的代码，把mongodb存储消息改成使用message queue处理消息。


### Install AMQP client for nodejs

关于AMQP client的Node.js版本常见的有两个[/postwait/node-amqp](https://github.com/postwait/node-amqp)和[/squaremo/amqp.node](https://github.com/squaremo/amqp.node)，这里我们使用前者。

`npm install --save amqp`


## Application Code

本文完整代码可以在这里下载[Github][5]

### Setup AMQP Client

#### Require AMQP client

```javascript
let amqp = require('amqp');
```

#### Create connection

```javascript
var conn = amqp.createConnection({url: "amqp://localhost"});

conn.on('ready', function() {
  // ...
});
```

#### Create exchange

每个消息都是通过exchange对象发送到queue的，exchange可以设置不同的routingKey来binding不同queues，这是对messages的分类方式。

```javascript
var exchange = conn.exchange('cf-da', {'type': 'fanout', durable: true}, function() {
  // ...
});
```

#### Create queue

Queue会对binding到exchange的routingKey上或者空routingKey。

```javascript
var queue = conn.queue('line', {durable: true, exclusive: true},
    function() {
      // ...
      queue.bind(exchange.name, '');
    });
queue.on('queueBindOk', function() {
    httpServer(exchange, oApp);
});
```

### Setup Subscriber

通过Queue对象可以订阅其消息，每当有新消息发来时callback会被调用。

```javascript
queue.subscribe(function(msg) {
  messages.push(msg);
});
```

### Setup Publisher

#### Post Event

通过Exchange对象发布消息到queue。

```javascript
oApp.post('/api/message', function (req, res) {
    for(var i = 0; i < req.body.result.length; i++) {
        var event = req.body.result[i];
        // publish the event message
        exchange.publish('', event);
    }
    // response
    res.json({info: "ok!"});
});
```

#### Get Messages

```javascript
oApp.get('/api/message', function (req, res) {
    res.json(messages);
});
```

## Local Test

### Install RabbitMQ

下载安装[Downloading and Installing RabbitMQ](https://www.rabbitmq.com/download.html)

### Testing

测试方法同上一篇类似。

## Push to Cloud Foundry

### Create RabbitMQ service

`cf create-service rabbitmq v3.6-container rabbitmq-digacc-service`

### Add Service in Manifest

```
---
applications:
- name: digital-account
  buildpack: nodejs_buildpack
  command: node app.js
  memory: 128M
  disk_quota: 128M
  host: digital-account
  services:
  - rabbitmq-digacc-service
```

### Push App

`cf push`

现在可以测试往服务上并发大量请求了。
大功告成！

## 总结

本文介绍了在HCP Cloud Foundry服务上创建和使用RabbitMQ service的基本步骤，更全面的功能有待我们在接下来的文章里进一步探索。


[1]:https://www.cloudfoundry.org/training/
[2]:https://hcp-cockpit.cfapps.us10.hana.ondemand.com/cockpit
[3]:https://github.com/postwait/node-amqp
[4]:https://www.rabbitmq.com/
[5]:https://github.com/anypossiblew/hcp-cf-digital-account/tree/master/nodejs-with-rabbitmq
[6]:https://en.wikipedia.org/wiki/Message_queue
[7]:https://www.amqp.org/
[8]:https://en.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol
