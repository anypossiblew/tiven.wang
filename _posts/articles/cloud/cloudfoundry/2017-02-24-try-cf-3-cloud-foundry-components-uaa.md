---
layout: post
title: Try Cloud Foundry 3 - Components UAA
excerpt: "Cloud Foundry Components UAA"
modified: 2017-02-24T17:00:00-00:00
categories: articles
tags: [UAA, OAuth2, Cloud Foundry, Pivotal]
image:
  vendor: dronestagr
  feature: /wp-content/uploads/2017/06/DJI_0029-6-1200x800.jpg
  credit: waterlily
  creditlink: http://www.dronestagr.am/author/helios1412/
comments: true
share: true
references:
  - title: "The User Account and Authentication Service (UAA): APIs"
    url: "http://docs.cloudfoundry.org/api/uaa/version/4.6.0/index.html"
  - title: "Cloud Foundry Documentation - Component: User Account and Authentication (UAA) Server"
    url: "https://docs.cloudfoundry.org/concepts/architecture/uaa.html"
  - title: "How Can I Try Out Cloud Foundry?"
    url: "https://www.cloudfoundry.org/how-can-i-try-out-cloud-foundry-2016/"
  - title: "Cloud Foundry Documentation - Creating and Managing Users with the UAA CLI (UAAC)"
    url: "https://docs.cloudfoundry.org/adminguide/uaa-user-management.html"
---

* TOC
{:toc}

See [Try CloudFoundry Series](/series/try-cloudfoundry/)

The CloudFoundry User Account and Authentication ([UAA][UAA]) is a multi tenant identity management service, used in [Cloud Foundry][CloudFoundry], but also available as a stand alone [OAuth2][OAuth2] server. It's primary role is as an OAuth2 provider, issuing tokens for client applications to use when they act on behalf of Cloud Foundry users. It can also authenticate users with their Cloud Foundry credentials, and can act as an [SSO][Single_sign-on] service using those credentials (or others). It has endpoints for managing user accounts and for registering OAuth2 clients, as well as various other management functions.

Please refer to [Introducing the UAA and Security for Cloud Foundry][uaa-intro]

## Quick Start

Clone the UAA sourcecode project to local:

`git clone https://github.com/cloudfoundry/uaa.git`

Build and publish the application:

```shell
$ ./gradlew manifests -Dapp="try-cf-uaa" -Dapp-domain="cfapps.io"
$ cf push -f build/sample-manifests/uaa-cf-application.yml
```

Open the url of your UAA server e.g. *https://try-cf-uaa.cfapps.io/* in browser, then you can login with the pre-created UAA user/password of "**marissa/koala**".

> you can find the pre-created users that are created by `spring_profiles: default` in configuration location:
```yaml
env:
  UAA_CONFIG_YAML: |
    spring_profiles: default,hsqldb
```  
> and the spring configuration file:
> **uaa/src/main/webapp/WEB-INF/spring/scim-endpoints.xml**

### Docker Container for UAA CLI

Build a docker image from Dockerfile:

```
FROM ruby:latest

RUN gem install cf-uaac

CMD [ "uaac" ]
```

Build:

`docker build . -t cf-uaac`

Run the image:

`docker run --rm -it cf-uaac bash`

### Basic Test in Docker Container

Using curl tool to test login information:

`curl -H "Accept: application/json" https://try-cf-uaa.cfapps.io/login`

The `uaac token client get` command authenticates and obtains an *access token* from the server using the **OAuth2** **implicit grant**, similar to the approach intended for a standalone client like the Cloud Foundry Command Line Interface (cf CLI).

`uaac token client get admin -s adminsecret`

UAAC stores the access token in the **~/.uaac.yml** file. Open the ~/.uaac.yml in a text editor and copy this access token to use in the next step.

`cat ~/.uaac.yml`

Run `uaac token decode` to retrieve the token details.

```shell
/# uaac token decode

Note: no key given to validate token signature

  jti: 786c4e7efd5344e6b6949856d0015fdc
  sub: admin
  authorities: clients.read clients.secret clients.write uaa.admin clients.admin scim.write scim.read
  scope: clients.read clients.secret clients.write uaa.admin clients.admin scim.write scim.read
  client_id: admin
  cid: admin
  azp: admin
  grant_type: client_credentials
  rev_sig: 613993bf
  iat: 1495680076
  exp: 1495723276
  iss: http://localhost:8080/uaa/oauth/token
  zid: uaa
  aud: scim clients uaa admin
```

> you can find the pre-created clients that are created by `spring_profiles: default` in configuration location:
```yaml
env:
  UAA_CONFIG_YAML: |
    spring_profiles: default,hsqldb
```  
> and the spring configuration file:
> **uaa/src/main/webapp/WEB-INF/spring/oauth-clients.xml**


## Deploy with Postgresql Database

Generate the sample manifest file:

`./gradlew manifests -Dapp="try-cf-uaa" -Dapp-domain="cfapps.io" -D"spring.profiles.active"="default,postgresql"`

Create a postgresql Database service in CloudFoundry platform manually or use command:

`cf create-service elephantsql turtle my_elephantsql`

> Don't bind the Database to the application in the CloudFoundry platform, because the CloudFoundry platform will set the environment variables as
```json
{
  "uri": "postgres://opfwkjiu:sipOocxnyqJQkUYGRFGvPvwUXsrBYysk@stampy-01.db.elephantsql.com:5432/opfwkjiu",
  "max_conns": "5"
}
```
automatically, but the UAA application should use the protocol format **postgresql://**.


Change the configuration to point to the created database in the manifest:

```
spring_profiles: default,postgresql
database:
  driverClassName: org.postgresql.Driver
  url: jdbc:postgresql://stampy-01.db.elephantsql.com:5432/opfwkjiu
  username: opfwkjiu
  password: sipOocxnyqJQkUYGRFGvPvwUXsrBYysk
  maxactive: 4
  maxidle: 2
  minidle: 1
```

> The **maxactive** should less than the concurrent connections in the plan of your database service.

Then push the application to CloudFoundry platform:

`cf push -f build/sample-manifests/uaa-cf-application.yml`

Now you can visit the URL of the UAA application *https://try-cf-uaa.cfapps.io/* , and login with the user. There is no different with previous web page ui, but the backend data has changed to Postgresql database.

## Run Locally

### Local Docker Container for Protgres

`docker run --rm --name my-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`

### Modify the Required Configuration

Modify the properties in configuration file `src/main/resources/uaa.yml`

```
spring_profiles: postgresql,default

...

database:
  driverClassName: org.postgresql.Driver
  url: jdbc:postgresql://localhost:5432/postgres
  username: postgres
  password: password
  maxactive: 4
  maxidle: 2
  minidle: 1

...

serviceProviderKey: |
...

```

### Run by gradle Cargo

Run local container by gradle task **':cargoRunLocal'**

`./gradlew run`

> When you get the error info **failed to finish deploying within the timeout period**, dont worry about that, you can take look at the log file **./build/reports/tests/uaa-server.log** to view the details.

### Check the Tables in Database

Run the docker container for postgres client with linking to the postgres server that is created before:

`docker run -it --rm --link my-postgres:postgres postgres psql -h postgres -U postgres`

```powershell
postgres=# \dt
                 List of relations
 Schema |          Name          | Type  |  Owner
--------+------------------------+-------+----------
 public | authz_approvals        | table | postgres
 public | expiring_code_store    | table | postgres
 public | external_group_mapping | table | postgres
 public | group_membership       | table | postgres
 public | groups                 | table | postgres
 public | identity_provider      | table | postgres
 public | identity_zone          | table | postgres
 public | oauth_client_details   | table | postgres
 public | oauth_code             | table | postgres
 public | revocable_tokens       | table | postgres
 public | schema_version         | table | postgres
 public | sec_audit              | table | postgres
 public | service_provider       | table | postgres
 public | user_info              | table | postgres
 public | users                  | table | postgres
(15 rows)
```

We can see the users and clients that are pre-config in spring profile **default** are imported in the tables in database:

```powershell
postgres=# select id, username, email, active, authorities, origin from users;
                  id                  |   username   |         email         | active | authorities | origin
--------------------------------------+--------------+-----------------------+--------+-------------+--------
 a6f5caa9-ce13-4472-ad2d-06bf23840456 | testbootuser | testbootuser@test.org | t      | uaa.user    | uaa
 d710f1e0-399c-48cf-b9b5-24d227925907 | marissa      | marissa@test.org      | t      | uaa.user    | uaa
(2 rows)

postgres=# select client_id, resource_ids, identity_zone_id from oauth_client_details;
             client_id             | resource_ids | identity_zone_id
-----------------------------------+--------------+------------------
 app                               | none         | uaa
 cf                                | none         | uaa
 oauth_showcase_password_grant     | none         | uaa
 admin                             | none         | uaa
 login                             | none         | uaa
 oauth_showcase_implicit_grant     | none         | uaa
 oauth_showcase_saml2_bearer       | none         | uaa
 oauth_showcase_client_credentials | none         | uaa
 identity                          | none         | uaa
 oauth_showcase_user_token         | none         | uaa
 dashboard                         | none         | uaa
 notifications                     | none         | uaa
 oauth_showcase_authorization_code | none         | uaa
(13 rows)
```

[Securing RESTful Web Services with OAuth2][oauth-rest]

## Identity Zones


[UAA]:https://github.com/cloudfoundry/uaa
[CloudFoundry]:https://www.cloudfoundry.org/
[OAuth2]:https://tools.ietf.org/html/rfc6749
[Single_sign-on]:https://en.wikipedia.org/wiki/Single_sign-on
[uaa-intro]:https://www.cloudfoundry.org/uaa-intro/
[oauth-rest]:https://www.cloudfoundry.org/oauth-rest/

[github-project]:https://github.com/anypossiblew/try-cloud-foundry
