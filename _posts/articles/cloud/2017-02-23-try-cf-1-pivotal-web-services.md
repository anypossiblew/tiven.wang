---
layout: post
title: Try Cloud Foundry 1 - Pivotal Web Services
excerpt: "Try Pivotal Cloud Foundry Web Services"
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

## Background
[How Can I Try Out Cloud Foundry?][how-can-i-try-out-cloud-foundry]

## Signup

[Get a free Pivotal Web Services account](https://try.run.pivotal.io/gettingstarted)

## Try

### Install CF CLI
[Install the CF CLI](https://pivotal.io/platform/pcf-tutorials/getting-started-with-pivotal-cloud-foundry/install-the-cf-cli)

### Deploy the Sample App

Now that you have the cf CLI installed and a Pivotal Web Services (PWS) account, you are really close to deploying the sample app.

This sample app is built with Spring Boot to get you up and running as quickly as possible.

Download the app with git:

`git clone https://github.com/cloudfoundry-samples/cf-sample-app-spring.git`

If you don't have Git installed, you can download a zip file of the app at [https://github.com/cloudfoundry-samples/cf-sample-app-spring/archive/master.zip](https://github.com/cloudfoundry-samples/cf-sample-app-spring/archive/master.zip)

Navigate to the app directory:

`cd cf-sample-app-spring`

Sign in to PWS:

`cf login -a https://api.run.pivotal.io`

Push the app to PWS:

`cf push`

Open the sample app in your browser:

![Image: gettingstartedwithpcf](https://d1fto35gcfffzn.cloudfront.net/images/products/gettingstartedwithpcf/example-url.png)

### View the Logs

View a snapshot of recent logs:

`cf logs cf-spring --recent`

Or, stream live logs:

`cf logs cf-spring`

PCF provides access to an aggregated view of logs related to your application. This includes HTTP access logs, as well as output from app operations such as scaling, restarting, and restaging.

Every log line contains four fields:

* Timestamp
* Log type
* Channel
* Message

![Image: sample-app-logs ](https://d1fto35gcfffzn.cloudfront.net/images/products/gettingstartedwithpcf/sample-app-logs@2x.png)

Press `Control C` to stop streaming.

### Connect a Database

PCF enables administrators to provide a variety of services on the platform that can easily be consumed by applications.

List the available ElephantSQL plans:

`cf marketplace -s elephantsql`

Create a service instance with the free plan:

`cf create-service elephantsql turtle cf-spring-db`

Bind the newly created service to the app:

`cf bind-service cf-spring cf-spring-db`

Once a service is bound to an app, environment variables are stored that allow the app to connect to the service after a push, restage, or restart command.

Restart the app:

`cf restart cf-spring`

Verify the new service is bound to the app:

`cf services`

### Scale the App

Increasing the available disk space or memory can improve overall app performance. Similarly, running additional instances of an app can allow an app to handle increases in user load and concurrent requests. These adjustments are called scaling.

Scaling your app horizontally adds or removes app instances. Adding more instances allows your application to handle increased traffic and demand.

![Image: scaling ](https://d1fto35gcfffzn.cloudfront.net/images/products/gettingstartedwithpcf/scaling@2x.png)

Increase the number of app instances from one to two:

`cf scale cf-spring -i 2`

Check the status of the app and verify there are two instances running:

`cf app cf-spring`

Scaling your app vertically changes the disk space limit or memory limit for each app instance.

Increase the memory limit for each app instance:

`cf scale cf-spring -m 1G`

Increase the disk limit for each app instance:

`cf scale cf-spring -k 512M`

### Next Steps

[Topics to explore][pcf-tutorials]

[pcf-tutorials]:https://pivotal.io/platform/pcf-tutorials/getting-started-with-pivotal-cloud-foundry/next-steps

[how-can-i-try-out-cloud-foundry]:https://www.cloudfoundry.org/how-can-i-try-out-cloud-foundry-2016/
