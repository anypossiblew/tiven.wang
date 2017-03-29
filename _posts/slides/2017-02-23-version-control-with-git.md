---
layout: slides
theme: svo
transition: slide
title: Version Control with Git
excerpt: "Powerful Tools and Techniques for Collaborative Software Development. Although some familiarity with revision control systems will be good background material, a reader who is not familiar with any other system will still be able to learn enough about basic Git operations to be productive in a short while. More advanced readers should be able to gain insight into some of Git’s internal design and thus master some of its more powerful techniques."
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [Git, Reading]
---

<section>
  <p class="Question">Version Control with Git</p>
  <p class="Author">Jon Loeliger & Matthew McCullough</p>
</section>

<section>
  <p class="Subject">I</p>
  <p class="Question">Introduction</p>
</section>

<section>
  <p class="Subject">II</p>
  <p class="Question">Basic Git Concepts</p>
</section>

<section>
   <img data-src="https://i.stack.imgur.com/XwVzT.png" style="background: white;">
</section>

<section>
  <p class="Subject">5</p>
  <p class="Question">File Management and the Index</p>
</section>

<section>
  <p class="Subject">git add</p>
  <p class="Object">git status</p>
  <p class="Object">git add</p>
  <p class="Object">git ls-files --stage</p>
  <p class="Object">git rm --cached &lt;filename&gt;</p>
  <p class="Object">git rm &lt;filename&gt;</p>
</section>

<section>
  <p class="Subject">IV</p>
  <p class="Question">Commits</p>
</section>

<section>
  <p class="Subject">Commit</p>
  <p class="Attributive">is used to</p>
  <p class="Object">record changes to a repository</p>
</section>

<section>
  <p class="Subject">ref</p>
  <p class="Attributive">is</p>
  <p class="Object">an SHA1 hash ID that refers to an object within the Git object store.</p>
  <p>
    <span class="fragment fade-up">master</span>
    <span class="fragment fade-up">,origin/master</span>
    <span class="fragment fade-up">,v1.0.0</span>
    <span class="fragment fade-up">,HEAD</span>
    <span class="fragment fade-up">,ORIG_HEAD</span>
    <span class="fragment fade-up">,FETCH_HEAD</span>
    <span class="fragment fade-up">,MERGE_HEAD</span>
    <span class="fragment fade-up">,master~3^2^</span>
  </p>
</section>

<section>
  <p class="Subject">V</p>
  <p class="Question">Branches</p>
</section>

<section>
  <p class="Subject">Branch</p>
  <p class="Attributive">is</p>
  <p class="Object">the fundamental means of launching a separate line of development within
  a software project.</p>
  <p class="Subject">for</p>
  <ul>
    <li class="fragment fade-up">individual customer release</li>
    <li class="fragment fade-up">a development phase</li>
    <li class="fragment fade-up">a single feature or research</li>
    <li class="fragment fade-up">the work of an individual contributor</li>
  </ul>
</section>

<section>
  <p class="Question">Thank you</p>
  <p class="Author"><a href="http://tiven.wang">@tiven.wang</a></p>
</section>
