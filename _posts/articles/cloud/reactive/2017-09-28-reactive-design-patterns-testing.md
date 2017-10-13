---
layout: post
title: Testing Reactive Applications
excerpt: "How to verify that the Reactive applications you build are elastic, resilient, and responsive. Testing is covered first because of the importance of proving Reactive capabilities. Just as Test-Driven Design (TDD) allows you to ensure that you are writing logic that meets your requirements from the outset, you must focus on putting into place the infrastructure required to verify elasticity, resilience, and responsiveness."
modified: 2017-09-28T17:00:00-00:00
categories: articles
tags: [Testing, Reactive]
image:
  vendor: unsplash
  feature: /photo-1481930703900-9007d48152b1?dpr=1.5&auto=format&fit=crop&w=1500&h=972&q=80&cs=tinysrgb&crop=
  credit: Brooke Lark
  creditlink: https://unsplash.com/@brookelark
comments: true
share: true
references:
  - title: "Testing Asynchronous JavaScript"
    url: "https://martinfowler.com/articles/asyncJS.html"
  - title: "Testing Asynchronous Code with MochaJS and ES7 async/await"
    url: "https://staxmanade.com/2015/11/testing-asyncronous-code-with-mochajs-and-es7-async-await/"
  - title: "Promises in JavaScript Unit Tests: the Definitive Guide"
    url: "https://www.sitepoint.com/promises-in-javascript-unit-tests-the-definitive-guide/"
  - title: "JavaScript unit test tools for TDD"
    url: "https://stackoverflow.com/questions/300855/javascript-unit-test-tools-for-tdd"
  - title: "Service Level Agreements in the Cloud: Who cares?"
    url: "https://www.wired.com/insights/2011/12/service-level-agreements-in-the-cloud-who-cares/"

---

* TOC
{:toc}

就像测试驱动开发(Test-driven Development TDD)所提倡的一样，我们在开发响应式的应用程序时先要考虑如何测试所要做的应用是否是 可伸缩(elastic) 有回复性(resilient) 灵敏的(responsive).

对于传统的应用程序架构和编程语言，测试方式已经很成熟了。但在响应式的应用里有一个问题需要关注，对于异步的程序如何进行测试？

## Testing Asynchronously

我们来看一下针对Javascript语言的异步机制如果进行单元测试。 在众多的Javascript单元测试框架中我们选用[Mocha][mochajs], 它是一款原生支持异步程序测试的框架。

> Mocha is a feature-rich JavaScript test framework running on [Node.js][nodejs] and in the browser, making asynchronous testing __simple__ and __fun__. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases. Hosted on [GitHub][mochajs/mocha].

Javascript单元测试框架的基本机构大同小异，重点来看一下针对异步程序有何不同。普通的测试代码如下：

```javascript
var assert = require('assert');

// Synchronous work/test
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
```

在package.json里指定测试脚本后运行命令`npm test`即可测试

```json
"scripts": {
  "test": "mocha"
}
```

### Event-Loop callback
基于[Event-loop][wiki/Event_loop]的异步机制是[Node.js][nodejs]的核心基础，对于每个event可以注册相应的函数(callback function)。
例如有一个创建并保存User的功能，保存通常需要远程调用，它是一个异步的过程，会有相应的callback函数。这里我们使用Javascript原生函数[setTimeout][setTimeout]来模拟异步操作。

```javascript
'use strict';

var User = function(username) {
  this.username = username;
};

User.prototype.save = function (callback) {
  let that = this;
  setTimeout(function() {
    that.status = "saved";
    callback()
  }, 1000);
};

module.exports = User;
```

然后使用Mocha写的测试程序如下，这里回调函数 __done__ 是告诉框架本段测试已经结束，异步任务完成，不需要再等待异步任务了。并且如果有错误发生会传给它:

```javascript
...
var User = require('../index');

// Asynchronous work/test
describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Tiven');
      user.save(function(err) {
        if (err) {
          done(err);
        }else {
          assert.equal(user.status, "saved", "User should be saved");
          done();
        }
      });
    });
  });
});
```

运行测试正确的结果如下

```
> reactive-design-patterns@1.0.0 test C:\dev\github\tiven-wang\reactive-design-patterns
> mocha

  Array
    #indexOf()
      √ should return -1 when the value is not present

  User
    #save()
      √ should save without error (1004ms)

  2 passing (1s)
```

如果在save方法的callback函数传入error，则这个测试单元不成功。

### Promise
相对于函数式编程的异步回调函数callback来说，[Promise][Promise]更像是一种面向对象版本的callback。

我们为User创建另一个方法update，用来更新用户名，同样使用setTimeout函数模拟异步任务。此方法会返回一个Promise对象，当输入用户名时用resolve表面正确，当没有输入时用reject表面错误。

```javascript
User.prototype.update = function (username) {
  this.username = username;
  let that = this;
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      that.status = "updated";
      if(username) {
        resolve(that);
      }else {
        reject("update fail!");
      }
    }, 1000);
  });
};
```

那么对于Promise的测试方式，同样得到了Mocha的原生支持。只需要在it函数里返回Promise，并确保此Promise对象会resolve或者reject，也就是相当于告诉框架这个段测试任务已经结束，等同于done函数作用。

```javascript
// Promise async work/test
describe('User', function() {
  describe('#update()', function() {
    let user;
    before(function() {
      user = new User('Tiven');
    });

    it('should update without error', function() {
      return user.update('tiwen').then((user)=> {
        assert.equal(user.status, "updated", "User should be updated");
      });
    });

    it('should update with error', function() {
      return user.update();
    });
  });
});
```

### Async/await

[Async/await][async_function] 特性需要运行时引擎支持，最新的 Node 已经默认支持它。

> Async/await support in Node 7.6 comes from updating V8, Chromium’s JavaScript engine, to version 5.5. This means async/await is not considered experimental anymore and can be used without specifying the --harmony flag, which can be used to enable almost-completed features that the V8 team does not consider stable yet.<br>
--> [https://www.infoq.com/news/2017/02/node-76-async-await](https://www.infoq.com/news/2017/02/node-76-async-await)
{: .Quotes}

另外一种方式是使用 Typescript 来编写Javascript程序， Typescript 支持 Async/await 特性。关于如何把 Typescript 编译成 ES5 的 Javascript 代码请参考 [Compile to ES5](/articles/to-es5-compiler/)

假如还有个删除方法是

```javascript
User.prototype.delete = function () {
  return new Promise((resolve, reject) => {
    setTimeout(()=> {
      resolve('deleted');
    }, 1000);
  });
};
```

使用async/await特性书写测试程序如下:

```javascript
// Async/Await async work/test
describe('User', function() {
  describe('#delete()', function() {
    let user;
    before(function() {
      user = new User('Tiven');
    });

    it('should delete without error', async function() {
      let status = await user.delete();
      assert.equal(status, "deleted", "User should be deleted");
    });

  });
});
```

### Testing Asynchronous Service Timeout
除了要测试异步服务能否返回正确的结果之外, 另一个指标也很重要, 那就是服务超时时间. 当一个服务在一定时间内没有返回结果, 那么我们就认为此服务超时, 不再等待. 在测试时可以设置超时时间, 用来测试服务的时间性能.

例如我们的 User 在5秒内没有醒来, 则此服务测试会失败:

```javascript
it('should waking without timeout', async function(){
  this.timeout(5000);
  let status = await user.sleep();
  assert.equal(status, "waking", "User should be waking");
});
```

### Testing Service-Level Agreements

> A [service level agreement (SLA)][service-level-agreement-sla] is a contract between a service provider (either internal or external) and the end user that defines the level of service expected from the service provider.
{: .Quotes}

SLA 在不同的领域都有应用，SLA 在计算机领域应用广泛，特别是云计算(Cloud Computing)方面 SLA 至关重要。有很多指标去衡量 SLA，
比如

* [__Availability__][High_availability] (e.g. 99.99% during work days, 99.9% for nights/weekends)
* __Performance__ (e.g. maximum response times)
* __Security / privacy__ of the data (e.g. encrypting all stored and transmitted data)
* __Disaster Recovery expectations__ (e.g. worse case recovery commitment)

等。

那么在测试程序中就要对 SLA 一些指标进行测试，虽然这并不像单元测试那么样有明确的结果。
假设我们有一个方法会以不同的时间返回结果，为了模拟不同的 response 时间我们为 setTimeout 设置 Math.random()\*1000 随机时间

```javascript
User.prototype.eat = function () {
  return new Promise((resolve, reject) => {
    setTimeout(()=> {
      resolve('eaten');
    }, Math.random()*1000);
  });
};
```

在测试程序中并行发出`N`个请求，每个请求会记录开始结束时间，最后再计算`95%`的请求响应时间是在一定的时间`latency`内

```javascript
it('should eaten within latency', function(done){
  // this.timeout(10000);
  let n = 200, times = n, latency = 950;
  let timings = [];
  while(times > 0) {
    let start = Date.now();
    user.eat().then(()=> {
      let stop = Date.now();
      timings.push(stop - start);
      if(timings.length == n) {
        timings.sort();
        // console.log(timings[Math.ceil(95/100*timings.length)-1]);
        assert.ok(timings[Math.ceil(95/100*timings.length)-1] < latency);
        done();
      }
    });
    times--;
  }
});
```

更多高级测试请参考 The [Apache JMeter™](http://jmeter.apache.org/)

完整代码请参考 [Github](https://github.com/tiven-wang/reactive-design-patterns/tree/test-async-js)

### Mock vs Stub

[Sinon.JS](http://sinonjs.org/)

Unit Testing with Mocks in Node <br>
http://vansande.org/2015/03/22/unit_testing_with_mocks_in_node_js/

[stackoverflow - What's the difference between a mock & stub?](https://stackoverflow.com/questions/3459287/whats-the-difference-between-a-mock-stub)

## Testing Elasticity

// TBD

## Testing Resilience

// TBD

## Testing Responsiveness

// TBD

[mochajs]:https://mochajs.org/
[nodejs]:http://nodejs.org/
[mochajs/mocha]:https://github.com/mochajs/mocha

[wiki/Event_loop]:https://en.wikipedia.org/wiki/Event_loop

[setTimeout]:https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
[Promise]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[async_function]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

[service-level-agreement-sla]:https://www.paloaltonetworks.com/cyberpedia/what-is-a-service-level-agreement-sla
[High_availability]:https://en.wikipedia.org/wiki/High_availability
[RAS]:https://en.wikipedia.org/wiki/Reliability,_availability_and_serviceability
