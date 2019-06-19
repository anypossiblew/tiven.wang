---
layout: post
theme: UbuntuMono
star: true
series: 
  url: sap-cloudfoundry-node
  title: SAP Cloud Foundry Node.js
title: "Expressjs"
excerpt: "How to develop Express routes with combining XSJS, HANA DB and Node.js in one Application"
modified: 2019-06-04T11:51:25-04:00
categories: articles
tags: [HANA, SAP Cloud SDK, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1740.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/menlo-park-united-states-1740
comments: true
share: true
references:
  - title: ""
    url: "https://developer.okta.com/blog/2018/11/15/node-express-typescript"  

---

* TOC
{:toc}

https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.03/en-US/31d5595ee67c484290621fdc6d6a197f.html

本系列文章我们将介绍如何为 SAP S4HANA Cloud 系统开发扩展程序 （Extension App）。本文（项目源代码可下载自 [GitLab sourcecode](https://gitlab.com/i.tiven.wang/s4hana-cloud-sdk-demo/tree/express)）将介绍如何在同一个 Node.js Application 里将传统 Express 程序与 SAP HANA XSJS 程序结合使用。

回到我们的第一篇 [SAP Cloud Foundry Node.js - Getting Started with SAP Cloud SDK TypeScript version](/articles/sap-cloudfoundry-node-getting-started/) 介绍了怎么 Setup 起来一个 TypeScript 版的 Node.js Application，本篇接着改进它，使其支持 SAP HANA XSJS 程序。

## Step 1. Init XSJS in Express Application

```
npm install @sap/xsjs --save
npm install @sap/hdbext --save
```

![](/images/s4hana/sap-cf-node-express-init-xsjs.png)

`cf set-env my-cloud-sdk-demo XS_APP_LOG_LEVEL debug`

Check the [Standard Node.js Packages for XS Advanced](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/54513272339246049bf438a03a8095e4.html)

```
@sap/logging
@sap/hdbext
@sap/audit-logging
```

## Error: XS Application User

添加 HANA Ext 的 middleware 函数时会出现如下错误：

> {"code":455,"message":"the predefined session variable cannot be set via SET command: XS_APPLICATIONUSER","sqlState":"HY000","status":500}
{: .Warning}

经过如下重现过程后发现 `getRequestOptions` from `req` 会取出 `sessionVariable:XS_APPLICATIONUSER` 并传给 `createConnection` 而它并不需要 Application User 去连 HANA DB 而是通过 `hanaService` 提供的用户信息

```javascript
const services = xsenv.getServices({ uaa:'my-xsuaa' });
passport.use(new JWTStrategy(services.uaa));

this.app.use(passport.initialize());
this.app.use(passport.authenticate('JWT', { session: false }));

function middleware(hanaService) {
  /**
   * {
   *   "sessionVariable:APPLICATION":"my-cloud-sdk-demo/dev",
   *   "sessionVariable:APPLICATIONVERSION":"my-cloud-sdk-demo@1.0.0"
   * }
   */
  console.error(JSON.stringify(connOptions.getGlobalOptions()));
  var globalOptions = _.extend({}, connOptions.getGlobalOptions(), hanaService);
  /**
   * {
   *   "sessionVariable:APPLICATION":"my-cloud-sdk-demo/dev",
   *   "sessionVariable:APPLICATIONVERSION":"my-cloud-sdk-demo@1.0.0",
   *   "host":"10.253.93.93",
   *   "port":"30041",
   *   "driver":"com.sap.db.jdbc.Driver",
   *   "url":"jdbc:sap://10.253.93.93:30041/?currentschema=3F5AE825FC7A4C5C97A3A01FD53AF6",
   *   "schema":"3F5AE825FC7A4C5C9FA7A01FD53AF6",
   *   "hdi_user":"SBSS_852183372522635697759010499289880709458540037505389095323186432",
   *   "hdi_password":"Rl8oKkR5z2n1ay4BBgnfglvPoYrcdHjR-_v0_eSuRRBOrvIzQfTN3gQL7vrJNA6edxHEuQmhJZXKpXX6u8.iXHk1HRoWuVxnq9Uu354snqIrE-u_.-IKjDiWWGJ0ev",
   *   "user":"SBSS_485141804469823880835309905005045141010551400530012062819396603",
   *   "password":"Uo6bS07rc1JNS9ALWATWXCW30_YZ1wfhUcsJvHSbujvdb8tgwRNRMYsKAnpd_VZdbmF3-MiSp3h8SnFmKawA-rMJHISq4zALYEWFs.Vb5S_23NwKazRT959TO0Hqby"
   * }
   */
  console.error(JSON.stringify(globalOptions));
  return function db(req, res, next) {
    var requestOptions = connOptions.getRequestOptions(req);
    /**
     * {
     *   "sessionVariable:XS_APPLICATIONUSER":"eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vcDIwMDEyODUzNzV0cmlhbC5hdXRoZW50aWNhdGlvbi5ldTEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJrZXktaWQtMSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4OTRlODYwZmVmOTU0NTNhYTYxNDJjNGFmNDQ3MGE4NyIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJ6ZG4iOiJwMjAwMTI4NTM3NXRyaWFsIn0sInhzLnN5c3RlbS5hdHRyaWJ1dGVzIjp7InhzLnJvbGVjb2xsZWN0aW9ucyI6W119LCJnaXZlbl9uYW1lIjoiVGl2ZW4iLCJ4cy51c2VyLmF0dHJpYnV0ZXMiOnt9LCJmYW1pbHlfbmFtZSI6IldhbmciLCJzdWIiOiJlZmNjNGM5OS04Nzg0LTRiMDYtYjIzZC1jOTkxOTU1MjI4N2EiLCJzY29wZSI6WyJvcGVuaWQiXSwiY2xpZW50X2lkIjoic2ItbXktY2xvdWQtc2RrLWRlbW8hdDE1MTIyIiwiY2lkIjoic2ItbXktY2xvdWQtc2RrLWRlbW8hdDE1MTIyIiwiYXpwIjoic2ItbXktY2xvdWQtc2RrLWRlbW8hdDE1MTIyIiwiZ3JhbnRfdHlwZSI6ImF1dGhvcml6YXRpb25fY29kZSIsInVzZXJfaWQiOiJlZmNjNGM5OS04Nzg0LTRiMDYtYjIzZC1jOTkxOTU1MjI4N2EiLCJvcmlnaW4iOiJsZGFwwidXNlcl9uYW1lIjoiaS50aXZlbi53YW5nQGdtYWlsLmNvbSIsImVtYWlsIjoiaS50aXZlbi53YW5nQGdtYWlsLmNvbSIsImF1dGhfdGltZSI6MTU2MDIxMzkwMCwicmV2X3NpZyI6IjY5NTNmYzVjIiwiaWF0IjoxNTYwMjEzOTAxLCJleHAiOjE1NjAyNTcxMDEsImlzcyI6Imh0dHA6Ly9wMjAwMTI4NTM3NXRyaWFsLmxvY2FsaG9zdDo4MDgwL3VhYS9vYXV0aC90b2tlbiIsInppZCI6IjBlNzhmMGVjLTk5N2UtNDI0Yy05YTcxLWY2MGQzYjM3YjMzOCIsImF1ZCI6WyJvcGVuaWQiLCJzYi1teS1jbG91ZC1zZGstZGVtbyF0MTUxMjIiXX0.E-ljDMvwjXjNc71eJKsHByv7d7SGuU_OC4rvGeIq3FsOzi8I8yUHbln5r1CIYlhDnroJg6rF97KY_fvhgFY8cV3zPJP4_Zjq7dwWJpRZv6n_LdR8rE8mjtOH4rFy2yxxIie8vKPbAzNwf-fqnjwbP5-gBdB_0i3K6PVjwqatrq0L7k884CaBZXPiFV8Xrffgwtdph3UMGuuw1n3hO3lSNLd8wl2t2nrqq8wH7inYJkxlZ2tsGtMU9Plp0-n8isX-75SffQQlsdHFcFLuRjFJT64YgywU13wBpuXx7ihK2JA7TmDah9YbWTNe4vkaJsZ8z2Jwaznr_8GiBKry8VDriLgjv7Xa0lzVJ912QHtWtTjLGrrlYKxVRUqxkVPLhfpwvFH_5kBvVB0_MsOMJnNwRxxxSaUOGGrYLTmd6B70kgkjP1kSN_2963fqCKDhIqG7rgpmuPkExRvfdA1xKSxpyEhFaT5v2GCYOx6tr0jaFzgcRZRKYPrv2GdMXNRy1YiB1oK0MdhDoucFUzkAjmoSzSfloq3mSeOPecxEnFBl36GB23exYOySdI8v8FWP_bNUbad6EXL21aWZGT5XGsDuqOfhmKjiDzzbXwWPP5FdstW6l-qQWDL6SjQj2d3YqrZc_HOl-mEY_puI7p_BJEL1lB_D52aXmHUXAhVb9yNzZls",
     *   "locale":"zh-CN"
     * }
     */
    console.error(JSON.stringify(requestOptions));

    // delete requestOptions["sessionVariable:XS_APPLICATIONUSER"];

    var options = _.extend({}, globalOptions, requestOptions);

    hdbext.createConnection(options, function (err, client) {
      if (err) {
        err.status = 500;
        console.error(JSON.stringify(err));
        return next(err);
      }

      req.db = client;

      var end = res.end;
      res.end = function () {
        var resEndArgs = arguments;

        debug('Cleanup triggered');
        req.db.close(function (err) {
          if (err) {
            debug('Error while closing connection.', err);
          }
          delete req.db;
          res.end = end;
          res.end.apply(res, resEndArgs);
        });
      };

      next();
    });
  };
}
this.app.use(middleware(xsenv.getServices({hana: {tag: "hana"}}).hana));
```

所以如果要正常运行，可以在创建 HANA Connection 前把 `requestOptions` 中的 `sessionVariable:XS_APPLICATIONUSER` 删掉。
但是这只是模拟 `@sap/hdbext` 库中的代码，实际上我们不能更改这段代码。那么实际上可以把初始化 HANA DB 的 Middleware 放在初始化 JWT A 之前就可以解决这个问题

```typescript
// Initialize HDB Middleware before initialize passport authentication
this.app.use(hdbext.middleware(xsenv.getServices({hana: {tag: "hana"}}).hana));
// Initialize JWT authentication
const services = xsenv.getServices({ uaa:'my-xsuaa' });
passport.use(new JWTStrategy(services.uaa));

this.app.use(passport.initialize());
this.app.use(passport.authenticate('JWT', { session: false }));
```

## Next Steps