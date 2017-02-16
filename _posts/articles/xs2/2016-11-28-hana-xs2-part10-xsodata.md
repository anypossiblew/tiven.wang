---
layout: post
title: HANA XS2 On-Premise part 10 - Create XSOData in XSA
excerpt: "HANA XS2 On-Premise part 10 - Create XSOData in XSA"
modified: 2016-11-28T17:00:00-00:00
categories: articles
tags: [OData, XS2, HANA2]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
references:
  - title: "SAP HANA XS JavaScript API Reference"
    url: "http://help.sap.com/hana/SAP_HANA_XS_JavaScript_API_Reference_en/"
---

* TOC
{:toc}

SAP HANA [XS JavaScript (XSJS)][xsjs] is an application programming language in JavaScript. It can be used to exposes data stored in database tables or views to client side. Additionally we can also implement any business logic.

> The project codes for this article can be downloaded from [Github][github-project].

## Application Codes


[github-project]:https://github.com/anypossiblew/hana-xs2-samples/tree/xsjs

[xsjs]:http://help.sap.com/hana/SAP_HANA_XS_JavaScript_Reference_en.pdf
[cf-environment-variable]:http://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html
[sap-xsjs]:/references/sap-github-xs2-xsjs-readme/
