---
layout: post
theme: UbuntuMono
title: "Getting Started with Kubernetes"
excerpt: ""
modified: 2018-05-25T11:51:25-04:00
categories: articles
tags: [Minikube, Kubernetes, Cloud]
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
  - title: "Hello Minikube"
    url: https://kubernetes.io/docs/tutorials/hello-minikube
---

* TOC
{:toc}

作为一个初学者，学习 [Kubernetes][kubernetes] 应该从哪里入手才更快捷和容易上手呐，本文带你寻找学习 Kubernetes 的资源。

首先可以选择的是 [Kubernetes 官方教程][kubernetes-tutorials]，里面有一种基于浏览器的交互式模拟命令行的学习工具，可以带你 Step-by-Step 地学习 Kubernetes 。这个工具是 [Katacoda][katacoda] 平台出的，所以你还可以到其官方网站 [https://www.katacoda.com][katacoda] 查看 [Kubernetes Playground][katacoda-kubernetes] 教程和更多交互式学习和训练资源，包括 Docker, Machine Learning, Tensorflow 等。

很显然 Katacoda 这种学习工具是要以盈利为目的的，所以在免费使用上有所限制。如果你需要更加灵活更加有控制权的学习 Kubernetes 的话，那么还可以在本机安装 [Minikube][minikube] 来创建 Local Kubernetes cluster 。

## Install Kubernetes Locally
### Minikube
首先安装 Kubernetes 客户端命令行工具 [kubectl][kubectl]，根据官方文档 [Install and Set Up kubectl][install-kubectl] 安装并检验 kubectl 命令行工具。
```
λ kubectl cluster-info
Kubernetes master is running at http://localhost:8080

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
Unable to connect to the server: dial tcp [::1]:8080: connectex: No connection could be made because the target machine actively refused it.
```
上面说明 kubectl 安装成功，但连接 Kubernetes master 服务失败，因为我们还没有在本机安装 Minikube .

根据文档 [https://github.com/kubernetes/minikube][minikube] 安装 Minikube ，然后检查
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
Minikube start 命令默认使用 [VirtualBox][virtualbox] 虚拟机工具来展现他的虚拟机节点，所以在此之前要安装 VirtualBox 。

> `minikube start` 可以添加参数 [`--vm-driver`](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md) 来指定所用的虚拟机驱动，例如在 Windows 系统上要使用 Hyper-v 来作为虚拟机可以使用命令 `minikube start --vm-driver hyperv --hyperv-virtual-switch "Primary Virtual Switch"` Primary Virtual Switch 是虚拟机网络适配器配置，需要事先创建好，可以参考 [Medium - Minikube on Windows 10 with Hyper-V](https://medium.com/@JockDaRock/minikube-on-windows-10-with-hyper-v-6ef0f4dc158c) ；<br>
Windows 上需要 administrator 权限运行命令，还要在原始 CMD 窗口运行；
`minikube start --help` 查看更多选项

> 可能是由于我所在的网络环境问题，我自己建的 Hyper-v Virtual Switch 不能用， `minikube start` 会停在 *Starting VM...* 这一步，应该是连不上网络的问题。我也尝试了其他各种方式都没能解决 Hyper-v VM 连网的问题。所以我选择尝试另外一种 [Kubernetes Cluster run on Docker Containers](#kubernetes-cluster-run-on-docker-containers)

> 绕了一圈，回头我换了一个无线网络连接就成功了，看来还是网络问题（对于 Windows Hyper-v 环境来说的）。也有可能是我原来的网络在 proxy 后面，设置代理会行，但没有试
`minikube start --vm-driver hyperv --hyperv-virtual-switch "Primary Virtual Switch" --docker-env HTTP_PROXY=http://your-http-proxy-host:your-http-proxy-port  --docker-env HTTPS_PROXY=http(s)://your-https-proxy-host:your-https-proxy-port
`

继续，Minikube start 完成后会自动把 `kubectl` 工具指向此 cluster
```
λ minikube start --vm-driver hyperv --hyperv-virtual-switch "Primary Virtual Switch"
Starting local Kubernetes v1.10.0 cluster...
Starting VM...
Getting VM IP address...
Moving files into cluster...
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```
我们使用 `kubectl get nodes` 来检查一下安装成果
```
λ kubectl get nodes
NAME       STATUS    ROLES     AGE       VERSION
minikube   Ready     master    1m        v1.10.0
```

你可以在 Hyper-V Manager 程序（如果你是使用的 Windows 平台）或者 Oracle VM VirtualBox 里看到有一个名叫 **_minikube_** 的虚拟机被创建了。它就是 Minikube 为了运行 Kubernetes 在 Local 创建的模拟实际环境的虚拟机。

> You can ssh into the VM by finding the IP (from `kubectl config view`) and using username "docker" password "tcuser":

如果觉得虚拟机太慢想要增大配置或者想要换一个 Kubernetes version，可以在创建时指定一些参数

```
> minikube start --cpus=4 --memory=4000 --kubernetes-version=v1.7.2
```

#### Docker in Minikube
Minikube 首先创建一个虚拟机，然后在虚拟机里安装了 Docker ，然后用 Docker containers 部署了整个 Kubernetes platform 。所以通过以下方式可以查看虚拟机里 Docker 里容器的情况：

* 首先获取 Minikube 虚拟机里的 Docker daemon 环境变量
  ```
  > minikube docker-env
  SET DOCKER_TLS_VERIFY=1
  SET DOCKER_HOST=tcp://10.207.217.65:2376
  SET DOCKER_CERT_PATH=C:\Users\tiven\.minikube\certs
  SET DOCKER_API_VERSION=1.23
  REM Run this command to configure your shell:
  REM @FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i
  ```
* 然后 copy 并运行这段输出，这样就为 Docker CLI 设置了连接环境变量
* 这样便可以使用 Docker CLI 查看 Minikube 虚拟机里的 Docker daemon 了
  ```
  λ docker ps
  CONTAINER ID        IMAGE                                      COMMAND                  CREATED             STATUS              PORTS               NAMES
  7d5cefcca3b5        k8s.gcr.io/k8s-dns-sidecar-amd64           "/sidecar --v=2 --lo…"   19 minutes ago      Up 19 minutes                           k8s_sidecar_kube-dns-86f4d74b45-gjfpv_kube-system_aa91872d-647d-11e8-9274-00155d4b0177_0
  f2004d188ce0        k8s.gcr.io/k8s-dns-dnsmasq-nanny-amd64     "/dnsmasq-nanny -v=2…"   19 minutes ago      Up 19 minutes                           k8s_dnsmasq_kube-dns-86f4d74b45-gjfpv_kube-system_aa91872d-647d-11e8-9274-00155d4b0177_0
  ff7f08a048bb        gcr.io/k8s-minikube/storage-provisioner    "/storage-provisioner"   19 minutes ago      Up 19 minutes                           k8s_storage-provisioner_storage-provisioner_kube-system_b65638bf-647d-11e8-9274-00155d4b0177_0
  7a94031a9af5        k8s.gcr.io/kubernetes-dashboard-amd64      "/dashboard --insecu…"   20 minutes ago      Up 20 minutes                           k8s_kubernetes-dashboard_kubernetes-dashboard-5498ccf677-qjjcn_kube-system_b58600f7-647d-11e8-9274-00155d4b0177_0
  946b9db8cceb        k8s.gcr.io/k8s-dns-kube-dns-amd64          "/kube-dns --domain=…"   20 minutes ago      Up 20 minutes                           k8s_kubedns_kube-dns-86f4d74b45-gjfpv_kube-system_aa91872d-647d-11e8-9274-00155d4b0177_0
  5eeab4d02c4e        k8s.gcr.io/kube-proxy-amd64                "/usr/local/bin/kube…"   21 minutes ago      Up 21 minutes                           k8s_kube-proxy_kube-proxy-hhc8s_kube-system_aa6ad921-647d-11e8-9274-00155d4b0177_0
  0475d408d01a        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 21 minutes ago      Up 21 minutes                           k8s_POD_storage-provisioner_kube-system_b65638bf-647d-11e8-9274-00155d4b0177_0
  f2515cb58dfa        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 21 minutes ago      Up 21 minutes                           k8s_POD_kubernetes-dashboard-5498ccf677-qjjcn_kube-system_b58600f7-647d-11e8-9274-00155d4b0177_0
  1c6de5875887        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 21 minutes ago      Up 21 minutes                           k8s_POD_kube-dns-86f4d74b45-gjfpv_kube-system_aa91872d-647d-11e8-9274-00155d4b0177_0
  d8912efc149c        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 21 minutes ago      Up 21 minutes                           k8s_POD_kube-proxy-hhc8s_kube-system_aa6ad921-647d-11e8-9274-00155d4b0177_0
  c38e7a5c044c        af20925d51a3                               "kube-apiserver --ad…"   22 minutes ago      Up 22 minutes                           k8s_kube-apiserver_kube-apiserver-minikube_kube-system_f501726901f29fd9d27ab8139f4a5539_1
  b5ef240f0d44        k8s.gcr.io/etcd-amd64                      "etcd --advertise-cl…"   22 minutes ago      Up 22 minutes                           k8s_etcd_etcd-minikube_kube-system_43a96417126e0f81ad559d1b9ce6879e_0
  c3fcc721d935        k8s.gcr.io/kube-scheduler-amd64            "kube-scheduler --ad…"   22 minutes ago      Up 22 minutes                           k8s_kube-scheduler_kube-scheduler-minikube_kube-system_31cf0ccbee286239d451edb6fb511513_0
  095fd5c179ad        k8s.gcr.io/kube-controller-manager-amd64   "kube-controller-man…"   23 minutes ago      Up 23 minutes                           k8s_kube-controller-manager_kube-controller-manager-minikube_kube-system_3a02eb099edcae526ad37ec9b3064ee9_0
  901f16e2f053        k8s.gcr.io/kube-addon-manager              "/opt/kube-addons.sh"    24 minutes ago      Up 24 minutes                           k8s_kube-addon-manager_kube-addon-manager-minikube_kube-system_3afaf06535cc3b85be93c31632b765da_0
  35551083d49e        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 24 minutes ago      Up 24 minutes                           k8s_POD_kube-scheduler-minikube_kube-system_31cf0ccbee286239d451edb6fb511513_0
  27bd26b86652        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 24 minutes ago      Up 24 minutes                           k8s_POD_etcd-minikube_kube-system_43a96417126e0f81ad559d1b9ce6879e_0
  dfdf30f66693        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 24 minutes ago      Up 24 minutes                           k8s_POD_kube-apiserver-minikube_kube-system_f501726901f29fd9d27ab8139f4a5539_0
  2f423184b417        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 24 minutes ago      Up 24 minutes                           k8s_POD_kube-addon-manager-minikube_kube-system_3afaf06535cc3b85be93c31632b765da_0
  f97816600571        k8s.gcr.io/pause-amd64:3.1                 "/pause"                 24 minutes ago      Up 24 minutes                           k8s_POD_kube-controller-manager-minikube_kube-system_3a02eb099edcae526ad37ec9b3064ee9_0
  ```

#### Minikube Commands
你还可以使用 `minikube ssh` 登录到虚拟机，便于查看和操作它，例如查看虚拟机里面 Docker 容器情况。
```
> minikube ssh
                         _             _
            _         _ ( )           ( )
  ___ ___  (_)  ___  (_)| |/')  _   _ | |_      __
/' _ ` _ `\| |/' _ `\| || , <  ( ) ( )| '_`\  /'__`\
| ( ) ( ) || || ( ) || || |\`\ | (_) || |_) )(  ___/
(_) (_) (_)(_)(_) (_)(_)(_) (_)`\___/'(_,__/'`\____)

$ docker info
Containers: 22
 Running: 20
 Paused: 0
 Stopped: 2
Images: 12
Server Version: 17.12.1-ce
...
```

`minikube ip` 可以得到 Minikube VM 的 IP 地址。

在部署 Minikube 的过程中难免会失败或不稳定，重来，停止 `minikube stop` 删除 `minikube delete` 重新创建 `minikube start`，这个过程做到腻。

最后打开 [Kubernetes 管理界面 Dashboard][kubernetes-dashboard]
```
> minikube dashboard
Opening kubernetes dashboard in default browser...
```

### Deploy Kubernetes Cluster on Docker Containers Manually
//[**跳过**](#first-application)

如果你对 [Docker][docker] 比较熟悉的话，也可以用 Docker containers 群来部署 Kubernetes 系统，但这种方式只适合用来做开发练习。虽然 Kubernetes 官方文档也不推荐这种方法，说由 Minikube 取代，参考 https://kubernetes-v1-4.github.io/docs/getting-started-guides/docker/ ，但在 Windows 上跑不起来 Minikube 的情况下不得不选择，也会增加你对 Kubernetes 组件的了解。


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

### Kubernetes in Docker for Windows CE Edge
我又发现 [Docker for Windows 18.02 CE Edge](https://docs.docker.com/docker-for-windows/kubernetes/) 支持了 [Kubernetes](https://www.docker.com/kubernetes) 。
但并没有成功启动它。

把 Docker 软件 *Reset to factory defaults...* 后重新 *Enable Kubernetes* 成功了。

https://www.hanselman.com/blog/HowToSetUpKubernetesOnWindows10WithDockerForWindowsAndRunASPNETCore.aspx

## First Application
Minikube 版的 Kubernetes 已经安装好了，现在就来部署我们的第一个应用吧。

我们来部署一个微博客服务 [Ghost][ghost]，因为它有现成的 Docker Image
```
> kubectl run ghost --image=ghost:0.9
deployment "ghost" created
> kubectl get pods
NAME                     READY     STATUS              RESTARTS   AGE
ghost-69f785b66c-bxh6f   0/1       ContainerCreating   0          2m
> docker ps
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS               NAMES
3e2851fd3e45        k8s.gcr.io/pause-amd64:3.1   "/pause"                 3 minutes ago       Up 3 minutes                            k8s_POD_ghost-69f785b66c-bxh6f_default_8de23638-64ab-11e8-9d1b-00155d4b0178_0
```
运行了部署 ghost 命令后查看 Kubernetes 状态的变化，会发现多了一个 pod 状态是 `ContainerCreating`，还多了一个 Docker container 叫 `k8s_POD_ghost-...`;

继续暴露此部署成服务
```
> kubectl expose deployments ghost --port=2368 --type=NodePort
service "ghost" exposed
> kubectl get pods
NAME                     READY     STATUS    RESTARTS   AGE
ghost-69f785b66c-bxh6f   1/1       Running   0          13m
> minikube service ghost
Opening kubernetes service default/ghost in default browser...
```
`minikube service ghost` 命令会在浏览器中打开指定服务的地址。这里可能需要等待 Docker container 创建完成，也用 `kubectl get pods` 可以查看 pods 的运行状态，当为 `Running` 时说明启动完成。

更多相关情况可以使用 `minikube dashboard` 查看 Kubernetes Dashboard ，你会发现在 namespace `default` 下新增了 [ghost][ghost] 相关的 Deployment, Pod, Replica Set, Service 。



## Conclusion

绕了一圈，觉得如果只是想入门的话，还是老老实实从官方教程里的交互式命令行演示开始学习吧。




[kubernetes]:https://kubernetes.io/
[kubernetes-tutorials]:https://kubernetes.io/docs/tutorials/
[minikube]:https://github.com/kubernetes/minikube
[kubectl]:https://kubernetes.io/docs/reference/kubectl/overview/
[etcd]:https://coreos.com/etcd/

[katacoda]:https://www.katacoda.com
[virtualbox]:https://www.virtualbox.org/
[docker]:https://www.docker.com/

[katacoda-kubernetes]:https://www.katacoda.com/courses/kubernetes/playground
[install-kubectl]:https://kubernetes.io/docs/tasks/tools/install-kubectl/
[kubernetes-dashboard]:https://github.com/kubernetes/dashboard

[ghost]:https://ghost.org/
