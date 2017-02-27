---
layout: slides
theme: svo
transition: slide
title: Cloud Architecture Patterns
excerpt: ""
modified: 2017-02-27T17:00:00-00:00
categories: articles
tags: [Cloud, Reading]
---

<section>
  <p class="Question">Cloud Architecture Patterns</p>
  <p class="Author">Bill Wilder</p>
</section>

<section>
  <p class="Subject">I</p>
  <p class="Question">Scalability</p>
</section>

<section>
<p class="Subject">Scalability</p>
<p class="Attributive">is</p>
<p class="Object">a measure of the number of users one application can effectively support at the same time.</p>
</section>

<section>
<p class="Subject">Vertically Scaling Up</p>
<p class="Attributive">is to</p>
<p class="Object">increase overall application capacity by increasing the resources within existing nodes.</p>
<pre class="fragment fade-up"><code class="PowerShell">$ cf scale myApp -k 512M
$ cf scale myApp -m 1G</code></pre>
</section>

<section>
<p class="Subject">Horizontally Scaling Out</p>
<p class="Attributive">is to</p>
<p class="Object">increase overall application capacity by adding entire nodes.</p>
<pre class="fragment fade-up"><code class="PowerShell">$ cf scale myApp -i 5</code></pre>
</section>

<section>
<p class="Subject">Horizontal Scaling</p>
<p class="Attributive">is more efficient</p>
<p class="Object">with homogeneous nodes.</p>
</section>

<section>
<p class="Subject">Scale Unit</p>
<p class="Attributive">are</p>
<p class="Object">the combinations of resources that need to be scaled together.</p>
</section>

<section>
  <p class="Subject">Following characteristics of a cloud platform make cloud-native applications possible</p>
  <p class="Attributive">:</p>
</section>

<section>
<ul>
  <li class="Object Small ">Enabled by (the illusion of) infinite resources and limited by the maximum capacity of individual virtual machines, cloud scaling is horizontal.</li>
  <li class="Object Small fragment fade-up">Enabled by a short-term resource rental model, cloud scaling releases resources as easily as they are added.</li>
  <li class="Object Small fragment fade-up">Enabled by a metered pay-for-use model, cloud applications only pay for currently allocated resources and all usage costs are transparent.</li>
  <li class="Object Small fragment fade-up">Enabled by self-service, on-demand, programmatic provisioning and releasing of resources, cloud scaling is automatable.</li>
  <li class="Object Small fragment fade-up">Both enabled and constrained by multitenant services running on commodity hardware, cloud applications are optimized for cost rather than reliability; failure is routine, but downtime is rare.</li>
  <li class="Object Small fragment fade-up">Enabled by a rich ecosystem of managed platform services such as for virtual machines, data storage, messaging, and networking, cloud application development is simplified.</li>
</ul>
</section>

<section>
  <p class="Subject">A cloud-native application is architected to take full advantage of cloud platforms. A cloud-native application is assumed to have the following properties, as applicable</p>
  <p class="Attributive">:</p>
</section>

<section>
  <ul>
    <li class="Object Small">Leverages cloud-platform services for reliable, scalable infrastructure. (“Let the platform do the hard stuff.”)</li>
    <li class="Object Small fragment fade-up">Uses non-blocking asynchronous communication in a loosely coupled architecture.</li>
    <li class="Object Small fragment fade-up">Scales horizontally, adding resources as demand increases and releasing resources as demand decreases.</li>
    <li class="Object Small fragment fade-up">Cost-optimizes to run efficiently, not wasting resources.</li>
    <li class="Object Small fragment fade-up">Handles scaling events without downtime or user experience degradation.</li>
    <li class="Object Small fragment fade-up">Handles transient failures without user experience degradation.</li>
    <li class="Object Small fragment fade-up">Handles node failures without downtime.</li>
    <li class="Object Small fragment fade-up">Uses geographical distribution to minimize network latency.</li>
    <li class="Object Small fragment fade-up">Upgrades without downtime.</li>
    <li class="Object Small fragment fade-up">Scales automatically using proactive and reactive actions.</li>
    <li class="Object Small fragment fade-up">Monitors and manages application logs even as nodes come and go.</li>
  </ul>
</section>


<section>
  <p class="Subject">II</p>
  <p class="Question">Horizontally Scaling Compute Pattern</p>
</section>

<section>
<p class="Subject">Cloud Scaling</p>
<p class="Attributive">is</p>
<p class="Object fragment fade-up">Reversible</p>
</section>

<section>
<p class="Subject">Managing Session State</p>
<p class="Attributive">through</p>
<p class="Object"><span class="Adjective fragment fade"><a href="https://docs.cloudfoundry.org/concepts/http-routing.html">sticky session</a></span><span class="Adjective fragment fade"> or <a href="http://blog.haproxy.com/2012/03/29/load-balancing-affinity-persistence-sticky-sessions-what-you-need-to-know/">session affinity</a></span></p>
</section>

<section>
<p class="Subject">Managing Many Nodes</p>
<p class="Attributive">include</p>
<p class="Object">  
  <ul>
    <li class="Object Small fragment fade">capacity planning for large scale</li>
    <li class="Object Small fragment fade">sizing virtual machines</li>
    <li class="Object Small fragment fade">failure is partial</li>
    <li class="Object Small fragment fade">operational data collection</li>
  </ul>
</p>
</section>


<section>
  <p class="Subject">III</p>
  <p class="Question">Queue-Centric Workflow Pattern</p>
</section>

<section>
  <p class="Question">Thank you</p>
  <p class="Author"><a href="http://tiven.wang">@tiven.wang</a></p>
</section>
