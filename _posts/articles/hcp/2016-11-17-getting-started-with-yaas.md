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
  - title: "An Introduction to OAuth 2"
    url: "https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2"
---

* TOC
{:toc}

> The project codes for this article can be downloaded from [Github][github-project].

## What is YaaS
[YaaS][yaas] (Hybris as a Service) is a [microservices][microservices] ecosystem helping businesses to rapidly augment and build new, highly flexible solutions.
Two role in YaaS, one is provider, another is consumer. As a provider, add new microservice-based features to your products or create your own services and apps from scratch. As a business, subscribe to YaaS services and add new capabilities to your applications.

<figure class="center">
  <img src="/images/cloud/yaas/YaaS_flow.png" alt="YaaS Diagram">
  <figcaption>YaaS Diagram</figcaption>
</figure>

## As a Provider
As a provider, you can create a service in [YaaS][yaas-market], before that you need to create a service in the [HANA Cloud Platform][hcp], other programming languages or Java technologies are supported. Once you have a REST web service that is deployable on the web, continue to create a service in [YaaS][yaas-market].

These two series articles introduced two approach about how to create a service on [HCP][hcp]:

* [How to create a service in HCP Cloud Foundry][1]
* [How to develop an XS application on the SAP HANA Cloud Platform][2]

### Application on Cloud Foundry
In this article, use the application on [HCP cloud foundry][hcp-cf-cockpit] service to provide the [microservices][microservices] to [YaaS][yaas].

Change the application code from the [first series articles][1] to process requests from YaaS.

#### Application Code

For testing getting the information from YaaS, you can add an [Express][expressjs] [routing][express-routing] to return the information in the body of response in the messages module.

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

The other Express routings:

* get */api/message*
* post */api/message*
* get */api/message/:id*
* delete */api/message/:id*
* put */api/message/:id*

The rest of the application don't need to be changed.

#### Push Application

Push the application to [HCP Cloud Foundry][hcp-cf-cockpit], you will get to access the urls: Base url _**https://digital-account.cfapps.us10.hana.ondemand.com/api**_ and the sub-paths:

* get     _**/yaas**_
* get     _**/message**_
* post    _**/message**_
* get     _**/message/:id**_
* delete  _**/message/:id**_
* put     _**/message/:id**_

### Publish Service in YaaS

[Register a Service in the Builder](https://devportal.yaas.io/gettingstarted/createaservice#6)

#### Register Service in Builder

Follow the tutorial [Register a Service in the Builder][3], register the app on HCP cloud foundry service in the YaaS builder.

The base path for the application will be the source url, and the generated proxy url follows the pattern

_https://{**yaas-api-host**}/{**org-path**}/{**project-id**}/{**project-version**}_

<figure class="center">
  <img src="/images/cloud/yaas/yaas-register-service.jpg" alt="Register a Service in YaaS">
  <figcaption>Register a Service in YaaS</figcaption>
</figure>

This app will get the generated proxy url

*https://api.yaas.io/tiven-labs/digital-account/v1*

#### Authorization Rules
Authorization rules enable you to secure your service by assigning scopes for different operations without having to write any code. We will skip the service scopes that will be introduced in the next topics.

Create a new rule,  add the sub-path of the cf application as it's path, and select methods, check the **_Skip Authorization_** or not.

<figure class="center">
  <img src="/images/cloud/yaas/yaas-create-a-new-rule.jpg" alt="Create a new Authorization Rule">
  <figcaption>Create a new Authorization Rule</figcaption>
</figure>

All of the rules for the service:

<figure class="center">
  <img src="/images/cloud/yaas/yaas-authorization-rules.jpg" alt="Authorization Rules in Service">
  <figcaption>Authorization Rules in Service</figcaption>
</figure>

#### Test Authorization Rules

Now you can test authorization rules of the service, the path */yaas* will be protected by the security of YaaS:

get *https://digital-account.cfapps.us10.hana.ondemand.com/api/yaas* Response:

```json
{
  "reqMethod": "GET",
  "reqUrl": "/api/yaas",
  "reqHeaders": {
    "host": "digital-account.cfapps.us10.hana.ondemand.com",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, sdch, br",
    "accept-language": "en,en-US;q=0.8,zh-CN;q=0.6,zh;q=0.4,ja;q=0.2,zh-TW;q=0.2",
    "cache-control": "no-cache",
    "postman-token": "0f454f39-4fc5-125d-5992-4c7d57124055",
    "x-cf-applicationid": "e37b63cd-7abf-491e-9b39-265510dad5fa",
    "x-cf-instanceid": "6251ce475f5d4c9b8518d530726dd67ec3b3c3230b7b42e9a890ec23c02dea85",
    "x-forwarded-for": "10.0.1.54, 10.0.129.67",
    "x-forwarded-proto": "https",
    "x-request-start": "1479694510611",
    "x-vcap-request-id": "a58d387e-d7b3-41fd-6080-c96d7c4f9ed2",
    "connection": "close"
  }
}
```

get *https://api.yaas.io/tiven-labs/digital-account/v1/yaas* Response:

```json
{
  "status": 401,
  "message": "Unauthorized: Bearer TOKEN is missing",
  "type": "insufficient_credentials",
  "moreInfo": "https://api.yaas.io/patterns/errortypes.html"
}
```

post *https://api.yaas.io/tiven-labs/digital-account/v1/message* body:

```json
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

Response:

```json
{
  "id": "WB1519-3872640834"
}
```

#### Add to Package

YaaS centers around packages because they are the main commodity. You can use existing packages by subscribing to them in the YaaS Market, or you can create your own packages using the Builder. A package is a bundle that contains at least one service or Builder module.

1. Create a package in YaaS builder.
2. Include the service in the package.

## As a consumer

As a business user, you can consume a service.

### Subscribe a Service

* Create a Project

  Create another Project in YaaS, the project consumes the service from provider.
  ![Create a Consumer Project](/images/cloud/yaas/yaas-test-project.jpg)

* Add Allowed Projects in Access Control

  Add the Allowed Projects who want to access the package in access control of the package using project identifier.
  ![Allowed Project in Access Control](/images/cloud/yaas/yaas-allowed-projects.jpg)

* Add Private Subscriptions in Consumer Project

  Add the package as a private package subscription by **_Version ID_**

### Create a Client in Consumer Project

The projects use clients to access the services. The client is an [OAuth2][OAuth2] client application created within a project. After the tenant subscribes to a package that includes the client, it can access data from other tenants.

### Test by Consumer

Now it is time to test accessing the YaaS service by the client credentials.

#### Authorization using Client Credentials

**OAuth2** is the authorization service for YaaS. It implements the [OAuth 2.0 framework](https://tools.ietf.org/html/rfc6749) and provides account authentication and authorization with the use of access tokens.

Use this endpoint **_/token_** to obtain an access token for a client

<figure class="center">
  <img src="/images/cloud/yaas/yaas-oauth2-token.jpg" alt="Authorization using Client Credentials">
  <figcaption>Authorization using Client Credentials</figcaption>
</figure>

#### Access Service using Access Token

Now you can use the token to access the service apis, then you will get the response with hybris attributes

<figure class="center">
  <img src="/images/cloud/yaas/yaas-digital-account-get.jpg" alt="Access Service using Access Token">
  <figcaption>Access Service using Access Token</figcaption>
</figure>

You can also get the authorization using **_grant\_type_** as '**_password_**'.

[More about Security for YaaS][yaas-security].

[More about OAuth2 for YaaS][yaas-oauth2].

## Next Steps

[OAuth2 with YaaS][articles-oauth2-with-yaas]

[yaas]:https://www.yaas.io/
[yaas-market]:https://market.yaas.io/beta
[hcp]:https://account.hanatrial.ondemand.com/cockpit
[microservices]:http://microservices.io/
[expressjs]:http://expressjs.com/
[express-routing]:http://expressjs.com/en/starter/basic-routing.html
[hcp-cf-cockpit]:https://hcp-cockpit.cfapps.us10.hana.ondemand.com/cockpit
[yaas-security]:https://devportal.yaas.io/overview/security/index.html
[yaas-oauth2]:https://devportal.yaas.io/services/oauth2/latest/index.html
[OAuth2]:https://oauth.net/2/
[articles-oauth2-with-yaas]:/articles/oauth2-with-yaas/
[github-project]:https://github.com/anypossiblew/hcp-cf-digital-account/tree/master/yaas-getting-started

[1]:/articles/getting-started-with-hcp-cloud-foundry/
[2]:/articles/how-to-develop-xs-application-on-hcp/
[3]:https://devportal.yaas.io/gettingstarted/createaservice#6
