---
layout: reference
title: SAP XS2 node-hdbext
excerpt: "SAP Github XS2 - Extend the functionality of the hdb module"
modified: 2016-11-10T17:00:00-00:00
categories: references
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
---

sap-hdbext
============

This module provides convenient functions on top of the [hdb][4] module.
Check [Change log](CHANGELOG.md) for the latest updates of this package.

## Usage

```js
var hdbext = require('sap-hdbext');
```

## API

### createConnection(hanaConfig, callback)

Creates a connection to a HANA database:

```js
var hanaConfig = {
  host     : 'hostname',
  port     : 30015,
  user     : 'user',
  password : 'secret'
};
hdbext.createConnection(hanaConfig, function(error, client) {
  if (error) {
    return console.error(error);
  }

  client.exec(...);
});
```

The `hanaConfig` argument contains [database connection options](#database-connection-options) and [additional options](#additional-options).
The callback provides a connected `client` object (see [hdb][4]).

If the application will be deployed in Cloud Foundry or XSA, you can use _sap-xsenv_ package to
lookup the bound HANA service, like this:
```js
var xsenv = require('sap-xsenv');

var hanaConfig = xsenv.cfServiceCredentials({ tag: 'hdb' });
hdbext.createConnection(hanaConfig, function(error, client) {
  //...
});
```

#### Database connection options

The HANA options provided to *sap-hdbext* should be in the same format as expected by the [hdb][5] package.

For convenience these properties set by the HANA service broker in the SAP HANA XS Advanced platform are also accepted:
* `db_hosts` - can be used instead of the `hosts` property of the [hdb driver][5].
* `certificate` - can be used instead of `ca` property of the [hdb driver][6].
__Note:__ `certificate` is a string containing one certificate, while `ca` is an array of certificates.

#### Additional options

A connection created with *sap-hdbext* can be further configured with the following options:

Option | Type | Description
-------- | ---- | -----------
`schema` | string | Used to set current schema.
`autoCommit` | boolean | Sets the autoCommit flag. If no option is specified it defaults to `true`
`isolationLevel` | enum | One of `hdbext.constants.isolation` values. Used to set transaction isolation level.
`locale` | string | Used to set connection locale.
`session` | object | Object with key/value pairs that will be set as session variables.

##### Special session variables

Some session variables are handled in a special way.

* `XS_APPLICATIONUSER` - can be set to a user token (SAML/JWT) to associate the aplication user with the database connection
* `SAP_PASSPORT` - used to propagate SAP passport to SAP HANA, used for end-to-end tracing
* `APPLICATION` - the name of the application initiating the database connection

**Note**: If providing an SAP Passport in the `session` object of the [additional options](#additional-options),
it should have already been updated with data, specific to the component that consumes *sap-hdbext*.
For more information, see the documentation of the *sap-e2e-trace* package.

The [Express middleware](#express-middleware) provided by this package sets automatically
`XS_APPLICATIONUSER` and `SAP_PASSPORT` by extracting relevant data from the HTTP request.

#### Example

Sample configuration with both [database connection options](#database-connection-options) and [additional options](#additional-options):

```js
{
  host: 'my.host',
  port: 30015,
  user: 'my_user',
  password: 'secret',
  schema: 'name_of_the_schema',
  isolationLevel: hdbext.constants.isolation.SERIALIZABLE,
  locale: 'en_US',
  session: {
    APPLICATION: 'myapp',
    SAP_PASSPORT: 'passport'
  }
}
```

### connectionOptions.getGlobalOptions()

Provides default values for these connection options:
* session.APPLICATION - extracted from VCAP_APPLICATION
* session.APPLICATIONVERSION - extracted from package.json in current directory

The application can override these defaults by setting these options explicitly.

### connectionOptions.getRequestOptions(req)

Provides these connection options based on the given HTTP request (_req_):
* session.SAP_PASSPORT
* session.XS_APPLICATIONUSER

### updateConnectionOptions(client, options, callback)

It is also possible to change options on existing connection by using the `updateConnectionOptions` function:

```js
hdbext.updateConnectionOptions(client, options, function(error) {
  if (error) {
    return console.error(error);
  }

  // ...
});
```

`options` is an object having properties same as the [additional options](#additional-options).

### loadProcedure(client, schemaName, procedureName, callback)

Calling stored procedures could become complex using plain [hdb][4] driver, so there are functionalities provided to simplify these calls.

For example, if you have the following stored procedure:

```sql
create procedure PROC_DUMMY (in a int, in b int, out c int, out d DUMMY, out e TABLES)
  language sqlscript
  reads sql data as
  begin
    c := :a + :b;
    d = select * from DUMMY;
    e = select * from TABLES;
  end
```

you can call it via the [hdb](https://www.npmjs.com/package/hdb) driver in the following way:

```js
client.prepare('call PROC_DUMMY (?, ?, ?, ?, ?)', function(err, statement) {
  if (err) {
    return console.error(err);
  }

  statement.exec({ A: 3, B: 4 }, function(err, parameters, dummyRows, tableRows) {
    if (err) {
      return console.error(err);
    }

    console.log('C:', parameters.C);
    console.log('Dummies:', dummyRows);
    console.log('Tables:', tableRows);
  });
});
```

**Note**: Non-quoted names are automatically converted to uppercase by HANA.

With *sap-hdbext* you don't need to construct a `CALL` statement. The procedure can be loaded by its name.
The code can look like this:

```js
hdbext.loadProcedure(client, 'MY_SCHEMA', 'PROC_DUMMY', function(err, sp) {
  sp({ A: 3, B: 4 }, function(err, parameters, dummyRows, tableRows) {
    if (err) {
      return console.error(err);
    }

    console.log('C:', parameters.C);
    console.log('Dummies:', dummyRows);
    console.log('Tables:', tableRows);
  });
});
```

To use the current schema, pass an empty string `''`, `null` or `undefined` for schema.

`loadProcedure(client, schemaName, procedureName, callback)` retruns a JavaScript function which you can call directly.
The function has the `paramsMetadata` property containing metadata for all parameters of the stored procedure.
This could be useful if you need to implement generic stored procedures calling.

You can also pass the input parameters directly in the proper order:

```js
sp(3, 4, function(err, parameters, dummyRows, tableRows) {
  // ...
});
```

Where the big advantage comes in, is with table parameters.
You can pass an array of objects and *sap-hdbext* will auto convert it into a table parameter.
Say we have a `customer` table with `ID` and `NAME` columns and the following procedure:

```sql
create procedure "getCustomers" (in in_table_1 "customer")
language sqlscript reads sql data as begin
select * from :in_table_1;
end;
```

You can call it like this:

```js
client.loadProcedure('MY_SCHEMA', 'getCustomers', function(err, sp) {
  if (err) {
    return console.error(err);
  }

  sp([
    { ID: 1, NAME: 'alex' },
    { ID: 2, NAME: 'peter' }
  ], function(err, parameters, dummyRows, tableRows) {
    // ...
  });
});
```

In this example each array element represents a table row. Property names should case-sensitively match the corresponding column names.

Internally *sap-hdbext* creates a local temporary table in the current schema for each table parameter.
Thus, the current user needs the respective permissions.


### Connection Pooling

*sap-hdbext* implements a simple [generic-pool][1] for pooling connections.

To use it you first synchronously create the pool:

```js
var pool = hdbext.getPool(hanaConfig, poolConfig);
```

The `hanaConfig` argument contains both [database connection options](#database-connection-options) and [additional options](#additional-options).

The `poolConfig` argument is optional. It may contain configurations for the pool itself.

You can acquire a client from the pool. It is delivered via a callback:

```js
pool.acquire(function(err, client) {
  // ...
});
```

If settings of the pooled connection need to be changed, an optional `options` object can be used.
```js
pool.acquire(options, function(err, client) {
  // ...
});
```
Refer to the [additional options](#additional-options) section for more details.


When the client is no longer needed you should release it to the pool with `pool.release(client);`, `client.close();` or `client.disconnect();`.


### Express Middleware

*sap-hdbext* provides an [Express][3] [middleware][2] which allows easy access to a connection pool in an Express based application.
In the background a connection pool is created. The connection is automatically returned to the pool when the express request is closed or finished.

```js
var hdbext = require('sap-hdbext');
var express = require('express');

var app = express();
app.use(hdbext.middleware(hanaConfig, poolConfig));

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

The argument `hanaConfig` may contain both [database connection options](#database-connection-options) and [additional options](#additional-options).

The argument `poolConfig` is optional. It may contain configurations for the created pool.

The middleware sets the `XS_APPLICATIONUSER` and the `SAP_PASSPORT` session variables automatically,
if the corresponding data is available in the HTTP request.
It also sets `APPLICATION` and `APPLICATIONVERSION` session variables automatically to some
default values extracted from the environment.

### SQL Parameter Utilities

The `hdbext.sqlInjectionUtils` object contains several synchronous utility functions that can be used to prevent SQL injections.

#### isAcceptableParameter(value, maxToken)

Returns true if `value` can be used to construct SQL statements.
The number of tokens a value is allowed to contain is set via the optional `maxToken` argument. Defaults to 1.

#### isAcceptableQuotedParameter(value)

Returns true if the provided `value` is quoted correctly and can be used in an SQL statement.

#### escapeDoubleQuotes(value)

Returns the `value` parameter with all double quotation marks escaped (i. e. doubled).

#### escapeSingleQuotes(value)

Returns the `value` parameter with all single quotation marks escaped (i. e. doubled).


[1]: https://github.com/coopernurse/node-pool
[2]: http://expressjs.com/guide/using-middleware.html
[3]: http://expressjs.com/
[4]: https://www.npmjs.com/package/hdb
[5]: https://www.npmjs.com/package/hdb#establish-a-database-connection
[6]: https://www.npmjs.com/package/hdb#encrypted-network-communication
