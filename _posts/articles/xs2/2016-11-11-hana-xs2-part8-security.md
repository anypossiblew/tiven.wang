---
layout: post
title: HANA XS2 On-Premise part 8 - Authorization Concept of an XS Advanced Application
excerpt: "HANA XS2 On-Premise part 8 - Authorization Concept for Users of an XS Advanced Application, XS User Account and Authentication (XSUAA) service"
modified: 2016-11-10T17:00:00-00:00
categories: articles
tags: [XS2, Security, Authorization, HANA]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
references:
  - title: "SAP Help - Setting Up Security Artifacts"
    url: "http://help.sap.com/saphelp_hanaplatform/helpdata/en/df/31a08a2c164520bb7e558103dd5adf/content.htm"
  - title: "SAP Help - Building Roles for SAP HANA XS Advanced Model Applications"
    url: "http://help.sap.com/saphelp_hanaplatform/helpdata/en/f1/2a65728bfd4565acd5d7f697c100e8/content.htm"
---

* TOC
{:toc}

The application needs to authenticate against the User Account and Authorization service. The authentication concept XS advanced uses is OAuth 2.0.

> The project codes for this article can be downloaded from [Github][github-project].

## Prepare

In this context, the UAA acts as OAuth 2.0 authorization server. The application router itself is the OAuth 2.0 client. To integrate the application into XS advanced authentication, you must create a service instance of the xsuaa service and bind it to the application router and the application containers. From the OAuth 2.0 perspective, the containers (for example the node.js container) are OAuth 2.0 resource servers. Their container security API validates the access tokens against the UAA.

### List in Marketplace

Get available offerings in the marketplace

`xs marketplace`

Output:

```
Getting services from marketplace...

service      plans                                   description
---------------------------------------------------------------------------------------------------------
fs-storage   free                                    xs file service provides an env variable which denotes the root of the clients application file system.
xsuaa        default, devuser, space                 XS UAA Service Broker for authentication & authorization services
hana         hdi-shared, sbss, schema, securestore   SAP HANA database
auditlog     free                                    Audit log broker on the XSA Platform
```

### Create Service

Create a servive for xs2 user account and authentication:

`xs create-service xsuaa space node-uaa -c xs-security.json`

The file xs-security.json:

```json
{
  "xsappname"     : "xs2-node-hw",
  "scopes"        : [
    {
      "name"                 : "$XSAPPNAME.Display",
      "description"         : "display"
    },
    {
      "name"                 : "$XSAPPNAME.Edit",
      "description"          : "edit"
    },
    {
      "name"                 : "$XSAPPNAME.Delete",
      "description"          : "delete"
    }
  ],
  "attributes"    : [
    {
      "name"                 : "Country",
      "description"          : "Country",
      "valueType"            : "s"
    },
    {
      "name"                 : "CostCenter",
      "description"          : "CostCenter",
      "valueType"            : "s"

    }
  ],
  "role-templates": [
    {
      "name"                 : "Viewer",
      "description"          : "View all books",
      "scope-references"     : [
        "$XSAPPNAME.Display"
      ],
      "attribute-references" : [
        "Country"
      ]
    },
    {
      "name"                 : "Editor",
      "description"          : "Edit and Delete the books",
      "scope-references"     : [
        "$XSAPPNAME.Edit",
        "$XSAPPNAME.Delete"
      ],
      "attribute-references" : [
        "Country",
        "CostCenter"
      ]
    }
  ]
}
```

The details of xs-security.json refer: [Create the Security Descriptor for Your XS Advanced Application][create-xs-security-json]

Check created servicves

`xs services`

you will get two services:

```
Getting services in org "tiven" / space "dev" as <user>...
Found services:

name                 service   plan         bound apps
-------------------------------------------------------------------------------
node-hdi-container   hana      hdi-shared   xs2-node-hw-db, xs2-node-hw-backend
node-uaa             xsuaa     space
```

## Application Code

Now add the security into the application.

### Client UI App

#### Manifest

Add the uaa service that just be created in the manifest file.
In order to enable your client UI to pass this authentication on to the backend node.js application, you need to ensure that the destination to your backend node.js application part is configured such that the access token is actually sent to the backend node.js part using `"forwardAuthToken": true`.

```yaml
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
        }
      ]
  services:
    - node-uaa
```

#### XS App Configuration

Change the attribute **_authenticationMethod_** into **_route_** or remove it; Add the logout endpoint that be used to logout by user

```json
{
  "welcomeFile": "index.html",
  "logout": {
    "logoutEndpoint": "/do/logout"
  },
  "routes": [
    {
      "source": "/sap/ui5/1(.*)",
      "target": "$1",
      "localDir": "sapui5"
    },
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

### Backend Service App

#### Manifest

Add the uaa servive into backend application **_xs2-node-hw-backend_**

```yaml
- name: xs2-node-hw-backend
  port: 3002
  path: js
  memory: 128M
  services:
    - node-hdi-container
    - node-uaa
```

#### Node.js Code

Use express and passport, you can easily plug a ready-made authentication strategy. In order to setup JWT authentication strategy, the default UAA credentials can be overriden by defining a user defined service called 'uaa'.

```javascript
var passport = require('passport');
var JWTStrategy = require('sap-xssec').JWTStrategy;
var xsenv = require('sap-xsenv');

var app = express();

/**
 * Setup JWT authentication strategy
 * The default UAA credentials can be overriden
 * by defining a user defined service called 'uaa'.
 */
passport.use(new JWTStrategy(xsenv.getServices({uaa:{tag:'xsuaa'}}).uaa));

//use passport for authentication
app.use(passport.initialize());

app.use('/',
  passport.authenticate('JWT', { session: false }),
  hdbext.middleware(),
  userinfo, testdata, addressbook);
```

> In order to use them, you must install the node.js dependencies `passport` `sap-xssec` `sap-xsenv`

## Test Locally

If you want to test the applications in local, you need to add the additional default configurations

### Get UAA Service Information

After pushed the project to XS2 server, you can get the xs uaa service's information from retrieving the application's environment variables

```
$ xs env xs2-node-hw

Getting env variables for app "xs2-node-hw"...
OK

System-Provided:
{
  "VCAP_APPLICATION" : {
    "start" : "2016-11-16 05:38:25 +0000",
    "application_id" : "cfb75586-cec5-4a6e-9efa-930849cf359a",
    "instance_id" : "cfb75586-cec5-4a6e-9efa-930849cf359a",
    "space_id" : "7d02345a-e038-4241-b6b3-29d93399b1e5",
    "application_name" : "xs2-node-hw",
    "organization_name" : "tiven",
    "space_name" : "dev",
    "started_at_timestamp" : "1479274705215",
    "started_at" : "2016-11-16 05:38:25 +0000",
    "state_timestamp" : "1479274463606",
    "full_application_uris" : [ "http://localhost:3004" ],
    "application_uris" : [ "localhost:3004" ],
    "uris" : [ "localhost:3004" ],
    "version" : "63b3be4d-fff3-4101-ab42-0225196a6006",
    "application_version" : "63b3be4d-fff3-4101-ab42-0225196a6006"
  },
  "VCAP_SERVICES" : {
    "xsuaa" : [ {
      "name" : "node-uaa",
      "label" : "xsuaa",
      "tags" : [ "xsuaa" ],
      "plan" : "space",
      "credentials" : {
        "clientid" : "sb-xs2-node-hw!i3",
        "verificationkey" : "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA57l29L
/tqf4yeaJX2Ew10Vk/iODY29sy4OnPQkDnVVtz5vTWSEsr0MykratKgkdcSfeXQMS7JVHbwrhGq9bMNre8TrSue9rcwriEuSG9Yut80Vw
wAfVjZn9lRI1O2tVeSx5onMLO5gKWWLFRJsw+uXHng78klneBx+GYEL7Z4LuePgMEuiNf42xXOwhBHpP+PnoDoXSjKHVM9WDlC3erKhog
0g72iIS215tMGohf//xG0LKibRiqSki51oQnaD625GPWkxMxltQ9cOo/FQygaDrcUWoQSYhI5S4/codgd2D4axaFKvLZW7XH+DU7aiiuc
7Y+Ly6Bv0cXXkrOnbILmQIDAQAB-----END PUBLIC KEY-----",
        "xsappname" : "xs2-node-hw!i3",
        "identityzone" : "uaa",
        "clientsecret" : "W+mTDSpq6fVODRo+kPO3lc9a9tOZUvEFw5jT0ntkCynKNDZI+XJZ2tz9lWkDnc8geSUB1Fxxuu/H\nr
niOlpSuIw==",
        "url" : "http://localhost:8080/uaa-security"
      }
    } ]
  }
}


User-Provided:
  destinations:
    [
      {
        "name":"backend",
        "url":"http://localhost:3002",
        "forwardAuthToken": true
      }
    ]

Staging environment:
  MEMORY_LIMIT: 100m

No execution environment variables have been set
```

### Default Services

In order to test the applications in local, you need add the uaa client information into the file default-servives.json in both of **_web_** and **_js_**

```json
{
    "uaa": {
        "url"             : "http://localhost:8080/uaa-security",
        "clientid"        : "sb-xs2-node-hw!i3",
        "clientsecret"    : "W+mTDSpq6fVODRo+kPO3lc9a9tOZUvEFw5jT0ntkCynKNDZI+XJZ2tz9lWkDnc8geSUB1Fxxuu/H\nrniOlpSuIw==",
        "xsappname"       : "xs2-node-hw!i3",
        "identityzone"    : "uaa",
        "verificationkey" : "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA57l29L/tqf4yeaJX2Ew10Vk/iODY29sy4OnPQkDnVVtz5vTWSEsr0MykratKgkdcSfeXQMS7JVHbwrhGq9bMNre8TrSue9rcwriEuSG9Yut80VwwAfVjZn9lRI1O2tVeSx5onMLO5gKWWLFRJsw+uXHng78klneBx+GYEL7Z4LuePgMEuiNf42xXOwhBHpP+PnoDoXSjKHVM9WDlC3erKhog0g72iIS215tMGohf//xG0LKibRiqSki51oQnaD625GPWkxMxltQ9cOo/FQygaDrcUWoQSYhI5S4/codgd2D4axaFKvLZW7XH+DU7aiiuc7Y+Ly6Bv0cXXkrOnbILmQIDAQAB-----END PUBLIC KEY-----"
    },
...
}
```

Ensure the access token can be sent to backend application from client ui application, you need to set `"forwardAuthToken": true` in file **_default-env.json_** in application **_web_**

```json
{
  "PORT": 3003,
  "destinations": [
    {
      "name": "backend",
      "url": "http://localhost:3001",
      "forwardAuthToken": true
    }
  ]
}
```

### Test Client UI

Test the client ui page using

*http://localhost:3003/*

you will be forwarded to login page, once login, you can find the login user's information in the tab '**USER INFO**'.

## Authorization of Role

### Authorization Scopes

We have created three scopes when creating uaa servive, so we can check the authorization of security scope in the backend application's logic.

Add the scope check in the deleting books function, the variable`securityContext` is inputted from the request's variable `authInfo`

```javascript
function deleteAllBooks(entities, cb) {
  if (!securityContext.checkLocalScope('Delete')) {
      return cb(new Error('Insufficient permissions. You do not have the required Delete scope. '
          +'Create a role based on the Editor role template and assign the role to a group which contains your user!'));
  }
  conn.$discardAll(entities, cb);
}
```

### Add Scope in Routes

Scopes in route are related to the permissions a user needs to access a resource. This property holds the required scopes to access the target path.

Add the scope `$XSAPPNAME.Delete` into the route

```json
{
  "source": "/rest/addressbook/testdataDestructor",
  "destination": "backend",
  "scope": "$XSAPPNAME.Delete"
}
```

### Application Role

In order to delete the address books, user must have the authorization of security scope.
Maintain application roles and role collections which can be used in user management in the XS advanced model administration tools.

#### Create Application Role

In the [**_XS Advanced Administration tools_**][xsa-admin-tools], open the **_Application Role Builder_** and create a role that named 'admin' and set role template as **_Editor_** in the uaa service's application **_xs2-node-hw!i3_**.

![Create Application Role](/images/hana/xs2/create-application-role.png)

> To maintain application role, user need the role collection `XS_AUTHORIZATION_ADMIN`

#### Create Role Collection

Create a role collection named **_RC\_AddressBook_**, then add the role who has the 'Editor' template in uaa application into it

![Create Role Collection](/images/hana/xs2/create-role-collection.png)

#### Add Role Collection to User

Add the role collection to user who need have the authorization of the scope

![Create Role Collection](/images/hana/xs2/add-role-collection-to-user.png)

> To manage users, user need the role collection `XS_USER_ADMIN`

### Test the Authorization

Now you can delete all of the address books from client ui.

## Next


[github-project]:https://github.com/anypossiblew/hana-xs2-samples/tree/security
[create-xs-security-json]:http://help.sap.com/saphelp_hanaplatform/helpdata/en/df/31a08a2c164520bb7e558103dd5adf/content.htm
[xsa-admin-tools]:/articles/hana-xs2-extra1-xsa-components/
