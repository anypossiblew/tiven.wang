---
layout: post
theme: 细秀体
title: Angular - Modules
excerpt: ""
modified: 2018-03-19T17:00:00-00:00
categories: articles
tags: [Modules, Angular, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DXs0pPHX4AA0Z_Z.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/971428030597025793
comments: true
share: true
references:
  - id: 1
    title: "Angular guide - NgModules"
    url: "https://angular.io/guide/ngmodules"

---

* TOC
{:toc}

[NgModules][NgModule] 是建立在 ES Modules 概念上的更抽象一层的概念。它是对应用程序功能模块的一种抽象，每个应用程序至少要有一个 [NgModule][NgModule] 作为启动用的。对于不大的应用来说一般只需要有一个 NgModule ，当应用程序不断扩大时，可以把不同特性的功能划分在不同的 NgModules 内，然后建立起相互引用的关系。

例如我们用 [angular-cli][angular-cli] 命令行产生的代码里的 `AppModule` 就是一个 Root NgModule 。然后从他启动应用程序

`platformBrowserDynamic().bootstrapModule(AppModule)`


下面是生成出来的一个最基本的 NgModule
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

`@NgModule.declarations` 声明此 module 里包含的类 => include classes in the package

`@NgModule.imports` 引入其他 module 中的类型进来 => import classes from another package


* JavaScript 语言本身的模块 Module 其实起到的是 Collection 的作用，就像 Java 语言里的 Class File；
* 而 JavaScript 源文件目录层级就像 Java 的 package，用于区分不同包；
* 而 Angular NgModule 才可以表示更抽象层面的模块含义，包含不同功能的类，就像 Java 的 jar 包；


[NgModule]:https://angular.io/api/core/NgModule
[angular-cli]:https://github.com/angular/angular-cli
