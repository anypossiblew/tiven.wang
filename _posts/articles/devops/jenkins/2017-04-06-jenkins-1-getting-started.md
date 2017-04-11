---
layout: post
title: Jenkins 1 - Getting Started
excerpt: ""
modified: 2017-04-06T17:00:00-00:00
categories: articles
tags: [Jenkins, Docker, CI/CD]
image:
  feature: hana/masthead-microservices.jpg
comments: true
share: true
references:
  - title: "Jenkins"
    url: "https://jenkins.io/"
  - title: "Docker Documentation"
    url: "https://docs.docker.com/"
  - title: "Jenkins and Docker"
    url: "https://jenkins.io/solutions/docker/"
  - title: "Docker CLI Reference"
    url: "https://docs.docker.com/engine/reference/commandline/docker/"
---

* TOC
{:toc}

## What's Jenkins

Jenkins is a self-contained, open source automation server which can be used to automate all sorts of tasks such as building, testing, and deploying software. Jenkins can be installed through native system packages, Docker, or even run standalone by any machine with the Java Runtime Environment installed.

Combining Jenkins and [Docker][Docker] together can bring improved speed and consistency to your automation tasks, which is why we have installed the Jenkins using Docker.

## What’s Docker

> Docker is an open-source project that automates the deployment of applications inside software containers, by providing an additional layer of abstraction and automation of operating-system-level virtualization on Linux.* <br/>
> — Wikipedia


## Installing Jenkins with Docker

You should have [Docker][Docker] properly installed on your machine. Check ﻿[Docker installation guide][Docker installation] for details.

First, pull the official [jenkins][jenkins image] image from Docker repository.

`docker pull jenkins`

Next, run a container using this image and map data directory from the container to the host; e.g in the example below */var/jenkins_home* from the container is mapped to *jenkins/* directory from the current path on the host. Jenkins *8080* port is also exposed to the host as *49001*.

`docker run -d -p 49001:8080 -v $PWD/jenkins:/var/jenkins_home:z -t jenkins`

Addtionally, you can configure [nginx][nginx] as a reverse proxy to your Jenkins instance, e.g.

```
upstream app {
    server 127.0.0.1:49001;
}
server {
    listen 80;
    server_name jenkins.your-domain.com;

    location / {
        proxy_pass http://app;
    }
}
```

### Setting Up Jenkins 2.0

Now that we are running an instance of Jenkins at *http://localhost:49001/* , access the URL then we need setup up Admin Password , User Details and Plugins initially.

![Image:Setting Up Jenkins 2.0](/images/cloud/devops/jenkins/jenkins-startup.gif)

## Configuring Jenkins Server

### Install Maven

Manually:

`docker exec -it myjenkins /bin/bash`

`curl -O http://download.java.net/java/jdk8u152/archive/b02/binaries/jdk-8u152-ea-bin-b02-linux-x64-27_mar_2017.tar.gz`

`curl -O http://mirror.synyx.de/apache/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz`

`tar -zxvf apache-maven-3.3.9-bin.tar.gz`

Configure the path of Maven and JDK in Jenkins Global Tool Configure page.

Automatically:

Install from Apache(or Oracle):



[Docker]:http://docker.io/
[Docker installation]:https://docs.docker.com/engine/installation/
[jenkins image]:https://hub.docker.com/_/jenkins/
[nginx]:http://nginx.org/
