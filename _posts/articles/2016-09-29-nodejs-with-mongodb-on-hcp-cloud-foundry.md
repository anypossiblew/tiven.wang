---
layout: post
title: How to develop a Node.js application with MongoDB service on HCP Cloud Foundry
excerpt: "本文介绍了在HCP Cloud Foundry上创建Node.js应用程序，并使用MongoDB service数据库服务保存查询消息的功能。使用到了一些Cloud Foundry的基础命令"
modified: 2016-09-29T11:51:25-04:00
categories: articles
tags: [HCP, Cloud Foundry, Node.js, MongoDB]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "Cloud Foundry official website"
    url: "https://www.cloudfoundry.org/"
  - title: "SCN - HCP Cloud Foundry - Playing around with Node.js, MongoDB and UI5"
    url: "http://scn.sap.com/community/developer-center/cloud-platform/blog/2016/09/05/hcp-cloud-foundry--playing-around-with-node-mongodb-and-ui5"
  - title: "The Application Source code"
    url: "https://github.com/anypossiblew/hcp-cf-digital-account/"
---

* TOC
{:toc}

上一篇[Getting Started with HCP Cloud Foundry](/articles/getting-started-with-hcp-cloud-foundry/)我们讲了如何在HCP Cloud Foundry上创建Project的基础知识，本篇进一步介绍如何创建[Node.js][2]应用，并且连接到HCP CF所提供的[MongoDB][3]服务。

## Prerequisites

### Login
`cf api https://api.cf.us10.hana.ondemand.com`

`cf login`

### Check services

* 查看可用的services

`cf marketplace`

output

```markdown
service      plans            description
mongodb      v3.0-container   MongoDB document-oriented database system
postgresql   v9.4-container   PostgreSQL object-relational database system
rabbitmq     v3.6-container   RabbitMQ messaging
redis        v2.8-container   Redis in-memory data structure store
```

* 查看可用的buildpacks

`cf buildpacks`

output

```markdown
buildpack              position   enabled   locked   filename
staticfile_buildpack   1          true      false    staticfile_buildpack-cached-v1.3.9.zip
java_buildpack         2          true      false    java-buildpack-v3.7.1.zip
ruby_buildpack         3          true      false    ruby_buildpack-cached-v1.6.19.zip
nodejs_buildpack       4          true      false    nodejs_buildpack-cached-v1.5.15.zip
go_buildpack           5          true      false    go_buildpack-cached-v1.7.8.zip
python_buildpack       6          true      false    python_buildpack-cached-v1.5.6.zip
php_buildpack          7          true      false    php_buildpack-cached-v4.3.14.zip
binary_buildpack       8          true      false    binary_buildpack-cached-v1.0.2.zip
```

## Create Node.js application code

创建Node.js application的具体过程不在此叙述，有需要的请查看Node.js教程。本应用完整代码可以在这里下载[Github][7]

### Node.js dependencies
添加程序中用到的一些依赖包

* express
* body-parser
* mongoose
* cfenv
* path

可以用此命令安装

`npm install --save dev express body-parser mongoose cfenv path`

最终**_package.json_**一些信息长这样

```javascript
{
  "name": "hcp-cf-digital-account",
  "version": "0.0.1",
  "engines": {
    "node": "6.2.1"
  },
  "dependencies": {
    "body-parser": "^1.15.2",
    "cfenv": "^1.0.3",
    "express": "^4.14.0",
    "mongoose": "^4.5.10",
    "path": "^0.12.7"
  }
}
```

### The application manifest
application manifest file **manifest.yml** 描述了Node.js应用和Cloud Foundry配置信息，当`cf push`命令创建应用时会使用到这里的信息去设置一些环境配置。
后面我们会添加MongoDB service配置。

```
---
applications:
- name: digital-account
  buildpack: nodejs_buildpack
  command: node app.js
  memory: 128M
  disk_quota: 128M
  host: digital-account
```

每个参数的含义如下

* __name__: The name of the application.
* __buildpack__: The name of the Node.js buildpack determined before with command `cf buildpacks`. It is also possible to reference the buildpack sources on GitHub. By default an auto determination of the buildpack is done if the buildpack information is missing in the application manifest. But from my point of view it is clearer to specify it in the application manifest.
* __command__: Node.js applications needs a start command to start the application. In the example "**_node app.js_**" is called which executes the JS code in a file "app.js" which is described later. The command is executed automatically after the application is successfully deployed to the Cloud Foundry instance.
* __memory__: Definition of the RAM available for the application. For the demo 128 MB are used.
* __disk_quota__: Definition of the disk space available for the application. For the demo 128 MB are used.
* __host__: Host information for the application which is used in the URL which makes the application accessible.

### Application structure
**_.cfignore_**文件是说明需要被`cf push`命令忽略的目录，比如需要将**/data**和**/node_modules**加到此文件中。
**_/data_**是在运行local的mongodb server时生成的文件，后面我们会讲到。**_/node_modules_**是存放Node.js依赖包的文件夹，因为Cloud Foundry会为我们解决依赖问题，所以我们不需要将依赖包上传。

![HCP CF Digital Account App structure](/images/cloud/hcp-cf-digital-account-app.jpg)

### Local test
部署到Cloud Foundry时测试是个麻烦事，所以我们要在本地进行测试过。

#### Run local mongo server
在本机安装[MongoDB][5]，并用此命令运行mongo server

`\digital-account>mongod --dbpath=./data`

#### Run Node.js express server

`\digital-account>node app.js`

output

```
\digital-account>node app.js
Server listening at http://localhost:6001
```

#### Test get info

**get** _http://localhost:6001/api/info_

output

```javascript
[
  {
    "object": "VCAP_SERVICES env",
    "value": "local not available"
  },
  {
    "object": "VCAP_APPLICATION env",
    "value": "local not available"
  },
  {
    "object": "Name of Application",
    "value": "digital-account"
  },
  {
    "object": "Port",
    "value": 6001
  },
  {
    "object": "URL",
    "value": "http://localhost:6001"
  }
]
```

#### Test post message

使用下面body内容**post** _http://localhost:6001/api/message_

```javascript
{
  "result": [
    {
      "content":{
        "text":"Hello world!"
      },
      "createdTime":1475033537220,
      "eventType":"138311609000106303",
      "id":"WB1519-3872640834"
    }
  ]
}
```

#### Test get message

**get** _http://localhost:6001/api/message_

```javascript
[
  {
    "id": "WB1519-3872640834",
    "createdTime": "1475033537220",
    "eventType": "138311609000106303",
    "text": "Hello world!"
  }
]
```

测试通过后我们将要push到[HCP Cloud Foundry][6]服务上去。

## Create MongoDB service
在install之前我们需要为application添加MongoDB service。

执行此命令创建一个mongodb服务**_mongodb-digacc-service_**

`cf create-service mongodb v3.0-container mongodb-digacc-service`

检查service实例创建成功

```
\>cf services
Getting services in org XXXX / space XXX as XXXX@XXX.com...
OK

name                     service   plan             bound apps   last operation
mongodb-digacc-service   mongodb   v3.0-container                create succeeded
```


然后application manifest文件中需要加上此mongodb服务

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
  - mongodb-digacc-service
```

## Install application

`cf push`

成功后就可以使用了。

## Next Steps

本文介绍了在HCP Cloud Foundry上创建Node.js应用程序，并使用[MongoDB][3] service数据库服务保存查询消息的功能。使用到了一些Cloud Foundry的基础命令。
接下来我们在此基础上再增加[RabbitMQ][4]服务来增强应用的负载能力

* [How to develop a Node.js applicaiton with RabbitMQ service on HCP Cloud Foundry](/articles/nodejs-with-rabbitmq-on-hcp-cloud-foundry/)。


[1]:https://www.cloudfoundry.org/training/
[2]:https://nodejs.org/
[3]:https://www.mongodb.com/
[4]:https://www.rabbitmq.com/
[5]:https://www.mongodb.com/download-center#community
[6]:https://hcp-cockpit.cfapps.us10.hana.ondemand.com/cockpit
[7]:https://github.com/anypossiblew/hcp-cf-digital-account/tree/master/nodejs-with-mongodb