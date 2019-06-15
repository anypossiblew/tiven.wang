---
layout: post
theme: UbuntuMono
series:
  url: try-cloudfoundry
  title: Try Cloud Foundry
title: UAA OAuth2
excerpt: "This article explains how to use Cloud Foundry APIs from a user application using the built in identity management solution in the User Account and Authentication Service (UAA). The UAA acts (amongst other things) as an OAuth 2.0 Authorization Server, granting access tokens to Client applications for them to use when accessing Resource Servers in the platform, such as the Cloud Controller. This article describes the responsibilities of a Client application and the mechanics of setting one up."
modified: 2017-06-02T17:00:00-00:00
categories: articles
tags: [OAuth2, Cloud Foundry, Pivotal]
image:
  vendor: twitter
  feature: /media/DLOz8nIW4AAK54A.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "Cloud Foundry - The User Account and Authentication Service (UAA)"
    url: "https://docs.cloudfoundry.org/api/uaa/index.html"
  - title: "spring.io/guides/tutorials - Spring Boot and OAuth2"
    url: "https://spring.io/guides/tutorials/spring-boot-oauth2/"
  - title: "Spring REST API + OAuth2 + AngularJS"
    url: "http://www.baeldung.com/rest-api-spring-oauth2-angularjs"
  - title: "Securing RESTful Web Services with OAuth2"
    url: "https://www.cloudfoundry.org/oauth-rest/"
  - title: "How to Integrate an Application with Cloud Foundry using OAuth2"
    url: "https://www.cloudfoundry.org/how-to-integrate-an-application-with-cloud-foundry-using-oauth2-2/"    
---

[Try CloudFoundry Series](/series/try-cloudfoundry/)

* TOC
{:toc}

## Setup UAA service

Setup the UAA service on [CloudFoundry platform](https://run.pivotal.io/) by following the previous article [Try Cloud Foundry 3 - Components UAA](/articles/try-cf-3-cloud-foundry-components-uaa/)

## Single Sign On With UAA

You can download the complete project source code from [Github][github-project]

```
git clone https://github.com/anypossiblew/try-cloud-foundry.git
cd try-cloud-foundry
git checkout 5-uaa-oauth2
```

### Creating a New Project

`mkdir try-cf-app && cd try-cf-app`

`curl https://start.spring.io/starter.tgz -d style=web -d name=try-cf-app | tar -xzvf -`

or use the [Spring Initializr](https://start.spring.io/) to bootstrap your application.

Run spring boot application with:

`./mvnw spring-boot:run`

When the info display, the embedded tomcat server is started:

```
2017-06-01 10:17:48.028  INFO 11592 --- [           main] s.b.c.e.t.TomcatEmbeddedServletContainer : Tomcat started on port(s): 8080 (http)
2017-06-01 10:17:48.433  INFO 11592 --- [           main] wang.tiven.trycfapp.tryCfAppApplication  : Started tryCfAppApplication in 7.802 seconds (JVM running for 12.929)
```

### Add a Home Page
In your new project create an index.html in the "src/main/resources/static" folder.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Try CF App</title>
  <meta name="description" content=""/>
  <meta name="viewport" content="width=device-width"/>
  <base href="/"/>
  <link rel="stylesheet" type="text/css" href="/webjars/bootstrap/css/bootstrap.min.css"/>
  <script type="text/javascript" src="/webjars/jquery/jquery.min.js"></script>
  <script type="text/javascript" src="/webjars/bootstrap/js/bootstrap.min.js"></script>
</head>
<body>
  <h1>Try CF App</h1>
  <div class="container"></div>
</body>
</html>
```

adding some dependencies in 'pom.xml':

```xml
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>angularjs</artifactId>
  <version>1.4.3</version>
</dependency>
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>jquery</artifactId>
  <version>2.1.1</version>
</dependency>
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>bootstrap</artifactId>
  <version>3.2.0</version>
</dependency>
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>webjars-locator</artifactId>
</dependency>
```

### Securing the Application

add Spring Security as a dependency

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.security.oauth</groupId>
  <artifactId>spring-security-oauth2</artifactId>
</dependency>
```

To make the link to Facebook we need an @EnableOAuth2Sso annotation on our main class:

```java
@SpringBootApplication
@EnableOAuth2Sso
public class tryCfAppApplication {

  public static void main(String[] args) {
		SpringApplication.run(tryCfAppApplication.class, args);
	}

}
```

and some configuration (converting application.properties to YAML for better readability):

```yaml
security:
  oauth2:
    client:
      clientId: app
      clientSecret: appclientsecret
      accessTokenUri: https://try-cf-uaa.cfapps.io/oauth/token
      userAuthorizationUri: https://try-cf-uaa.cfapps.io/oauth/authorize
      tokenName: access_token
      authenticationScheme: query
      clientAuthenticationScheme: form
    resource:
      userInfoUri: https://try-cf-uaa.cfapps.io/userinfo
```

The configuration refers to a client app registered with your initial configurations in your UAA service, in which you have to supply a registered redirect (home page) for the app. This one is registered to "localhost:8080" so it only works in an app running on that address.

With that change you can run the app again and visit the home page at http://localhost:8080. Instead of the home page you should be redirected to login with Facebook. If you do that, and accept any authorizations you are asked to make, you will be redirected back to the local app and the home page will be visible. If you stay logged into UAA, you won’t have to re-authenticate with this local app, even if you open it in a fresh browser with no cookies and no cached data. (That’s what Single Sign On means.)

Now you can restart your local server, and open the http://localhost:8080/index.html, you will be redirected to the authorization uri of the UAA service. Input your user authentication information and click the sign in button, and you will be redirected to authorization page if you are the first login, click allow button to be redirected to your localhost login page or deny button to reject.

```
https://try-cf-uaa.cfapps.io/oauth/authorize?grant_type=authorization_code&client_id=app&client_secret=appclientsecret&redirect_uri=http://localhost:8080/index.html

https://try-cf-uaa.cfapps.io/login

Application Authorization

select the requested permission

and click the **AUTHORIZE** button:

http://localhost:8080/login?code=SVYvp1nSbd&state=NunIm4
```

### Add User Info

Add the annotation **@RestController** on the application class to enable the restful api, the controller needs an endpoint at "/user" that describes the currently authenticated user. That’s quite easy to do, e.g. in our main class:

```java
@SpringBootApplication
@EnableOAuth2Sso
@RestController
public class tryCfAppApplication {

  ...

  @RequestMapping("/user")
  public Principal user(Principal principal) {
    return principal;
  }

}
```

Restart server and access *http://localhost:8080/user* and login if you haven't, you will get the user authentication details:

```json
{
  "authorities": [
    {
    "authority": "ROLE_USER"
    }
  ],
  "details": {
    "remoteAddress": "0:0:0:0:0:0:0:1",
    "sessionId": "5E5D2F3797CCEE8E6B10AF13C478BC9A",
    ...
  },
  "authenticated": true,
  "userAuthentication": {
    "authorities": [
      {
      "authority": "ROLE_USER"
      }
    ],
    "details": {
      "user_id": "0da8195f-3027-406d-a899-1c742b2eba9e",
      "sub": "0da8195f-3027-406d-a899-1c742b2eba9e",
      "user_name": "marissa",
      ...
    },
    "authenticated": true,
    "principal": "0da8195f-3027-406d-a899-1c742b2eba9e",
    "credentials": "N/A",
    "name": "0da8195f-3027-406d-a899-1c742b2eba9e"
  },
  "principal": "0da8195f-3027-406d-a899-1c742b2eba9e",
  "clientOnly": false,
  "credentials": "",
  "oauth2Request": {
    "clientId": "app",
    "scope": [ ],
    ...
  },
  "name": "0da8195f-3027-406d-a899-1c742b2eba9e"
}
```

#### Add User in Welcome page

To render some content conditional on whether the user is authenticated or not we could use server side rendering (e.g. with Freemarker or Tymeleaf), or we can just ask the browser to to it, using some JavaScript. To do that we are going to use [AngularJS](https://angularjs.org/), but if you prefer to use a different framework, it shouldn’t be very hard to translate the client code.

```html
<script type="text/javascript" src="/webjars/angularjs/angular.min.js"></script>

<script type="text/javascript">
angular.module("app", []).controller("home", function($http) {
  var self = this;
  $http.get("/user").success(function(data) {
    self.user = data.userAuthentication.details.name;
    self.authenticated = true;
  }).error(function() {
    self.user = "N/A";
    self.authenticated = false;
  });
});
</script>

...

<body ng-app="app" ng-controller="home as home">
  <h1>Try CF App</h1>
  <div class="container" ng-show="home.authenticated">
    Logged in as: <span ng-bind="home.user"></span>
  </div>
</body>
```

Now you get the user info in the index page like this:

```
Try CF App
  Logged in as: Marissa Bloggs
```

### Add Spring Security Configurations

We can't access the welcome page as anonymous yet, the application let us login whenever. So we need add Spring Security configurations to enable anonymous access.

```java
@SpringBootApplication
@EnableOAuth2Sso
@RestController
public class tryCfAppApplication extends WebSecurityConfigurerAdapter {

  ...

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .antMatcher("/**")
      .authorizeRequests()
        .antMatchers("/", "/login**", "/webjars/**")
        .permitAll()
      .anyRequest()
        .authenticated();
  }

}
```

Add the login and logout section in welcome page:

```html

<script type="text/javascript">
angular.module("app", []).controller("home", function($http) {
  var self = this;
  ...
  self.logout = function() {
    $http.post('/logout', {}).success(function() {
      self.authenticated = false;
      $location.path("/");
    }).error(function(data) {
      console.log("Logout failed")
      self.authenticated = false;
    });
  };
});
</script>
...
<body ng-app="app" ng-controller="home as home">
  <h1>Try CF App</h1>
  <div class="container" ng-show="!home.authenticated">
    Login with: <a href="/login">try-cf-uaa@CloudFoundry</a>
  </div>
  <div class="container" ng-show="home.authenticated">
    Logged in as: <span ng-bind="home.user"></span>
    <div>
      <button ng-click="home.logout()" class="btn btn-primary">Logout</button>
    </div>
  </div>
</body>
```

#### Adding a Logout Endpoint

Spring Security has built in support for a `/logout` endpoint which will do the right thing for us (clear the session and invalidate the cookie). To configure the endpoint we simply extend the existing `configure()` method in our `WebSecurityConfigurer`:

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
  http.antMatcher("/**")
    ... // existing code here
    .and().logout().logoutSuccessUrl("/").permitAll();
}
```


The `/logout` endpoint requires us to POST to it, and to protect the user from Cross Site Request Forgery (CSRF, pronounced "sea surf"), it requires a token to be included in the request. The value of the token is linked to the current session, which is what provides the protection, so we need a way to get that data into our JavaScript app.

AngularJS also has built in support for CSRF (they call it XSRF), but it is implemented in a slightly different way than the out-of-the box behaviour of Spring Security. What Angular would like is for the server to send it a cookie called "XSRF-TOKEN" and if it sees that, it will send the value back as a header named "X-XSRF-TOKEN". To teach Spring Security about this we need to add a filter that creates the cookie and also we need to tell the existing CRSF filter about the header name. In the `WebSecurityConfigurer`:

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
  http.antMatcher("/**")
    ... // existing code here
    .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
}
```

With those changes in place we are ready to run the app and try out the new logout button. Start the app and load the home page in a new browser window. Click on the "login" link to take you to Facebook (if you are already logged in there you might not notice the redirect). Click on the "Logout" button to cancel the current session and return the app to the unauthenticated state. If you are curious you should be able to see the new cookies and headers in the requests that the browser exchanges with the local server.

Remember that now the logout endpoint is working with the browser client, then all other HTTP requests (POST, PUT, DELETE, etc.) will also work just as well. So this should be a good platform for an application with some more realistic features.



[SCIM]:http://www.simplecloud.info/
[github-project]:https://github.com/anypossiblew/try-cloud-foundry
