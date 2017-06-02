---
layout: post
title: Try Cloud Foundry 6 - Multi Tenancy
excerpt: "Cloud Foundry: Support Multi Tenancy using Identity Zone Management APIs of UAA"
modified: 2017-05-26T17:00:00-00:00
categories: articles
tags: [Multi Tenancy, Cloud Foundry, Pivotal]
image:
  feature: cloud/masthead-cf.jpg
comments: true
share: true
references:
  - title: "Cloud Foundry - The User Account and Authentication Service (UAA)"
    url: "https://docs.cloudfoundry.org/api/uaa/index.html"
---

* TOC
{:toc}

## Multi Tenancy

## Identity Zones

The UAA supports multi tenancy. This is referred to as identity zones. An identity zones is accessed through a unique subdomain. If the standard UAA responds to https://uaa.10.244.0.34.xip.io a zone on this UAA would be accessed through https://testzone1.uaa.10.244.0.34.xip.io





[SCIM]:http://www.simplecloud.info/
