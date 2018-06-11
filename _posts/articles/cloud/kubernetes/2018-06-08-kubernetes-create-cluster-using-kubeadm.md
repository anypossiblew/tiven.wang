---
layout: post
theme: UbuntuMono
title: "Kubernetes - Create cluster using kubeadm"
excerpt: "Learn how to add additional nodes to a Kubernetes cluster. This allows you to start exploring scaling and scheduling approaches of Kubernetes. In future scenarios we'll use this foundation to simulate network errors and application errors that may occur in a distributed system."
modified: 2018-06-08T11:51:25-04:00
categories: articles
tags: [Kubeadm, Kubernetes, Cloud]
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

## VM as Kube Node
现在就创建一个虚拟机作为 Kubernetes Cluster 新的 Node 主机。Kubernetes 节点主机支持不同的 Linux 系统，只要可以安装相关软件。为了大众化我们选择 Ubuntu server 系统，下载 Ubuntu server 镜像 [https://www.ubuntu.com/download/server](https://www.ubuntu.com/download/server)

然后在 Hyper-V Manager 中创建一个虚拟机并安装此 Ubuntu server 镜像。

> 我本来想用 `docker-machine` 命令工具创建的虚拟机作为 Kubernetes Cluster 节点主机的，但 Docker Machine 创建的虚拟机是使用 boot2docker linux 系统，不符合 Kubernetes 集群节点主机的要求，连 `apt-get` 命令工具都没有，所以还是下载个 ubuntu server 创建虚拟机吧。minikube 使用的是 embedded Linux Distribution ([Buildroot][buildroot]) 作虚拟机系统，你也可以尝试使用 [Buildroot][buildroot] 创建虚拟机。

> 手工安装 ubuntu server 系统并不简单，有很多步骤需要选择和操作。应该有相应的自动化命令行工具做这种事情。


安装好虚拟机 Ubuntu server 系统后使用 Hyper-V connect 登录虚拟机系统或者使用 [PuTTY][putty] 这种 ssh 工具登录（使用 PuTTY 工具更好，对编辑终端命令支持好一些）。

### Install kubeadm
虚拟机准备好了，接下来就可以在他上面安装 Kubernetes master 节点所需软件和创建集群了，根据 [https://kubernetes.io/docs/tasks/tools/install-kubeadm/](https://kubernetes.io/docs/tasks/tools/install-kubeadm/) 教程安装 Docker, kubelet, kubeadm 和 kubectl 工具。我们是 Ubuntu 系统，所以使用以下命令（使用`sudo -i`进入 root 权限模式）安装：

* 在虚拟机里安装 Docker
```
apt-get update
apt-get install -y docker.io
```

* 安装 kubelet kubeadm kubectl
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

### Configure cgroup driver used by kubelet on Master Node
// 不确定什么情况下需要做这步
```
root@kubemaster:~# cat /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_SYSTEM_PODS_ARGS=--pod-manifest-path=/etc/kubernetes/manifests --allow-privileged=true"
Environment="KUBELET_NETWORK_ARGS=--network-plugin=cni --cni-conf-dir=/etc/cni/net.d --cni-bin-dir=/opt/cni/bin"
Environment="KUBELET_DNS_ARGS=--cluster-dns=10.96.0.10 --cluster-domain=cluster.local"
Environment="KUBELET_AUTHZ_ARGS=--authorization-mode=Webhook --client-ca-file=/etc/kubernetes/pki/ca.crt"
Environment="KUBELET_CADVISOR_ARGS=--cadvisor-port=0"
Environment="KUBELET_CERTIFICATE_ARGS=--rotate-certificates=true --cert-dir=/var/lib/kubelet/pki"
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_CERTIFICATE_ARGS $KUBELET_EXTRA_ARGS
root@kubemaster:~# docker info | grep -i cgroup
Cgroup Driver: cgroupfs
WARNING: No swap limit support
```

```
root@kubemaster:~# sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g" /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
root@kubemaster:~# cat /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_SYSTEM_PODS_ARGS=--pod-manifest-path=/etc/kubernetes/manifests --allow-privileged=true"
Environment="KUBELET_NETWORK_ARGS=--network-plugin=cni --cni-conf-dir=/etc/cni/net.d --cni-bin-dir=/opt/cni/bin"
Environment="KUBELET_DNS_ARGS=--cluster-dns=10.96.0.10 --cluster-domain=cluster.local"
Environment="KUBELET_AUTHZ_ARGS=--authorization-mode=Webhook --client-ca-file=/etc/kubernetes/pki/ca.crt"
Environment="KUBELET_CADVISOR_ARGS=--cadvisor-port=0"
Environment="KUBELET_CERTIFICATE_ARGS=--rotate-certificates=true --cert-dir=/var/lib/kubelet/pki"
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_CERTIFICATE_ARGS $KUBELET_EXTRA_ARGS
```

Then restart kubelet:
```
systemctl daemon-reload
systemctl restart kubelet
```

### Create Cluster
https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/

#### Initializing your master
The master is the machine where the control plane components run, including etcd (the cluster database) and the API server (which the kubectl CLI communicates with).

```
root@kubemaster:~# kubeadm init
[init] Using Kubernetes version: v1.10.4
[init] Using Authorization modes: [Node RBAC]
[preflight] Running pre-flight checks.
        [WARNING SystemVerification]: docker version is greater than the most recently validated version. Docker version: 17.12.1-ce. Max validated version: 17.03
        [WARNING FileExisting-crictl]: crictl not found in system path
Suggestion: go get github.com/kubernetes-incubator/cri-tools/cmd/crictl
[preflight] Starting the kubelet service
[certificates] Generated ca certificate and key.
[certificates] Generated apiserver certificate and key.
[certificates] apiserver serving cert is signed for DNS names [kubemaster kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 172.20.84.213]
[certificates] Generated apiserver-kubelet-client certificate and key.
[certificates] Generated etcd/ca certificate and key.
[certificates] Generated etcd/server certificate and key.
[certificates] etcd/server serving cert is signed for DNS names [localhost] and IPs [127.0.0.1]
[certificates] Generated etcd/peer certificate and key.
[certificates] etcd/peer serving cert is signed for DNS names [kubemaster] and IPs [172.20.84.213]
[certificates] Generated etcd/healthcheck-client certificate and key.
[certificates] Generated apiserver-etcd-client certificate and key.
[certificates] Generated sa key and public key.
[certificates] Generated front-proxy-ca certificate and key.
[certificates] Generated front-proxy-client certificate and key.
[certificates] Valid certificates and keys now exist in "/etc/kubernetes/pki"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/admin.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/kubelet.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/controller-manager.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/scheduler.conf"
[controlplane] Wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/manifests/kube-apiserver.yaml"
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/manifests/kube-controller-manager.yaml"
[controlplane] Wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/manifests/kube-scheduler.yaml"
[etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/manifests/etcd.yaml"
[init] Waiting for the kubelet to boot up the control plane as Static Pods from directory "/etc/kubernetes/manifests".
[init] This might take a minute or longer if the control plane images have to be pulled.
[apiclient] All control plane components are healthy after 51.025111 seconds
[uploadconfig] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[markmaster] Will mark node kubemaster as master by adding a label and a taint
[markmaster] Master kubemaster tainted and labelled with key/value: node-role.kubernetes.io/master=""
[bootstraptoken] Using token: 3b7u48.w4bidn6xs5gy6zmx
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstraptoken] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: kube-dns
[addons] Applied essential addon: kube-proxy

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join 172.20.84.213:6443 --token 3b7u48.w4bidn6xs5gy6zmx --discovery-token-ca-cert-hash sha256:182fba1ecb85fd4dbfbf478b12a40143d2c7de9f16ba2ea85263648a74b010b1
```

* 如果遇到下面错误说明你需要执行 `swapoff -a`
```
[ERROR Swap]: running with swap on is not supported. Please disable swap
```
* 如果出现下面错误，那就照做 `systemctl enable docker.service`
```
[WARNING Service-Docker]: docker service is not enabled, please run 'systemctl enable docker.service'
```

##### Installing a pod network
```
root@kubemaster:~# sysctl net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-iptables = 1
root@kubemaster:~# kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
serviceaccount "weave-net" created
clusterrole.rbac.authorization.k8s.io "weave-net" created
clusterrolebinding.rbac.authorization.k8s.io "weave-net" created
role.rbac.authorization.k8s.io "weave-net" created
rolebinding.rbac.authorization.k8s.io "weave-net" created
daemonset.extensions "weave-net" created
```
pod network 安装成功之后，用下面命令查看 kube-dns 这个 pod 的状态，当其为 Running 时说明正式成功运行起来了<br>
`kubectl get pods --all-namespaces`

然后就可以为我们的 Kubernetes cluster 加入节点主机了。

## Join Nodes

在 Kubernetes master 主机上使用 `kubeadm init` 初始化 Kubernetes master 节点时终端输出日志最后有一行命令用来把子虚拟机节点加入  Kubernetes Cluster 中，如下
```
kubeadm join 10.59.176.211:8443 --token mceq67.bit1jg2iafbz8xjv --discovery-token-ca-cert-hash sha256:c870fa8cf3ef944e0d695655604110debeef650ed78f4d07ef83f3442825cb46
```

按照创建和安装 master 节点虚拟机一样的步骤再创建一个 ubuntu server 系统的虚拟机，然后安装好 Docker, kubelet, kubeadm 和 kubectl 工具。

> 这是一个重复劳动，所以我们需要像 [Vagrant][Vagrant] 这样的自动化工具

运行上面的命令把此虚拟机加入 Kubernetes cluster master 节点，如果遇到什么问题需要重新运行命令，则先要运行命令 `kubeadm reset` 重置环境，然后重新运行 join 命令。
```
root@kubenode1:~# kubeadm join 10.59.176.211:6443 --token psp2gi.6agdgib6ff2r0mla --discovery-token-ca-cert-hash sha256:5b6c9086b74cb0ebc57a8608245c8114d429143183ab3ac4ffda9134b64aaceb
[preflight] Running pre-flight checks.
        [WARNING SystemVerification]: docker version is greater than the most recently validated version. Docker version: 17.12.1-ce. Max validated version: 17.03
        [WARNING FileExisting-crictl]: crictl not found in system path
Suggestion: go get github.com/kubernetes-incubator/cri-tools/cmd/crictl
[preflight] Starting the kubelet service
[discovery] Trying to connect to API Server "10.59.176.211:6443"
[discovery] Created cluster-info discovery client, requesting info from "https://10.59.176.211:6443"
[discovery] Requesting info from "https://10.59.176.211:6443" again to validate TLS against the pinned public key
[discovery] Cluster info signature and contents are valid and TLS certificate validates against pinned roots, will use API Server "10.59.176.211:6443"
[discovery] Successfully established connection with API Server "10.59.176.211:6443"

This node has joined the cluster:
* Certificate signing request was sent to master and a response
  was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the master to see this node join the cluster.
```
日志会提示你，在 master 主机上运行命令 `kubectl get nodes` 查看此 node 节点主机已经加入到了 Kubernetes cluster，如下

```
root@kubemaster:~# kubectl get nodes
NAME         STATUS     ROLES     AGE       VERSION
kubemaster   Ready      master    15m       v1.10.4
kubenode1    NotReady   <none>    28s       v1.10.3
```
可以看到 kubenode1 节点还没有 Ready , 过一会再查看就会是 Ready 状态了。

> 我之前曾经试图把 node 节点主机加入到 Minikube 主机的 Kubernetes cluster ， node 主机上运行的 `kubeadm join` 命令输出都支持，但 Minikube 就是没有 node 加进来。




[buildroot]:https://buildroot.org/
[putty]:https://www.putty.org/
[Vagrant]:https://www.vagrantup.com/
