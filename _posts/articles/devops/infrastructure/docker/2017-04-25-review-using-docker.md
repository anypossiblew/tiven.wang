---
layout: post
title: Using Docker
excerpt: "Review for <<Using Docker>>"
modified: 2017-04-25T17:00:00-00:00
categories: articles
tags: [Docker, CI/CD]
image:
  feature: hana/masthead-microservices.jpg
comments: true
share: true
references:
---

* TOC
{:toc}

## First Steps

### The Basic Commands

`$ docker run -h CONTAINER -i -t debian /bin/bash`

### Building Images from Dockerfiles

`docker build -t test/cowsay-dockerfile .`

`docker run --rm test/cowsay-dockerfile "Moo world"`

> **Problem**: standard_init_linux.go:178: exec user process caused "no such file or directory" <br>
> **When**: make the entrypoint.sh as the ENTRYPOINT <br>
> **Fixed**: `dos2unix entrypoint.sh`

## Docker Fundamentals

![High-level overview of major Docker components](/images/devops/infrastructure/docker/High-level-overview-Docker-components.jpg)
