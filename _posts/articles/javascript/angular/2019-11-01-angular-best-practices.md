---
layout: post
theme: XiXiuTi
series: 
  url: angular
  title: Angular
title: Tips & Best Practices to Organize your Angular Project
excerpt: "the best practices for writing clean and usable Angular apps."
modified: 2019-11-01T18:00:00-00:00
categories: articles
tags: [Best Practices, Angular]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1572.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/abu-dhabi-united-arab-emirates-1572
comments: true
share: true
references:
  - id: 1
    title: "Angular University - Angular Architecture - Smart Components vs Presentational Components"
    url: "https://blog.angular-university.io/angular-2-smart-components-vs-presentation-components-whats-the-difference-when-to-use-each-and-why/"
  - id: 2
    title: "Medium - 5 Tips & Best Practices to Organize your Angular Project"
    url: "https://medium.com/dev-jam/5-tips-best-practices-to-organize-your-angular-project-e900db08702e"
  - id: 3
    title: "Medium - Best Practices for Writing Angular 6 Apps"
    url: "https://blog.usejournal.com/best-practices-for-writing-angular-6-apps-e6d3c0f6c7c1"
---

* TOC
{:toc}

## 1. Use of Angular CLI

不管怎么说, 用就行了 [`@angular/cli`](https://cli.angular.io/)

`npm install -g @angular/cli`

## 2. In modular fashion using core, shared and feature modules

**Core module** should be created of components (i.e. header, main navigation, footer) that will be used across the entire app.

**Shared module** can have components, directives and pipes that will be shared across multiple modules and components, but not the entire app necessarily.

Last but not least are **feature modules**. Per Angular’s official documentation, feature module is:

> an organizational best practice, as opposed to a concept of the core Angular API. A feature module delivers a cohesive set of functionality focused on a specific application need such as a user workflow, routing, or forms. While you can do everything within the root module, feature modules help you partition the app into focused areas. A feature module collaborates with the root module and with other modules through the services it provides and the components, directives, and pipes that it shares.

### Shared Module

**In short**, when using a Shared Module:

* **DO** `declare` components, pipes, directives, and `export` them.
* **DO** import `FormsModule`, `ReactiveFormsModule` and other (3rd-party) modules you need.
* **DO** import the `SharedModule` into any other Feature Modules.
* **DO NOT** provide app-wide singleton services in your `SharedModule`. Instead move these to the `CoreModule`.
* **DO NOT** import the `SharedModule` into the `AppModule`.

### Core Module

> A Core Module is an NgModule containing code that will be used to instantiate your app and load some core functionality.

In the Core Module we commonly place our singleton services and modules that will be used across the app but only need to be imported **once**. Examples are an Authentication Service or LocalStorage Service, but also modules like `HttpClientModule` , `StoreModule.forRoot(…)`, `TranslateModule.forRoot(…)` . The `CoreModule` is then imported into the `AppModule` .

**In short**, when using a Core Module:

* **DO** import modules that should be instantiated once in your app.
* **DO** place services in the module, but do not provide them.
* **DO NOT** declare components, pipes, directives.
* **DO NOT** import the CoreModule into any modules other than the AppModule.

### Feature Module

#### Types of Feature Modules

There are five general categories of feature modules which tend to fall into the following groups:

* Domain feature modules.
* Routed feature modules.
* Routing modules.
* Service feature modules.
* Widget feature modules.

## 3. Lazy loading a feature module

使用 Router 对 feature module 做 lazy loading

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
    component: CoreComponent
  }
];
```

## 4. Use of smart vs. dummy components

Most common use case of developing Angular’s components is a separation of smart and dummy components. Think of a dummy component as a component used for presentation purposes only, meaning that the component doesn’t know where the data came from. For that purpose, we can use one or more smart components that will inherit dummy’s component presentation logic.

[参考 1](#reference-1)

### Smart Components vs Presentational Components

开始前或者应用复杂到一定程度后应该思考的问题:

* 组件应该分为哪些类型?
* 组件之间怎么交互?
* 组件和服务之间怎么依赖?
* 怎么使组件可共用?

为了做到组件的可重复实用性, 我们暂时把组件类型分为两种:

* Smart Components: 或者叫 应用级别的组件, 容器组件或者控制器 (controller) 组件;
* Presentation Components: 或者叫 纯(pure)组件或者哑(dumb)组件;

怎么设计:

**continuous refactoring**

## 5. Proper use of dependency injection

## 6. Coding Styles

### 6.1 Aliases for imports

### 6.2 Simplify your imports

use **_index.ts_** file

### 6.3 Shorten your relative paths

After the project has grown a little and we have some nested modules, we can end up with code like this:

```typescript
import { FooPipe } from '../../../../../shared/pipes/foo/foo.pipe';
```

use this instand of

```typescript
import { FooPipe } from '@shared/pipes/foo/foo.pipe';
```

Is this possible? Absolutely! 🙌 We just have to tell our compiler which paths it should map by modifying our `tsconfig.json`

```json
{
...
  "compilerOptions": {
    ...
    "baseUrl": "src",
    "paths": {
      "@env": ["environments/environment"],
      "@shared/*": ["app/shared/*"],
      "@core/*": ["app/core/*"]
    }
  }
}
```

(Don’t forget the `baseUrl` )

### 6.4 Use SCSS Variables

