---
layout: slides
theme: svo
transition: slide
title: Cloud Application Architectures - Building Applications and Infrastructure in the Cloud
excerpt: ""
modified: 2017-02-17T17:00:00-00:00
categories: articles
tags: [Cloud, Reading]
---

<section>
  <p class="Question">Cloud Application Architectures</p>
  <p class="Author">George Reese</p>
</section>

<section>
  <p class="Subject">Chapter 5</p>
  <p class="Adjective">Security</p>
</section>

<section>
  <p class="Question">Why</p>
</section>

<section>
<p class="Subject">Security implications of the cloud</p>
<p class="Attributive">are</p>
<ul>
<li class="Object fragment fade-up">Lawsuits that do not involve you become a security concern</li>
<li class="Object fragment fade-up">Many of the laws and standards that govern your IT infrastructure were created without virtualization in mind</li>
<li class="Object fragment fade-up">The idea of perimeter security is largely nonsensical in the cloud</li>
<li class="Object fragment fade-up">How you manage user credentials goes beyond standard identity management</li>
</ul>
</section>

<section>
  <p class="Adjective">Data Security</p>
</section>

<section>
<p class="Subject">Encrypt Everything</p>
<p class="Attributive"></p>
<ul>
<li class="Object fragment fade-up">Encrypt sensitive data in your databse and in memory</li>
<li class="Object fragment fade-up">Decrypt it only in memory for the duration of the need for the data</li>
<li class="Object fragment fade-up">Encrypt your backups</li>
<li class="Object fragment fade-up">Encrypt your network traffic</li>
<li class="Object fragment fade-up">Encrypt your filesystems</li>
</ul>
</section>

<section>
<p class="Subject">Regulatory and Standards Compliance</p>
<p class="Attributive">how, where, what</p>
<p><span class="Keyword">Directive 95/46/EC</span> <span class="Keyword">HIPAA</span> <span class="Keyword">PCI or PCI DSS</span> <span class="Keyword">SOX</span> <span class="Keyword">21CFR11</span></p>
</section>

<section>
  <p class="Adjective">Network Security</p>
</section>

<section>
<p class="Subject">A few best practices</p>
<p class="Attributive">include</p>
<ul>
<li class="Object fragment fade-up">Run only one network service (plus necessary administrative services) on each virtual server</li>
<li class="Object fragment fade-up">Do not open up direct access to your most sensitive data</li>
<li class="Object fragment fade-up">Open only the ports absolutely necessary to support a server's service and nothing more</li>
<li class="Object fragment fade-up">Limit access to your services to clients who need to access them</li>
<li class="Object fragment fade-up">Even if you are not doing load balancing, use a reverse proxy</li>
<li class="Object fragment fade-up">Use the dynamic nature of the cloud to automate your security embarrassments</li>
</ul>
</section>

<section>
  <p class="Adjective">Host Security</p>
</section>

<section>
<p class="Subject">Cloud Vendors</p>
<p class="Attributive">provide</p>
<ul>
<li class="Object fragment fade-up">Network Intrusion Detection</li>
<li class="Object fragment fade-up">System Hardening</li>
<li class="Object fragment fade-up">Antivirus Protection</li>
<li class="Object fragment fade-up">Host Intrusion Detection</li>
<li class="Object fragment fade-up">Data Segmentation</li>
<li class="Object fragment fade-up">Credential Management</li>
</ul>
</section>

<section>
  <p class="Subject">Chapter 6</p>
  <p class="Adjective">Disaster Recovery</p>
</section>

<section>
  <p class="Question">Thank you</p>
  <p class="Author"><a href="http://tiven.wang">@tiven.wang</a></p>
</section>
