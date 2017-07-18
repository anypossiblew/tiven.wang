---
layout: post
title: Training JavaScript - 2. Create Server by Node.js (TypeScript version)
excerpt: ""
modified: 2017-06-05T17:00:00-00:00
categories: articles
tags: [Node.js, TypeScript, JavaScript]
image:
  feature: /images/nationalgeographic/Strutting-Stork.jpg
comments: true
share: true
references:
  - title: "TypeScript 2 + Express + Node.js"
    url: "http://brianflove.com/2016/11/08/typescript-2-express-node/"
---

* TOC
{:toc}

JavaScript Series:

1. [JavaScript Foundation](/articles/training-javascript-1-foundation/) and [Node.js](/articles/professional-node.js/)
2. [Create Server by Node.js (JavaScript version)](/articles/training-javascript-2-server-javascript/) or Create Server by Node.js (TypeScript version)
3. [Angular for frontend development](/articles/training-javascript-3-frontend-angular/)

I want to use Node.js to create a application which can receive the messages that come from [wechat](https://open.weixin.qq.com/
) server, and store them in [MongoDB](https://www.mongodb.com), and retrieve them by restful api.

## Setup Node.js Project

`$ mkdir training-javascript-node`

`$ cd training-javascript-node`

`npm init`

### Install TypeScript

install TypeScript using the npm install command:

`npm install typescript --save-dev`

check the installed typescript version:

`./node_modules/.bin/tsc -v`

> Note: this also generates a new **node_modules** folder in your project. If you are using **Git** then should add this folder to your **.gitignore** file.

### Install Gulp

I am going to be using the Gulp task runner to compile the TypeScript source code. Use npm to install gulp:

`npm install gulp --save-dev`

Now that we have gulp installed, let’s install some task runners:

```
npm install gulp-tsc --save-dev
```

#### Create gulpfile.js

```javascript
var gulp   = require('gulp');
var tsc    = require('gulp-tsc');

// ** Pre-Configurations * //
var paths = {
  tscripts : {
    src : ['app/src/**/*.ts'],
    dest : 'app/build'
  }
};

// ** Compilation ** //
gulp.task('build', ['compile:typescript']);
gulp.task('compile:typescript', function () {
  return gulp
  .src(paths.tscripts.src)
  .pipe(tsc({
    module: "commonjs",
    emitError: false
  }))
  .pipe(gulp.dest(paths.tscripts.dest));
});
```

Check the configuration by running:

`gulp build`

### Create Application Code



## Setup Node.js Project by Yeoman

[Yeoman](http://yeoman.io/) is a generic scaffolding system allowing the creation of any kind of app. It allows for rapidly getting started on new projects and streamlines the maintenance of existing projects.

First thing is to install `yo` using `npm`:

`npm install -g yo`

Search the generator that you need from [yeoman.io](http://yeoman.io/generators/), for example [`generator-typescript`](https://www.npmjs.com/package/generator-typescript):

`npm install -g generator-typescript`

Generate scaffolding source code for your application using `generator-typescript`:

`$ mkdir training-javascript-node`

`$ cd training-javascript-node`

`$ yo typescript`

After answering the prompts you will have a few files and folders in your project folder:

```
training-javascript-node
|- app/
|  |- build/
|  |- src/
|  |  |- app.ts
|  |  |- index.ts
|- test/
|  |- test-greeting.js
|  |- test-load.js
|- .editorconfig
|- .jshintrc
|- gulpfile.js
|- package.json
|- README.md
|- tslint.json
```

Install the dependencies by

`npm install`

> Note: this also generates a new **node_modules** folder in your project. If you are using **Git** then should add this folder to your **.gitignore** file.

Once the dependencies have install already, you can build and run the application using the build tool [gulp](http://gulpjs.com/):

`gulp`

Output:

```
$ gulp
[17:06:54] Using gulpfile \training-javascript-node\gulpfile.js
[17:06:54] Starting 'lint:default'...
[17:06:54] Starting 'buildrun'...
[17:06:54] Starting 'compile:typescript'...
[17:06:54] Finished 'lint:default' after 236 ms
[17:06:54] Starting 'lint'...
[17:06:54] Finished 'lint' after 9.85 μs
[17:06:54] Compiling TypeScript files using tsc version 2.3.4
[17:06:56] Finished 'compile:typescript' after 2.56 s
[17:06:56] Starting 'build'...
[17:06:56] Finished 'build' after 8.21 μs
[17:06:56] Starting 'run'...
Whatup, world!
[17:06:57] Finished 'run' after 252 ms
[17:06:57] Finished 'buildrun' after 2.81 s
[17:06:57] Starting 'default'...
[17:06:57] Finished 'default' after 4.51 μs
```

> To build and run the project: `$ gulp`
>
> To build only: `$ gulp build`
>
> To run only: `$ gulp run`
>
> To automatically build when a file changes: `$ gulp watch`
>
> To automatically build and run when a file changes: `$ gulp watchrun`

## HTTP Server

[Express.js](https://expressjs.com/), or simply **Express**, is a web application framework for Node.js. Express is the backend part of the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)), together with MongoDB database and AngularJS frontend framework.

To install the Express dependency. I am including the `--save` flag to my `npm install` command so that the dependency is saved in the *package.json* file:

`npm install express --save`

the associated TypeScript declaration is needed:

`npm install @types/express --save-dev`

### Basic Server

#### Create Server Class

Create a file `server.ts` in *app/src*:

```typescript
import * as express from "express";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();

    //add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    this.app.get('/', function (request, response) {
      response.send('Hello World');
    });
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //empty for now
  }

  /**
   * Create router
   *
   * @class Server
   * @method api
   */
  public routes() {
    //empty for now
  }
}

```

#### Create Index File

Create a file `index.ts` in *app/src*:

```javascript
import ser = require("./server");

const server: ser.Server  = ser.Server.bootstrap();

server.app.listen(3000);
```

#### Test the Server

Build TypeScript files:

`gulp build`

Start the expressjs server:

`node ./app/build/index.js`

Test the api by accessing:

*http://127.0.0.1:3000/*

You will get: _**Hello World**_ in your browser.

### Middleware for Express

We have created out server.ts module, next we will add more features in our server. So we need to install some more dependencies for middleware. I am using the following middleware in this example Express application:

* body-parser
* cookie-parser
* morgan
* errorhandler
* method-override

You can read more about each of these using the links above. Let’s go ahead and get these installed via npm:

```
$ npm install body-parser --save
/*$ npm install cookie-parser --save
$ npm install morgan --save
$ npm install errorhandler --save
$ npm install method-override --save*/
```

Also need to install the TypeScript declaration files for them:

```
$ npm install @types/body-parser --save-dev
/*$ npm install @types/cookie-parser --save-dev
$ npm install @types/morgan --save-dev
$ npm install @types/errorhandler --save-dev
$ npm install @types/method-override --save-dev*/
```

### Create Routes

## MongoDB and mongoose

`npm install mongodb --save`

`npm install @types/mongodb --save-dev`

`npm install mongoose --save`

`npm install @types/mongoose --save-dev`

## ES6 Promise

## IDE

## Debug
