---
layout: post
theme: XiXiuTi
series: 
  url: angular
  title: Angular
title: PWA
excerpt: ""
modified: 2019-10-18T18:00:00-00:00
categories: articles
tags: [Angular]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2009.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/darnah-libya-2009
comments: true
share: true
---

* TOC
{:toc}

## PWA

https://alligator.io/angular/angular-pwa/

为 Angular 项目安装 PWA 功能

`ng add @angular/pwa`

编译 `ng build --prod`

安装 http server

`npm install -g http-server`

运行 http server

`http-server -p 8080 -c-1 dist/<project-name>`

打开 *http://localhost:8080/index.html* 在 chrome 浏览器右上角有 + 号，可以点击安装到桌面。

如果把 http server 关掉，重新打开安装的 PWA app 可以看到仍然可以打开， 在 chrome devtool 的 Network 页面可以看到页面很多文件是从 ServiceWorker 里加载的，所以服务器不在线也可以打开。

### 哪些文件被缓存了

由于本地缓存了页面文件，所以在离线状态下 PWA App 也可以重新打开，那么哪些文件被缓存了呐？

在生成的文件 *ngsw.json* 里说明了哪些文件被缓存了， 它是由 *ngsw-config.json* 生成出来的，如果有需要可以修改增删 *ngsw-config.json* 文件里的文件列表。

### 怎么更新文件

修改代码重新 build 后生成的 *ngsw.json* 中文件 hash 值就会变化， PWA App 会连接此文件拿到更新并下载 hash 变化的文件， 当下次重新刷新 PWA App 后变化便会呈现。

### dataGroups

## App shell

[An app shell architecture](https://developers.google.com/web/showcase/2016/iowa2016)

[Angular App Shell - Boosting Application Startup Performance](https://blog.angular-university.io/angular-app-shell/)

### Angular Universal

为应用 `<project name>`(*angular-t*) 添加 universal 功能

`ng generate universal --client-project <project name>`

这样结果会产生配置 `projects/<project name>/architect/server`

#### How can we use the Angular Universal application

generate app shell

`ng generate app-shell --clientProject <project name>`

just created a new component called `app-shell`, This component was then linked to the `/app-shell-path` route, but only in the Angular Universal application. 这是一个辅助 route 用户并不能在浏览器中打开它。

我们示范性地在 *app-shell.component.html* 中加上 *loading!* 字样来表示页面正在加载请耐心等待。

编译项目

`ng run angular-t:app-shell`

运行 `ng serve --prod`

生成 app shell 也可以用一个命令包含 app-shell 和 universal project

`ng generate app-shell --client-project angular-t --universal-project server-app`

## Server-Side Rendering

https://medium.com/@MarkPieszak/angular-universal-server-side-rendering-deep-dive-dc442a6be7b7