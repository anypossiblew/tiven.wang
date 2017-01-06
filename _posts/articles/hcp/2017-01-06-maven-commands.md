---
layout: post
title: Maven Commands
excerpt: "Maven Commands"
modified: 2017-01-06T17:00:00-00:00
categories: articles
tags: [Maven, Tools]
image:
  feature: cloud/masthead-incubators.jpg
comments: true
share: true
---

* TOC
{:toc}


## Setup

### Generate Maven Project

```
mvn archetype:generate \
        -DarchetypeGroupId=pl.codeleak \
        -DarchetypeArtifactId=spring-mvc-quickstart \
        -DarchetypeVersion=1.0.0 \
        -DgroupId=<my.groupid> \
        -DartifactId=<my-artifactId> \
        -Dversion=<version> \
        -DarchetypeRepository=http://kolorobot.github.io/spring-mvc-quickstart-archetype
```

install maven plugins for eclipse using url *http://download.eclipse.org/technology/m2e/releases/*

### Lifecycle

`mvn compile`

`mvn test`

[Maven guides getting started][maven-getting-started]

[maven-getting-started]:https://maven.apache.org/guides/getting-started/
