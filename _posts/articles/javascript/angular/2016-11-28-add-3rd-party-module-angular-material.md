---
layout: post
title: Angular.js Adds 3rd Party Module - Angular Material
excerpt: "Angular.js Adds 3rd Party Module - Angular Material"
modified: 2016-11-28T17:51:25-04:00
categories: articles
tags: [Material Design, Angular]
image:
  feature: /images/angular/mashheader-angular1x.png
comments: true
share: true
references:
  - title: "Angular.js by Google"
    url: "https://angularjs.org/"
---

* TOC
{:toc}

For developers using [AngularJS][angular1], [Angular Material][angular-material] is both a UI Component framework and a reference implementation of [Google's Material Design Specification][google-material]. The [Angular Material][angular-material] project provides a set of reusable, well-tested, and accessible UI components based on Material Design.

> The project codes for this article can be downloaded from [Github][github-project].

## Installation

Install the [*angular-material*][angular-material] module using

`npm install  angular-material --save`

it dependents these two module:

`npm install angular-aria@^1.5.0 --save`

`npm install angular-animate@^1.5.0 --save`

## Application Codes

The `angular.module` is a global place for creating, registering and retrieving Angular modules. All modules (angular core or 3rd party) that should be available to an application must be registered using this mechanism.

A **module** is a collection of *services*, *directives*, *controllers*, *filters*, and *configuration information*. `angular.module` is used to configure the **$injector**.

### Import Module

Import and include [*angular-material*][angular-material] module in your Angular module:

```javascript
require('angular-material');
require('angular-material/angular-material.css');

angular
  .module(app, [... , 'ngMaterial'])
```

### Use Components

Use the components of [*angular-material*][angular-material] like this

```html
<md-nav-bar md-selected-nav-item="currentNavItem" nav-bar-aria-label="navigation links">
  <md-nav-item md-nav-href="#/implicit-grant" name="page-implicit-grant">Implicit Grant</md-nav-item>
  <md-nav-item md-nav-href="#/client-credentials" name="page-client-credentials">Client Credentials</md-nav-item>
  <md-nav-item md-nav-href="#/password-credentials" name="page-password-credentials">Password Credentials</md-nav-item>
</md-nav-bar>
```


[angular1]:https://angularjs.org/
[angular-material]:https://material.angularjs.org/latest/
[google-material]:https://material.google.com/

[angular-directive]:https://docs.angularjs.org/guide/directive
[angular-component]:https://docs.angularjs.org/guide/component
[angular-databinding]:https://docs.angularjs.org/guide/databinding
[angular-services]:https://docs.angularjs.org/guide/services
[angular-di]:https://docs.angularjs.org/guide/di

[github-project]:https://github.com/anypossiblew/hcp-cf-digital-account/tree/angular-material/yaas-angular-app
