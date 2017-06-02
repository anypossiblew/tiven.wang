---
layout: slides
theme: svo
transition: slide
title: Training JavaScript - 1. Foundation
excerpt: ""
modified: 2017-06-02T17:00:00-00:00
categories: articles
tags: [JavaScript, Training]
---

<section>
<p class="Subject">Training JavaScript</p>
<p class="Question">Foundation</p>
<p class="Author"><a href="/about">Tiven Wang</a></p>
</section>

<section >
<p class="Subject">Language basics</p>
<p class="Question">Variable</p>
</section>

<section id="section-variables">
  <section>
  <p class="Subject">Variable</p>
  <p class="Object">JavaScript is a <i>loosely typed</i> or a <i>dynamic</i> language.</p>
  <p class="Attributive">Primitive</p>
  <ul>
    <li class="fragment fade-up">string</li>
    <li class="fragment fade-up">number</li>
    <li class="fragment fade-up">boolean</li>
    <li class="fragment fade-up">null</li>
    <li class="fragment fade-up">undefined</li>
    <li class="fragment fade-up">symbol (new in ECMAScript 6)</li>
  </ul>
  <p class="Attributive">other</p>
  <ul>
    <li class="fragment fade-up">Object</li>
  </ul>
  </section>

  <section >
  <p class="Subject">Variable</p>
  <p class="Object">boolean Conversions</p>
  <p class="Attributive">false</p>
  <ul>
    <li class="fragment fade-up">The empty string ""</li>
    <li class="fragment fade-up">null</li>
    <li class="fragment fade-up">undefined</li>
    <li class="fragment fade-up">The number 0</li>
    <li class="fragment fade-up">The number NaN</li>
    <li class="fragment fade-up">The boolean false</li>
  </ul>
  <p class="Attributive">true</p>
  <ul>
    <li class="fragment fade-up">The string "0"</li>
    <li class="fragment fade-up">The string "false"</li>
    <li class="fragment fade-up">The string " "</li>
    <li class="fragment fade-up">The number -1</li>
  </ul>
  </section>
  <aside class="notes" data-markdown>
  Lazy Evaluation
  $ true || "something“
   true
  $ true && "something“
  "something“
  </aside>

</section>

<section >
<p class="Subject">Object</p>
<p class="Object">An object is a collection of related data and/or functionality (which usually consists of several <a href="#section-variables">variables</a> and <a href="#section-function">functions</a> — which are called properties and methods when they are inside objects.) </p>
<p>Array is Object</p>
<pre><code class="javascript">
var person = {
  name: ['Bob', 'Smith'],
  age: 32,
  gender: 'male',
  interests: ['music', 'skiing'],
  bio: function() {
    alert(this.name[0] + ' ' + this.name[1] + ' is ' + this.age + ' years old. He likes ' + this.interests[0] + ' and ' + this.interests[1] + '.');
  },
  greeting: function() {
    alert('Hi! I\'m ' + this.name[0] + '.');
  }
};
</code></pre>
</section>

<section id="section-function">
  <section>
  <p class="Subject">Function</p>
  <p class="Attributive">points</p>
  <ul>
  <li class="fragment fade-up">How to define and use a function</li>
  <li class="fragment fade-up">Passing parameters to a function</li>
  <li class="fragment fade-up">Pre-defined functions that are available to you "for free"</li>
  <li class="fragment fade-up">The scope of variables in JavaScript</li>
  <li class="fragment fade-up">The concept that functions are just data, albeit a special type of data</li>

    <li class="fragment fade-up">Function has prototype that is a Object</li>
    <li class="fragment fade-up">new Function = Object</li>
    <li class="fragment fade-up">call Function</li>
  </ul>
  </section>

  <section>
  <p class="Subject">Function</p>
  <p class="Attributive">points</p>
  <ul>
  <li class="fragment fade-up">Using anonymous functions</li>
  <li class="fragment fade-up">Callbacks</li>
  <li class="fragment fade-up">Self-invoking functions</li>
  <li class="fragment fade-up">Inner functions (functions defined inside functions)</li>
  <li class="fragment fade-up">Functions that return functions</li>
  <li class="fragment fade-up">Functions that redefine themselves</li>
  <li class="fragment fade-up">Closures</li>
  </ul>
  <aside class="notes" data-markdown>
* Callbacks
  When you pass a function A to another function B and B executes A, it's often said that A is a callback function. If A doesn't have a name, then you can say that it's an anonymous callback function.

* Self-invoking functions

```javascript
  (
  function(name){
    alert('Hello ' + name + '!');
  }
)('dude')
```

* Inner functions

```javascript
var a = function(param) {
  var b = function(theinput) {
    return theinput * 2;
  };
  return 'The result is ' + b(param);
};
```

是实现OO私有方法的基础

* Functions that redefine themselves

这个例子涉及到了这几个难点。

```javascript
var a = function() {
  function someSetup(){
    var setup = 'done';
  }
  function actualWork() {
    alert('Worky-worky');
  }
  someSetup();
  return actualWork;
}();
```

* Closures
In JavaScript, functions have lexical scope. This means that functions create their
environment (scope) when they are defined, not when they are executed.

When a function is defined, it "remembers" its environment, its scope chain。

```javascript
// code start
var a = function() {
	return sayHello();
}();
println(a);

function sayHello() {
    println("Hello " + this);
}
// code end
```
结果是
Hello [object Object]

	</aside>
  </section>

</section>



<section >
<p class="Subject">Scope</p>
<ul>
  <li class="fragment fade-up">()</li>
  <li class="fragment fade-up">function f(){}()</li>
  <li class="fragment fade-up">(function f(){}())</li>
</ul>
</section>

<section >
<p class="Subject">Prototype</p>
<p class="Object">Object.prototype is a object: Object is a inner Function</p>
<p class="Object">Function.prototype is a function: Function is a inner Function</p>
</section>

<section>
<p class="Subject">Closure</p>

</section>

<section data-markdown>
  ## Markdown support

  Write content using inline or external Markdown.
  Instructions and more info available in the [readme](https://github.com/hakimel/reveal.js#markdown).
</section>

<section>
  <p class="Question">Thank you</p>
  <p class="Author"><a href="http://tiven.wang">@tiven.wang</a></p>
</section>
