https://alligator.io/angular/angular-webpack-bundle-analyzer/

https://blog.angularindepth.com/optimize-angular-bundle-size-in-4-steps-4a3b3737bf45

https://www.npmjs.com/package/depcheck

https://www.npmjs.com/package/madge

## npm install ci lock

## npm ci

NPM 5.7.0 引入了一种新的安装依赖的方式：

`$ npm ci`

它是从 *package-lock.json* 文件安装依赖， 具有快以及可靠优点.

官方有下面补充：

* 将会删除项目中的 *node_modules* 文件夹；
* 会依照项目中的 package.json 来安装确切版本的依赖项；
* 项目里面必须存在 *package-lock.json* 或 *npm-shrinkwrap.json*;
* 如果 package lock 里面依赖和 *package.json* 不一致， `npm ci` 会报错并且退出， 而不是更新 package lock 文件;
* `npm ci` 只能一次性安装整个工程的依赖，不能使用这个命令单独添加依赖
* 如果 *node_modules* 文件夹存在， 它会在安装依赖之前删除这个文件夹
* 它不会改变 *package.json* 或者任何 *package-locks*

### npm install

`npm install` 或者 `npm i` 通常是用来安装依赖项：

* 它将会安装 Node.js 项目所有的依赖项;
* 如果使用 `^` 或 `~` 来匹配依赖项的版本时，则 npm 可能无法安装确切版本;
* 利用 `npm install` 安装新依赖项时，会更新 *package-lock.json*;

## compiler

### Just in Time (JIT)

### Ahead of Time (AoT)