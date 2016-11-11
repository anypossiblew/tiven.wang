---
layout: reference
title: SAP XS2 sap-xsenv
excerpt: "SAP Github XS2 - Utility for easy setup and access of environment variables and services in Cloud Foundry and XSA"
modified: 2016-11-11T17:00:00-00:00
categories: references
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
---

# sap-xsenv

Utility for easy setup and access of SAP HANA XS Advanced environment variables.

SAP HANA XS Advanced apps take various configurations from the environment.
For example Cloud Foundry provides properties of bound services in [VCAP_SERVICES](http://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES) variable.

To test locally you need to provide these configurations by yourself. This package allows you to provide default configurations in a separate configuration file.
* This reduces clutter by removing configuration data from the app code.
* You don't have to set env vars manually each time you start your app.
* Different developers can use their own configurations for their local tests without changing files under source control. Just add this configuration file to `.gitignore` and `.cfignore`.

Currently you can provide default configurations on two levels:
* For Cloud Foundry services via `getServices()` and `default-services.json`
* For any environment variable via `loadEnv()` and `default-env.json`

While here we often reference Cloud Foundry, it all applies also to SAP HANA XS Advanced On-premise Runtime which emulates Cloud Foundry as much as possible.

### Service Lookup

Here is an example how to lookup specific Cloud Foundry services bound to your application:
```js
var xsenv = require('sap-xsenv');

var services = xsenv.getServices({
  hana: { tag: 'hdb' },
  scheduler: function(service) { return service.label === 'jobs' }
});

var hanaCredentials = services.hana;
var schedulerCredentials = services.scheduler;
```
The search criteria for the required services is specified via the query parameter to `getServices`.
Each property of the query object specifies the query value for one service.
See [filterCFServices](#filtercfservices) below for description of the supported query values.

To test this locally, create a file called `default-services.json` in the working directory of your application.
This file should contain something like this:
```json
{
  "hana": {
    "host": "localhost",
    "port": "30015",
    "user": "SYSTEM",
    "password": "secret"
  },
  "scheduler": {
    "host": "localhost",
    "port": "4242",
    "user": "my_user",
    "password": "secret"
  }
}
```
Notice that the result property names (`hana` and `scheduler`) are the same as those in the query object and also those in `default-services.json`.

For each requested service `getServices` first looks in [VCAP_SERVICES](http://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES) variable and then in `default-services.json` file.

This will throw an error if some of the requested services could not be found.
This way you will find right away if some required service is missing.

Note: `getServices` will return only the requested services. It will not return any of the standard SAP HANA XS Advanced services (hana, uaa, jobs) unless they are explicitly specified in the query parameter.

You can also pass a custom file to load default service configuration from:
```js
var xsenv = require('sap-xsenv');

var services = xsenv.getServices({
  hana: { tag: 'hana' },
  uaa: { tag: 'uaa' }
}, 'my-services.json');
```
This will load defaults from `my-services.json` instead of `default-services.json`.

#### User-Provided Service Instances

While this package can look up any kind of bound service instances, you should be aware that [User-Provided Service Instances](https://docs.cloudfoundry.org/devguide/services/user-provided.html) have less properties than managed service instances. Here is an example:
```json
  "VCAP_SERVICES": {
    "user-provided": [
      {
        "name": "pubsub",
        "label": "user-provided",
        "tags": [],
        "credentials": {
          "binary": "pubsub.rb",
          "host": "pubsub01.example.com",
          "password": "p@29w0rd",
          "port": "1234",
          "username": "pubsubuser"
        },
        "syslog_drain_url": ""
	  }
    ]
  }
```
As you can see the only usable property is the `name`.

#### Best practice

The recommended and most reliable way to lookup a service is by using its instance name which is unique.
```js
xsenv.getServices({
  hana: process.env.HANA_SERVICE_NAME,
  uaa: process.env.UAA_SERVICE_NAME
})
```
Of course you have to set HANA_SERVICE_NAME and UAA_SERVICE_NAME in the environment to same values you use to bind the respective services (in `manifest.yml` or via `cf bind-service`).

#### filterCFServices

`filterCFServices` scans the services in VCAP_SERVICES and returns only those
that match the given criteria.
It always returns an array of matching service instances.
If no matching services are found, it returns an empty array.

You can lookup a service by its instance name (the name you use to bind the service):
```js
var hanas = xsenv.filterCFServices({ name: 'hana' });
if (hanas.length > 0) {
  connect(hanas[0].credentials);
}
```
**Note:** Do not confuse the instance name (`name` property) with service name (`label` property).
Since you can have multiple instances of the same service bound to your app,
instance name is unique while service name is not.
For this reason the recommended approach is to look up services by instance name.
So for this common case there is even simpler syntax:
```js
xsenv.filterCFServices('hana');
```
This call will return an aray of one element or an empty array, if not found.

You can also look up a service by tag:
```js
xsenv.filterCFServices({ tag: 'relational' });
```
This looks for service instances that have the given tag.

If you need, you can match several properties:
```js
xsenv.filterCFServices({ label: 'hana', plan: 'shared' });
```
This will return the services where _all_ of the given properties match.

If you need more contrived search criteria, you can pass a custom filter function:
```js
xsenv.filterCFServices(function(service) {
  return /shared/.test(service.plan) && /hdi/.test(service.label);
});
```

##### Service Query

Both `getServices` and `filterCFServices` use the same service query values.

Query value | Description
------------|------------
{string}    | Matches the service with the same service instance name (`name` property). Same as { name: '&lt;string&gt;' }.
{object}    | All properties of the given object should match corresponding service instance properties as they appear in VCAP_SERVICES. See below.
{function}  | A function that takes a service object as argument and returns `true` only if it is considered a match

If an object is given as a query value, it may have the following properties:

Property | Description
---------|------------
`name`   | Service instance name - the name you use to bind the service
`label`  | Service name - the name shown by `cf marketplace`
`tag`    | Should match any of the service tags
`plan`   | Service instance plan - the plan you use in `cf create-service`


#### cfServiceCredentials

`cfServiceCredentials` function is a convenience wrapper over `filterCFServices`.
If exactly one service is found, it returns its `credentials` object.
If the requested service is not found or multiple instances are found, it throws an error.

#### readCFServices

VCAP_SERVICES contains arrays of service instances.
`readCFServices` returns a flat object with all service instances as properties.
```
  "VCAP_SERVICES": {
    "hana" : [ {
      "credentials" : {
        ...
      },
      "label" : "hana",
      "name" : "hana1",
      "plan" : "shared",
      "tags" : [ "hana", "relational" ]
    },
    {
      "credentials" : {
        ...
      },
      "label" : "hana",
      "name" : "hana2",
      "plan" : "shared",
      "tags" : [ "hana", "relational", "SP09" ]
    } ]
  }
```
Then `readCFServices` would return:
```
{
  hana1: {
    "credentials" : {
      ...
    },
    "label" : "hana",
    "name" : "hana1",
    "plan" : "shared",
    "tags" : [ "hana", "relational" ]
  },
  hana2: {
    "credentials" : {
      ...
    },
    "label" : "hana",
    "name" : "hana2",
    "plan" : "shared",
    "tags" : [ "hana", "relational", "SP09" ]
  }
}
```
This way it is easier to find a service instance.

### Local environment setup

Function `xsenv.loadEnv()` loads the given JSON file (by default `default-env.json`),
converts each top-level property to a string and sets it in the respective env var,
unless it is already set. So the file content acts like default values for env vars.
Here is a sample `default-env.json` providing HANA and Job Scheduler configuration:
```json
{
  "PORT": 3000,
  "VCAP_SERVICES": {
    "hana": [
      {
        "credentials": {
          "host": "myhana",
          "port": "30015",
          "user": "SYSTEM",
          "password": "secret"
        },
        "label": "hana",
        "name": "hana-R90",
        "tags": [
          "hana",
          "database",
          "relational"
        ]
      }
    ],
    "scheduler": [
      {
        "credentials": {
          "host": "localhost",
          "port": "4242",
          "user": "jobuser",
          "password": "jobpassword"
        },
        "label": "scheduler",
        "name": "jobscheduler",
        "tags": [
          "scheduler"
        ]
      }
    ]
  }
}
```

This allows you to easily setup locally the same environment as in Cloud Foundry and
clean your code from conditional logic if it is running in CF or locally.

You can also use a different file name:
```js
xsenv.loadEnv('myenv.json');
```

### Loading SSL Certificates

If SSL is configured in XSA On-Premise Runtime, it will provide one or more
trusted CA certificates that applications can use to make SSL connections.
If present, the file paths of these certificates are listed in `XS_CACERT_PATH`
environment variable separated by `path.delimiter` (`:` on LINUX and `;` on Windows).

`loadCertificates(certPath)` function loads the certificates listed in `certPath`.
If this argument is not provided, it uses `XS_CACERT_PATH` environment variable instead.
If that is not set either, the function returns `undefined`.
The function returns an array even if a single certificate is provided.

This function is synchronous so it throws an error, if it cannot load some of
the listed files.

For example this code loads the trusted CA certificates so they are used for all
subsequent outgoing HTTPS connections:
```js
var https = require('https');
var xsenv = require('sap-xsenv');

https.globalAgent.options.ca = xsenv.loadCertificates();
```

This function can be used also to load SSL certificates for HANA like this:
```js
var hdb = require('hdb');
var xsenv = require('sap-xsenv');

var client = hdb.createClient({
  host : 'hostname',
  port : 30015,
  ca   : xsenv.loadCertificates(),
  ...
});
```

`loadCaCert()` function loads the certificates listed in `XS_CACERT_PATH` environment variable
into [https.globalAgent](https://nodejs.org/api/https.html#https_https_globalagent) of Node.js.
All subsequent outgoing HTTPS connections will use these certificates to verify the certificate
of the remote host. The verification should be successful if the certificate of the
remote host is signed (directly or via some intermediary) by some of these trusted
certificates.

**Note:** `loadCaCert` is **deprecated**. Use `loadCertificates` instead.

It is suggested to call this function once during the application startup.

```js
xsenv.loadCaCert();
```

If `XS_CACERT_PATH` variable is not set, the function does nothing.
This function is synchronous.
It will throw an error if it cannot load some of the certificates.

### Debugging

Set `DEBUG=xsenv` in the environment to enable debug traces. See [debug](https://www.npmjs.com/package/debug) package for details.
