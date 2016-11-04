---
layout: post
title: HANA XS2 On-Premise part 4 - Nodejs with HDI
excerpt: "HANA XS2 On-Premise part 4 - Nodejs with HDI"
modified: 2016-11-03T17:00:00-00:00
categories: articles
tags: [XS2, XS, HANA]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
references:
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features; HDI"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features-hdi/"
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features; XS Advanced"
    url: "https://blogs.sap.com/2015/12/10/sap-hana-sps-11-new-developer-features-tooling-getting-started/"
---

* TOC
{:toc}

本文完整代码可以下载自[Github][6]

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
Getting services in org "tiven" / space "dev" as <XS_User>...
Found services:

name                 service   plan         bound apps
------------------------------------------------------
node-hdi-container   hana      hdi-shared
```

### Create XSUAA

//`xs create-service xsuaa space node-uaa -c xs-security.json`

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

Add the SAP HDI dependencies by

```
{
  ...
  "scripts": {
    "start": "node node_modules/sap-hdi-deploy/deploy.js"
  },
  ...
  "dependencies": {
    "sap-hdi-deploy": "2.2.0"
  }
}
```

then execute <br/>
`npm config set registry http://nexus:8081/nexus/content/groups/build.releases.npm/` <br/>
`npm install`

Or use the repository url <br/>

```
"dependencies": {
  "sap-hdi-deploy": "git://github.wdf.sap.corp/xs2/hdideploy.js.git"
}
```

Or manually install SAP dependencies node_modules from [SAP SMP][5].

[About details of sap-hdi-deploy][4]

### Add HANA Artifacts

#### .hdiconfig

#### .hdinamespace

```
{
    "name":      "com.sap.xs2.tiven",
    "subfolder": "append"
}
```

#### .hdbcds

```
namespace com.sap.xs2.tiven;

context AddressBook {

  Entity Book {
    key id : Integer;
    name : String(100);
  };

  Entity Address {
    key id     : Integer;
    book       : Association to Book;
    first_name : String(256);
    last_name  : String(256);
    address    : String(256);
    city       : String(256);
    country    : String(256);
    zip        : String(10);
    phone      : String(25);
    email      : String(50);
    web        : String(50);
  };

};
```

the architecture of the db module is

```
/
+-- node_modules/
+-- src/
|   +-- .hdiconfig
|   +-- .hdinamespace
|   +-- .hdbcds
|   +-- <source files ...>
+-- package.json
```

### Add Application in Manifest

Add the db module as an application in manifest.yml, and add the service 'node-hdi-container' created just recently into the db module's application

```
---
applications:
- name: xs2-node-hw-db
  path: db
  memory: 128M
  no-route: true
  services:
    - node-hdi-container

- name: xs2-node-hw
  memory: 100M
  path: web
  buildpack: sap_nodejs_buildpack
```

## Publish Application

Publish the Nodejs with HDI applications by executing

`xs push`

### Check xs logs

Check the logs of deployment for db applicaion

```
C:\Users\tiven>xs logs xs2-node-hw-db --recent

Connected, dumping recent logs for app "xs2-node-hw-db"
11/4/16 6:40:09.933 AM [APP/2-0] OUT       Deploying configuration file "src/.hdiconfig"... OK
11/4/16 6:40:09.933 AM [APP/2-0] OUT       Deploying namespace file "src/.hdinamespace"...
11/4/16 6:40:09.933 AM [APP/2-0] OUT       Deploying namespace file "src/.hdinamespace"... OK
11/4/16 6:40:09.933 AM [APP/2-0] OUT       Adding "src/AddressBook.hdbcds" for deploy...
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Preparing... OK
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Calculating dependencies...
11/4/16 6:40:09.933 AM [APP/2-0] OUT       Precompiling "src/AddressBook.hdbcds"
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Calculating dependencies... OK
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Checking uniqueness of catalog objects in schema "63BA774DD3EA4523B50E3C99FDA18305"...
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Checking uniqueness of catalog objects in schema "63BA774DD3EA4523B50E3C99FDA18305"... OK
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Optimizing...
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Optimizing... OK
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Processing work list...
11/4/16 6:40:09.933 AM [APP/2-0] OUT       Deploying "src/AddressBook.hdbcds"
11/4/16 6:40:09.933 AM [APP/2-0] OUT      Processing work list... OK
11/4/16 6:40:09.949 AM [APP/2-0] OUT      Finalizing...
11/4/16 6:40:09.949 AM [APP/2-0] OUT       Checking uniqueness of catalog objects in schema "63BA774DD3EA4523B50E3C99FDA18305"...
11/4/16 6:40:09.949 AM [APP/2-0] OUT       Checking uniqueness of catalog objects in schema "63BA774DD3EA4523B50E3C99FDA18305"... OK
11/4/16 6:40:09.949 AM [APP/2-0] OUT      Finalizing... OK
11/4/16 6:40:09.949 AM [APP/2-0] OUT      Make succeeded (0 warnings): 3 (effective 3) files deployed, 0(effective 0) files deleted, 0 dependent files redeployed
11/4/16 6:40:09.949 AM [APP/2-0] OUT     Making... OK
11/4/16 6:40:09.949 AM [APP/2-0] OUT    Starting make in DTC "63BA774DD3EA4523B50E3C99FDA18305" with 3 files to deploy, 0 files to undeploy... OK
11/4/16 6:40:09.949 AM [APP/2-0] OUT    Deployment to container 63BA774DD3EA4523B50E3C99FDA18305 done [Deployment ID: none].
11/4/16 6:40:09.949 AM [APP/2-0] OUT    Application can be stopped.
11/4/16 6:40:12.242 AM [API] OUT   Cleared instance '1d95dd3b-f428-4902-b115-8784e135a9d3' of application "xs2-node-hw-db" (port 40364, pid 4376).
```

### Check schema in HANA

Check the schema and artifacts in Catalog of HANA system or HANA studio

<figure class="center">
  <img src="/images/hana/xs2/hana-xs2-shema-in-catalog.jpg" alt="HANA XS2 Schema in Catalog">
  <figcaption>HANA XS2 Schema in Catalog</figcaption>
</figure>

## Next

[HANA XS2 On-Premise part 5 - Access artifacts in HDI from Nodejs](/articles/hana-xs2-part5-access-hdi/)

[1]:https://github.wdf.sap.corp/xs2/XS_JAVASCRIPT
[2]:/docs/xs2/SAP-GitHub-Wiki-xs2-NodeJsRuntime.pdf
[3]:http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.milestones.npm/
[4]:/docs/xs2/hdideploy.js_README.pdf
[5]:https://websmp201.sap-ag.de/
[6]:https://github.com/anypossiblew/hana-xs2-samples/tree/nodejs-hdi
