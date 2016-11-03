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

`git config --global http.sslVerify false`

## Prepare your HANA

[Preparing a HANA for XSA][1]

> JRE 8.0

`java -cp "D:\xsa_root\jars\*" com.sap.xs2rt.installation.impl.readymade.ReadymadeInstallProcedure --parameter-file="D:\xsa_root\uaaserver\tomcat\conf\parameterCentralDb" --base-directory="D:\xsa_root"``

## Standalone XSA Installation

[Standalone XSA Installation][2]

### Start UAA/HANA Service Broker

`D:\xsa_root\bin\xs-uaa-server-own-uaa-schema 8080 localhost ssl-disable run`

### Start XS Controller

`D:\xsa_root\bin\xs-controller --embedded-ea --path D:\xsa_work  --default-domain=localhost --uaa-url=http://localhost:8080/uaa-security`

Output:

```
Initializing ConfigStore............... OK
Initializing Platform Router. OK
Initializing BlobStore. OK
Initializing MonitoringStore OK
Initializing Stager. OK
Initializing Model (Check and patch) OK
Initializing HTTP/REST Server.... OK
Initializing Platform Router (Start-Up)......... OK
Initializing local Execution Agent... OK
Initialized.

Organizations:  0
Spaces:         0
Buildpacks:     0
Runtimes:       0
Users:          0
Applications:   0
Services:       0

Execution Agent (s):  http://localhost:54168               (embedded)
UAA URL:              http://localhost:40002/uaa-security
System port:          9998                                 (to connect execution agents)
Controller path:      D:\xsa_work
API URL:              http://localhost:30030

Press 'Enter' to stop...
```

### Install Initial Content

> set no_proxy=localhost

`D:\xsa_root\bin\xs-init http://localhost:30030`

## Next

[HANA XS2 part2 - Getting Started](/articles/hana-xs2-part2-getting-started/)

[1]:/docs/xs2/xs2-Preparing-a-HANA-for-XSA.pdf
[2]:/docs/xs2/xs2-Standalone-XSA-Installation.pdf
