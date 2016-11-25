---
layout: reference
title: SAP XS2 xsjs
excerpt: "SAP Github XS2 - Node module running XSJS code compatibility"
modified: 2016-11-25T17:00:00-00:00
categories: references
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
---

* TOC
{:toc}

Compatibility layer for SAP HANA extended application services, classic model (SAP HANA XS Classic) applications to run on Node.js in SAP HANA extended application services, advanced model.

For the API of XS Engine
  * [SAP HANA XS JavaScript Reference](http://help.sap.com/hana/SAP_HANA_XS_JavaScript_API_Reference_en/)

## Usage
It is as simple as it could be.
```js
'use strict';

var xsenv = require('sap-xsenv');
var xsjs = require('sap-xsjs');

var port = process.env.PORT || 3000;
var options = xsenv.getServices({
    uaa: 'xsuaa',
    hana: 'hana-hdi',
    jobs: 'scheduler',
    mail: 'mail',
    secureStore: 'secureStore'
}));
xsjs(options).listen(port);

console.log('Node XS server listening on port %d', port);
```

The starting function takes an object that contains service credentials and application options.

You will need to setup the Application Router for authentication.
For a step by step tutorial see *Use the XSJS Compatibility Layer in XS Advanced*
in *SAP HANA Developer Guide for SAP HANA XS Advanced Model*.

For local testing you can set `options.anonymous = true` to disable authentication.

### Options

Here is a list with options you can provide:

| property | default | usage |
| -------- | ------- | ----- |
| rootDir | 'lib' | xsjs files location |
| rootDirs |  | same as above, but array of directories can be provided, overrides rootDir if provided |
| uaa |  | UAA configuration necessary to enable JWT token authentication and business user propagation to HANA |
| hana |  | object containing HANA DB connection parameters, used for DB connectivity |
| secureStore |  | object containing HANA DB connection parameters, used for secure store connectivity |
| jobs |  | Job scheduler connection parameters used to register jobs during application startup and later for updating job execution status when job finished |
| mail |  | Mail options, used by $.net.Mail API |
| anonymous | false | Enable anonymous access, i.e. without credentials |
| formData |  | Special restrictions over form-data submitted to server |
| destinationProvider |  | Custom function, synchronous or asynchronous, to be used when $.net.http.readDestination is called in XSJS code. For more information on destinations support, check the detailed description for this configuration option. |
| ca | certificates listed in `XS_CACERT_PATH` env var | Trusted SSL certificates for any outgoing HTTPS connections. Should be an array of loaded certificates. |
| compression | true | By default text resources over 1K are compressed.
| context | {} | Extend the default context in xsjs scripts.

**Note:** When there are several rootDirs (for example: repo1 and repo2) and their file strucutre is equivalent (/repo1/hello.xsjs and /repo2/hello.xsjs) the file from the first directory (as listed in the 'rootDirs' property) will be used (/repo1/hello.xsjs) and the file from the second directory (/repo2/hello.xsjs) will be ignored with a warning message in the logs.

SAP HANA XS Advanced applications connect to HANA with a fixed technical user provided via CloudFoundry service (environment variables). The actual (business) user of the application is retrieved from the JWT token and propagated to HANA.

The connection to Job scheduler service is done with a fixed technical user provided by the CloudFoundry service binding.


#### hana

| property | mandatory | usage |
| -------- | ----- | -------- |
| host | x | DB host |
| port | x | DB port |
| user | x | Technical user used for DB connection |
| password | x | Technical user password |
| schema |  | If provided will be set as current schema to DB connection |
| connectWithLoggedUser |  | Possible values are `true` / `false`, default is `false`. If provided the DB connection will be done with the SAML assertion contained in the JWT token of the logged user. **Note:** This option is provided only for HANA cockpit transition to SAP HANA XS Advanced. In general this option should be avoided. |
| sqlcc |  | Object containing all SQLCC configurations as properties with name after  SQLCC name used in XSJS code |
| ca |  | Trusted SSL certificates explicitly for HANA connection. Should be an array of loaded certificates. If not provided, certificate from service binding will be used. If none are available HANA connection will not be encrypted. |

- `sqlcc` - referring to the example above, SQLCC property can be initialized from the bound services like this:

```js
...
options.hana.sqlcc = xsenv.getServices({
  'com.sap.my.sqlcc_config': 'SQLCC__NAME',
  'com.sap.my.other_sqlcc_config': 'OTHER_SQLCC_UPS_NAME'
  });
...
```

and used later in xsjs code like:
```js
var connection = $.db.getConnection('com.sap.my.sqlcc_config');
```


#### secureStore

| property | mandatory | usage |
| -------- | ----- | -------- |
| host | x | DB host |
| port | x | DB port |
| user | x | Technical user used for DB connection |
| password | x | Technical user password |
| schema |  | If provided will be set as current schema to DB connection |



#### formData

object with following properties:

| property | default | usage |
| -------- | ------- | ----- |
| maxFilesSizeInBytes | `10485760` | It restricts the total size of all the uploaded files. |


#### mail

object with following properties:

| property | mandatory | usage |
| -------- | ----- | -------- |
| host | x | SMTP server host. |
| port | x | SMTP server port. |
| ignoreTLS |  | Could be `true` or `false`. This represents whether a STARTTLS command should be invoked if available by the mail server. Defaults to `false`. |
| secure |  | Could be `true` or `false`. This represents whether the connection should be over TLS/SSL. Defaults to `false`. |
| connectionTimeout |  | Connection timeout in ms. Defaults to 60000. |
| authMethod |  | Authentication method to use. Could be 'PLAIN' / 'LOGIN' / 'CRAM-MD5'. |
| auth |  | Authentication credentials. Example: {user: 'user', pass: 'pass'} The default is no authentication. |


#### destinationProvider

If your application requires different mechanism for destination configuration for example dynamic configuration changes or dynamically adding new destinations to your application, you can provide own function that retrieves these configurations from your storage.

For convenience we support synchronous and asynchronous destination provider function. Depending on the number of parameters your function has we call it synchronously or asynchronously.

Here are the signatures for both:

```js
function getDestinationSync(packagename, objectname, dtDescriptor) {
}

function getDestinationAsync(packagename, objectname, dtDescriptor, callback) {
}
```


| parameter | description |
| -------- | --------- |
| packagename | the package of the destination supplied to $.net.http.readDestination |
| objectname | the object name of the destination supplied to $.net.http.readDestination |
| dtDescriptor | object containing all properties contained in the corresponding .xshttpdest file, if such file is available, otherwise __undefined__ |
| callback | provided only in the asynchronous case - should be called by your provider function to return the destination or report error  |

#### context

This option can be used if you want to extend the xsjs scripts with additional global variables.

Example:

```js
var xsjs = require('sap-xsjs');
var options = {
  anonymous: true,
  context: { answer: 42 }
};
xsjs(options).listen(3000);
```

This configuration extends the context of xsjs scripts with one additional variable called `answer`.
Every time an xsjs script is executed it will not only have the `$` variable in it's context, but it will also include variable `answer` with value `42`.

Lets have a file `answer.xsjs` with the following content:
```js
$.response.setBody(answer);
```
A request to `http://<your_domain>:3000/answer.xsjs` will respond with `42`.

With the `context` property set, you can expose Node.js packages and variables:
```js
var options = {
  anonymous: true,
  context: { environment: process.env, _: require('lodash') }
};
```

Currently we are aware of a limitation, which causes `<variable> instanceof <constructor_function>` used in a xsjs script to have odd behaviour.
Also stubbing or mocking constructor functions such as `Date`, `String`, etc in a xsjs script won't affect other xsjs files.

The `context` property also finds usage in a workaround for this limitations. Setting:
```js
var options = {
  anonymous: true,
  context: { Array: Array, String: String }
};
```
will fix these problems, but has side effects:

* Creating an array in xsjs script and checking it's instance will now return false:
```js
  var myArray = [1, 2, 3];
  $.response.setBody(myArray instanceof Array); // Responds with false
```
* Monkey-patching built-in types won't work as expected, if they are exposed through the `context` property:
```js
  String.prototype.contains = function(str) { return this.indexOf(str) >= 0; };
  var stringLiteral = 'Abc';
  var stringObject = new String('Abc');
  console.log(stringLiteral.contains); // undefined
  console.log(stringObject.contains); // [Function]
```
Since there might be other side effects, **use this feature at your own risk.**


## OData support

OData support is provided by OData package sap-xsodata. Details on what features are provided can be found in the project itself. In the compatibility layer we search for .xsodata descriptors in the source directories(s) specified and register OData endpoint for each valid descriptor. JavaScript exits via .xsjslib files are supported.


## NPM packages support
As an extension in the dollar API we included support for all the available NPM packages. <br />
For example, in your xsjs file you can add the following code:

```js
var _ = $.require('underscore');
// Count to ten
var count = '';
_.range(11).forEach(function(number) {
  count += number + ' ';
});
$.response.setBody(count);
```

__NOTE__: If you require an npm package that is asynchronous, you have to use our built-in fibers support to make it synchronous. <br />
Let's take for example the [request](https://github.com/request/request/blob/master/request.js) module from npm. The standart Node.js approach for using the module will be:

```js
var request = $.require('request');
request('http://google.com', function(error, response) {
  if (error) {
    $.trace.error(error);
    return;
  }
  $.response.setBody(response.body);
});
```
This snippet won't work in a xsjs file. The right xsjs approach would be:

```js
var request = $.require('request');
try {
  var response = request.sync('http://google.com');
  $.response.setBody(response.body);
} catch(error) {
  $.trace.error(error.message);
}
```

You can also require a file relatively. The required file will execute in Node.js context. This means you will have access to global Node.js variables, such as `__dirname`, `process`, etc. in it.
For example, if we have a file called myAPI.js with content:

```js
// myAPI.js
module.exports = {
  getDirname: function() {
    return __dirname;
  }
};
```

Let's say myAPI.js is located in a parent directory for the following xsjs file:
```js
var myAPI = $.require('../myAPI.js');
$.response.setBody(myAPI.getDirname());
```

## Destinations support

#### Via user provided services
By default the compatibility layer supports destinations configuration via user provided services. The destination name (the repo resource id, e.g. package + '.' + xshttpdest name) is matched to service name.

Example content of VCAP_SERVICES:

```js
VCAP_SERVICES: {
  "user-provided": [
   {
     "label": "user-provided",
     "name": "foobar.httpdest.mydest",
     "credentials": {
       "host": "some.host",
       "port": 8088,
       "username": "user",
       "password": "secret"
     }
   }
}
```
Example usage in XSJS code:
```js
var destination = $.net.http.readDestination('foobar.httpdest', 'mydest');
```
If there is no service in VCAP_SERVICES with same name as the destination requested, an exception is thrown.

When destination is read the content of the design time descriptor is merged with the properties provided in the user provided service. Property values of the UP service override DT descriptor values.


#### Via custom provider function

If the default support is not enough for your use case, you can provide custom destination provider function. For details how to do that, see the __destinationProvider__ configuration option explained above.


## Troubleshooting

This package uses _sap-logging_ package so all of its features are available to control logging.
For example to set all logging and tracing to finest level set `XS_APP_LOG_LEVEL` environment variable to `debug`.

If the application is deployed on XS Advanced On-premise Runtime, you can change the log level without restarting the application.
For example this command will set all logging and tracing to finest level.
```sh
xs set-logging-level <application-name> '*' debug
```
See sap-logging documentation for details.

Some of the libraries used by this package employ other tracing mechanisms. For example many use the popular [debug](https://www.npmjs.com/package/debug) package. This means that by setting `DEBUG` environment variable, you can enable additional traces. Set it to `*` to enable all of them, but be careful as the output may be overwhelming.
In addition internal Node.js traces can be enabled via `NODE_DEBUG` environment variable. [This post](http://www.juliengilli.com/2013/05/26/Using-Node.js-NODE_DEBUG-for-fun-and-profit/) describes it in more detail.

**Warning:** Enabling some of these options may trace security sensitive data, so use with caution.

## Differences between XSJS on node.js and HANA XS Classic

See the differences [here](/references/sap-github-xs2-xsjs-differences/).

<br/>
