---
layout: post
theme: UbuntuMono
title: "Kubernetes - Create cluster using kubeadm"
excerpt: "Learn how to create a kubernetes cluster using kubeadm tool"
modified: 2018-06-08T11:51:25-04:00
categories: articles
tags: [Kubeadm, Kubernetes, Cloud]
image:
  vendor: nationalgeographic
  feature: /content/dam/travel/rights-exempt/2018-travel-photographer-of-the-year/sunset-sunrise-golden-hour/sunrise-myanmar-burma-golden-hour-01.ngsversion.1527707084997.adapt.885.1.jpg
  credit: NATIONAL GEOGRAPHIC TRAVEL
  creditlink: https://www.nationalgeographic.com/travel/features/photography/sunset-sunrise-golden-hour-light/
comments: true
share: true
showYourTerms: true
references:
  - title: "Kubernetes Documentation"
    url: https://kubernetes.io/docs
  - title: "Katacoda: Kubernetes - Add Additional Nodes To Existing Cluster"
    url: https://www.katacoda.com/courses/kubernetes/add-additional-nodes-to-cluster
---

<style>
.showyourterms.kubemaster .type:before {
  content: "root@kubemaster:~# "
}
.showyourterms.kubenode1 .type:before {
  content: "root@kubenode1:~# "
}
</style>

* TOC
{:toc}

首先来看一下我们要创建的 Kubernetes cluster 整体架构

![Image: Kubernetes cluster using Kubeadm](/images/cloud/kubernetes/Kubernetes-cluster-kubeadm-arc.png)

首先我们会创建安装和部署 master 虚拟机，然后再创建安装 node 虚拟机并加入到 master 主机代表的 Kubernetes cluster。
本篇我们只演示一个 node 虚拟机，内存富裕的小伙伴可以多创建几个 node 虚拟机加入 Kubernetes cluster。

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
<div class='showyourterms kubemaster' data-title="Kubemaster">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>cat /etc/systemd/system/kubelet.service.d/10-kubeadm.conf</div>
    <div class='lines' data-delay='400'>
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
    </div>
    <div class='type green' data-action='command' data-delay='400'>docker info | grep -i cgroup</div>
    <div class='lines' data-delay='400'>
Cgroup Driver: cgroupfs
WARNING: No swap limit support
    </div>
  </div>
</div>

设置参数

<div class='showyourterms kubemaster' data-title="Kubemaster">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g" /etc/systemd/system/kubelet.service.d/10-kubeadm.conf</div>
    <div class='type green' data-action='command' data-delay='400'>cat /etc/systemd/system/kubelet.service.d/10-kubeadm.conf</div>
    <div class='lines' data-delay='400'>
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
    </div>
  </div>
</div>

Then restart kubelet:

<div class='showyourterms kubemaster' data-title="Kubemaster">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>systemctl daemon-reload</div>
    <div class='type green' data-action='command' data-delay='400'>systemctl restart kubelet</div>
  </div>
</div>

### Create Cluster
按照官方文档 [Create cluster using kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/) 创建 Kubernetes cluster

#### Initializing your master
The master is the machine where the control plane components run, including etcd (the cluster database) and the API server (which the kubectl CLI communicates with).

<div class='showyourterms kubemaster' data-title="Kubemaster">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>kubeadm init</div>
    <div class='lines' data-delay='400'>
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
    </div>
  </div>
</div>

* 如果遇到下面错误说明你需要执行 `swapoff -a` 使用 `swapon --summary` 查看确保没有 swap
```
[ERROR Swap]: running with swap on is not supported. Please disable swap
```
* 如果出现下面错误，那就照做 `systemctl enable docker.service`
```
[WARNING Service-Docker]: docker service is not enabled, please run 'systemctl enable docker.service'
```

##### Installing a pod network

<div class='showyourterms kubemaster' data-title="Kubemaster">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>sysctl net.bridge.bridge-nf-call-iptables=1</div>
    <div class='lines' data-delay='400'>
net.bridge.bridge-nf-call-iptables = 1
    </div>
    <div class='type green' data-action='command' data-delay='400'>kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"</div>
    <div class='lines' data-delay='400'>
serviceaccount "weave-net" created
clusterrole.rbac.authorization.k8s.io "weave-net" created
clusterrolebinding.rbac.authorization.k8s.io "weave-net" created
role.rbac.authorization.k8s.io "weave-net" created
rolebinding.rbac.authorization.k8s.io "weave-net" created
daemonset.extensions "weave-net" created
    </div>
  </div>
</div>
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

<div class='showyourterms kubenode1' data-title="Kubenode">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>kubeadm join 10.59.176.211:6443 --token psp2gi.6agdgib6ff2r0mla --discovery-token-ca-cert-hash sha256:5b6c9086b74cb0ebc57a8608245c8114d429143183ab3ac4ffda9134b64aaceb</div>
    <div class='lines' data-delay='400'>
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
    </div>
  </div>
</div>

日志会提示你，在 master 主机上运行命令 `kubectl get nodes` 查看此 node 节点主机已经加入到了 Kubernetes cluster，如下

<div class='showyourterms kubemaster' data-title="Kubemaster">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>kubectl get nodes</div>
    <div class='lines' data-delay='400'>
NAME         STATUS     ROLES     AGE       VERSION
kubemaster   Ready      master    15m       v1.10.4
kubenode1    NotReady   &lt;none&gt;    28s       v1.10.3
    </div>
  </div>
</div>

可以看到 kubenode1 节点还没有 Ready , 过一会再查看就会是 Ready 状态了。

> 我之前曾经试图把 node 节点主机加入到 Minikube 主机的 Kubernetes cluster ， node 主机上运行的 `kubeadm join` 命令输出都支持，但 Minikube 就是没有 node 加进来。

## Troubleshot after Reboot
当我重启 master 节点虚拟机后 Kubernetes cluster 没有启动，查看 Kubelet 服务运行状态

<div class='showyourterms kubemaster' data-title="Kubemaster">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>systemctl status kubelet</div>
    <div class='lines' data-delay='400'>
<span class="green">●</span> kubelet.service - kubelet: The Kubernetes Node Agent
   Loaded: loaded (/lib/systemd/system/kubelet.service; enabled; vendor preset: enabled)
  Drop-In: /etc/systemd/system/kubelet.service.d
           └─10-kubeadm.conf
   Active: <span class="green">active (running)</span> since Tue 2018-06-19 03:26:03 UTC; 1h 39min ago
     Docs: http://kubernetes.io/docs/
 Main PID: 845 (kubelet)
    Tasks: 14 (limit: 2184)
   CGroup: /system.slice/kubelet.service
           └─845 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --pod-manifest-path
    </div>
  </div>
</div>
可以看到里面 **Active: active (running)** 则代表正常，否则可能遇到问题了。
再使用 [journalctl][journalctl] 查看这个服务运行日志

`journalctl -xeu kubelet`

在我的输出里包含如下描述

```
--cgroups-per-qos enabled, but --cgroup-root was not specified.
failed to run Kubelet: Running with swap on is not supported
```

第一行不是问题，第二行说明系统的 swap 开启了，要关闭掉，因为我们之前少做了一步操作，现在重新操作如下

* `swapoff -a`
* 从 `/etc/fstab` 文件中删除 swap 相关的条目，例如包含 `/swap.img` 的这一行
* `reboot`

重启后重新查看 swap 状态 `swapon --summary` 确保没有 swap 存在，然后再查看 kubelet 是否正常启动。

### Swap Memory

关于 Swap 的问题，是 Kubernetes 从 v1.8.0 开始，如果工作节点主机的 swap memory 开启 Kubelet 默认会启动失败。
[kubelet][kubelet] 有个参数 `--fail-swap-on     Default: true` 指定了这个特性。建议不要设置成 false，因为 Kubelet 不管理 swap space，开启 swap 可能会造成不可预测的效率问题。详细请参考讨论[kubernetes/issues/7294](https://github.com/kubernetes/kubernetes/issues/7294)。




[buildroot]:https://buildroot.org/
[putty]:https://www.putty.org/
[Vagrant]:https://www.vagrantup.com/
[journalctl]:https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs
[kubelet]:https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/
