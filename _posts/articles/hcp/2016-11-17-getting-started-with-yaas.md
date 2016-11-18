---
layout: post
title: Getting Started with YaaS
excerpt: "Getting Started with YaaS"
modified: 2016-11-18T17:00:00-00:00
categories: articles
tags: [YaaS, HCP, Cloud]
image:
  feature: cloud/masthead-incubators.jpg
comments: true
share: true
references:
  - title: "SAP HCP Docs - Business Services for YaaS"
    url: "https://help.hana.ondemand.com/help/frameset.htm?0b94bf7eb8ff4c8c8d653ff18ea7bc12.html"
  - title: "How to consume SAP Localization Hub – Tax in Yaas (Commerce as a Service)"
    url: "https://blogs.sap.com/2015/09/11/how-to-consume-sap-localization-hub-tax-in-yaas-commerce-as-a-service/"
---

* TOC
{:toc}

Before create a service in [YaaS][yaas-market], you need to create a service in the [HANA Cloud Platform][hcp], other programming languages or Java technologies are supported. Once you have a REST web service that is deployable on the web, continue to create a service in [YaaS][yaas-market].

As how to create a service on [HCP][hcp], you can follow these series articles:

* [How to create a service in HCP Cloud Foundry][1]
* [How to develop an XS application on the SAP HANA Cloud Platform][2]

## Application on Cloud Foundry

Change the application code to process requests from YaaS.

### Application Code

```javascript
// for testing getting information from YaaS
oApp.get('/api/yaas', function (req, res) {
  res.json({
    reqMethod: req.method,
    reqUrl: req.url,
    reqHeaders: req.headers
  });
});
```

others

* get */api/message*
* post */api/message*
* get */api/message/:id*
* delete */api/message/:id*
* put */api/message/:id*

### Push Application

Push the application to HCP Cloud Foundry, you will get to access the urls.

Base url *https://digital-account.cfapps.us10.hana.ondemand.com/api*

* get     */yaas*
* get     */message*
* post    */message*
* get     */message/:id*
* delete  */message/:id*
* put     */message/:id*

## Register a Service in the Builder

[Register a Service in the Builder](https://devportal.yaas.io/gettingstarted/createaservice#6)

### Publish your service

Once you have published the service, you will get the proxy base url *https://api.yaas.io/tiven-labs/digital-account/v1*

### Authorization Rules

Add Authorization rules into the YaaS service.

### Add to Package

[*https://devportal.yaas.io/overview/security/index.html*](https://devportal.yaas.io/overview/security/index.html)

## Create Client

### Add Allowed Projects in Access Control

### Add Private Subscriptions in Consume Project

### Create a Client in Consume Project

## OAuth2

[*https://devportal.yaas.io/services/oauth2/latest/index.html*](https://devportal.yaas.io/services/oauth2/latest/index.html)

[yaas-market]:https://market.yaas.io/beta
[hcp]:https://account.hanatrial.ondemand.com/cockpit
[1]:/articles/getting-started-with-hcp-cloud-foundry/
[2]:/articles/how-to-develop-xs-application-on-hcp/
