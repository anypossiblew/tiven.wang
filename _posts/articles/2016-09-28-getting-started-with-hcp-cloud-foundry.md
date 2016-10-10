---
layout: post
title: Getting Started with HCP Cloud Foundry
excerpt: "很多公司的云平台都提供了Cloud Foundry服务，本文介绍如何在Hybris YaaS上创建Project，如何在HANA Cloud platform HCP上的Cloud Foundry services上创建Application，和一些基础的CF命令"
modified: 2016-09-29T11:51:25-04:00
categories: articles
tags: [HCP, Cloud Foundry, Hybris, YaaS]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "Cloud Foundry official website"
    url: "https://www.cloudfoundry.org/"
  - title: "SAP HANA Cloud Platform, Starter Edition for Cloud Foundry Services (Beta)"
    url: "https://uacp2.hana.ondemand.com/viewer/#/hcp_cf/b8ee7894fe0b4df5b78f61dd1ac178ee.html"
  - title: "The Application Source code"
    url: "https://github.com/anypossiblew/hcp-cf-digital-account/"
---

很多公司的云平台都提供了Cloud Foundry服务，本文介绍HANA Cloud platform上的Cloud Foundry services。

## Prerequisites

### Create a Starter Edition for Cloud Foundry Services

1. **Enable the Starter Edition for Cloud Foundry Services in HCP**
[登录到HCP][8]，左边栏services菜单点开，然后开启"HCP,Starter Edition for Cloud Foundry Services"服务，目前还是beta版本。
Go to Service，会转到[YaaS][1]，YaaS是[SAP Hybris][2]的云服务平台。
![HCP Starter edition for CF](/images/cloud/hcp-starter-edition-for-cf.jpg)

2. **Create a poject in YaaS**
注册登录YaaS并创建Organization和一个project，There seems to be a litte meshup between the terms because the project you create within an organization is in fact the name you want to remember as the organization when you push your application to HCP-CF.

3. **Create a space**
在YaaS的project的Administration里，添加HCP Starter Edition的subscription，然后project的左边栏会出现"SAP HANA Cloud Platform"。然后在"SAP HANA Cloud Platform"里创建一个space。点击"MANAGE HCP APPLICATION"转到[HCP][9]可以看到创建好的space。

![HCP Starter edition for CF in YaaS](/images/cloud/hcp-starter-edition-for-cf-in-yaas.jpg)


### Install cf cli
在使用HCP Cloud Foundry services时需要Cloud Foundry的命令行工具。
[Github][3]

## Project Source Code
这里我们创建一个最简单的静态页面应用，部署在HCP Cloud Foundry上。Application完整代码可以在这里下载[Github][10]

* Create project folder

在电脑硬盘里新建一个文件夹**my-static-app**，作为应用的根目录。

* Create manifest.yml

创建一个文件**manifest.yml**，这是cloud foundry的配置文件。

```markdown
---
applications:
- name: my-static-app
  random-route: true
  memory: 64M
```

* Create index.html

创建我们要显示的主页文件**index.html**。

```html
<!DOCTYPE html>
<html>
<head>
  <title>Hello, World!</title>
</head>
<body>
  <h1>Hello, World! </h1>
  <p>I am in HCP Cloud Foundry services.</p>
</body>
</html>
```

* Create empty file Staticfile

创建一个空文件,名为**Staticfile**


## Install Application
接着安装到HCP Cloud Foundry service。

* Login to HCP CF

`\>cf api https://api.cf.us10.hana.ondemand.com`

`\>cf login`

* Install

在manifest.yml所在目录运行cf push命令安装

`\my-static-app>cf push`

看到如下显示时表示安装成功

![cf push success](/images/cloud/cf-push-success.jpg)

实际页面效果为

<div class="mfp-iframe-scaler">
<iframe width="420" height="100" src="https://my-static-app-precoracoid-leister.cfapps.us10.hana.ondemand.com/" frameborder="1"></iframe>
</div>

关于更多Cloud Foundry的知识请学习[cloudfoundry training][4]

## Project in HCP CF
打开[HCP Cloud Foundry service cockpit][9]，可以看到刚创建的project详细信息：

![my static app](/images/cloud/my-static-app.jpg)


## 总结
本文介绍了如何在HCP Cloud Foundry service上创建接单的静态页面project，接下来我们将要介绍在HCP Cloud Foundry service上构建[Node.js][5]应用，并且如何使用Node.js连接[MongoDB][6]和[RabbitMQ][7]服务。


[1]:https://www.yaas.io/
[2]:https://www.hybris.com/
[3]:https://github.com/cloudfoundry/cli/releases
[4]:https://www.cloudfoundry.org/training/
[5]:https://nodejs.org/
[6]:https://www.mongodb.com/
[7]:https://www.rabbitmq.com/
[8]:https://hcp.sap.com/
[9]:https://hcp-cockpit.cfapps.us10.hana.ondemand.com/cockpit
[10]:https://github.com/anypossiblew/hcp-cf-digital-account/tree/master/my-static-app