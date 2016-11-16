---
layout: post
title: HANA XS2 On-Premise part 7 - Client User Interface of an XS Advanced Application
excerpt: "HANA XS2 On-Premise part 7 - Client User Interface of an XS Advanced Application"
modified: 2016-11-10T17:00:00-00:00
categories: articles
tags: [XS2, SAPUI5, Fiori, HANA]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
---

* TOC
{:toc}

A business application consists of several different apps (microservices), at where users access the application, the application router is used to provide a single entry point to that business application. We use the [approuter.js][2] to provide a web application for xs2 in this topic.

> The project codes for this article can be downloaded from [Github][3].

## Project Overview

The web application's position in the xs2 project architecture:

```
JavaScript-ProjectName
|- db/                        
|  |- package.json            
|  |- src/                    
|     |- .hdiconfig           
|     \- mytable.hdbdd        
|- web/                         # Application descriptors
|  |- xs-app.json               # Application routes configuration
|  |- package.json              # Application router details/dependencies
|  \- resources/              
|- js/                        
|  |- start.js                
|  |- package.json            
|  \- src/                    
|     \- odata/               
|        |- resources/        
|        \- services/         
|           | - srv1.xsodata  
|           \ - srvN.xsodata  
|- security/                  
|  \- xs-security.json        
\- manifest.yml  
```

And the **_web_** application's structure:

```
+-- web
| +-- package.json
| +-- xs-app.json
| +-- resources
| | +-- hello-world.html
| | +-- my-page.html
| +-- node_modules
| | +-- approuter
| | +-- ...
| +-- default-env.json
\ +-- default-services.json
```

## Application Code

Let's create a web application using approuter.js.

### XS App Configuration

The main configuration file is named **_xs-app.json_** in the 'web' folder. Since I want to introduce authorization concept in the next topic "[HANA XS2 On-Premise part 8 - Authorization Concept of an XS Advanced Application][1]", I set the `authenticationMethod` as `none` at now.

```
{
  "welcomeFile": "index.html",
  "authenticationMethod": "none",
  "routes": [
    {
      "source": "/rest/.*",
      "destination": "backend"
    },
    {
      "source": "^/(.*)",
      "localDir": "resources"
    }
  ]
}
```

A route is a configuration that instructs the application router how to process an incoming request with a specific path. The first route forwards the source request who start with "*/rest/*" to the destination **_backend_** who is defined in the file **_manifest.yml_**.

The second route forwards all of the rest request to local dir **_resources_** which includes the web application pages.

### Web Resources

Create a html file **_index.html_**

```html
<!DOCTYPE HTML>
<html>
<head>
  <title>Address Books</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset="utf-8">
</head>
<body>
  <div>Hello HANA XS2!</div>
</body>
</html>
```

### Manifest

Add the web application as a app node in manifest file, the environment's destinations that used in approuter need to be defined in this app:

```
---
applications:
- name: xs2-node-hw-db
  path: db
  memory: 128M
  no-route: true
  services:
    - node-hdi-container

- name: xs2-node-hw-backend
  port: 3002 #the port used for nodejs
  path: js
  memory: 128M
  services:
    - node-hdi-container

- name: xs2-node-hw
  port: 3004
  memory: 100M
  path: web
  env:
    destinations: >
      [
        {
          "name":"backend",
          "url":"http://localhost:3002"
        }
      ]
```

## Test Locally

When you test approuter's application locally, you must define two local configuration files:

### Default Environment

The value of attribute **_PORT_** be used as the port of approuter in Node.js runtime container.

**_default-env.json_**:

```json
{
  "PORT": 3003,
  "destinations": [
    {
      "name":"backend",
      "url":"http://localhost:3001"
    }
  ]
}

```

### Default Services

There is a dummy service must be named **_uaa_** in here, I will introduce it in the next topic. However the approuter will check it exist.

**_default-services.json_**:

```json
{
    "uaa": {
        "url" : "http://sap-login.cfapps.neo.ondemand.com",
        "clientid" : "xs2.java",
        "clientsecret" : "javaclientsecret",
        "xsappname" : "node-hello-world"
    }
}
```

### Run Local Test

Run:

`npm start`

After that, access the url *http://127.0.0.1:3003/* to get the web page which contains content 'Hello HANA XS2!'.

## SAPUI5

### SAPUI5 Resources

Download the sapui5 resources zip file, unpack it into folder **_web/sapui5_**. Define the route for SAPUI5

```
"routes": [
  {
    "source": "/sap/ui5/1(.*)",
    "target": "$1",
    "localDir": "sapui5"
  },
  ...
]
```

### Fiori UI

Import the sapui5 core resource file as a html's script, it will be forwarded to local **_sapui5/resources/sap-ui-core.js_** using the route that is defined in **_xs-app.json_**

```html
<script src="/sap/ui5/1/resources/sap-ui-core.js"
        id="sap-ui-bootstrap"
        data-sap-ui-libs="sap.ui.commons, sap.ui.ux3, sap.ui.table, sap.viz"
        data-sap-ui-theme="sap_bluecrystal">
</script>
```

Then you can use all of the sapui5 resources in web pages:

```javascript
var backendURL = "/rest/userinfo"
var oModel = new sap.ui.model.json.JSONModel(backendURL, false)
```

the request of this json model will be forwarded to destination **_backend_**, in which there are all of the background data APIs.

## Publish

When all of the application tested in local are ok, you can push the project to HANA XS2 server.

### XS Push

`xs push`

### Test

Access the url, you will get the SAPUI5 application, in which you can create and delete address-books

*http://127.0.0.1:3004/*

## Next

[HANA XS2 On-Premise part 8 - Authorization Concept of an XS Advanced Application][1]

[1]:/articles/hana-xs2-part8-security/
[2]:/references/sap-github-xs2-approuter-readme/
[3]:https://github.com/anypossiblew/hana-xs2-samples/tree/client-ui
