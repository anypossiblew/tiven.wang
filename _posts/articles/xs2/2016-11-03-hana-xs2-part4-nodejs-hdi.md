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

## Create Services

### Check Marketplace

查看有哪些services可以使用

`xs marketplace`

Output:

```
Getting services from marketplace...

service      plans                                   description
---------------------------------------------------------------------------------------------------------
fs-storage   free                                    xs file service provides an env variable which denotes the root of the clients application file system.
xsuaa        default, devuser, space                 XS UAA Service Broker for authentication & authorization services
hana         hdi-shared, sbss, schema, securestore   SAP HANA database
auditlog     free                                    Audit log broker on the XSA Platform
```

### Create HDI Container

创建HDI服务

`xs create-service hana hdi-shared node-hdi-container`

#### Check services

`xs services`

Output:

```
Getting services in org "tiven" / space "dev" as C5235715...
Found services:

name                 service   plan         bound apps
------------------------------------------------------
node-hdi-container   hana      hdi-shared
```

### Create XSUAA

`xs create-service xsuaa space node-uaa -c xs-security.json`

## Application

### Create DB

```
cd xs2-node-hw
mkdir db
cd db
npm init
```

Output package.json:

```
{
  "name": "xs2-node-hw-db",
  "version": "1.0.0",
  "description": "DB Application in xs2 Nodejs",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "tiven.wang",
  "license": "ISC"
}
```

### Install SAP node.js modules

[XS2 docs - Node.js Runtime][2]

Add SAP HDI dependencies

```
{
  "name": "xs2-node-hw-db",
  "version": "1.0.0",
  "description": "DB Application in xs2 Nodejs",
  "main": "index.js",
  "scripts": {
    "start": "node node_modules/sap-hdi-deploy/deploy.js"
  },
  "author": "tiven.wang",
  "license": "ISC",
  "dependencies": {
    "sap-hdi-deploy": "1.0.6"
  }
}
```

Execute `npm config set registry http://nexus:8081/nexus/content/groups/build.releases.npm/`
`npm install`

 Or manually install SAP dependencies.

### Add HANA Artifacts



[1]:https://github.wdf.sap.corp/xs2/XS_JAVASCRIPT
[2]:/docs/xs2/SAP-GitHub-Wiki-xs2-NodeJsRuntime.pdf

[3]:http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.milestones.npm/

npm config set registry https://registry.npmjs.com/

npm config set registry http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.releases.npm/

npm config set registry http://nexus:8081/nexus/content/groups/build.releases.npm/

npm config set proxy http://vsvpgw00.pro.coil:8080
npm config set https-proxy http://vsvpgw00.pro.coil:8080
