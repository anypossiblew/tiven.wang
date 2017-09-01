---
layout: post
title: Reactive Design Patterns - Analyzing Latency of Traditional Approach
excerpt: ""
modified: 2017-08-28T17:00:00-00:00
categories: articles
tags: [Latency, Reactive]
image:
  vendor: unsplash
  feature: /photo-1447078806655-40579c2520d6?dpr=1.5&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
  credit: Annie Spratt
  creditlink: https://unsplash.com/@anniespratt
comments: true
share: true
mathjax: true
references:
  - title: "Scalability"
    url: "https://en.wikipedia.org/wiki/Scalability"
  - title: "Scale-Up vs. Scale-Out Storage: What’s the Difference?"
    url: "https://cloudian.com/blog/scale-up-vs-scale-out-storage/"

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

So our application maximum process requests per-second is 1000. This is only theoretical value, the increased parallelized threads will eat more cpu resources then process per request need more times.

According to [Amdahl's law][Amdahl's law] the theoretical speedup in latency of the execution of a task at fixed workload that can be expected of a system whose resources are improved.

Amdahl's Law specifies the maximum increase in speed that can be achieved by adding additional threads:

\\[ S(n) =  \frac{T(1)}{T(N)} = \frac{1}{\alpha + \frac{1 - \alpha}{N}} = \frac{N}{1 + \alpha(N - 1)} \\]
{: .center}

* N is the number of available threads
* α is the fraction of the program that is serialized
* T(N) is the time the algorithm needs when executed with N threads

The increase in speed of a program using multiple processors in parallel computing is limited by the sequential fraction of the program. For example, if 95% of the program can be parallelized, the theoretical maximum speedup using parallel computing will be 20 times, no matter how many processors are used:

![Image: AmdahlsLaw](https://upload.wikimedia.org/wikipedia/commons/e/ea/AmdahlsLaw.svg)
{: .center}

So we can't scale up our server to speedup processing request blindly, but we need refactor our application architecture and **scale out** our server.



[tomcat-config-executor]:https://tomcat.apache.org/tomcat-7.0-doc/config/executor.html
[SCP-neo-deploy]:https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/937db4fa204c456f9b7820f83bc87118.html
[Amdahl's law]:https://en.wikipedia.org/wiki/Amdahl%27s_law
