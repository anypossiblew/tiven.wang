---
layout: post
title: Try Cloud Foundry 2 - Components Router
excerpt: "Cloud Foundry Components Router"
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [Cloud Foundry, Pivotal]
image:
  feature: cloud/masthead-cf.jpg
comments: true
share: true
references:
  - title: "How Can I Try Out Cloud Foundry?"
    url: "https://www.cloudfoundry.org/how-can-i-try-out-cloud-foundry-2016/"
---

> [冠斑犀鸟](https://en.wikipedia.org/wiki/Malabar_pied_hornbill)（学名：Anthracoceros coronatus）大型鸟类，体长74~78厘米。嘴具大的盔突，颜色为蜡黄色或象牙白色，盔突前面有显着的黑色斑；上体黑色，具金属绿色光泽，下体除腹为白色外，亦全为黑色，外侧尾羽具宽阔的白色末端。翅缘、飞羽先端和基部亦为白色，飞翔时极明显。喜较开阔的森林及林缘。成对或喧闹成群，振翅飞行或滑翔在树间。喜食昆虫多于果实。

* TOC
{:toc}

Try CloudFoundry Series:

1. [Pivotal Web Services](/articles/try-cf-1-pivotal-web-services/)
2. [Cloud Foundry Components Router](/articles/try-cf-2-cloud-foundry-components-router/)
3. [Cloud Foundry Components UAA](/articles/try-cf-3-cloud-foundry-components-uaa/)
4. [Cloud Foundry Custom Domain](/articles/try-cf-4-custom-domain/)
5. [UAA Single Sign On with OAuth2](/articles/try-cf-5-uaa-oauth2/)
6. [Cloud Foundry Multi Tenancy](/articles/try-cf-6-multi-tenancy/)


[Cloud Foundry Components][cloudfoundry-concepts-architecture]

Cloud Foundry components include a self-service application execution engine, an automation engine for application deployment and lifecycle management, and a scriptable command line interface (CLI), as well as integration with development tools to ease deployment processes. Cloud Foundry has an open architecture that includes a buildpack mechanism for adding frameworks, an application services interface, and a cloud provider interface.

Refer to the descriptions below for more information about Cloud Foundry components. Some descriptions include links to more detailed documentation.

![Image: cf_architecture_block ](https://docs.cloudfoundry.org/concepts/images/cf_architecture_block.png)
{: .center}

## Concepts

### Router

The [router][router] routes incoming traffic to the appropriate component, either a Cloud Controller component or a hosted application running on a Diego Cell.

The router periodically queries the Diego Bulletin Board System (BBS) to determine which cells and containers each application currently runs on. Using this information, the router recomputes new routing tables based on the IP addresses of each cell virtual machine (VM) and the host-side port numbers for the cell’s containers.

### HTTP Routing

[HTTP Routing][HTTP-Routing]

## Try

### Nodejs

Create a Node.js project using `npm init` or clone source code of the project from [Github][github-project] `git clone https://github.com/anypossiblew/try-cloud-foundry.git`

Add a Javascript file for router:

```javascript
'use strict';

const express = require('express');
const crypto  = require('crypto');
const bodyParser  = require('body-parser');
const cfenv   = require('cfenv');

// create express instance
let oApp = express();

// Cloud Foundry environment variables
let oAppEnv = cfenv.getAppEnv();

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
oApp.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
oApp.use(bodyParser.json());

var current_date = (new Date()).valueOf().toString();
var random = Math.random().toString();
var jsessionid = crypto.createHash('sha1').update(current_date + random).digest('hex');

oApp.get('/api/router', function(request, response){

  console.log(request.headers);

  response.cookie('JSESSIONID', jsessionid, { maxAge: 9000000, httpOnly: true });

  response.json({info:"ok"});
});

// express app listener
oApp.listen(oAppEnv.port, function(){
    console.log('Server listening at ' + oAppEnv.url);
});
```

Create the Cloud Foundry manifest (you need change the application name attribute or use attribute `random-route: true`):

```
---
applications:
- name: <try-cloud-foundry>
  buildpack: nodejs_buildpack
  command: node index.js
  memory: 128M
  disk_quota: 128M
```

### Deploy Application

Deploy the application using `cf push -c "node router.js"` then you will get the information by executing the command `cf app <app-name>`

```
\try-cloud-foundry>cf app try-cloud-foundry
Showing health and status for app try-cloud-foundry in org <tiven.wang> / space development as <email@gmail.com>...
OK

requested state: started
instances: 1/1
usage: 128M x 1 instances
urls: try-cloud-foundry.cfapps.io
last uploaded: Thu Feb 23 09:56:29 UTC 2017
stack: cflinuxfs2
buildpack: nodejs_buildpack

     state     since                    cpu    memory          disk            details
#0   running   2017-02-24 05:37:01 AM   0.2%   23.1M of 128M   35.8M of 128M
```

In order to test the cloud foundry router for multiple instances, you need to scale the application using `cf scale <app-name> -i 2` or set attribute `instances: 1` in application's manifest file.

Retry the command `cf app <app-name>`, you will see:

```
\try-cloud-foundry>cf app try-cloud-foundry
Showing health and status for app try-cloud-foundry in org <tiven.wang> / space development as <email@gmail.com>...
OK

requested state: started
instances: 2/2
usage: 128M x 2 instances
urls: try-cloud-foundry.cfapps.io
last uploaded: Thu Feb 23 09:56:29 UTC 2017
stack: cflinuxfs2
buildpack: nodejs_buildpack

     state     since                    cpu    memory          disk            details
#0   running   2017-02-24 05:37:01 AM   0.0%   23.4M of 128M   35.8M of 128M
#1   running   2017-02-24 11:09:45 AM   0.2%   23.6M of 128M   35.8M of 128M
```

### Test

Open the url of your application: *https://try-cloud-foundry.cfapps.io/api/router* in browser, you can get the response as

```
{
info: "ok"
}
```

Open the developer tools of browser for the page:

![image: cf router cookies](/images/cloud/cf/cf-router-dev-tools-cookies.png)
{: .center}

You can see the two attributes in the cookies of the page. Refresh the page, the value will not be changed. But you can remove all of the two attributes, the you might get a different value. Eventually there are only two different values, one belongs to each instances of the application.



[cloudfoundry-concepts-architecture]:https://docs.cloudfoundry.org/concepts/architecture
[router]:https://docs.cloudfoundry.org/concepts/architecture/router.html
[HTTP-Routing]:https://docs.cloudfoundry.org/concepts/http-routing.html

[github-project]:https://github.com/anypossiblew/try-cloud-foundry
