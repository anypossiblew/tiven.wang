---
layout: slides
theme: svo
transition: slide
title: Professional Node.js Building Javascript Based Scalable Software
excerpt: ""
modified: 2017-02-14T17:00:00-00:00
categories: articles
tags: [Node.js]
---

<section>
  <p class="Question">Introducing Node.js</p>
</section>

<section>
  <p class="Question">What is Event-Driven Programming</p>
</section>

<section>
  <p class="Subject"><a href="http://stackoverflow.com/questions/10570246/what-is-non-blocking-or-asynchronous-i-o-in-node-js">Non-Blocking I/O</a></p>
  <p class="Attributive">is</p>
  <p class="Object">a form of input/output processing that permits other processing to continue before the transmission has finished.</p>
</section>

<section>
  <p class="Question">What is first-class function</p>
</section>

 <section>
   <p class="Subject"><a href="http://stackoverflow.com/questions/705173/what-is-meant-by-first-class-object">First-class Function</a></p>
   <p class="Attributive">is</p>
   <p class="Object">that the language supports constructing new functions during the execution of a program, storing them in data structures, passing them as arguments to other functions, and returning them as the values of other functions.</p>
   <p class="Object fragment fade">JavaScript is a powerful language, mainly because it has first-class functions and closures.</p>
 </section>

<section>
  <p class="Question">What are Closures</p>
</section>

<section>
  <p class="Subject">Closures</p>
  <p class="Attributive">are</p>
  <p class="Object">functions<span class="fragment fade"> that inherit variables from their enclosing environment.</span></p>
  <p class="Object"><span class="fragment fade">This powerful feature is at the heart of Node's success.</span></p>
</section>

<section>
  <p class="Question">Node Core API</p>
</section>

<section>
  <p class="Subject">Modules</p>
  <p class="Attributive">use</p>
  <p class="Object"><a href="http://requirejs.org/docs/commonjs.html">CommonJS</a> modules system.</p>
</section>

<section>
  <p class="Subject">Buffer</p>
  <p class="Attributive">helps you to</p>
  <p class="Object">deal with binary data in Node.js.</p>
</section>

<section>
  <p class="Subject">The standard callback pattern</p>
  <p class="Attributive">is</p>
  <p class="Object"><span class="Adjective fragment display"><a href="https://en.wikipedia.org/wiki/Continuation-passing_style">CPS</a></span> which is a style of programming in which control is passed explicitly in the form of a continuation.</p>
</section>

<section>
  <p class="Subject">The event emitter pattern</p>
  <p class="Attributive">can</p>
  <p class="Object">trigger event happened multiple times.</p>
</section>

<section>
  <p class="Subject">process.nextTick()</p>
  <p class="Attributive"></p>
  <p class="Object">By using process.nextTick(callback) instead of setTimeout(callback, 0), your callback runs immediately after all the events in the event queue have been processed, which is much sooner than when the JavaScript timeout queue is activated.</p>
</section>

<section>
  <p class="Question">Files, Processes, Streams, and Networking</p>
</section>

<section>
<p>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/path.html">path</a></span>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/fs.html">, fs</a></span>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/child_process.html">, child_process</a></span>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/stream.html">, stream</a></span>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/net.html">, net</a></span>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/http.html">, http</a></span>
<span class="Adjective fragment fade"><a href="https://github.com/request/request">, request</a></span>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/dgram.html">, dgram</a></span>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/tls.html">, tls</a></span>
<span class="Adjective fragment fade"><a href="https://nodejs.org/api/https.html">, https</a></span>
</p>
</section>

<section>
  <p class="Question">Thank you</p>
  <p class="Author"><a href="http://tiven.wang">@tiven.wang</a></p>
</section>
