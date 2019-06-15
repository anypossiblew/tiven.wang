---
layout: post
theme: UbuntuMono
series:
  url: try-cloudfoundry
  title: Try Cloud Foundry
title: Pivotal Web Services
excerpt: "Try Pivotal Cloud Foundry Web Services"
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [Cloud Foundry, Pivotal]
image:
  vendor: twitter
  feature: /media/DMRVJ3AVAAA33ds.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "How Can I Try Out Cloud Foundry?"
    url: "https://www.cloudfoundry.org/how-can-i-try-out-cloud-foundry-2016/"
---

[Try CloudFoundry Series](/series/try-cloudfoundry/)

* TOC
{:toc}

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
