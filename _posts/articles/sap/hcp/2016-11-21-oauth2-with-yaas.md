---
layout: post
title: OAuth2 with YaaS
excerpt: "OAuth 2 is an authorization framework that enables applications to obtain limited access to user accounts on an HTTP service, such as Facebook, GitHub, and YaaS. YaaS is a microservices ecosystem helping businesses to rapidly augment and build new, highly flexible solutions. In this article I will show you how to create OAuth2 client and how to use OAuth2 services in YaaS Platform"
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [OAuth2, YaaS, Cloud, Angular]
image:
  feature: /images/cloud/masthead-incubators.jpg
comments: true
share: true
references:
  - title: "DigitalOcean - An Introduction to OAuth 2"
    url: "https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2"
  - title: "IETF - The OAuth 2.0 Authorization Framework"
    url: "https://tools.ietf.org/html/rfc6749"
---

* TOC
{:toc}

> The project code of the OAuth2 client for YaaS can be downloaded from [Github][github-oauth2-client]

> The live demo: [OAuth2 with YaaS][OAuth2-with-YaaS]

## OAuth 2

OAuth 2 is an authorization framework that enables applications to obtain limited access to user accounts on an HTTP service, such as Facebook, GitHub, and YaaS. It works by delegating user authentication to the service that hosts the user account, and authorizing third-party applications to access the user account. OAuth 2 provides authorization flows for web and desktop applications, and mobile devices.

OAuth defines four roles:

* Resource Owner
* Client
* Resource Server
* Authorization Server

The resource owner is the user who authorizes an application to access their account. The application's access to the user's account is limited to the "scope" of the authorization granted (e.g. read or write access).

The resource server hosts the protected user accounts, and the authorization server verifies the identity of the user then issues access tokens to the application.

From an application developer's point of view, a service's API fulfills both the resource and authorization server roles. We will refer to both of these roles combined, as the Service or API role.

The client is the application that wants to access the user's account. Before it may do so, it must be authorized by the user, and the authorization must be validated by the API.


     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+

### Obtaining Authorization

* Authorization Code Grant
* Implicit Grant
* Resource Owner Password Credentials Grant
* Client Credentials Grant

## OAuth2 in YaaS

### Implicit Grant
The implicit grant type is used to obtain access tokens (it does not support the issuance of refresh tokens) and is optimized for public clients known to operate a particular redirection URI.  These clients are typically implemented in a browser using a scripting language such as JavaScript.

```
  +----------+
  | Resource |
  |  Owner   |
  |          |
  +----------+
      ^
      |
     (B)
  +----|-----+          Client Identifier     +---------------+
  |         -+----(A)-- & Redirection URI --->|               |
  |  User-   |                                | Authorization |
  |  Agent  -|----(B)-- User authenticates -->|     Server    |
  |          |                                |               |
  |          |<---(C)--- Redirection URI ----<|               |
  |          |          with Access Token     +---------------+
  |          |            in Fragment
  |          |                                +---------------+
  |          |----(D)--- Redirection URI ---->|   Web-Hosted  |
  |          |          without Fragment      |     Client    |
  |          |                                |    Resource   |
  |     (F)  |<---(E)------- Script ---------<|               |
  |          |                                +---------------+
  +-|--------+
   |    |
  (A)  (G) Access Token
   |    |
   ^    v
  +---------+
  |         |
  |  Client |
  |         |
  +---------+
```

#### Step 1: Add Login Button

Add the *login with YaaS* button in the implicit grant page **_app/login/implicit-grant.html_**

```html
<a href="https://api.beta.yaas.io/hybris/oauth2/v1/authorize?response_type=token&client_id=7bTHGrDS9DmuPXPAYbWHOIpV9IzugeUr&redirect_uri=https%3A%2F%2Fyaas-oauth2-client-nonreproducible-coddler.cfapps.us10.hana.ondemand.com%2F%23%2Fimplicit-grant%2Fcallback">
  <button>Login with YaaS</button>
</a>
```

User can access the page using uri *\<host\>/#/login*

##### Authorization Request

* response_type <br>
    _REQUIRED_.  Value MUST be set to "token".
* client_id <br>
    _REQUIRED_.  The client identifier as described in [Section 2.2][ietf-oauth2-section2.2].
* redirect_uri <br>
    _OPTIONAL_. After completing its interaction with the resource owner, the authorization server directs the resource owner's user-agent back to the client.  The authorization server redirects the user-agent to the
   client's redirection endpoint previously established with the authorization server during the client registration process or when making the authorization request.
* scope <br>
    _OPTIONAL_. The authorization and token endpoints allow the client to specify the scope of the access request using the "scope" request parameter.  In turn, the authorization server uses the "scope" response parameter to inform the client of the scope of the access token issued.
* state <br>
    _RECOMMENDED_. An opaque value used by the client to maintain state between the request and callback.  The authorization server includes this value when redirecting the user-agent back to the client.  The parameter SHOULD be used for preventing cross-site request forgery as described in [Section 10.12][ietf-oauth2-section10.12].

#### Step 2: OAuth Callback URI

Add the callback uri `https://yaas-oauth2-client-nonreproducible-coddler.cfapps.us10.hana.ondemand.com/#/implicit-grant/callback` into the redirect URIs of the client in YaaS.

Define an controller and uri to receive the callback from authorization of YaaS. The callback uri from authorization server of YaaS will be
 `https://yaas-oauth2-client-nonreproducible-coddler.cfapps.us10.hana.ondemand.com/#/implicit-grant/callback#token_type=Bearer&access_token=022-62d66b3e-0d8c-4ae2-9ae6-0ef7b55c1e96&expires_in=3600&scope=hybris.tenant=testdigaccount`

```javascript
module.exports = ['$scope', '$location', function($scope, $location) {
  var oauth2Response =  $location.hash();
  var oauth2Params = oauth2Response.split('&');
  var auths = {};
  oauth2Params.forEach(function(e, i) {
    var params = e.split('=');
    auths[params[0]] = params.splice(1).join('=');
  })
  $scope.auths = auths;
 }];
```

The output in callback page will be

```json
{
  "token_type": "Bearer",
  "access_token": "022-62d66b3e-0d8c-4ae2-9ae6-0ef7b55c1e96",
  "expires_in": "3600",
  "scope": "hybris.tenant=testdigaccount"
}
```

Then you can use the `access_token` to access the resource in YaaS service from your web app client.

### Resource Owner Password Credentials Grant

If the client application is trusted by the user (e.g. it is owned by the service, or the user's desktop OS), this grant type can be enabled on the authorization server.

The authorization request is
`https://api.beta.yaas.io/hybris/oauth2/v1/token?grant_type=password&client_id=CLIENT_ID&username=USERNAME&password=PASSWORD`

The JavaScript implementation for the 'Resource Owner Password Credentials Grant' like:

```javascript
var YaaSOAuth2 = $resource('https://api.beta.yaas.io/hybris/oauth2/v1/token',
                    {},
                    {
                      authorize: {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        transformRequest : function(obj){
                          var str = [];
                          for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                          return str.join("&");
                        }
                      }
                    }
                  );

var credentials = {
  "grant_type":'password',
  "client_id": '7bTHGrDS9DmuPXPAYbWHOIpV9IzugeUr'
};

/**
 * Submit the authorization request when user click "submit" button
 */
$scope.submit = function(user) {
  credentials.username = user.name;
  credentials.password = user.password;
  $scope.credentials = credentials;
  YaaSOAuth2.authorize(credentials, function(response) {
    $scope.response = response;
  }, function(error) {
    $scope.response = error;
  });
};
```

The Access Token Response

```json
{
  "token_type": "Bearer",
  "access_token": "022-f447e930-3bad-4da0-8629-a95f8618a32b",
  "expires_in": 3600,
  "scope": "hybris.tenant=testdigaccount"
}
```

### Client Credentials Grant
The client credentials grant type provides an application a way to access its own service account.

The authorization request is
`https://api.beta.yaas.io/hybris/oauth2/v1/token?grant_type=client_credentials&client_id=CLIENT_ID&client_secret=CLIENT_SECRET`

The JavaScript implementation for the 'Client Credentials Grant' like

```javascript
...
var credentials = {
  "grant_type":'client_credentials',
  "client_id": '7bTHGrDS9DmuPXPAYbWHOIpV9IzugeUr',
  "client_secret": 'H2LYBpaNVDwk9E5A'
};
YaaSOAuth2.authorize(credentials, function(response) {
  $scope.credentials = credentials;
  $scope.response = response;
});
```

The Access Token Response

```json
{
  "token_type": "Bearer",
  "access_token": "022-6fabea3c-10a6-486a-888a-beaa61b380e7",
  "expires_in": 3600,
  "scope": "hybris.tenant=testdigaccount"
}
```

## Next Steps


[yaas]:https://www.yaas.io/
[yaas-market]:https://market.yaas.io/beta
[hcp]:https://account.hanatrial.ondemand.com/cockpit
[microservices]:http://microservices.io/
[expressjs]:http://expressjs.com/
[express-routing]:http://expressjs.com/en/starter/basic-routing.html
[hcp-cf-cockpit]:https://hcp-cockpit.cfapps.us10.hana.ondemand.com/cockpit
[yaas-security]:https://devportal.yaas.io/overview/security/index.html
[yaas-oauth2]:https://devportal.yaas.io/services/oauth2/latest/index.html
[OAuth2]:https://oauth.net/2/
[restangular]:https://github.com/mgonto/restangular
[OAuth2-with-YaaS]:http://labs.tiven.wang/angular2/oauth2/

[github-oauth2-client]:https://github.com/anypossiblew/hcp-cf-digital-account/tree/master/yaas-oauth2-client
[ietf-oauth2-section10.12]:https://tools.ietf.org/html/rfc6749#section-10.12
[ietf-oauth2-section2.2]:https://tools.ietf.org/html/rfc6749#section-2.2
