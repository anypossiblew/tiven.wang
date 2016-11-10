---
layout: reference
title: SAP XS2 XS_JAVASCRIPT
excerpt: "Collecting project for shipment of node.js packages as one software component on Service Marketplace"
modified: 2016-11-09T17:00:00-00:00
categories: references
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
---

XS_JAVASCRIPT
=============

This component bundles Node.js packages part of SAP HANA XS Advanced.
This bundle is delivered as `XS_JAVASCRIPT` Software Component on [SAP Service Marketplace](http://service.sap.com).

# Comprised packages
* __approuter__ - Application router for SAP HANA XS Advanced
* __sap-cds__ - Core Data Services (CDS) client for Node.js
* __sap-hdb-connection__ - Utility functions for using SAP HANA in Node.js (deprecated, use __sap-hdbext__ instead)
* __sap-hdbext__ - Extended functionality for SAP HANA access in Node.js
* __sap-hdi-deploy__ - Node.js client for HANA Deployment Infrastructure (HDI)
* __sap-jobs-client__ - Node.js client for Job Scheduler
* __sap-logging__ - SAP standard logging and tracing for Node.js applications
* __sap-textbundle__ - Text internationalization for Node.js applications
* __sap-textmining__ - Text mining API for Node.js applications
* __sap-textanalysis__ - Text analysis API for Node.js applications
* __sap-xsenv__ - Utility for easy setup and access of XS Advanced environment variables and services
* __sap-xsjs__ - Compatibility layer for execution of XS Classic applications
* __sap-xsjs-test__ - Unit test framework for the compatibility layer (XS classic runtime)
* __sap-xssec__ - XS Advanced security API for Node.js
* __sap-xsssecure__ - Utilities for protection against cross-site scripting
* __sap-e2e-trace__ - Provides functionalities for e2e tracing (SAP Passports handling in particular)
* __sap-sds-deploy__ - Node.js client for HANA Smart Data Streaming (SDS) option
* __sap-audit-logging__ - Provides functionalities for audit logging
* __sap-xb-messaging__ - Provides functionalities for publish / subscribe with an external messaging broker
* __sap-site-entry__ - SAP Portal site entry point
* __sap-site-content-deployer__ - Node.js client for portal site content deployer
* __sap-ui-annotations__ - Provides SAP UI Annotations for OData Provisioning of CDS Artifacts

See README inside each package for more details.

# Installation

Follow these instructions to install some of the packages above in your Node.js application.

1. Check if directory `node_modules` exists in the same location where your `package.json` file is.
If directory `node_modules` does not exist, create it.

2. Make sure `node_modules` directory is not included in `.cfignore` or `.xsignore` files.

3. Copy the complete directory of the selected package from XS_JAVASCRIPT under `node_modules` directory in your application.
For example if you need _sap-xsjs_ in your aplication, copy `sap-xsjs` directory under `node_modules`.
**Note:** it is important to use the same package directory name (`sap-xsjs` in the example above).

4. Check `name` and `version` properties in `package.json` of the selected package.
Then edit `package.json` of your application and add a dependency under `dependencies`
using the same name and version. Continuing the example above, if `sap-xsjs/package.json` contains
```json
  "name": "sap-xsjs",
  "version": "1.6.3",
```
add this line in your `package.json` under `dependencies`
```json
  "sap-xsjs": "1.6.3"
```

Since `node_modules` directory will be present in your application when pushing it to
XS Advanced runtime, Node.js buildpack will not execute `npm install` and any missing
dependencies will not be downloaded. So make sure to execute `npm install` locally
before executing `xs push`.
