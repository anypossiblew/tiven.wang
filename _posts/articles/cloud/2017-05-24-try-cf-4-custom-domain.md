---
layout: post
title: Try Cloud Foundry 4 - Custom Domain
excerpt: "Cloud Foundry Custom Domain"
modified: 2017-05-24T17:00:00-00:00
categories: articles
tags: [Cloud Foundry, Pivotal]
image:
  feature: /images/cloud/masthead-cf.jpg
comments: true
share: true
references:
  - title: "Cloud Foundry Documentation - Routes and Domains"
    url: "https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html"
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

## Create Custom Domain and Route

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

## Mapping Domains to Your Custom Domain

Add a CNAME record in my DNS provider:

*try-cloud-foundry.cf* to *try-cloud-foundry.cfapps.io*

Now we can access the app by *try-cloud-foundry.cf.tiven.wang*

## Mapping Route of Path to App

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


[github-project]:https://github.com/anypossiblew/try-cloud-foundry
