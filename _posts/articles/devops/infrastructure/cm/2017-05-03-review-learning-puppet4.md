---
layout: post
title: Learning Puppet4
excerpt: "Review for &lt;&lt;Learning Puppet4&gt;&gt;"
modified: 2017-05-03T17:00:00-00:00
categories: articles
tags: [Puppet, Infrastructure as Code]
image:
  feature: /images/hana/masthead-microservices.jpg
comments: true
share: true
references:
  - title: "Docker 优秀资源集锦"
    url: "https://github.com/haiiiiiyun/awesome-docker-cn"
---

* TOC
{:toc}

## Running Puppet using Docker

`git clone https://github.com/jorhett/learning-puppet4`

`docker run --rm -it -w /workspace -v C:/Users/tiven.wang/dockers/learning-puppet4:/workspace devopsil/puppet bash`

`puppet config print |grep dir`

## Writing Manifests

`puppet apply manifests/helloworld.pp`

`puppet resource mailalias postmaster`

[Puppet Resource Type Reference](https://docs.puppet.com/puppet/latest/type.html)
