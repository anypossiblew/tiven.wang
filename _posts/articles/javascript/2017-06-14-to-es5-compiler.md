---
layout: post
title: Compile to ES5
excerpt: ""
modified: 2017-06-14T17:00:00-00:00
categories: articles
tags: [ES6, JavaScript]
image:
  feature: /images/nationalgeographic/Strutting-Stork.jpg
comments: true
share: true
references:
  - title: "Using Traceur with Node.js"
    url: "https://github.com/google/traceur-compiler/wiki/Using-Traceur-with-Node.js"
---

* TOC
{:toc}

## traceur

[traceur](https://github.com/google/traceur-compiler)

`npm install --save-dev traceur`

### Option 1:

`./node_modules/.bin/traceur --out public/index.js index.js`

`node ./public/index.js`

### Option 2:

bootstrap.js:

```javascript
// bootstrap.js
var traceur = require('traceur');
traceur.require.makeDefault(function(filename) {
  // don't transpile our dependencies, just our app
  return filename.indexOf('node_modules') === -1;
});
require('./index');
```

index.js:

```javascript
class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Square extends Polygon {
  constructor(length) {
    // Here, it calls the parent class' constructor with lengths
    // provided for the Polygon's width and height
    super(length, length);
    // Note: In derived classes, super() must be called before you
    // can use 'this'. Leaving this out will cause a reference error.
    this.name = 'Square';
  }

  get area() {
    return this.height * this.width;
  }

  set area(value) {
    this.area = value;
  }

  draw() {
    console.log(this.area);
  }
}

new Square(10).draw();
```

```
$ node bootstrap.js
100
```

[Using Traceur with Node.js](https://github.com/google/traceur-compiler/wiki/Using-Traceur-with-Node.js)

## Babel

[babel](http://babeljs.io)

Install the cli and preset of babel:

`npm install --save-dev babel-cli`

`npm install --save-dev babel-preset-env`

Create the babel's environment file *.babelrc*:

```json
{
  "presets": ["env"]
}
```

Compile JavaScript files in folder *src* into folder *lib*:

`./node_modules/.bin/babel src -d lib`

## Typescript

`npm install -g typescript`

`tsc helloworld.ts`

`node helloworld.js`

If you want add more options for typescript compiler, please add a file named *tsconfig.json* in the root of your project.

If you want read more knowledge about TypeScript and Node, refer to [TypeScript Node Starter](https://github.com/Microsoft/TypeScript-Node-Starter#typescript-node-starter)
