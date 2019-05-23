---
layout: post
theme: 细秀体
title: Angular - Setup Dev Project
excerpt: "Setup Angular development project"
modified: 2018-03-13T17:00:00-00:00
categories: articles
tags: [Angular, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DWxM_OlX0AEOamH.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/967232671427514368
comments: true
share: true
references:
  - id: 1
    title: "Angular2 - how to start and with which IDE"
    url: "https://stackoverflow.com/questions/40840317/angular2-how-to-start-and-with-which-ide"
---

* TOC
{:toc}

[Angular](https://en.wikipedia.org/wiki/Angular_(application_platform)) is the frontend part of the [MEAN][MEAN] stack, consisting of [**M**ongoDB][MongoDB] database, [**E**xpress.js][Express.js] web application server framework, [**A**ngular][angular.io] itself, and [**N**ode.js][Node.js] runtime environment.

https://angular.io/guide/quickstart

> 本文完整代码可下载自 [Github](https://github.com/tiven-wang/angular-tutorial/tree/setup)
{: .Notes}

## Set up the Development Environment

> 本文使用最新版 Angular `v7.2.15`
>
> 环境配置最低要求 **Node.js version 8.x or 10.x** and **npm**
{: .Warning}

[Angular CLI][angular-cli] 是开发测试构建部署 Angular 项目的命令行工具，安装在全局环境

`npm install -g @angular/cli`

打开命令行窗口，用下面的命令创建一个新的 Angular 项目并生成项目骨架，`railway-app` 是我们的项目名称你可以自定义。

`ng new railway-app`

> 这个过程需要一段时间，主要是因为需要安装 npm 依赖包。国内网络可能更慢或者失败，请设置代理 [npm proxy](http://tiven.wang/articles/proxy-config-be-used-in-develop-tools/#npm%E7%9A%84%E9%85%8D%E7%BD%AE%E7%AE%A1%E7%90%86%E5%8F%8A%E8%AE%BE%E7%BD%AE%E4%BB%A3%E7%90%86)

进入项目目录, 然后启动服务器

```
cd railway-app
ng serve --open
```

`ng serve` 命令可以启动服务器，监控项目文件，如果你有修改自动重新构建项目。`--open`或者`-o`选项会自动在浏览器中打开项目主页。

## Project Skeleton
接下来我们分析一下生成的项目整个骨架。

### TypeScript
Angular 项目代码使用 [TypeScript][typescript] 语言进行开发，

## Angular CLI

https://github.com/angular/angular-cli/wiki

## IDEs

### Sublime Text or Atom
如果简单起见可以使用 Sublime Text 或者 Atom 编辑器加装 TypeScript 相关插件。

### Visual Studio Code

[Visual Studio Code][visualstudio-code] is a lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux. It comes with built-in support for JavaScript, [TypeScript][typescript] and Node.js and has a rich ecosystem of extensions for other languages (such as C++, C#, Java, Python, PHP, Go) and runtimes (such as .NET and Unity).

#### How to use Typescript with Visual Studio Code

I'd strongly recommend you to use angular-cli for developing an Angular2 app. Not only for simplicity, but because in a community we need to have a basic starter which gives us the ability to have similar structured repo. So we can understand easily the structure of an other project.

Plus, [angular-cli][angular-cli] handles Typescript compilation for you and you don't have to deal with it in command line or from your IDE.

`npm i -g typescript`
(no need for `typings` anymore since Typescript 2.0 !)

```
npm i -g angular-cli
ng new my-super-project --style=scss
cd my-super-project
```
Then just run

`ng serve`
And access to your app at : http://localhost:4200

Angular-cli compiles your Typescript and even your (sccs\|sass\|less) files.

When you want to deploy your app :

`ng serve --prod`
Will also minimify JS and CSS. [[1.](#reference-1)]

## How to debug the typescript source code

// TODO
https://angularfirebase.com/lessons/methods-for-debugging-an-angular-application/

https://medium.com/@ttemplier/how-to-debug-the-typescript-source-code-of-angular2-99a593e2983f

## 推荐书籍

* [Rangle's Angular Training Book](https://angular-2-training-book.rangle.io/)




[angular.io]:https://angular.io/
[MEAN]:https://en.wikipedia.org/wiki/MEAN_(software_bundle)
[MongoDB]:https://en.wikipedia.org/wiki/MongoDB
[Express.js]:https://en.wikipedia.org/wiki/Express.js
[Node.js]:https://nodejs.org/

[angular-cli]:https://github.com/angular/angular-cli
[visualstudio-code]:https://code.visualstudio.com/
[typescript]:http://tiven.wang/articles/typescript/
