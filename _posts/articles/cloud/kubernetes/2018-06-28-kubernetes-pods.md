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
  feature: /prettyearth/assets/full/2022.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/amherst-united-states-2022
comments: true
share: true
references:
  - id: 1
    title: "Docker tutorials - Network containers"
    url: https://docs.docker.com/engine/tutorials/networkingcontainers
  - id: 2
    title: "Mesosphere - Networking for Docker Containers (a Primer) Part I"
    url: https://mesosphere.com/blog/networking-docker-containers/
  - id: 3
    title: "Docker Community Forums - Shared network namespaces using –net=container:"
    url: https://forums.docker.com/t/shared-network-namespaces-using-net-container/16697
---

* TOC
{:toc}

[Kubernetes pod][kubernetes/pod-overview] 是部署在同一主机的一组[容器][linuxcontainers]。 如果你定义的 pod 里只有一个容器那么可以说此 pod 就是此容器。 既然要部署在一起，那么这组容器是要干点什么事情的。 他们在一起是要共享些什么，并且要一起生一起死。

Kubernetes pod 内的容器共享 Network Namespaces, Volumes and Resources limits。

想要理解共享的含义，让我们先来看一下用 Docker 怎么实现这样的共享。

## Docker Containers Shared Network Namespace
Docker 为容器提供了四种网络模式 bridge, none, container 和 host 。其中 container 模式就是提供容器间共享网络命名空间（Network Namespace）的模式。

还记得我们上一篇 [Kubernetes - Running First App on Kubernetes](/articles/kubernetes-running-first-app-on-kubernetes/) 在  [build docker image](/articles/kubernetes-running-first-app-on-kubernetes/#build-docker-image) 章节里创建了一个 Node.js 服务的 Docker 镜像，这里用它来做演示作为其中一个容器。用下面命令创建一个运行 Node.js server process 的容器

```
$ docker run --rm -d --name=node-server -p 80:80 tiven/kube-tiven
```
看到这里暴露的端口号是 `80` 不是 `8080`

另外一个容器使用 [nginx][docker/nginx] 作为 Node.js server 的前置反向代理服务器。首先创建一个 nginx 的配置文件内容如下

*default.conf*
```
server {
    listen       80;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```
此配置内容简单，监听在 `80` 端口，把所有请求代理到本机 `8080` 端口。再新建一个 Docker 镜像构建文件

*Dockerfile*
```
FROM nginx

ADD default.conf /etc/nginx/conf.d/default.conf
```
此配置文件含义是基于 nginx 默认最新镜像，使用我们建的配置文件替换掉原来默认带的配置文件。运行构建镜像，然后创建容器
```
$ docker build -t kube-nginx .
$ docker run --rm -d --name=nginx-web --network=container:node-server kube-nginx
```
可以看到 `--network=container:node-server` 参数说明此容器运行在基于现有容器 `node-server` 的网络上。

如下调用你运行 Docker 容器的主机的 `80` 端口，可以访问 Node.js server 进程
```
$ curl <host-ip>:80
You've hit 26316a133da7
```
查看两个容器详情，可以看到我们确实访问了 `26316a133da7` 这个容器上的进程
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
52aea5a754da        kube-nginx          "nginx -g 'daemon of…"   49 seconds ago      Up 10 seconds                                           nginx-web
26316a133da7        tiven/kube-tiven    "node app.js"            18 hours ago        Up 18 hours         0.0.0.0:80->80/tcp                  node-server
```
基于现有容器网络的 Docker 容器网络模式架构如下图所示，可以更好地理解 Docker 容器共用网络的整个交互过程

![](/images/cloud/kubernetes/docker-containers-networking.png)
{: .center.middle}

## Pods using pause
上面的容器共享网络模式有一些瑕疵，一些共享的属性（如端口号）放在哪个容器初始化都不合适。所以 Kubernetes Pod 使用了一个单独的容器作为 Pod 内其他容器的基础设施容器，如下
```
$ docker run --rm -d --name=pause -p 80:80 k8s.gcr.io/pause
```
`k8s.gcr.io/pause` 是 Kubernetes 的一个镜像，它基本为空，只作为共享基础设施用。我们把暴露的端口号设置在此容器上，然后运行其他的容器，如下
```
$ docker run --rm -d --name=node-server --network=container:pause tiven/kube-tiven
$ docker run --rm -d --name=nginx-web --network=container:pause kube-nginx
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
9e013c5f982c        kube-nginx          "nginx -g 'daemon of…"   2 minutes ago       Up 19 seconds                                           nginx-web
3a5db34a2373        tiven/kube-tiven    "node app.js"            2 minutes ago       Up 53 seconds                                           node-server
b788ed17093d        k8s.gcr.io/pause    "/pause"                 3 minutes ago       Up About a minute   0.0.0.0:80->80/tcp                  pause
$ curl <host-ip>
You've hit b788ed17093d
```
看到返回的结果是显示访问的 `b788ed17093d` 主机名，说明 `hostname` 也是共享的。
Kubernetes pod 的容器共享网络架构如下图所示

![](/images/cloud/kubernetes/kubernetes-pods-containers-networking.png)
{: .center.middle}

除了 network Kubernetes pod 内容器还共享另外两种设施进程命名空间([pid][docker/pid-settings])和进程间通信([ipc][docker/ipc-settings])，重新运行容器如下
```
$ docker run --rm -d --name=pause -p 80:80 k8s.gcr.io/pause
$ docker run --rm -d --name=node-server --network=container:pause --pid=container:pause --ipc=container:pause tiven/kube-tiven
$ docker run --rm -d --name=nginx-web --network=container:pause --pid=container:pause --ipc=container:pause kube-nginx
$ docker exec -it node-server bash
root@00d5a8ed906a:/# ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.1  0.0 265272   444 ?        Ssl  05:25   0:00 /pause
root         9  0.9  2.8 872872 28600 ?        Ssl  05:25   0:00 node app.js
root        20  0.4  0.4  32472  4948 ?        Ss   05:25   0:00 nginx: master p
systemd+    25  0.0  0.2  32952  2500 ?        S    05:25   0:00 nginx: worker p
root        26  1.0  0.2  20244  3012 pts/0    Ss   05:26   0:00 bash
root        31  0.0  0.2  17500  2060 pts/0    R+   05:26   0:00 ps aux
```
查看 `node-server` 容器内的进程可以看到三个容器的所有进程。


## Shared Volumes






[kubernetes/pod-overview]:https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/
[linuxcontainers]:https://linuxcontainers.org/
[docker/nginx]:https://hub.docker.com/_/nginx/

[docker/libnetwork]:https://github.com/docker/libnetwork
[netfilter]:https://netfilter.org/documentation/
[iptables]:https://netfilter.org/projects/iptables/index.html
[docker/pid-settings]:https://docs.docker.com/engine/reference/run/#pid-settings---pid
[docker/ipc-settings]:https://docs.docker.com/engine/reference/run/#ipc-settings---ipc

[Linux Network Namespace Introduction]:http://docker-k8s-lab.readthedocs.io/en/latest/docker/netns.html
[Linux Switching]:http://www.opencloudblog.com/?p=66
