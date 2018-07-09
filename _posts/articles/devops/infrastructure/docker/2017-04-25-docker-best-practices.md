---
layout: post
title: Docker Best Practices
excerpt: "Docker Best Practices"
modified: 2017-04-25T17:00:00-00:00
categories: articles
tags: [Docker, Infrastructure as Code, CI/CD]
image:
  vendor: unsplash
  feature: /photo-1430026996702-608b84ce9281?dpr=1.5&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
  credit: Lucas Alexander
  creditlink: https://unsplash.com/@lucasalexander
comments: true
share: true
references:
---

> [犀牛](https://en.wikipedia.org/wiki/Rhinoceros) 在犀类的后代中，现仅残存有犀牛科的4属5种，主要分布在亚洲和非洲，其中分布在亚洲的犀牛已经濒临绝种，非洲犀牛因为还有保护措施尚有族群。主要是因为犀牛角作为药材获利不菲，现行非洲犀牛角主要由养殖者所提供。南非养殖者会将犀牛角砍下，等待约一年半后再度收成，而部分盗猎者会将犀牛直接杀死取角，随盗猎导致数量减少，现在也不容易买到真正的犀牛角，现在商贩还懂得以牛羊的蛋白质部位替代来获利，甚至用相似成分的猫狗爪磨成假货变换充数。
{: .Warning}

* TOC
{:toc}

## Basic Operations
### Login Docker CLI

`docker login`

### Cleaning Up Stopped Containers

`$ docker rm -v $(docker ps -aq -f status=exited)`

`> docker rm -v (docker ps -aq -f status=exited)`

### Accessing host machine from within docker container

Run docker container with option:

`docker run --net=host ...` or `docker run --network host ...`

Within the container to get the IP of the host:

`route | awk '/^default/ { print $2 }'` or `ip route | awk '/^default/ { print $3 }'`

[stackoverflow.com - Let two Containers getting linked to eachother
](https://stackoverflow.com/questions/27563460/let-two-containers-getting-linked-to-eachother)

**Or**

Add entries to container hosts file ([--add-host](https://docs.docker.com/engine/reference/commandline/run/#add-entries-to-container-hosts-file-add-host)):

`docker run --add-host="docker:10.0.75.1"`

Example:

`docker run --add-host=docker:10.0.75.1 --rm -it byrnedo/alpine-curl -H "Accept: application/json" docker:8080/uaa/login`

[Accessing host machine from within docker container](https://forums.docker.com/t/accessing-host-machine-from-within-docker-container/14248)

**Or**

In docker-compose use [network_mode](https://docs.docker.com/compose/compose-file/#network_mode): "host"

And alse need [extra_hosts](https://docs.docker.com/compose/compose-file/#extra_hosts) when you get error
```
extra_hosts:
  - "moby:127.0.0.1"
```

> **extra_hosts** <br>
> Add hostname mappings. Use the same values as the docker client `--add-host` parameter.
>
```
extra_hosts:
  - "somehost:162.242.195.82"
  - "otherhost:50.31.209.229"
```
> An entry with the ip address and hostname will be created in `/etc/hosts` inside containers for this service, e.g:
```
162.242.195.82  somehost
50.31.209.229   otherhost
```
{: .Quotes}

[Docker Machine – moby: Name or service not known](http://blog.yohanliyanage.com/2016/09/docker-machine-moby-name-or-service-not-known/)

### Container Proxy

```
docker run -e "http_proxy=http://myproxy.example.com:8080" \
           -e "https_proxy=https://myproxy.example.com:8080" \
           ...
```

### How to get a Docker container's IP address from the host?

{% raw %}
`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container name or id>`
{% endraw %}

`docker inspect <container name or id> | grep "IPAddress"`

## Configuration

### Docker Daemon Proxy

1. Create a systemd drop-in directory for the docker service:

  `$ sudo mkdir -p /etc/systemd/system/docker.service.d`

2. Create a file called `/etc/systemd/system/docker.service.d/http-proxy.conf` that adds the **HTTP_PROXY** environment variable:

  ```
  [Service]
  Environment="HTTP_PROXY=http://proxy.example.com:80/" "NO_PROXY=localhost,127.0.0.1"
  ```
  or 
  ```
  $ cat <<EOF >/etc/systemd/system/docker.service.d/http-proxy.conf
  [Service]
  Environment="HTTP_PROXY=http://proxy.example.com:80/" "NO_PROXY=localhost,127.0.0.1"
  EOF
  ```
  If you are behind an HTTPS proxy server
  ```
  $ cat <<EOF >/etc/systemd/system/docker.service.d/https-proxy.conf
  [Service]
  Environment="HTTPS_PROXY=https://proxy.example.com:443/" "NO_PROXY=localhost,127.0.0.1"
  EOF
  ```

3. Flush changes:

  `$ sudo systemctl daemon-reload`

4. Restart Docker:

  `$ sudo systemctl restart docker`

5. Verify that the configuration has been loaded:

  ```
  $ systemctl show --property=Environment docker
  Environment=HTTP_PROXY=http://proxy.example.com:80/
  ```

[Docker daemon proxy config with systemd](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy)


## Run
### Running Nodejs

`$ docker run -it --rm --name my-running-script -v "$PWD":/usr/src/app -w /usr/src/app node node your-daemon-or-script.js`

`> docker run -it --rm --name my-running-script -v "%cd%":/usr/src/app -w /usr/src/app node npm install`

`> docker run -it --rm --name my-running-script -v "%cd%":/usr/src/app -w /usr/src/app -p 6001:6001 node node router.js`

### Running Jekyll

`docker run --rm -e "JEKYLL_ENV=docker" -v ${PWD}:/srv/jekyll -v ${PWD}/_bundle:/usr/local/bundle -p 4000:4000 -it jekyll/jekyll jekyll serve --config  _config.yml,_config.docker.yml`

> The above command line is for PowerShell. For Windows Command Line (cmd), replace `${PWD}` with `%cd%`.
{: .Notes}

*_config.docker.yml*
```yaml
url: "http://localhost:4000"
```

https://tonyho.net/jekyll-docker-windows-and-0-0-0-0/

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

### Running Maven

`docker run --rm -it -w /workspace -v C:/dev/works/onlingo:/workspace -v C:/Users/C5235715/.m2/repository:/root/.m2/repository maven:3.5.0-jdk-8 mvn archetype:generate -DinteractiveMode=false -Dversion=1.0.0-SNAPSHOT -DgroupId=com.sample -DartifactId=my-car-service -DarchetypeGroupId=org.apache.olingo -DarchetypeArtifactId=olingo-odata2-sample-cars-annotation-archetype -DarchetypeVersion=2.0.0`

### Running RabbitMQ

[rabbitmq](https://hub.docker.com/_/rabbitmq/)

`$ docker run -d --hostname my-rabbit --name some-rabbit rabbitmq:3`

## Issues

### "New state of 'nil' is invalid"
Ah right, I get it now. Have verified just now that this is still an issue on docker master, but only when using the legacy (go-ansiterm emulated) console. Which means on any version of Windows before Windows 10, or Windows 10 with the console explicitly set to legacy mode.  MC does run just fine on a Windows 10 client (with console in native/default mode) pointing to a Linux daemon:

> Recommend: [ConEmu](https://conemu.github.io/) with PowerShell on Windows
{: .Tips}

["New state of 'nil' is invalid" when attaching to container, probably related to UTF-8](https://github.com/moby/moby/issues/22345)
