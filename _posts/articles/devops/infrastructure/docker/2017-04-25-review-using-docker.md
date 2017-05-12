---
layout: post
title: Using Docker
excerpt: "Review for <<Using Docker>>"
modified: 2017-04-25T17:00:00-00:00
categories: articles
tags: [Docker, Infrastructure as Code, CI/CD]
image:
  feature: hana/masthead-microservices.jpg
comments: true
share: true
references:
  - title: "Awesome Docker"
    url: "https://github.com/haiiiiiyun/awesome-docker-cn"
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

### The Docker Architecture

![High-level overview of major Docker components](/images/devops/infrastructure/docker/High-level-overview-Docker-components.jpg)

The [Docker daemon][docker-daemon] used an "execution driver" to create containers.

**execution driver**:

* [runc][runc] CLI tool for spawning and running containers according to the [OCI specification][OCI]

* [LXC][LXC] is a userspace interface for the Linux kernel containment features. Through a powerful API and simple tools, it lets Linux users easily create and manage system or application containers.

Docker [storage drivers][storage-drivers]

#### Surrounding Technologies

* Swarm
* Compose
* Machine
* Kitematic
* Docker Trusted Registry
* Networking: Weave, Project Calico, Overlay
* Service discovery: Consul, Registrator, SkyDNS, etcd
* Orchestration and cluster management: Kubernetes from Google, Marathon for Mesos, CoreOS's Fleet, Docker's Swarm

#### Docker Hosting

* Amazon cloud
* Google cloud
* [Digital Ocean cloud][digitalocean]
* [Joyent Triton][Joyent-Triton]
* [Deis][deis]
* [Flynn][flynn]
* [Paz][paz]

### How Images Get Built

#### The Build Context

`docker build - < Dockerfile`

`docker build - < context.tar.gz`

`docker build -f dockerfiles/Dockerfile.debug`

> .dockerignore

#### Image Layers

`docker history mongo:latest`

#### Caching

`docker build --no-cache`

#### Dockerfile Instructions

[Dockerfile reference][Dockerfile reference]

[Best practices for writing Dockerfiles][Best practices for writing Dockerfiles]

### Linking Containers

### Managing Data with Volumes and Data Containers

* `docker run -v /data`
* `VOLUME /data`
* `docker run -v /home/tiven/data:/data`

#### Sharing Data

`--volumes-from CONTAINER`

#### Data Containers

seed the container with any initial data and ensures permissions are set up correctly.

Delete:

`docker rm -v`

### Common Docker Commands

[Engine (docker) CLI][Engine (docker) CLI]

# The Software Lifecycle with Docker

## Creating a Simple Web App

```
FROM python:3.4

RUN groupadd -r uwsgi && useradd -r -g uwsgi uwsgi
RUN pip install Flask==0.10.1 uWSGI==2.0.8 requests==2.5.1 redis==2.10.3
WORKDIR /app
COPY app /app
COPY cmd.sh /

EXPOSE 9090 9191
USER uwsgi

CMD ["/cmd.sh"]
```

### Docker Compose

* [Compose command-line reference](https://docs.docker.com/compose/reference/)

* [Compose file version 3 reference](https://docs.docker.com/compose/compose-file/)

## Image Distribution

Running:
`docker run -d -p 5000:5000 --restart always --name registry registry:2`

Tagging:
`docker tag test/jekyll localhost:5000/test/jekyll`

Pushing:
`docker push localhost:5000/test/jekyll`

## Continuous Integration and Testing with Docker



## Deploying Containers

### Provisioning Resources with Docker Machine

[Docker Machine][Docker Machine]

`docker-machine ls`

`docker-machine create --driver virtualbox dev`

`docker-machine regenerate-certs dev` if need

`docker-machine env dev`

`docker-machine env dev | Invoke-Expression`

`docker info`


## Logging and Monitoring

# Part III. Tools and Techniques

## Networking and Service Discovery

### Ambassadors

`docker-machine create -d virtualbox redis-host`

`docker-machine env redis-host | Invoke-Expression`

`docker run -d --name real-redis redis:3`

`docker run -d --name real-redis-ambassador -p 6379:6379 --link real-redis:real-redis amouat/ambassador`

`docker-machine ip redis-host`

[Socat](https://linux.die.net/man/1/socat) is a command line based utility that establishes two bidirectional byte streams and transfers data between them.

[sed](https://www.computerhope.com/unix/used.htm) is a stream editor. A stream editor is used to perform basic text transformations on an input stream (a file, or input from a pipeline). While in some ways similar to an editor which permits scripted edits (such as ed), sed works by making only one pass over the input(s), and is consequently more efficient.

### Service Discovery

#### etcd

The [Raft Consensus Algorithm][raft]

[etcd](https://github.com/coreos/etcd) is a distributed reliable key-value store for the most critical data of a distributed system.

#### SkyDNS

[SkyDNS](https://github.com/skynetservices/skydns) is a distributed service for announcement and discovery of services built on top of etcd. It utilizes DNS queries to discover available services. This is done by leveraging SRV records in DNS, with special meaning given to subdomains, priorities and weights.

#### Consul

### Networking Options

#### Bridge



[Docker container networking][networking]

[docker-daemon]:https://docs.docker.com/engine/reference/commandline/dockerd/
[runc]:https://runc.io/
[OCI]:https://www.opencontainers.org/
[LXC]:https://linuxcontainers.org/
[storage-drivers]:https://docs.docker.com/engine/userguide/storagedriver

[digitalocean]:https://www.digitalocean.com/
[Joyent-Triton]:https://www.joyent.com/
[deis]:http://deis.io/
[flynn]:https://flynn.io/
[paz]:http://www.paz.sh/

[Dockerfile reference]:https://docs.docker.com/engine/reference/builder/
[Best practices for writing Dockerfiles]:https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/

[Engine (docker) CLI]:https://docs.docker.com/engine/reference/run/

[networking]:https://docs.docker.com/engine/userguide/networking/
[Docker Machine]:https://docs.docker.com/machine/
[raft]:https://raft.github.io/
