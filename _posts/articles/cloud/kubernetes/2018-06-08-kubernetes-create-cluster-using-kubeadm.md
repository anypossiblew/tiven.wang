---
layout: post
theme: UbuntuMono
title: "Kubernetes - Create cluster using kubeadm"
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
---

* TOC
{:toc}

## VM as Kube Node
现在就创建一个虚拟机作为 Kubernetes Cluster 新的 Node 主机。
下载 ubuntu server 镜像 https://www.ubuntu.com/download/server

然后在 Hyper-V Manager 中创建一个虚拟机并安装此 ubuntu server 镜像。

> 我本来想用 `docker-machine` 命令工具创建的虚拟机作为 Kubernetes Cluster 节点主机的，但 Docker Machine 创建的虚拟机是使用 boot2docker linux 系统，不符合 Kubernetes 集群节点主机的要求，连 `apt-get` 命令工具都没有，所以还是下载个 ubuntu server 创建虚拟机吧。minikube 使用的是 embedded Linux Distribution ([Buildroot][buildroot]) 作虚拟机系统，你也可以尝试使用 [Buildroot][buildroot] 创建虚拟机。

安装好虚拟机 ubuntu server 系统后使用 Hyper-V connect 登录虚拟机系统或者使用 PuTTY 这种 ssh 工具登录（使用 PuTTY 工具更好，对编辑终端命令支持好一些）。

根据 [https://kubernetes.io/docs/tasks/tools/install-kubeadm/](https://kubernetes.io/docs/tasks/tools/install-kubeadm/) 教程安装 kubelet kubeadm kubectl 工具。

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

## Configure cgroup driver used by kubelet on Master Node
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

https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/

## Initializing your master
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

`kubectl get pods --all-namespaces`


## Join Nodes

等 master 节点好了再加入他

安装 Dashboard UI

## Kubectl from Laptop

Powershell 终端上安全拷贝 admin.conf 到物理本机，然后就可以在此电脑上访问 Kubernetes master 节点的集群了
```
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

### Enable Ubuntu root
为 Ubuntu root 用户设置密码，即开启 root 用户登录系统能力

`sudo passwd root`

Ubuntu 18.04允许root登录：

```
vi /etc/ssh/sshd_config
PermitRootLogin yes （默认为#PermitRootLogin prohibit-password）
：wq

service ssh restart
```

## Proxying API Server to localhost

```
kubectl --kubeconfig ./admin.conf proxy
```
然后就可以用 localhost 访问 Kubernetes cluster 的 API Server 的接口了 *http://localhost:8001/api/v1*

## Dashboard
通过代理访问 API *http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/*
可以得到如下结果
```json
{
  kind: "Status",
  apiVersion: "v1",
  metadata: { },
  status: "Failure",
  message: "services "kubernetes-dashboard" not found",
  reason: "NotFound",
  details: {
    name: "kubernetes-dashboard",
    kind: "services"
  },
  code: 404
}
```
可以看到服务 "kubernetes-dashboard" 还没有安装，所以接下来我们要为 Kubernetes cluster 安装一个 Dashboard UI

https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/

在 Kubernetes master 主机上安装 Dashboard service
```
root@kubemaster:~# kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
secret "kubernetes-dashboard-certs" created
serviceaccount "kubernetes-dashboard" created
role.rbac.authorization.k8s.io "kubernetes-dashboard-minimal" created
rolebinding.rbac.authorization.k8s.io "kubernetes-dashboard-minimal" created
deployment.apps "kubernetes-dashboard" created
service "kubernetes-dashboard" created
```

```
root@kubemaster:~# kubectl get pods --all-namespaces
NAMESPACE     NAME                                    READY     STATUS             RESTARTS   AGE
kube-system   kube-apiserver-kubemaster               0/1       Pending            0          1s
kube-system   kube-dns-86f4d74b45-bdd2g               3/3       Running            0          14h
kube-system   kube-proxy-8swcv                        1/1       Running            0          14h
kube-system   kubernetes-dashboard-7d5dcdb6d9-jbz8z   0/1       ImagePullBackOff   0          36s
kube-system   weave-net-7t6lt                         2/2       Running            4          13h
```

等 kubernetes-dashboard 这个 pod `Running` 起来，再次在物理本机访问 *http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/*
如果正常情况则会出现 Kubernetes Dashboard UI 登录页面。
有两种登录方式可选，Kubeconfig 和 Token。
选择 Kubeconfig 方式，输入之前 Copy 出来的 admin.conf 配置文件

参考 https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/

https://kubernetes.io/docs/reference/access-authn-authz/authentication/


```
PS C:\Users\anypo> kubectl --kubeconfig ./admin.conf get serviceaccounts
NAME      SECRETS   AGE
default   1         15h
PS C:\Users\anypo> kubectl --kubeconfig ./admin.conf get serviceaccounts default -o yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2018-06-08T14:38:07Z
  name: default
  namespace: default
  resourceVersion: "304"
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
  uid: 8f488b5a-6b29-11e8-8a5e-00155d026a08
secrets:
- name: default-token-qg7kp
```
```
root@kubemaster:~# kubectl get secret default-token-qg7kp -o yaml
apiVersion: v1
data:
  ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRFNE1EWXdPREUwTXpZek9Gb1hEVEk0TURZd05URTBNell6T0Zvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBS3l1CnV3WDMybXlMWWdZS25Kd25nakxWSVllTEwwNFlxc3hYbTFpM3g4VFBiVk45eVovdW16SWpHc0hsSHQwc2xJNWIKVzlxZXprQVJkelJWMXFHNWFCcWMySnlKU1cycGZ2R0ZLVGJhNmhPWElzMlVnYzF2cUYzcG1YVkFIbEJMbUNzUApNV0ljUENKUG1uWUl0TFZqSnBweUtPZUE4QS90SzJidVZUSGRibVdUMEllMlgwQ0h4N1BZWDl6emUrTkZ3RnZaCkkrek1ZV3cvQmhUZERZWVZ1N2F5TkQxdm9uNkN5YTBFdE9kZmxmazRwWEsxQVpacnJpTFA1VU1DRFdKK2l3eXYKZTJyZ28vdlVDU253a2I0aHhGZGtjTVhSV2trb2FWYkxWb2MxVG5lQ0ljWW5DMUNXSEpIaDJ6UitwZWt2VFpxZApWZTg3UWhHSCtuRHBZSVhtbGxFQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFHTmk1eGs4WWVxRFRURldKSzhCa2dDNnEvb1gKV0QvdTdrTUZZUGtlV2QvNnppRDk4VXZlTS9CanJubnFuTHpwV0kvbkp0bUVQL3libTVReU9neDEyTVNjcHJ6OAovRmFHVUZZLy90OEtFczVQSmNJa2JwV1MveTh0Sk54S2ZQL3BsK1d0V0hXQUJMQW5ScklFMnR1am5rM1FaZUVKCnUxMUk4NEk0TXVlS2hLekVueGVveWVWcXdtOXdPMDhlSU0yWXUxRllrRVBaMENrZ2psZGQrYllmc3g3K3RYRlAKRlBxNmxydFNWWWpWWmdlaXE2T1NTTk9xTW1hSXRSajBnRUx5S0VoQitBczB5WTBQU1dKMVF2czR4eWswdENRVwpVdGNLVlFkNmgxeW1oT0NMekNOM0d1a0NiWXpSbnNLOWlqSVRDYkNDekh3bUpheW41NXNNNjJOTklLWT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
  namespace: ZGVmYXVsdA==
  token: ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklpSjkuZXlKcGMzTWlPaUpyZFdKbGNtNWxkR1Z6TDNObGNuWnBZMlZoWTJOdmRXNTBJaXdpYTNWaVpYSnVaWFJsY3k1cGJ5OXpaWEoyYVdObFlXTmpiM1Z1ZEM5dVlXMWxjM0JoWTJVaU9pSmtaV1poZFd4MElpd2lhM1ZpWlhKdVpYUmxjeTVwYnk5elpYSjJhV05sWVdOamIzVnVkQzl6WldOeVpYUXVibUZ0WlNJNkltUmxabUYxYkhRdGRHOXJaVzR0Y1djM2EzQWlMQ0pyZFdKbGNtNWxkR1Z6TG1sdkwzTmxjblpwWTJWaFkyTnZkVzUwTDNObGNuWnBZMlV0WVdOamIzVnVkQzV1WVcxbElqb2laR1ZtWVhWc2RDSXNJbXQxWW1WeWJtVjBaWE11YVc4dmMyVnlkbWxqWldGalkyOTFiblF2YzJWeWRtbGpaUzFoWTJOdmRXNTBMblZwWkNJNklqaG1ORGc0WWpWaExUWmlNamt0TVRGbE9DMDRZVFZsTFRBd01UVTFaREF5Tm1Fd09DSXNJbk4xWWlJNkluTjVjM1JsYlRwelpYSjJhV05sWVdOamIzVnVkRHBrWldaaGRXeDBPbVJsWm1GMWJIUWlmUS5NOEZyLUxtWnBmeWFmeXoxVTBoWVNGSUp5UFQyN3VlTV9ZdTYxdXpDS0FLcnhTMkhzakpnbTFsc1FUODVBc2lCNnh5V1kwZ0VBYllBMEM0WEEyVDZCbHhOWVB3MjBuTlZlTDY0UTZlS1B5LWcxTHRFdXdxUmthdHA5anpvbjdkcWc3VGlqYjFhclNRVWN4VmNCNGxUdmNIdkxuX1ZOWHhfZUF5ajQ1Q084WG4yQUt0TDBGZHVUSllxelJnV2pMWHlaZzh0NE9zZWR0TEJ0TjFWR01RY1BlMkU5b3hjSGRueWdCdTl1OU9iZW05czZ6eDNDbkNibTBDcWNzOXFxWW5ETzNHTWpldHEtWXZoNENXaWtnUXZIOEFuZ0RKeXVWQWc3RzR5UDVfSWNFZXRJT1NMLW5xS1p3Wm9zZjI2R2hPd2prbDh4R3dEUmFCMVZiTzdCZlpOcWc=
kind: Secret
metadata:
  annotations:
    kubernetes.io/service-account.name: default
    kubernetes.io/service-account.uid: 8f488b5a-6b29-11e8-8a5e-00155d026a08
  creationTimestamp: 2018-06-08T14:38:08Z
  name: default-token-qg7kp
  namespace: default
  resourceVersion: "301"
  selfLink: /api/v1/namespaces/default/secrets/default-token-qg7kp
  uid: 8f9bb724-6b29-11e8-8a5e-00155d026a08
type: kubernetes.io/service-account-token
```

跳过登录页面的话，虽然可以进入管理页面，但都没权限查看，会出现下面这种错误
```
nodes is forbidden: User "system:serviceaccount:kube-system:kubernetes-dashboard" cannot list nodes at the cluster scope
```


https://kubernetes-incubator.github.io/kube-aws/advanced-topics/kubernetes-dashboard.html


[buildroot]:https://buildroot.org/
