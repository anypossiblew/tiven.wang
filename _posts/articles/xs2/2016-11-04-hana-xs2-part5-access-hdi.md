---
layout: post
title: HANA XS2 On-Premise part 5 - Access HANA from Nodejs
excerpt: "HANA XS2 On-Premise part 5 - Access HANA from Nodejs"
modified: 2016-11-09T17:00:00-00:00
categories: articles
tags: [XS2, XS, HANA]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
references:
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features; HDI"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features-hdi/"
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features; Node.js"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features-nodejs/"
---

* TOC
{:toc}

Following the previous topic [HANA XS2 On-Premise part 4 - Nodejs with HDI][1] , I would like to introduce how to access HANA database in Node.js application in this article. The project code used by this topic can be downloaded from [Github][2].

## Setup New Module

[Express][3] is a fast, unopinionated, minimalist web framework for Node.js. In this application, we use Express to serve http APIs.

### New Module js

Create a new folder **js**, the `cd js` and initialize it by `npm init`, the content of file `package.json` is

```
{
  "name": "xs2-node-hw-backend",
  "version": "1.0.0",
  "description": "The backend module in XS2 Nodejs Application",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "tiven.wang",
  "license": "ISC"
}
```

### Install Express

Before used, we need install Express package for Node.js dependencies, use this command

`$ npm install express --save`

> Before installing the express, please check your npm registry by `npm config get registry`. If it is not registry of npmjs, set the registry using `npm config set registry https://registry.npmjs.org/`

## Basic Access

We write these code in order to show how to access the database from Node.js application.

### Express Server

For the Express server, we use the file **_index.js_** to listen the http request. Before using the port, you can check which port can be used in your environment, for example in window `$ netstat -an`

```javascript
'use strict';
var express = require('express');
var routes = require('./routes/userinfo'); //http request route for getting current user infomation

var PORT = process.env.PORT || 3001;
var app = express();

app.use('/', routes);

//start the HTTP server
app.listen(PORT, function () {
    console.log('Server running on http://localhost:' + PORT);
});
```

### Express Routes

Because we want to access the HANA HDI artifacts from express routes, we need the `sap-hdbext` module to utilize accessing approach.

#### Install the sap-hdbext

Get the component [*XS\_JAVASCRIPT*][7] from [SAP SMP][4], and install the dependencies which you need into the node_modules.

Or if you are in the SAP internal environment, you can use

`$ npm install sap-hdbext --save`

> Before installing the sap-hdbext, please check your npm registry by `npm config get registry`. If it is not registry of sap, set the registry using `npm config set registry http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.milestones.npm/`

#### Access HANA DB

Create a file **_userinfoQuery.js_** which is used to get current user information from HANA database. How to access HANA database, we can use the component **_sap-hdbext_**.

```javascript
var hdbext = require('sap-hdbext');

var hanaConfig = {
  host: '<HANA DB Host>',
  port: <HANA DB Port>,
  user: '<HANA DB User Name>',
  password: '<HANA DB User Password>',
  schema: '63BA774DD3EA4523B50E3C99FDA18305', // the schema id of application xs2-node-hw-db
  isolationLevel: hdbext.constants.isolation.SERIALIZABLE,
  locale: 'en_US',
  session: {
    APPLICATION: 'xs2-node-hw-db',
    SAP_PASSPORT: 'passport'
  }
};

function userInfoQuery(callback) {
    responseObject = {};

    hdbext.createConnection(hanaConfig, function(error, client) {
      if (error) {
        return console.error(error);
      }

      client.exec("SELECT TOP 1 CURRENT_USER, SESSION_USER, SESSION_CONTEXT('XS_APPLICATIONUSER') as APPLICATION_USER FROM DUMMY", function (error, rows) {
          if (error) {
              callback(error, null);
          }
          else {
              responseObject.hdbCurrentUser = rows;
              responseObject.user = externalUserInfo;
              callback(null, responseObject);
          }
      });
    });
}
module.exports = userInfoQuery;
```

#### Express Routes

We need use express route to pip the user information from SQL into express services.
Create a file **_userinfo.js_**

```javascript
var express = require('express');
var router = express.Router();
var userInfoQuery = require('./userinfoQuery');

router.get('/rest/userinfo', function (req, res) {
    userInfoQuery(function(error, result) {
        if(error) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end('{}');
        }
        else {
            console.log(JSON.stringify(result, null, 4));
            res.end(JSON.stringify(result, null, 4));
        }
    });
});
module.exports = router;
```

## Testing Locally

If we want to test the application in local environment

### Add Package Scripts

Add the script `node index.js` as `start` command of scripts node in the configuration file *package.json*

```javascript
"scripts": {
  "start": "node index.js",
  ...
},
```

### Start Node Server

Use the command to start Node.js Server in the **_js_** module

`npm start`

then access this url, you can get current user information which is in the HANA config

*http://localhost:3001/rest/userinfo*

Output

```
{
    "hdbCurrentUser": [
        {
            "CURRENT_USER": "tiven",
            "SESSION_USER": "tiven",
            "APPLICATION_USER": "tiven"
        }
    ]
}
```

Up to now, the project code can be downloaded from [Github][5].

## Use hdbext Middleware

We have set the HANA DB connection information in javascript code, but we need the connection information to be configurable. So we change the code

### hdbext.middleware

*sap-hdbext* provides an [Express middleware][6] which allows easy access to a connection pool in an Express based application. In the background a connection pool is created. The connection is automatically returned to the pool when the express request is closed or finished.

Add the middleware of hdbext component into Express based application:

```javascript
app.use('/', hdbext.middleware(), routes);
```

then we can use the db connection from request

```javascript
app.get('/execute-query', function (req, res) {
  var client = req.db;

  client.exec('SELECT * FROM DUMMY', function (err, rs) {
    if (err) {
      return res.end('Error: ' + err.message);
    }

    res.end(JSON.stringify(rs));
  });
});
```

The middleware sets the `XS_APPLICATIONUSER` and the `SAP_PASSPORT` session variables automatically, if the corresponding data is available in the HTTP request. It also sets `APPLICATION` and `APPLICATIONVERSION` session variables automatically to some default values extracted from the environment.

### Environment Variables Set for App

The `xs env <APP>` command retrieves details of the application's connection to the SAP HANA database; the retrieved information can be added to the application's **_default-services.json_** file, if you want to automate the connection process in local testing.

`xs env xs2-node-hw-db`

Output Code:

```
Getting env variables for app "xs2-node-hw-db"...
OK

System-Provided:
{
  "VCAP_APPLICATION" : {
    "start" : "2016-11-08 05:26:10 +0000",
    "application_id" : "59687532-2e1a-4c53-997b-bd47a1d3abab",
    "instance_id" : "59687532-2e1a-4c53-997b-bd47a1d3abab",
    "space_id" : "7d02345a-e038-4241-b6b3-29d93399b1e5",
    "application_name" : "xs2-node-hw-db",
    "organization_name" : "tiven",
    "space_name" : "dev",
    "started_at_timestamp" : "1478582770319",
    "started_at" : "2016-11-08 05:26:10 +0000",
    "state_timestamp" : "1478241599917",
    "full_application_uris" : [ ],
    "application_uris" : [ ],
    "uris" : [ ],
    "version" : "73fb676c-92bf-4a40-b776-8c8f90bee7e3",
    "application_version" : "73fb676c-92bf-4a40-b776-8c8f90bee7e3"
  },
  "VCAP_SERVICES" : {
    "hana" : [ {
      "name" : "node-hdi-container",
      "label" : "hana",
      "tags" : [ "hana", "database", "relational" ],
      "plan" : "hdi-shared",
      "credentials" : {
        "schema" : "63BA774DD3EA4523B50E3C99FDA18305",
        "hdi_password" : "Aa_74608735244298218028342040858001426965049506414721064325321684283",
        "password" : "Aa_85244343817894021448045883854530024053619952332403999594279734561",
        "driver" : "com.sap.db.jdbc.Driver",
        "port" : "30015",
        "host" : "vhnwa750",
        "db_hosts" : [ {
          "port" : 30015,
          "host" : "vhnwa750"
        } ],
        "hdi_user" : "SBSS_89818668466260891837065444764981588346708582242961564640118036313",
        "user" : "SBSS_99662011288451820856454027337837582596985533612535677965536819566",
        "url" : "jdbc:sap://vhnwa750:30015?encrypt=true&validateCertificate=false&currentschema=63BA774DD3EA4523B50E3C99FDA18305"
      }
    } ]
  }
}


No user-defined env variables have been set
Staging environment:
  MEMORY_LIMIT: 128m

No execution environment variables have been set
```

### Configuration for Local Development

Because there is no xs2 environment when we test the application in local, we need the local configuration of special User Account for db connection via a **_default-services.json_** file in the same directory as the node.js services themselves(not the project root).

*default-services.json*:

```
{
    "hana": {
        "host"            : "vhnwa750",
        "port"            : "30015",
        "user"            : "tiven",
        "password"        : "password",
        "schema"          : "63BA774DD3EA4523B50E3C99FDA18305"
    }
}
```

You can also add Authentication (UAA) services in this file for local development.

### Testing of Local Development

Execute `npm start` then you can also get the user information by accessing

*http://localhost:3001/rest/userinfo*

## Next

[HANA XS2 On-Premise part 6 - Operate artifacts in HANA from Nodejs](/articles/hana-xs2-part6-operate-hana/)

[1]:/articles/hana-xs2-part4-nodejs-hdi/
[2]:https://github.com/anypossiblew/hana-xs2-samples/tree/access-hana
[3]:http://expressjs.com/
[4]:http://service.sap.com/
[5]:https://github.com/anypossiblew/hana-xs2-samples/tree/sap-hdbext
[6]:http://expressjs.com/en/guide/using-middleware.html
[7]:/references/sap-github-xs2-xs-javascript/
