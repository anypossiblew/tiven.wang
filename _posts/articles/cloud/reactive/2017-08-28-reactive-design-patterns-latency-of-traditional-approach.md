---
layout: post
title: Reactive Design Patterns - Analyzing Latency of Traditional Approach
excerpt: ""
modified: 2017-08-28T17:00:00-00:00
categories: articles
tags: [Reactive]
image:
  vendor: unsplash
  feature: /photo-1490645935967-10de6ba17061?dpr=1.5&auto=format&fit=crop&w=1080&h=735&q=80&cs=tinysrgb&crop=
  credit: Brooke Lark
  creditlink: https://unsplash.com/@brookelark
comments: true
share: true
mathjax: true
references:
  - title: "The Reactive Manifesto"
    url: "http://www.reactivemanifesto.org/"

---

* TOC
{:toc}

[tomcat config executor][tomcat-config-executor]

For example: you can see the `--max-threads` option (*Default*: **200**) in the [**deploy**][SCP-neo-deploy] command page for tools of SAP Cloud Platform. Assume there is need 0.2 seconds to process a request, so the
max processed requests per-second is

\\[ L = \lambda \cdot W \\]
{: .center}

\\[ \lambda =  \frac{L}{W} \\]
{: .center}


\\[ \lambda =  \frac{200}{0.2} = 1000 \\]
{: .center}



[tomcat-config-executor]:https://tomcat.apache.org/tomcat-7.0-doc/config/executor.html
[SCP-neo-deploy]:https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/937db4fa204c456f9b7820f83bc87118.html
