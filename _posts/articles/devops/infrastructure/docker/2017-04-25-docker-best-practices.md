---
layout: post
title: Docker Best Practices
excerpt: "Docker Best Practices"
modified: 2017-04-25T17:00:00-00:00
categories: articles
tags: [Docker, Infrastructure as Code, CI/CD]
image:
  feature: hana/masthead-microservices.jpg
comments: true
share: true
references:
---

* TOC
{:toc}

## Basic Operations

### Cleaning Up Stopped Containers

`$ docker rm -v $(docker ps -aq -f status=exited)`

`> docker rm -v (docker ps -aq -f status=exited)`

## Run
### Running Nodejs

`$ docker run -it --rm --name my-running-script -v "$PWD":/usr/src/app -w /usr/src/app node node your-daemon-or-script.js`

`> docker run -it --rm --name my-running-script -v "%cd%":/usr/src/app -w /usr/src/app node npm install`

`> docker run -it --rm --name my-running-script -v "%cd%":/usr/src/app -w /usr/src/app -p 6001:6001 node node router.js`

### Running Jekyll

Build a docker image using *Dockerfile*:

```
FROM jekyll/jekyll:latest

RUN gem install jekyll-gist

CMD jekyll
```

build the image:

`docker build -t test/jekyll .`

then run:

`> docker run --rm -it -w /data -p 4000:4000 -v c:/Users/<User>/github/tiven.wang:/data test/jekyll bundle exec jekyll serve -s /data/`

### Running SAP Cloud Platform Application

Build a docker image using Dockerfile:

```
FROM maven:3.5.0-jdk-8

COPY neo-java-web-sdk-2.72.17 /usr/share/neo-java-web-sdk-2.72.17

RUN ln -s /usr/share/neo-java-web-sdk-2.72.17/tools/neo.sh /usr/bin/neo

CMD neo
```

build the image:
`docker build -t test/scp .`

Package:

`> docker run --rm -it -w /app -v C:/dev/github/myapp:/app -v C:/Users/<User>/.m2/repository:/root/.m2/repository test/scp mvn package -DskipTests`

Run Tomcat7:

`> docker run --rm -it -w /app -v C:/dev/github/myapp:/app -v C:/Users/<User>/.m2/repository:/root/.m2/repository -p 8080:8080 test/scp mvn tomcat7:run`

Open HANA DB tunnel:

`> docker run --rm -it -e "https_proxy=proxy:8080" -p 30015:30015 test/scp neo open-db-tunnel -h int.sap.hana.ondemand.com -u <User> -a ixxxxxxsapdev --id hanadb`

### Running Private Registry

Running:
`docker run -d -p 5000:5000 --restart always --name registry registry:2`

Tagging:
`docker tag test/jekyll localhost:5000/test/jekyll`

Pushing:
`docker push localhost:5000/test/jekyll`

### Running CloudFoundry CLI

`docker run -v /workspace -it diegoteam/cf-cli`

### Running Puppet

`docker run --rm -it -w /workspace -v C:/Users/C5235715/dockers/learning-puppet4:/workspace devopsil/puppet bash`

#### Running Maven

docker run --rm -it -w /workspace -v C:/dev/works/onlingo:/workspace -v C:/Users/C5235715/.m2/repository:/root/.m2/repository maven:3.5.0-jdk-8 mvn archetype:generate -DinteractiveMode=false -Dversion=1.0.0-SNAPSHOT -DgroupId=com.sample -DartifactId=my-car-service -DarchetypeGroupId=org.apache.olingo -DarchetypeArtifactId=olingo-odata2-sample-cars-annotation-archetype -DarchetypeVersion=2.0.0
