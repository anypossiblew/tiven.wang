---
layout: post
title: TypeScript - Setup with Node.js
excerpt: ""
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

## Setup

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

> windows system 请使用格式 `nodemon --exec .\node_modules\.bin\ts-node -- .\index.ts`
{: .Notes}

这样运行命令 `npm start` 则会时时监控文件更改而编译成 JavaScript 文件，然后运行入口文件程序





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
