---
layout: post
theme: UbuntuMono
title: "Kubernetes - Pods"
excerpt: "Kubernetes Pods."
modified: 2018-06-28T11:51:25-04:00
categories: articles
tags: [Kubernetes, Cookbook, Cloud]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6491.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/timbuktu-mali-6491
comments: true
share: true
references:
  - id: 1
    title: "Docker tutorials - Network containers"
    url: https://docs.docker.com/engine/tutorials/networkingcontainers
  - id: 2
    title: "Mesosphere - Networking for Docker Containers (a Primer) Part I"
    url: https://mesosphere.com/blog/networking-docker-containers/
---

<style>
.blog__post.demo-blog__posts.mdl-grid .mdl-card .mdl-card__media h3 {
  color: maroon;
}
</style>

* TOC
{:toc}

[Kubernetes pod][kubernetes/pod-overview] 是部署在同一主机的一组[容器][linuxcontainers]。 如果你定义的 pod 里只有一个容器那么可以说此 pod 就是此容器。 既然要部署在一起，那么这组容器是要干点什么事情的。 他们在一起是要共享些什么，并且要一起生一起死。

Kubernetes pod 内的容器共享 Network Namespaces, Volumes and Resources limits。

想要理解共享的含义，让我们先来看一下用 Docker 怎么实现这样的共享。

## Docker Containers Shared Network Namespace
Docker 为容器提供了四种网络模式 bridge, none, container 和 host 。其中 container 模式就是提供容器间共享网络命名空间（Network Namespace）的模式。

[build docker image](/articles/kubernetes-running-first-app-on-kubernetes/#build-docker-image)


```
$ docker run --rm -d --name=node-server -p 80:80 tiven/kube-tiven
$ docker run --rm -d --name=nginx-web -v ~/k82/conf.d/default.conf:/etc/nginx/conf.d/default.conf --net=container:node-server nginx
```

```
server {
    listen       80;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```


SkyDNS

https://forums.docker.com/t/shared-network-namespaces-using-net-container/16697

docker0 bridge 与 Linux iptables NAT






[kubernetes/pod-overview]:https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/
[linuxcontainers]:https://linuxcontainers.org/

[docker/libnetwork]:https://github.com/docker/libnetwork
[netfilter]:https://netfilter.org/documentation/
[iptables]:https://netfilter.org/projects/iptables/index.html


[Linux Network Namespace Introduction]:http://docker-k8s-lab.readthedocs.io/en/latest/docker/netns.html
[Linux Switching]:http://www.opencloudblog.com/?p=66
