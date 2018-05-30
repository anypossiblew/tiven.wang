---
layout: post
theme: UbuntuMono
title: "Getting Started with Kubernetes"
excerpt: ""
modified: 2018-05-25T11:51:25-04:00
categories: articles
tags: [Kubernetes, Cloud]
image:
  vendor: twitter
  feature: /media/Dd0B9t9UQAAJuXN.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/998956854687485954
comments: true
share: true
references:
  - title: "Kubernetes Documentation"
    url: https://kubernetes.io/docs
---

* TOC
{:toc}

作为一个初学者，学习 Kubernetes 应该从哪里入手才更快捷和容易上手呐，本文带你寻找学习 Kubernetes 的资源。

首先可以选择的是 [Kubernetes 官方教程][kubernetes-tutorials]，里面有一种基于浏览器的交互式模拟命令行的学习工具，可以带你 Step-by-Step 地学习 Kubernetes 。这个工具是 [Katacoda][katacoda] 平台出的，所以你还可以到其官方网站 https://www.katacoda.com 查看 [Kubernetes Playground][katacoda-kubernetes] 教程和更多交互式学习和训练资源，包括 Docker, Machine Learning, Tensorflow 等。

很显然 Katacoda 这种学习工具是要以盈利为目的的，所以在免费使用上有所限制。如果你需要更加灵活更加有控制权的学习 Kubernetes 的话，那么还可以在本机安装 [Minikube][minikube] 来创建 Local Kubernetes cluster 。

## Minikube
首先安装 Kubernetes 客户端命令行工具 [kubectl][kubectl]，根据官方文档 [Install and Set Up kubectl][install-kubectl] 安装并检验 kubectl 命令行工具。
```
λ kubectl cluster-info
Kubernetes master is running at http://localhost:8080

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
Unable to connect to the server: dial tcp [::1]:8080: connectex: No connection could be made because the target machine actively refused it.
```
上面说明 kubectl 安装成功，但连接 Kubernetes master 服务失败，因为我们还没有在本机安装 Minikube .

根据文档 https://github.com/kubernetes/minikube 安装 Minikube ，然后检查
```
λ minikube version
minikube version: v0.27.0
```
启动它
```
λ minikube start
Starting local Kubernetes v1.10.0 cluster...
Starting VM...
Downloading Minikube ISO
 16.25 MB / 150.53 MB [====>-------------------------------------]  10.79% 3m26s
```
Minikube start 默认使用 VirtualBox 虚拟机工具来展现他的虚拟机节点，所以在此之前要安装 VirtualBox 。

> `minikube start` 可以添加参数 [`--vm-driver`](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md) 来指定所用的虚拟机驱动，例如在 Windows 系统上要使用 Hyper-v 来作为虚拟机可以使用命令 `minikube start --vm-driver hyperv --hyperv-virtual-switch "Primary Virtual Switch"` Primary Virtual Switch 是虚拟机网络适配器配置，需要事先创建好，可以参考 https://medium.com/@JockDaRock/minikube-on-windows-10-with-hyper-v-6ef0f4dc158c
Windows 上需要 administrator 运行命令，
`minikube start --help` 查看更多选项

> 可能是由于我所在的网络环境问题，我自己建的 Hyper-v Virtual Switch 不能用， `minikube start` 会停在 *Starting VM...* 这一步，应该是连不上网络的问题。我也尝试了其他各种方式都没能解决 Hyper-v VM 连网的问题。所以我选择尝试另外一种

> You can ssh into the VM by finding the IP (from kubectl config view) and using username "docker" password "tcuser":

## Kubernetes Cluster run on Docker Containers
如果你对 Docker 比较熟悉的话，也可以用 Docker containers 群来部署 Kubernetes 系统，但这种方式只适合用来做开发练习。虽然 Kubernetes 官方文档也不推荐这种方法，说由 Minikube 取代，参考 https://kubernetes-v1-4.github.io/docs/getting-started-guides/docker/ ，但在 Windows 上跑不起来 Minikube 的情况下不得不选择，也会增加你对 Kubernetes 组件的了解。


在运行 Kubernetes 的各服务如 API server, scheduler, controller 之前你需要一个存储 Kubernetes cluster 状态的服务，Kubernetes 使用了一种分布式 key-value 存储工具叫 [etcd][etcd]。用下面这样运行

```
docker run -d \
       --name=k8s \
       -p 8080:8080 \
       gcr.io/google_containers/etcd:3.1.10 \
       etcd --data-dir /var/lib/data
```

我在 Windows 10 平台运行此命令会出现错误: "etcdmain: listen tcp 10.29.96.18:2380: bind: cannot assign requested address"<br>
应该是 IP 地址 bug, 然后我在它的一些参数中手工指定 url 为 http://0.0.0.0:xxxx 这种形式

```
etcd --data-dir /var/lib/data \
     --initial-advertise-peer-urls=http://0.0.0.0:2380 \
     --listen-peer-urls http://0.0.0.0:2380 \
     --advertise-client-urls http://0.0.0.0:2379 \
     --listen-client-urls http://0.0.0.0:2379 \
     --initial-cluster default=http://0.0.0.0:2380
```

参考：

https://stackoverflow.com/questions/46193229/start-etcd-failed-by-bind-cannot-assign-requested-address

https://coreos.com/etcd/docs/3.2.9/op-guide/container.html#docker

下一步创建 API server , 使用 Docker image 叫 `hyperkube`, 它是在 Google Container Registry (GCR) 里的。
它是一个 all-in-one 的镜像，可以用它运行所有的 Kubernetes 服务。下面命令是创建一个 API server 服务容器

```
docker run -d \
       --net=container:k8s \
       gcr.io/google_containers/hyperkube:v1.7.11 \
       /apiserver --etcd-servers=http://127.0.0.1:2379 \
       --service-cluster-ip-range=10.0.0.1/24 \
       --insecure-bind-address=0.0.0.0 \
       --insecure-port=8080 \
       --admission-control=AlwaysAdmit
```

最后创建一个 controller manager 服务容器
```
docker run -d \
       --net=container:k8s \
       gcr.io/google_containers/hyperkube:v1.7.11 \
       /controller-manager --master=127.0.0.1:8080
```

`--net` 即 `--network` 参数赋值 `container:<name|id>` 的话表示该容器将重用指定容器的网络栈，也就是说他们可以用 `127.0.0.1` 相互访问对方，只不过他们的服务占用的端口号不同而已。参考 [Docker Network settings](https://docs.docker.com/engine/reference/run/#network-settings)

来测试一下我们的工作成果，，使用 etcd 容器中的 `etcdctl` 工具查看 etcd `/registry` 目录下的数据情况，可以看到一堆下面的数据
```
$ docker exec -ti k8s /bin/sh
/ # export ETCDCTL_API=3
/ # etcdctl get "/registry/api" --prefix=true
/registry/apiregistration.k8s.io/apiservices/v1.
{"kind":"APIService","apiVersion":"apiregistration.k8s.io/v1beta1","metadata":{"name":"v1.","selfLink":"/apis/apiregistration.k8s.io/v1beta1/apiservices/v1.","uid":"db6f6a11-63d2-11e8-9e1d-0242ac110002","creationTimestamp":"2018-05-30T06:29:51Z","labels":{"kube-aggregator.kubernetes.io/automanaged":"onstart"}},"spec":{"service":null,"version":"v1","caBundle":"","groupPriorityMinimum":18000,"versionPriority":1},"status":{"conditions":[{"type":"Available","status":"True","lastTransitionTime":"2018-05-30T06:29:51Z","reason":"Local","message":"Local APIServices are always available"}]}}
...
```

或者调用 API server 暴露出来的 API 查看效果
```
$ curl -s curl http://127.0.0.1:8080/api/v1 | more
{
  "kind": "APIResourceList",
  "groupVersion": "v1",
  "resources": [
    {
      "name": "bindings",
      "singularName": "",
      "namespaced": true,
      "kind": "Binding",
      "verbs": [
        "create"
      ]
    },
...
```

scheduler

```
docker run -d --net=container:k8s gcr.io/google_containers/hyperkube:v1.7.11 /scheduler --master=127.0.0.1:8080
```

以上基本上是跑起来了 Master Components，接下来就是创建多个 Node Components Node 然后连接加入到 Master Node 。

**kubelet** - An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.

> 但在用 Docker container 跑 kubelet 容器时又遇到了没解决的问题，kubelet 需要一个容器管理器，我尝试了 Windows 平台从 kubelet 的 Docker container 去连接主机的 Docker daemon，或者用 Docker-in-Docker 的方式去连接一个 Docker container 中的 Docker daemon 都没有试验成功。

我又发现 [Docker for Windows 18.02 CE Edge](https://docs.docker.com/docker-for-windows/kubernetes/) 支持了 Kubernetes





[kubernetes-tutorials]:https://kubernetes.io/docs/tutorials/
[minikube]:https://github.com/kubernetes/minikube
[kubectl]:https://kubernetes.io/docs/reference/kubectl/overview/
[etcd]:https://coreos.com/etcd/

[katacoda]:https://www.katacoda.com

[katacoda-kubernetes]:https://www.katacoda.com/courses/kubernetes/playground
[install-kubectl]:https://kubernetes.io/docs/tasks/tools/install-kubectl/
