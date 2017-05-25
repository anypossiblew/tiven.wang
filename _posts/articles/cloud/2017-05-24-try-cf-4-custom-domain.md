---
layout: post
title: Try Cloud Foundry 4 - Custom Domain
excerpt: "Cloud Foundry Custom Domain"
modified: 2017-05-24T17:00:00-00:00
categories: articles
tags: [Cloud Foundry, Pivotal]
image:
  feature: cloud/masthead-cf.jpg
comments: true
share: true
references:
  - title: "Cloud Foundry Documentation - Routes and Domains"
    url: "https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html"
---

* TOC
{:toc}

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
