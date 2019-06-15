---
layout: post
theme: XiXiuTi
star: true
series: 
  url: angular
  title: Angular
title: Setup Dev Project
excerpt: "Setup Angular development project"
modified: 2019-06-13T17:00:00-00:00
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

> 本文参照[官方教程](https://angular.io/start), 完整代码可下载自 [Github](https://github.com/tiven-wang/angular-tutorial/tree/v8-setup). 为了更好的服务于 SAP 产品的开发，本文使用的数据模型是 SAP(NW7.5) EPM Demo 组件的 `SEPMRA_SO_ANA` OData Service. 之后会连接此 OData Service 去模拟实际的应用场景。
{: .Notes}

## Set up the Development Environment

> * 本文使用最新版 Angular `v8.0.0`
> * 环境配置最低要求 **Node.js version 8.x or 10.x** and **npm**
> * Angular 官方推荐使用 WebIDE 工具 [StackBlitz](https://stackblitz.com/) (Online IDE powered by Visual Studio Code) 进行开发
> * [Angular CLI][angular-cli] 是开发测试构建部署 Angular 项目的命令行工具，安装在全局环境
{: .Warning}

### Step 1. Create Project by Angular CLI

I'd strongly recommend you to use `angular-cli` for developing an Angular8 app. Not only for simplicity, but because in a community we need to have a basic starter which gives us the ability to have similar structured repo. So we can understand easily the structure of an other project.

Plus, [angular-cli][angular-cli] handles Typescript compilation for you and you don't have to deal with it in command line or from your IDE.

`npm i -g typescript`
(no need for `typings` anymore since Typescript 2.0 !)

本机开发 Angular 项目的话，首先安装 Angular CLI 工具

`npm install -g @angular/cli`

用下面的命令创建一个新的 Angular 项目并生成项目骨架，`angular-tutorial` 是我们的项目名称你可以自定义。

`ng new angular-tutorial`

> 这个过程需要一段时间，主要是因为需要安装 npm 依赖包。国内网络可能更慢或者失败，请设置代理 [npm proxy](http://tiven.wang/articles/proxy-config-be-used-in-develop-tools/#npm%E7%9A%84%E9%85%8D%E7%BD%AE%E7%AE%A1%E7%90%86%E5%8F%8A%E8%AE%BE%E7%BD%AE%E4%BB%A3%E7%90%86)

进入项目目录 *angular-tutorial*, 然后启动服务器

```text
cd angular-tutorial
ng serve --open
```

`ng serve` 命令可以启动服务器，监控项目文件，如果你有修改自动重新构建项目。`--open`或者`-o`选项会自动在浏览器中打开项目主页。

```text
npm i -g angular-cli
ng new my-super-project --style=scss
cd my-super-project
```

Then just run

* `ng serve` And access to your app at : http://localhost:4200

Angular-cli compiles your Typescript and even your (sccs\|sass\|less) files.

When you want to deploy your app :

* `ng serve --prod` Will also minimify JS and CSS. [[1.](#reference-1)]

### IDEs

* Sublime Text or Atom, 如果简单起见可以使用 Sublime Text 或者 Atom 编辑器加装 TypeScript 相关插件。

* [Visual Studio Code][visualstudio-code] is a lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux. It comes with built-in support for JavaScript, [TypeScript][typescript] and Node.js and has a rich ecosystem of extensions for other languages (such as C++, C#, Java, Python, PHP, Go) and runtimes (such as .NET and Unity).

* [StackBlitz](https://stackblitz.com/) (Online IDE powered by Visual Studio Code)

![StackBlitz Angular](/images/angular/stackblitz-angular.png)

用 StackBlitz 开发的代码提交到 Github 后可以在本地下载，然后就可以用下面命令运行了 （但报错 *ERROR Error: The selector "my-app" did not match any elements* 暂未解决，还是用 Angular CLI 生成项目代码方式）

```sh
npm i
ng serve --open
```

## Project Skeleton

接下来我们分析一下生成的项目整个骨架。

* **Components** define areas of responsibility in your UI that let you reuse these sets of UI functionality.
* **NgModules** are containers for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities. They can contain components, service providers, and other code files whose scope is defined by the containing NgModule. They can import functionality that is exported from other NgModules, and export selected functionality for use by other NgModules.

### Step 2. Generate Component

用 Angular CLI 生成一个新的 Component *product-list*

`ng g component product-list`

![Angular ng g component](/images/angular/ng-generate-component.png)

同样的可以生成另外的 Components

> 关于 [@Directive v/s @Component in Angular](https://stackoverflow.com/questions/32680244/directive-v-s-component-in-angular)
{: .Warning}

## 推荐书籍

* [Rangle's Angular Training Book](https://angular-2-training-book.rangle.io/)

[angular.io]:https://angular.io/
[MEAN]:https://en.wikipedia.org/wiki/MEAN_(software_bundle)
[MongoDB]:https://en.wikipedia.org/wiki/MongoDB
[Express.js]:https://en.wikipedia.org/wiki/Express.js
[Node.js]:https://nodejs.org/

[angular-cli]:https://cli.angular.io/
[visualstudio-code]:https://code.visualstudio.com/
[typescript]:http://tiven.wang/articles/typescript/
