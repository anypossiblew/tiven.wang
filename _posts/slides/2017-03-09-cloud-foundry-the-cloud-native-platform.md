---
layout: slides
theme: svo
transition: slide
title: Cloud Foundry - The Cloud-Native Platform
excerpt: "Cloud Foundry is a platform for running applications and services. Its purpose is to change the way applications and services are deployed and run by reducing the develop to deployment cycle time. Cloud Foundry directly leverages cloud-based resources so that applications running on the platform can be infrastructure unaware. It provides a contract to run cloud-native applications predictably and reliably."
modified: 2017-03-09T17:00:00-00:00
categories: articles
tags: [Cloud Foundry, Review]
---

<section>
  <p class="Question">Cloud Foundry</p>
  <p class="Object">The Cloud-Native Platform</p>
  <p class="Author">Duncan C. E. Winn</p>
</section>

<section>
<p class="Object">“Nobody has ever built cloud-native apps without a platform. They either build one themselves or they use Cloud Foundry.”</p>
<p class="Author">—Joshua McKenty, Field CTO of Pivotal Cloud Foundry</p>
</section>

<section>
<p class="Subject">Cloud Native</p>
<p class="Attributive">is</p>
<p class="Object">a term describing software designed to run and scale reliably and predictably on top of potentially unreliable cloud-based infrastructure.</p>
</section>

<section>
<p class="Subject">Becoming cloud native involves three fundamental tenets</p>
</section>

<section>
<p class="Subject">1. Automated Infrastructure Management and Orchestration</p>
<p class="fragment fade-up">This is the ability to consume infrastructure elastically (scale up and down), on demand, and in a self-service fashion. This layer is often referred to as Infrastructure as a Service (IaaS); however, it is the automated self-service characteristics of the infrastructure that are important. There is no explicit requirement to use virtualized infrastructure.</p>
</section>

<section>
<p class="Subject">2. Platforms</p>
<p class="fragment fade-up">You should use the highest level of abstraction possible to drive the underlying infrastructure and related services. Service abstraction is provided by a platform that sits above the infrastructure/ IaaS layer, leveraging it directly. Platforms offer a rich set of services for managing the entire application life cycle.</p>
</section>

<section>
<p class="Subject">3. The Twelve-Factor App</p>
<p class="fragment fade-up">Ensure that the application layer on top of the platform can scale and thrive in a cloud environment. This is where the concept of <a href="http://12factor.net/">The Twelve-Factor App</a> becomes key. Twelve Factor describes 12 design principles for applications purposefully designed to run in a cloud environment. These applications designed to run on top of a cloud-based infrastructure are typically referred to as cloud-native applications. Cloud-native applications are infrastructure unaware; they allow the platform to leverage infrastructure on their behalf. Being infrastructure agnostic is the only way applications can thrive in a cloud environment.</p>
</section>

<section>
<p class="Object">“There are two approaches to handling change: adapt or die vs. same mess for less!”</p>
<p class="Author">—Dekel Tankel, Senior Director of Pivotal Cloud Foundry</p>
</section>

<section id="c2">
<p class="Subject">Cloud-native platforms' technical driving forces</p>
<ul>
<li><a href="#/c2-Anything-as-a-service">Anything as a service</a></li>
<li><a href="#/c2-Cloud-Computing">Cloud Computing</a></li>
<li><a href="#/c2-Containers">Containers</a></li>
<li><a href="#/c2-Agile">Agile</a></li>
<li><a href="#/c2-Automation">Automation</a></li>
<li><a href="#/c2-DevOps">DevOps</a></li>
<li><a href="#/c2-Microservices">Microservices</a></li>
<li><a href="#/c2-Business-Capability-Teams">Business-Capability Teams</a></li>
<li><a href="#/c2-Cloud-Native-Applications">Cloud-Native Applications</a></li>
</ul>
</section>

<section id="c2-Anything-as-a-service">
<p class="Subject">Anything as a service</p>
<p class="fragment fade-up">Every layer of information technology, from networking, storage, computation, and data, right through to applications, are all offered “as a service.”</p>
</section>

<section id="c2-Cloud-Computing">
<p class="Subject">Cloud Computing</p>
<p class="Subject">Three tenets of "XaaS"</p>
<ul>
<li class="fragment fade-up"><span class="Adjective">Elasticity</span> The ability to handle concurrent growth through dynamically scaling the service up and down at speed.</li>
<li class="fragment fade-up"><span class="Adjective">On demand</span> The ability to choose when and how to consume the required service.</li>
<li class="fragment fade-up"><span class="Adjective">Self-service</span> The ability to directly provision or obtain the required service without time-consuming ticketing.</li>
</ul>
</section>

<section id="c2-Containers">
<p class="Subject">Containers</p>
<ul>
<li class="fragment fade-up"><span class="Adjective">Container images</span></li>
<li class="fragment fade-up"><span class="Adjective">A container management solution</span></li>
</ul>
</section>

<section id="c2-Agile">
<p class="Subject">Agile</p>
<p class="Subject">manifesto values:</p>
<ul>
<li class="fragment fade-up">Individuals and interactions over processes and tools</li>
<li class="fragment fade-up">Working software over comprehensive documentation</li>
<li class="fragment fade-up">Customer collaboration over contract negotiation</li>
<li class="fragment fade-up">Responding to change over following a plan</li>
</ul>
</section>

<section id="c2-Automation">
<p class="Subject">Automate Everything</p>
<ul>
<li class="fragment fade-up">Continuous Integration</li>
<li class="fragment fade-up">Continuous Delivery</li>
</ul>
</section>

<section id="c2-DevOps">
<p class="Subject">DevOps</p>
</section>

<section id="c2-Microservices">
<p class="Subject">Microservices</p>
<p class="Attributive">is</p>
<p class="Object">a term used to describe a software architectural style that has emerged over the last few years. It describes a modular approach to building software in which complex applications are composed of several small, independent processes communicating with each other though explicitly defined boundaries using language-agnostic APIs. These smaller services focus on doing a single task very well. They are highly decoupled and can scale independently.</p>
</section>

<section id="c2-Business-Capability-Teams">
<p class="Subject">Business-Capability Teams</p>
<p class="Object">“Any organization that designs a system will produce a design whose structure is a copy of the organization’s communication structure.”</p>
<p class="Author">—Melvyn Conway</p>
</section>

<section id="c2-Cloud-Native-Applications">
<p class="Subject">Cloud-Native Applications</p>
<p class="Attributive">is</p>
<p class="Object">an architectural style which has been established to describe the design of applications specifically written to run in a cloud environment. These applications avoid some of the anti-patterns that were established in the client-server era, such as writing data to the local file system.</p>
</section>

<section>
<p class="Object">“Cloud Foundry is so resilient that the reliability of the underlying infrastructure becomes inconsequential.”</p>
<p class="Author">—Julian Fischer, anynines</p>
</section>

<section id="c3">
<p class="Subject">Cloud Foundry platform</p>
<p class="Attributive">offers</p>
<ul>
  <li class="fragment fade-up">Services as a higher level of abstraction above infrastructure</li>
  <li class="fragment fade-up">Containers</li>
  <li class="fragment fade-up">Agile and automation</li>
  <li class="fragment fade-up">A cultural shift to DevOps</li>
  <li class="fragment fade-up">Microservices support</li>
  <li class="fragment fade-up">Cloud-native application support</li>
</ul>
</section>

<section>
<p class="Object">“Here is my source code, run it on the cloud for me. I do not care how!”</p>
<p class="Author">—Onsi Fakhouri, VP of Engineering of Pivotal Cloud Foundry</p>
</section>

<section id="c4">
<p class="Subject">Cloud Foundry built-in platform capabilities</p>
<p class="Attributive">:</p>
<ul>
  <li class="fragment fade-up">Resiliency and fault tolerance through self-healing and redundancy</li>
  <li class="fragment fade-up">User management</li>
  <li class="fragment fade-up">Security and auditing</li>
  <li class="fragment fade-up">Application life-cycle management, including aggregated streaming of logs and metrics</li>
  <li class="fragment fade-up">Release engineering, including provisioning VMs, containers, middleware, and databases</li>
</ul>
</section>

<section>
  <p class="Question">Thank you</p>
  <p class="Author"><a href="http://tiven.wang">@tiven.wang</a></p>
</section>
