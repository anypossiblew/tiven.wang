---
layout: post
theme: UbuntuMono
title: "Kubernetes - Add Additional Nodes To Existing Cluster"
excerpt: "Learn how to add additional nodes to a Kubernetes cluster. This allows you to start exploring scaling and scheduling approaches of Kubernetes. In future scenarios we'll use this foundation to simulate network errors and application errors that may occur in a distributed system."
modified: 2018-06-08T11:51:25-04:00
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
  - title: "Katacoda: Kubernetes - Add Additional Nodes To Existing Cluster"
    url: https://www.katacoda.com/courses/kubernetes/add-additional-nodes-to-cluster
---

* TOC
{:toc}

```
PS C:\Users\tiven> minikube ssh
                         _             _
            _         _ ( )           ( )
  ___ ___  (_)  ___  (_)| |/')  _   _ | |_      __
/' _ ` _ `\| |/' _ `\| || , <  ( ) ( )| '_`\  /'__`\
| ( ) ( ) || || ( ) || || |\`\ | (_) || |_) )(  ___/
(_) (_) (_)(_)(_) (_)(_)(_) (_)`\___/'(_,__/'`\____)

$ sudo kubeadm token create --print-join-command
kubeadm join 10.59.176.211:8443 --token mceq67.bit1jg2iafbz8xjv --discovery-token-ca-cert-hash sha256:c870fa8cf3ef944e0d695655604110debeef650ed78f4d07ef83f3442825cb46
```

## VM as Kube Node
现在就创建一个虚拟机作为 Kubernetes Cluster 新的 Node 主机。
下载 ubuntu server 镜像 https://www.ubuntu.com/download/server

然后在 Hyper-V Manager 中创建一个虚拟机并安装此 ubuntu server 镜像。

> 我本来想用 `docker-machine` 命令工具创建的虚拟机作为 Kubernetes Cluster 节点主机的，但 Docker Machine 创建的虚拟机是使用 boot2docker linux 系统，不符合 Kubernetes 集群节点主机的要求，连 `apt-get` 命令工具都没有，所以还是下载个 ubuntu server 创建虚拟机吧。minikube 使用的是 embedded Linux Distribution ([Buildroot][buildroot]) 作虚拟机系统，你也可以尝试使用 [Buildroot][buildroot] 创建虚拟机。

安装好虚拟机 ubuntu server 系统后使用 Hyper-V connect 登录虚拟机系统或者使用 PuTTY 这种 ssh 工具登录（使用 PuTTY 工具更好，对编辑终端命令支持好一些）。

根据 https://kubernetes.io/docs/tasks/tools/install-kubeadm/ 教程安装 kubelet kubeadm kubectl 工具。

```
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
```

> 如果你依照步骤操作了，仍然遇到错误<br>
E: Unable to locate package kubelet<br>
E: Unable to locate package kubeadm<br>
E: Unable to locate package kubectl<br>
则可能跟我一样安装的是 32bit 的 ubuntu server 系统，因为 Docker 只支持 64bit 系统，所以 Kubernetes 要安装在 64bit 系统上，所以重新下载个 ubuntu server amd64 iso 安装虚拟机。

然后在虚拟机里安装 Docker
```
apt-get update
apt-get install -y docker.io
```

然后就可以执行 master node 上给的命令，把此虚拟机节点加入 Kubernetes Cluster 了
```
kubeadm join 10.59.176.211:8443 --token mceq67.bit1jg2iafbz8xjv --discovery-token-ca-cert-hash sha256:c870fa8cf3ef944e0d695655604110debeef650ed78f4d07ef83f3442825cb46
```

如果遇到下面错误说明你需要执行 `swapoff -a`
```
[ERROR Swap]: running with swap on is not supported. Please disable swap
```
如果出现下面错误，那就照做 `systemctl enable docker.service`
```
[WARNING Service-Docker]: docker service is not enabled, please run 'systemctl enable docker.service'
```



https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/


[buildroot]:https://buildroot.org/
