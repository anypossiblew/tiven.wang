---
layout: post
title: HANA XS2 On-Premise part 4 - Nodejs with HDI
excerpt: "HANA XS2 On-Premise part 4 - Nodejs with HDI"
modified: 2016-11-03T17:00:00-00:00
categories: articles
tags: [XS2, XS, HANA]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features/"
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features; XS Advanced"
    url: "https://blogs.sap.com/2015/12/10/sap-hana-sps-11-new-developer-features-tooling-getting-started/"
---

* TOC
{:toc}

[1]:https://github.wdf.sap.corp/xs2/XS_JAVASCRIPT
[2]:http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.milestones.npm/

npm config set registry https://registry.npmjs.com/

npm config set registry http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.releases.npm/

npm config set registry http://nexus:8081/nexus/content/groups/build.releases.npm/

npm config set proxy http://vsvpgw00.pro.coil:8080
npm config set https-proxy http://vsvpgw00.pro.coil:8080
