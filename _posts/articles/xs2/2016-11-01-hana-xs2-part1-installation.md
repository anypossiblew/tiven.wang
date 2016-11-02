---
layout: post
title: HANA XS2 On-Premise part 1 - Installation
excerpt: "HANA XS2 On-Premise part 1 - Installation"
modified: 2016-11-01T17:00:00-00:00
categories: articles
tags: [XS2, XS, HANA]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features/"
---

* TOC
{:toc}

git config --global http.sslVerify false

********
==> JRE 8.0
java -cp "D:\xsa_root\jars\*" com.sap.xs2rt.installation.impl.readymade.ReadymadeInstallProcedure --parameter-file="D:\xsa_root\uaaserver\tomcat\conf\parameterCentralDb" --base-directory="D:\xsa_root"

********
==> Start UAA/HANA Service Broker
D:\xsa_root\bin\xs-uaa-server-own-uaa-schema 8080 localhost ssl-disable run

********
==> Start XS Controller

D:\xsa_root\bin\xs-controller --embedded-ea --path D:\xsa_work  --default-domain=localhost --uaa-url=http://localhost:8080/uaa-security
Execution Agent: http://localhost:54168
UAA URL: http://localhost:40002/uaa-security
System port: 9998
Controller path: D:\xsa_work
API URL: http://localhost:30030

*************
!!!set no_proxy=localhost
D:\xsa_root\bin\xs-init http://localhost:30030

*************
OP sample
https://wiki.wdf.sap.corp/wiki/display/xs2/Deploying+Sample+Applications
