---
layout: post
title: HANA XS2 On-Premise part 9 - Run XSJS in XSA
excerpt: "HANA XS2 On-Premise part 9 - Run XSJS in XSA"
modified: 2016-11-25T17:00:00-00:00
categories: articles
tags: [XSJS, XS2, HANA2]
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

### Step 1 XSJS application
Create an folder **_xsjs_** for XSJS runtime artifacts

```
/
|--/hdb     (for HDI deployment artifacts)
|--/web     (for static resources and app router)
'--/xsjs    (for XS JavaScript code)
```

### Step 2 XSJS files

For default, create XSJS files in *xsjs/lib* folder.

#### Create a Book Manager XSJS Library

```javascript
function saveBook(book) {
  var conn = $.hdb.getConnection();

  var sql = 'INSERT INTO "com.sap.xs2.tiven::AddressBook.Book" VALUES(?, ?)';
  var stmt = conn.prepareStatement(sql);
  stmt.setInt(1, book.id);
  stmt.setNString(2, book.name);
  stmt.execute();

  conn.commit();
}

...
```

#### Create testdata XSJS File

```javascript
// Import the bookManager library
$.import("addressbook", "bookManager");

$.response.contentType = "application/json";

var bookId = Math.floor(Math.random() * 1000000);
var book = {
  id: bookId,
  name: 'My Book #' + bookId + ' by ' + $.session.getUsername()
}

$.addressbook.bookManager.saveBook(book);

$.addressbook.bookManager.saveAddress({
        id         : Math.floor(Math.random() * 1000000),
        book       : { id: bookId },
        first_name : 'Tiven',
        last_name  : 'Wang',
        address    : 'Pudong, Chenhui road, 1001',
        city       : 'Shanghai',
        country    : 'China',
        zip        : '20001',
        phone      : '+86 21 6108 7986',
        email      : 'tiwen.wang@sap.com',
        web        : 'http://tiven.wang'
});

...

$.response.setBody(JSON.stringify(book));
```

### Step 3 main JavaScript file
Create JavaScript file that starts our application. You can name it as you prefer – examples: *main.js*, *index.js*, *application.js* etc and put it in */xsjs* folder. This is the JavaScript file that will be passed to Node.js to start the application. In this file you need to refer to [**_XSJS_**][sap-xsjs] module (the compatibility layer), provide the required options and start the application. For more information on possible options take a look at XSJS project documentation.

Here is simple example content:

```javascript
'use strict';
var xsjs = require('xsjs');
var port = process.env.PORT || 3000;
var app = xsjs({
  hana : xsjs.extend({
    host : 'localhost',
    port : 30015,
    user : 'APPUSER',
    password : 'UserPass',
    schema : 'xsjs_app_schema'
  }, xsjs.cfUserProvidedService(process.env.serviceName))
});
app.listen(port);
console.log('HTTP server listening on port %d', port);
```

In CF deployment the port on which the application listens is provided via environment variable specified during deployment – will see later how, the default port 3000 is used for local testing. Similarly host, port user and schema are provided for local testing. These parameters point to for your own HANA system. In CF deployment this information is provided via environment variables set by CF.

Some of the important env variables are described bellow. For complete list of configurations see the [CF documentation][cf-environment-variable].

### Step 4 package.json
Node.js applications are described via *package.json* file and we need one for xsjs application located in */xsjs* folder. Usually it is created via `npm init` command where you provide general information about the application. In addition following should be added:

* dependency to XSJS module - the SAP HANA XS Advanced compatibility layer
* start command to specify node options

```json
{
  "name": "<application name>",
  "description": "<application description>",
  "version": "<application version>",
  "repository": {
    "url": "<link to your repository>"
  },
  "dependencies": {
    "xsjs": "git://github.wdf.sap.corp/xs2/xsjs.git"
  },
  "engines": {
    "node": ">=0.10.x"
  },
  "scripts": {
    "start": "node --max-old-space-size=400 --expose-gc main.js"
  }
}
```

In the start command:

The **--max-old-space-size** option defines the memory that V8 should use for old heap. In the example we provide 400 MB, the best way to identify optimal size is to execute performance tests for your application with different heap sizes. What is important to have in mind while changing this number is the size provided for application in the application manifest file. The old heap size should be around 100MB smaller than the all memory provided.

The **--expose-gc** option enables the garbage collector (GC) to be accessible in JavaScript code. When enabled, the compatibility layer will run GC after every request. This is highly recommended, as we experienced GC to spend a lot of time trying to free memory for large application run on CF, in the case when GC is not triggered after each request.

### Step 5 Use in Web Application

#### Use in SAPUI5

Change the backendURL to xsjs services like */addressbook/tree.xsjs* in *tree.view.js*

```javascript
sap.ui.jsview("jds.tree", {

  getControllerName : function() {
    return "jds.tree";
  },

  createContent : function(oController) {
    var backendURL = "/addressbook/tree.xsjs";
    var oModel = new sap.ui.model.json.JSONModel(backendURL, false);
    ...
  }
  ...
});
```

#### Create application router configuration

Add the route in *xs-app.json* file:

```json
{
  "source": ".*\\.xsjs",
  "destination": "xsjs"
}
```

### Step 6 Create application manifest
Next we create application manifest file in the root folder, where we say to Cloud Foundry how to deploy our application

```yaml
# Add a new application for xsjs
- name: xs2-node-hw-xsjs
  port: 3006
  path: xsjs
  memory: 128M
  services:
    - node-hdi-container
    - node-uaa

# Add a destination for xsjs in Web application
- name: xs2-node-hw
  port: 3004
  memory: 100M
  path: web
  env:
    destinations: >
      [
        {
          "name":"backend",
          "url":"http://localhost:3002",
          "forwardAuthToken": true
        },
        {
          "name":"xsjs",
          "url":"http://localhost:3006",
          "forwardAuthToken": true
        }
      ]
  services:
    - node-uaa
```


### Deploy

Add the Node.js dependencies and push the application

## Test Locally

Create local configuration file *default-services.json* in *xsjs/* folder, add two binding services

```json
{
  "uaa": {
    "url"             : "http://localhost:8080/uaa-security",
    "clientid"        : "sb-xs2-node-hw!i3",
    "clientsecret"    : "W+mTDSpq6f...iOlpSuIw==",
    "xsappname"       : "xs2-node-hw!i3",
    "identityzone"    : "uaa",
    "verificationkey" : "-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----"
  },
  "hana": {
      "host"            : "<hana_host>",
      "port"            : "30015",
      "user"            : "<user>",
      "password"        : "<password>",
      "schema"          : "63BA774DD3EA4...E3C99FDA18305"
  }
}
```

Then start local server by executing

`npm start` in both of *xsjs/* and *web/*

and access the url *http://localhost:3003/index.html*

## Unit Test
Create unit test files in folder *xsjs/lib/test*

Add the script and develop dependencies in *package.json*

```json
"scripts": {
  "start": "node --max-old-space-size=400 --expose-gc main.js",
  "test": "xstest --test.reportdir=report"
},
"devDependencies": {
  "sap-xsjs-test": "1.2.1"
}
```

Then you can execute `npm test` for unit testing.

## Next



[github-project]:https://github.com/anypossiblew/hana-xs2-samples/tree/xsjs

[xsjs]:http://help.sap.com/hana/SAP_HANA_XS_JavaScript_Reference_en.pdf
[cf-environment-variable]:http://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html
[sap-xsjs]:/references/sap-github-xs2-xsjs-readme/
