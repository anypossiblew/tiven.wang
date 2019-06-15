---
layout: post
theme: Josefin-Sans
series: 
  url: typescript
  title: TypeScript
title: Setup with Node.js
excerpt: "How to setup a Node.js Application with TypeScript language?"
modified: 2018-02-02T17:00:00-00:00
categories: articles
tags: [TypeScript, Webpack, JavaScript]
image:
  vendor: twitter
  feature: /media/DUzbaI1W0AAcb1X.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "GitBook - TypeScript Deep Dive - TypeScript with Node.js"
    url: "https://basarat.gitbooks.io/typescript/docs/quick/nodejs.html"
---

* TOC
{:toc}

本文介绍如何 Setup 起来一个使用 TypeScript 进行开发的 Node.js Application

## Setup

使用以下步骤 Setup 起来一个 Node.js with TypeScript Application

* `npm init -y` setup Node.js project `package.json`
* `npm install typescript --save-dev` install [TypeScript][typescript]
* `npm install @types/node --save-dev` install TypeScript's type definitions for [Node.js][nodejs]
* `npx tsc --init` Init a `tsconfig.json` for TypeScript options
* Make sure you have `compilerOptions.module:commonjs` in your tsconfig.json

> 或者走另外一条路，把 TypeScript 相关的包安装在 global：
`npm install -g typescript`, 在运行 tsc 命令时则不需要使用 [npx][npx] 工具 `tsc --init` 。
{: .Notes}

Now you can use all the built in node modules (e.g. `import fs = require('fs');`) with all the safety and developer ergonomics of TypeScript!

还可以使用 ES6 style import 语法导入 Node modules `import * as fs from 'fs';`

### Compile

使用命令 `npx tsc -p ./` 以当前目录为项目根目录（包含配置文件 `tsconfig.json`）执行 TypeScript 编译，`tsconfig.json` 文件中有详细配置可供选择。

参数 `-p` : Compile a project given a valid configuration file. The argument can be a file path to a valid JSON configuration file, or a directory path to a directory containing a tsconfig.json file. See tsconfig.json documentation for more details.

> 如果你的 TypeScript 安装在 global 则可以直接使用命令 `tsc -p ./`

#### Publishing

[TypeScript NPM Publishing][typescript-declaration-files] 有两种方式：

* 通过指定 *package.json* 文件中的参数 `"types": "./lib/main.d.ts"` 来说明本项目中 TypeScript 文件
* 发布到 [@types organization][npmjs-types] on npm.

所以在 `tsc` 编译时也会从这两个方面查找 TypeScript 的依赖包。

#### @types

为了大量现有的 JavaScript 库，有一个项目叫 [DefinitelyTyped][DefinitelyTyped] 专门为现有 JavaScript 定义相应的 TypeScript 类型。例如你想要在你的 TypeScript 程序中使用 jQuery 库，你就可以导入 jQuery 的 TypeScript 类型包 `npm install @types/jquery --save-dev`，然后就可以在代码中引入它 `import * as jQuery from 'jquery';`。

这样在编译的时候有两个选项可以为[DefinitelyTyped][DefinitelyTyped]灵活配置，`typeRoots` 和 `types`

[@types, typeRoots and types](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types)

### Live compile + run

* Add `ts-node` which we will use for live compile + run in node (`npm install ts-node --save-dev`)
* Add `nodemon` which will invoke `ts-node` whenever a file is changed (`npm install nodemon --save-dev`)

> 如果 typescript 安装在 global 则这两个包也需要安装在 global

假设你的应用程序入口文件是`index.ts`, 那么就可以在你的`package.json`添加下面脚本

```json
"scripts": {
  "start": "npm run build:live",
  "build:live": "nodemon --exec ./node_modules/.bin/ts-node -- ./index.ts"
},
```

这样运行命令 `npm start` 则会实时监控文件更改而编译成 JavaScript 文件，然后运行入口文件程序

除了使用 `ts-node` 实时编译和运行 TypeScript 程序外还可以使用 Gulp 工具 Build TypeScript 项目包括编译打包等任务。

## with Build Tools

### Gulp

> [gulp][gulpjs] is a toolkit for automating painful or time-consuming tasks in your development workflow, so you can stop messing around and build something.

首先要在全局安装 gulp 命令行工具包

`npm install -g gulp-cli`

然后为项目安装开发依赖包 gulp , gulp-typescript

`npm install --save-dev gulp gulp-typescript`

在项目根目录下创建文件 `gulpfile.js`

```javascript
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
```

运行命令 `gulp` 即可编译 TypeScript 代码到目标目录 dist 下。

参考官方文档 https://www.typescriptlang.org/docs/handbook/gulp.html

### Grunt

[Grunt ](https://gruntjs.com/) is a JavaScript task runner.

首先全局安装 Grunt 命令行工具

`npm install -g grunt-cli`

使用 `grunt -v` 命令可验证安装成功

然后安装 Grunt 到项目

`npm install grunt --save-dev`

Once Grunt is available on your machine and specified in your project, you need to get a TypeScript plugin.

`npm install grunt-ts --save-dev`

新建问价 *Gruntfile.js* 并填写

```javascript
module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      default : {
        tsconfig: './tsconfig.json',
        src: ["**/*.ts", "!node_modules/**/*.ts"],
        outDir: "dist"
      },
      options: {
      }
    }
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
  };
```

The Grunt configuration creates a default task that executes a custom ts task that links to the tsconfig.json file, which is the default TypeScript configuration file.

## Debugging

在 Visual Studio Code 的 Debug 里为项目添加一个新的 node.js configuration，配置改成如下内容

```json
{
    "type": "node",
    "request": "launch",
    "name": "Launch Program",
    "runtimeArgs": [
        "-r",
        "ts-node/register"
    ],
    "args": [
        "${workspaceFolder}/index.ts"
    ]
}
```

[Debug TypeScript Application using Visual Studio Code](https://github.com/TypeStrong/ts-node#visual-studio-code)

## Hello world

新建文件 index.ts, 引入 Node.js 的两个 modules, 项目控制台提问，并读取输入流然后打印欢迎消息

```typescript
import * as readline from 'readline';
import * as process from 'process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please type your name:', (username) => {
  rl.close();

  console.log("Welcome "+username+"!");
});
```

如果你正在运行着 `npm start` 命令，每当代码有修改并保持后都会被编译和运行。

[typescript]:https://www.npmjs.com/package/typescript
[nodejs]:http://nodejs.org/
[npx]:https://www.npmjs.com/package/npx
[DefinitelyTyped]:http://definitelytyped.org/
[typescript-declaration-files]:https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
[npmjs-types]:https://www.npmjs.com/~types
[gulpjs]:https://gulpjs.com/
