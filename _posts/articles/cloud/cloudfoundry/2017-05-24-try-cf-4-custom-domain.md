---
layout: post
title: Try Cloud Foundry 4 - Custom Routes and Domains
excerpt: "This topic try how routes and domains work in Cloud Foundry, and how developers and administrators configure routes and domains for their applications using the Cloud Foundry Command Line Interface (cf CLI)."
modified: 2017-05-24T17:00:00-00:00
categories: articles
tags: [HTTP, TCP, Cloud Foundry, Pivotal]
image:
  vendor: unsplash
  feature: /photo-1496761523829-6ee70d7928aa?dpr=1.5&auto=format&fit=crop&w=1500&h=550&q=80&cs=tinysrgb&crop=
  credit: Shripal Daphtary
  creditlink: https://unsplash.com/@shripald
comments: true
share: true
references:
  - title: "Cloud Foundry Documentation - Routes and Domains"
    url: "https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html"
  - title: "CloudFoundry Admin Guide - Enabling TCP Routing"
    url: "https://docs.cloudfoundry.org/adminguide/enabling-tcp-routing.html"
  - title: "TCP Routing comes to Cloud Foundry"
    url: "https://www.cloudfoundry.org/tcp-routing-comes-to-cloud-foundry/"
  - title: "Deploying with Application Manifests"
    url: "https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#domain"
---

> [冠斑犀鸟](https://en.wikipedia.org/wiki/Malabar_pied_hornbill)（学名：Anthracoceros coronatus）大型鸟类，体长74~78厘米。嘴具大的盔突，颜色为蜡黄色或象牙白色，盔突前面有显着的黑色斑；上体黑色，具金属绿色光泽，下体除腹为白色外，亦全为黑色，外侧尾羽具宽阔的白色末端。翅缘、飞羽先端和基部亦为白色，飞翔时极明显。喜较开阔的森林及林缘。成对或喧闹成群，振翅飞行或滑翔在树间。喜食昆虫多于果实。
{: .Warning}

* TOC
{:toc}

[Try CloudFoundry Series](/series/try-cloudfoundry/)

## Routes and Domains
### Create Custom Domain and Route

Create a your private domain for your organization:

`$ cf create-domain tiven.wang cf.tiven.wang`

```
Creating domain cf.tiven.wang for org tiven.wang as i.tiven.wang@gmail.com...
OK
```

Use the `cf domains` command to view a list of available domains for the targeted org:

```
Getting domains in org tiven.wang as i.tiven.wang@gmail.com...
name            status   type
cfapps.io       shared
cf-tcpapps.io   shared   tcp
cf.tiven.wang   owned
```

Map the a route to your respective apps, Developers use hostname, domain, and path to uniquely identify a route to map their apps to:

`$ cf map-route try-cloud-foundry cf.tiven.wang --hostname try-cloud-foundry`

```
Creating route try-cloud-foundry.cf.tiven.wang for org tiven.wang / space development as i.tiven.wang@gmail.com...
OK
Adding route try-cloud-foundry.cf.tiven.wang to app try-cloud-foundry in org tiven.wang / space development as i.tiven.wang@gmail.com...
OK
```

View the urls attribute of your app:

`cf apps`

```
Getting apps in org tiven.wang / space development as i.tiven.wang@gmail.com...
OK

name                requested state   instances   memory   disk   urls
try-cloud-foundry   started           2/2         128M     128M   try-cloud-foundry.cfapps.io, try-cloud-foundry.cf.tiven.wang
```

Call *try-cloud-foundry.cfapps.io* to access my app, but *try-cloud-foundry.cf.tiven.wang* can't, because we need configure a CNAME record with your DNS provider.

### Mapping Domains to Your Custom Domain

Add a CNAME record in my DNS provider:

*try-cloud-foundry.cf* to *try-cloud-foundry.cfapps.io*

Now we can access the app by *try-cloud-foundry.cf.tiven.wang*

### Mapping Route of Path to App

You can also map a path route to the app:

`$ cf map-route try-cloud-foundry cf.tiven.wang --hostname labs --path try-cloud-foundry`

```
Creating route labs.cf.tiven.wang/try-cloud-foundry for org tiven.wang / space development as i.tiven.wang@gmail.com...
OK
Adding route labs.cf.tiven.wang/try-cloud-foundry to app try-cloud-foundry in org tiven.wang / space development as i.tiven.wang@gmail.com...
OK
```

Add a CNAME record in your DNS provider:

*labs.cf* to *cfapps.io*

Now you can access *http://labs.cf.tiven.wang/try-cloud-foundry*

> You must handle the path /try-cloud-foundry in your app
{: .Tips}

## TCP Routing
### Build a TCP Application

> Application source codes on [Github](https://github.com/tiven-wang/try-cf/tree/tcp-routing)
{: .Notes}

Build a TCP chat server using Node.js.

```javascript
var net = require('net');

var server = net.createServer();

var sockets = [];

server.on('connection', function(socket) {
  console.log('got a new connection');

  sockets.push(socket);

  socket.on('data', function(data) {
    //console.log('got data:', data.toString());

    sockets.forEach(function(otherSocket) {
      if(otherSocket !== socket) {
        otherSocket.write(data);
      }
    });
  });
});

server.on('error', function(err) {
  console.error('Server error:', err.message);
});

server.on('close', function() {
  console.log('Server closed:');
});

server.listen(4001);
```

### Deploy to PWS

Using `domain: cf-tcpapps.io`

```yaml
---
applications:
- name: try-cf-tcp
  buildpack: nodejs_buildpack
  command: node index.js
  memory: 128M
  host: try-cf-tcp
  domain: cf-tcpapps.io
```

Currently, only Shared Domains can be TCP. **Admins** manage shared domains, which are available to users in all orgs of a PWS deployment. Shared domains are HTTP by default, but can be configured to be TCP when associated with the TCP Router Group.

So we can't use TCP in PWS now.

```
$ cf push
Using manifest file C:\dev\github\tiven-wang\try-cf\manifest.yml

Updating app try-cf-tcp in org tiven.wang / space development as i.tiven.wang@gmail.com...
OK

Creating random route for cf-tcpapps.io...
OK

FAILED
Server error, status code: 400, error code: 310009, message: You have exceeded the total reserved route ports for your organization's quota.
```

> By default, PWS only supports routing of HTTP requests to applications.
{: .Notes}


[github-project]:https://github.com/anypossiblew/try-cloud-foundry
