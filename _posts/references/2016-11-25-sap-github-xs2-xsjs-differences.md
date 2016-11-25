---
layout: reference
title: SAP XS2 xsjs Differences
excerpt: "SAP Github XS2 - Differences between XSJS on Node.js and HANA XS Classic"
modified: 2016-11-25T17:00:00-00:00
categories: references
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
---

* TOC
{:toc}

 Differences between XSJS on Node.js and HANA XS Classic

## Root Object ($)
 * `$.session` - only these properties are supported:
  * user
  * language
  * getUsername()
  * hasAppPrivilege()
  * assertAppPrivilege()

## Legacy Database API ($.db)
* getX functions where X is some type
  * do not perform as many type conversions as in HANA XS Classic
* `$.db.ResultSet.getString()`
  * returns a number instead of a string if the column is of numeric type.
  * decimals are returned with respect to their scale. Trailing zeros might be added at the end of the string to complement the returned value to the number of fractional digits specified. For example, '1.34000' will be returned for the value 1.34, if the type is a decimal with precision 6 and scale 5.
* ParameterMetaData
  * getParameterType and getParameterTypeName may return different values from HANA XS Classic, e.g.
    * NSTRING returned instead of NVARCHAR
    * TIMESTAMP returned instead of SECONDDATE
    * DECIMAL returned instead of SMALLDECIMAL
    * NVARCHAR returned instead of ALPHANUM
  * table output parameters from stored procedures are not described in ParameterMetaData
  * isNullable - Not supported
  * isSigned - Not supported
  * hasDefault - Not supported
* PreparedStatement, CallableStatement - setDate, setTime, setTimestamp
  * not all date/time formats are supported

## Database API ($.hdb)
 * `$.hdb.ResultSet` - access by column index is not supported (only by column name).

## Jobs API ($.jobs)
Supported.

## Network API ($.net)
 * Destinations
  * only the following properties are supported - host, port, pathPrefix, useProxy, proxyPort, authType, username, password
 * Mail, SMTPConnection
  * proxy support and Digest-MD5 authentication method are not supported

## Security API ($.security)
Supported.
**Note:** `$.security.Store` - store files are created automatically

## Text Analysis and Text Mining ($.text)
$.text.mining supported.<br />
$.text.analysis supported when _sap-xsjs_ is connected to HANA 2.0.

## Trace API ($.trace)
Supported.

## Util API ($.util)
 * $.util.Zip is partially supported:
    * Originally in XS Classic the Zip constructor accepts setting object with two properties: `password` and `maxUncompressedSizeInBytes`.
      Currently password-protected zips are not supported so the `password` property is forbidden.
    * Adding, altering and deleting entries from the zip objects is not supported.

 * $.util.compression.gunzip does not support the `maxUncompressedSizeInBytes` parameter.
 * $.util.SAXParser - partial support.
    * `stop` and `resume` methods are not supported.
    * `currentByteIndex`, `currentColumnNumber` and `currentLineNumber` properties are not supported.
    * `attlistDeclHandler`, `endDoctypeDeclHandler`, `endNameSpaceDeclHandler`, `entityDeclHandler`, `externalEntityRefHandler`, `notationDeclHandler`, `processingInstructionHandler`, `startDoctypeDeclHandler`, `startNameSpaceDeclHandler`, `xmlDeclHandler` handlers are not supported.
    * namespaces and entities are not supported.

## Request Processing API ($.web)
Supported with the following differences:
- Headers starting with a tilde (`~`) that are accessible in XS Classic are not provided.
- Duplicated custom incoming request headers are represented as joined headers. For example, if a client sends a header `abc` once with value of `1` and second time with a value of `2`,
`$.request.headers.get('abc')` will result into `'1, 2'` instead of `['1', '2']`.
- webResponse.setBody(body) - In XS Classic if body is null, undefined or object, an exception is thrown. In XS Advanced the response is 'null', 'undefined' and JSON.stringify(object), respectively.

## ODATA
Supported, including SQL and JavaScript exists.

## Repository access ($.repo)
Not supported.

## JavaScript VM
Node.js uses V8 from Google, while HANA XS uses SpiderMonkey from Mozilla.
 * `let` keyword is not supported in Node.js by default. Use `var` instead.
 * In XS Classic xsjs
  * always runs implicitly in strict mode.
  * supports `const` from ES6.
  * supports conditional catches:
```js
try {
     willfail() // throws FooException
} catch (e if e instanceof FooException) {
     //do something
}
```
Node.js / V8 does not support this 'if' construct in the catch statement - you can only provide a single parameter name, e.g. 'e'.

* `instanceof`

 `.xsjs` files run in isolated contexts which have different references for the built-in Node.js types.
 This will cause `instanceof` not to work as expected. You can take a look on [this issue](https://github.com/nodejs/node-v0.x-archive/issues/1277) in Node.js.

 This issue applies for built-in types like:  **Array**, **String**, **RegExp**, **Number**, etc.<br />
 For **Array**, you should use `Array.isArray` instead of `instanceof Array`.<br />
 For **String** it is suitable to use `typeof`.

## Other
 * DXC (Direct Extractor Connection) and xsxmla are not supported.
