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

The web application in the xs2 project architecture:

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


## Next

[HANA XS2 On-Premise part 8 - Authorization Concept of an XS Advanced Application][1]

[1]:/articles/hana-xs2-part8-security/
[2]:/references/sap-github-xs2-approuter-readme/
[3]:https://github.com/anypossiblew/hana-xs2-samples/tree/
